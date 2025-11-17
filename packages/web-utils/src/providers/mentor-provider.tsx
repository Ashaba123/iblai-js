/**
 * MentorProvider Component
 *
 * Provider that manages AI mentor selection and redirection logic.
 * It handles:
 * - Mentor selection based on user preferences and history
 * - Mentor seeding for new tenants
 * - Redirection to appropriate mentor or creation flow
 * - Integration with tenant context for access control
 */

"use client";

import React, { useState } from "react";

import {
  useLazySeedMentorsQuery,
  useLazyGetMentorsQuery,
  useLazyGetMentorPublicSettingsQuery,
  useGetRbacPermissionsMutation,
  useLazyGetRecentlyAccessedMentorsQuery,
} from "@iblai/data-layer";
import { useTenantContext } from "./tenant-provider";
import { useAuthContext } from "./auth-provider";

/**
 * Props for the MentorProvider component
 */
type Props = {
  children?: React.ReactNode;
  fallback?: React.ReactNode; // Component to show during mentor determination
  onAuthSuccess?: () => void; // Callback for successful mentor selection
  onAuthFailure?: (reason: string) => void; // Callback for failed mentor selection
  redirectToAuthSpa: () => void; // Function to redirect to auth SPA
  redirectToMentor: (tenantKey: string, mentorId: string) => void; // Function to redirect to specific mentor
  onLoadMentorsPermissions?: (
    rbacPermissions: Record<string, unknown> | undefined,
  ) => void; // Function to redirect to specific mentor with permissions
  redirectToNoMentorsPage: () => void; // Function to redirect to no mentors page
  redirectToCreateMentor: () => void; // Function to redirect to mentor creation
  username: string; // Current user's username
  isAdmin: boolean; // Whether user is an admin
  mainTenantKey: string; // The key of the main tenant
  requestedMentorId?: string; // Mentor ID that the user requested to access
  handleMentorNotFound?: () => Promise<void>; // Function to handle mentor not found
  forceDetermineMentor?: boolean;
};

/**
 * MentorProvider Component
 *
 * Main mentor provider that:
 * 1. Determines the most appropriate mentor for the user
 * 2. Handles mentor seeding for new tenants
 * 3. Manages redirection based on mentor availability
 * 4. Integrates with tenant context for access control
 */
export function MentorProvider({
  children,
  fallback,
  onAuthSuccess,
  onAuthFailure,
  redirectToAuthSpa,
  redirectToMentor,
  onLoadMentorsPermissions,
  redirectToNoMentorsPage,
  redirectToCreateMentor,
  username,
  isAdmin,
  mainTenantKey,
  requestedMentorId,
  handleMentorNotFound,
  forceDetermineMentor = false,
}: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const { userIsAccessingPublicRoute } = useAuthContext();
  const { determineUserPath, tenantKey, metadata } = useTenantContext();
  const isMainTenant = tenantKey === mainTenantKey;

  console.log(
    "MentorProvider initialized",
    username,
    isAdmin,
    tenantKey,
    mainTenantKey,
    isMainTenant,
    requestedMentorId,
    determineUserPath,
  );

  const [fetchMentors] = useLazyGetMentorsQuery();
  const [fetchSeedMentors] = useLazySeedMentorsQuery();
  const [getMentorPublicSettings] = useLazyGetMentorPublicSettingsQuery();
  const [getRbacPermissions] = useGetRbacPermissionsMutation();
  const [getRecentlyAccessedMentors] = useLazyGetRecentlyAccessedMentorsQuery();

  const QUERY_LIMIT = 10;

  const loadMentorsPermissions = async (mentorDbId: string | number) => {
    try {
      const mentorPermissions = await getRbacPermissions({
        requestBody: {
          platform_key: tenantKey,
          resources: ["/mentors/", `/mentors/${mentorDbId}/`, "/apitokens/"],
        },
      }).unwrap();
      const permissions = {
        ...mentorPermissions,
      };
      return permissions;
    } catch {}
  };

  /**
   * Determines which mentor to redirect the user to by following this priority:
   * 1. Recently accessed mentors
   * 2. Featured mentors (with special handling for main tenant)
   * 3. Non-featured mentors
   * 4. Seeded mentors (for admin users)
   * 5. Creation flow or no mentors page
   */
  async function determineMentorToRedirectTo() {
    console.log(
      "starting mentor determination process",
      JSON.stringify({
        tenantKey,
        username,
        isAdmin,
        isMainTenant,
      }),
    );

    console.log(
      "###################### metadata is ",
      metadata,
      typeof metadata,
    );

    setIsLoading(true);

    try {
      // Get the user's recent mentors
      console.log(
        "fetching recent mentors",
        JSON.stringify({
          tenantKey,
          username,
          limit: QUERY_LIMIT,
          orderBy: "recently_accessed_at",
        }),
      );

      if (
        typeof metadata === "object" &&
        metadata.skills_embedded_mentor_name
      ) {
        const defaultMentor = JSON.parse(metadata.skills_embedded_mentor_name);
        if (defaultMentor?.unique_id) {
          if (defaultMentor?.id) {
            const rbacPermissions = await loadMentorsPermissions(
              defaultMentor?.id,
            );
            onLoadMentorsPermissions?.(rbacPermissions);
          }
          redirectToMentor(tenantKey, defaultMentor.unique_id);

          onAuthSuccess?.();
          return;
        }
      }

      // Check for recently accessed mentors (second choice)
      console.log(
        "checking recently accessed mentors",
        JSON.stringify({
          tenantKey,
          username,
        }),
      );

      const recentlyAccessedResult = await getRecentlyAccessedMentors({
        org: tenantKey,
        // @ts-ignore
        userId: username,
      });
      // @ts-ignore
      const recentlyAccessedMentors = recentlyAccessedResult.data as {
        starred_mentors: any[];
        recent_mentors: any[];
      };
      const starredMentors = recentlyAccessedMentors?.starred_mentors;
      let recentMentors = recentlyAccessedMentors?.recent_mentors;

      if (starredMentors.length > 0) {
        const starredMentor = starredMentors[0];
        if (starredMentor?.unique_id) {
          const rbacPermissions = await loadMentorsPermissions(
            starredMentor?.id,
          );
          onLoadMentorsPermissions?.(rbacPermissions);
          redirectToMentor(tenantKey, starredMentor.unique_id);

          onAuthSuccess?.();
          return;
        }
      }
      if (recentMentors.length > 0) {
        const recentMentor = recentMentors[0];
        if (recentMentor?.unique_id) {
          const rbacPermissions = await loadMentorsPermissions(
            recentMentor?.id,
          );
          onLoadMentorsPermissions?.(rbacPermissions);
          redirectToMentor(tenantKey, recentMentor.unique_id);

          onAuthSuccess?.();
          return;
        }
      }

      const recentMentorsResult = await fetchMentors({
        // @ts-ignore
        org: tenantKey,
        username,
        limit: QUERY_LIMIT,
        orderBy: "recently_accessed_at",
      });
      recentMentors = recentMentorsResult.data?.results || [];

      console.log(
        "recent mentors fetched",
        JSON.stringify({
          count: recentMentors.length,
          mentorIds: recentMentors.map((m) => m?.unique_id),
        }),
      );

      // Check if we found recent mentors for the tenant
      if (recentMentors.length > 0) {
        const selectedMentorId = recentMentors[0]?.unique_id || "";
        const selectedMentorDbId = recentMentors[0]?.id || "";
        console.log(
          "redirecting to recent mentor",
          JSON.stringify({
            selectedMentorId,
            mentorName: recentMentors[0]?.name,
            tenantKey,
          }),
        );
        const rbacPermissions =
          await loadMentorsPermissions(selectedMentorDbId);

        // Select the most recent mentor as current mentor
        onLoadMentorsPermissions?.(rbacPermissions);
        redirectToMentor(tenantKey, selectedMentorId);

        onAuthSuccess?.();
        return;
      }

      // If no recent mentors, get featured mentors
      console.log("no recent mentors found, fetching featured mentors", {
        tenantKey,
        username,
      });

      const featuredMentorsResult = await fetchMentors({
        // @ts-ignore
        org: tenantKey,
        username,
        limit: QUERY_LIMIT,
        orderBy: "recently_accessed_at",
      });
      const featuredMentors = featuredMentorsResult.data?.results || [];

      console.log("featured mentors fetched", {
        count: featuredMentors.length,
        mentorIds: featuredMentors.map((m) => m?.unique_id),
        defaultMentors: featuredMentors
          .filter((m) => m?.metadata?.default)
          .map((m) => m?.unique_id),
      });

      // Check if we found featured mentors
      if (featuredMentors.length > 0) {
        // Special handling for main tenant non-admin users
        if (isMainTenant && !isAdmin) {
          console.log("applying main tenant non-admin logic", {
            isMainTenant,
            isAdmin,
          });

          // Set the default IBL mentor
          const defaultIblMentor = featuredMentors.find(
            (mentor: any) => mentor?.metadata?.default === true,
          );

          // Check if found default featured mentor
          if (defaultIblMentor) {
            console.log("redirecting to default IBL mentor", {
              mentorId: defaultIblMentor?.unique_id,
              mentorName: defaultIblMentor?.name,
            });
            const defaultIblMentorDbId = defaultIblMentor?.id || "";
            const rbacPermissions =
              await loadMentorsPermissions(defaultIblMentorDbId);
            onLoadMentorsPermissions?.(rbacPermissions);
            redirectToMentor?.(tenantKey, defaultIblMentor?.unique_id || "");
            onAuthSuccess?.();
            return;
          }
        } else {
          console.log("applying standard featured mentor logic", {
            isMainTenant,
            isAdmin,
          });

          // Check if there's a default featured mentor
          const defaultFeatureMentor = featuredMentors.find(
            (mentor: any) => mentor?.metadata?.default === true,
          );

          if (defaultFeatureMentor) {
            console.log("redirecting to default featured mentor", {
              mentorId: defaultFeatureMentor?.unique_id,
              mentorName: defaultFeatureMentor?.name,
            });
            const defaultFeatureMentorDbId = defaultFeatureMentor?.id || "";
            const rbacPermissions = await loadMentorsPermissions(
              defaultFeatureMentorDbId,
            );

            onLoadMentorsPermissions?.(rbacPermissions);
            redirectToMentor(tenantKey, defaultFeatureMentor?.unique_id || "");
            onAuthSuccess?.();
            return;
          }
        }

        // If no default mentor, select the first featured mentor
        const firstFeaturedMentorId = featuredMentors[0]?.unique_id || "";
        console.log("redirecting to first featured mentor", {
          mentorId: firstFeaturedMentorId,
          mentorName: featuredMentors[0]?.name,
        });
        const firstFeaturedMentorDbId = featuredMentors[0]?.id || "";
        const rbacPermissions = await loadMentorsPermissions(
          firstFeaturedMentorDbId,
        );
        onLoadMentorsPermissions?.(rbacPermissions);
        redirectToMentor(tenantKey, firstFeaturedMentorId);

        onAuthSuccess?.();
        return;
      }

      // If no featured mentors, get non-featured mentors
      console.log("no featured mentors found, fetching non-featured mentors", {
        tenantKey,
        username,
      });

      const nonFeaturedMentorsResult = await fetchMentors({
        // @ts-ignore
        org: tenantKey,
        username,
        limit: QUERY_LIMIT,
        orderBy: "recently_accessed_at",
      });
      const nonFeaturedMentors = nonFeaturedMentorsResult.data?.results || [];

      console.log("non-featured mentors fetched", {
        count: nonFeaturedMentors.length,
        mentorIds: nonFeaturedMentors.map((m) => m?.unique_id),
      });

      // Check if we found non-featured mentors
      if (nonFeaturedMentors.length > 0) {
        const firstNonFeaturedMentorId = nonFeaturedMentors[0]?.unique_id || "";
        console.log("redirecting to first non-featured mentor", {
          mentorId: firstNonFeaturedMentorId,
          mentorName: nonFeaturedMentors[0]?.name,
        });
        const firstNonFeaturedMentorDbId = nonFeaturedMentors[0]?.id || "";
        const rbacPermissions = await loadMentorsPermissions(
          firstNonFeaturedMentorDbId,
        );
        onLoadMentorsPermissions?.(rbacPermissions);
        redirectToMentor(tenantKey, firstNonFeaturedMentorId);

        onAuthSuccess?.();
        return;
      }
      // If no mentors found, check if user is admin
      console.log("no mentors found, checking admin status", {
        isAdmin,
        tenantKey,
        username,
      });

      if (isAdmin) {
        console.log("user is admin, attempting to seed mentors", {
          tenantKey,
          username,
        });

        // Try to seed mentors
        const seedMentorsResult = await fetchSeedMentors({
          // @ts-ignore
          org: tenantKey,
          // @ts-ignore
          userId: username,
        });
        const seededMentorsDetails = seedMentorsResult.data?.detail;

        console.log("mentor seeding completed", {
          success: !!seededMentorsDetails,
          details: seededMentorsDetails,
        });

        // Check if mentors have been seeded
        if (seededMentorsDetails) {
          console.log(
            "mentors seeded successfully, refetching featured mentors",
          );

          // Retry getting featured mentors after seeding
          const featuredMentorsAfterSeedResult = await fetchMentors({
            // @ts-ignore
            org: tenantKey,
            username,
            limit: QUERY_LIMIT,
          });
          const featuredMentorsAfterSeed =
            featuredMentorsAfterSeedResult.data?.results || [];

          console.log("featured mentors after seeding", {
            count: featuredMentorsAfterSeed.length,
            mentorIds: featuredMentorsAfterSeed.map((m) => m?.unique_id),
          });

          if (featuredMentorsAfterSeed.length > 0) {
            const seededMentorId = featuredMentorsAfterSeed[0]?.unique_id || "";
            console.log("redirecting to seeded mentor", {
              mentorId: seededMentorId,
              mentorName: featuredMentorsAfterSeed[0]?.name,
            });
            const seededMentorDbId = featuredMentorsAfterSeed[0]?.id || "";
            const rbacPermissions =
              await loadMentorsPermissions(seededMentorDbId);
            onLoadMentorsPermissions?.(rbacPermissions);
            redirectToMentor(tenantKey, seededMentorId);

            onAuthSuccess?.();
            return;
          } else {
            console.log(
              "no seeded mentors found, redirecting to create mentor",
            );
            redirectToCreateMentor();
            onAuthSuccess?.();
            return;
          }
        } else {
          console.log("mentor seeding failed, redirecting to create mentor");

          // Prompt the user to create a mentor
          redirectToCreateMentor();
          onAuthSuccess?.();
          return;
        }
      } else {
        console.log("user is not admin, redirecting to no mentors page", {
          isAdmin,
          tenantKey,
        });

        // Redirect to no mentors page for non-admin users
        redirectToNoMentorsPage();
        onAuthSuccess?.();
        return;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      console.log("mentor determination failed", {
        error: errorMessage,
        tenantKey,
        username,
        isAdmin,
      });

      onAuthFailure?.(`Unexpected error: ${errorMessage}`);
      console.log("[auth-redirect] Unexpected error in mentor provider", {
        error: errorMessage,
      });
      redirectToAuthSpa();
    } finally {
      setIsLoading(false);
    }
  }

  async function mentorExistsInTenant(
    tenantKey: string,
    requestedMentorId: string,
  ): Promise<[boolean, number | undefined]> {
    console.log(
      "checking if mentor exists in tenant",
      tenantKey,
      requestedMentorId,
      username,
    );

    try {
      const response = await getMentorPublicSettings({
        // @ts-ignore
        mentor: requestedMentorId,
        org: tenantKey,
        // @ts-ignore
        userId: username,
      }).unwrap();

      const mentorExists = response?.mentor_unique_id === requestedMentorId;

      console.log("mentor existence check completed", {
        mentorExists,
        responseId: response?.mentor_unique_id,
        requestedId: requestedMentorId,
      });

      return [mentorExists, response?.mentor_id];
    } catch (error) {
      console.log("mentor existence check failed", {
        error: error instanceof Error ? error.message : String(error),
        tenantKey,
        requestedMentorId,
      });

      return [false, undefined];
    }
  }

  // Effect to handle mentor determination when tenant path is determined
  React.useEffect(() => {
    async function checkMentor() {
      console.log(
        "starting mentor check process",
        determineUserPath,
        requestedMentorId,
        tenantKey,
      );

      if (userIsAccessingPublicRoute && !requestedMentorId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // If the tenant provider has determined that the user is not accessing the correct tenant,
      // then this mentor provider will redirect the user to the correct mentor.
      if (determineUserPath || forceDetermineMentor) {
        console.log(
          "determine user path is true, starting mentor determination",
        );
        await determineMentorToRedirectTo();
        return;
      } else if (requestedMentorId) {
        console.log(" ", {
          requestedMentorId,
        });

        const [mentorExists, requestedMentorDbId] = await mentorExistsInTenant(
          tenantKey,
          requestedMentorId,
        );

        // If the mentor does not exist in the tenant, redirect the user to the correct mentor
        if (!mentorExists) {
          console.log(
            "requested mentor not found in tenant",
            JSON.stringify({
              requestedMentorId,
              tenantKey,
              hasCustomHandler: !!handleMentorNotFound,
            }),
          );

          if (handleMentorNotFound) {
            console.log("calling custom mentor not found handler");
            await handleMentorNotFound();
          } else {
            console.log("using default mentor determination fallback");
            await determineMentorToRedirectTo();
          }
          return;
        } else {
          console.log(
            "requested mentor exists in tenant, proceeding",
            requestedMentorId,
          );
          if (requestedMentorDbId) {
            const rbacPermissions = await loadMentorsPermissions(
              requestedMentorDbId as number,
            );
            onLoadMentorsPermissions?.(rbacPermissions);
          }
          setIsLoading(false);
        }

        // If the user is navigating to a specific mentor, check if it exists in the tenant
      } else {
        console.log("no specific mentor requested, loading complete");
        setIsLoading(false);
      }
    }

    checkMentor();
  }, []);
  // Show fallback component during mentor determination
  if (isLoading) {
    console.log("mentor provider showing fallback component");
    return fallback;
  }

  console.log("mentor provider rendering children");
  return children;
}
