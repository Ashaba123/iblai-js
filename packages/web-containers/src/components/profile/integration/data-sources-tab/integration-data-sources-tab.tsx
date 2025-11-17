import { Trash } from "lucide-react";
import { Button } from "@web-containers/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@web-containers/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@web-containers/components/ui/table";
import {
  useGetMaskedIntegrationCredentialsQuery,
  useDeleteIntegrationCredentialMutation,
  MaskLLM,
} from "@iblai/data-layer";
import { toast } from "sonner";

export default function IntegrationDataSourcesTab({
  tenantKey,
}: {
  tenantKey: string;
}) {
  // Fetch masked integration credentials from API
  const {
    data: maskedCredentials = [],
    isLoading: isMaskedCredentialsLoading,
    refetch,
  } = useGetMaskedIntegrationCredentialsQuery({ org: tenantKey });

  const [deleteIntegrationCredential, { isLoading: isDeletingIntegration }] =
    useDeleteIntegrationCredentialMutation();

  const handleDeleteCredential = async (
    name: string,
    platformKey: string
  ) => {
    try {
      await deleteIntegrationCredential({
        org: tenantKey,
        platform_key: platformKey,
        name,
      }).unwrap();
      toast.success("Data source credential deleted successfully");
      refetch();
    } catch (error) {
      console.error("Failed to delete credential:", error);
      toast.error("Failed to delete credential");
    }
  };

  return (
    <Card style={{ borderColor: "oklch(.922 0 0)" }}>
      <CardHeader>
        <div className="flex items-start gap-2">
          <CardDescription>
            These are data source credentials from third-party services that
            you've configured for use with your application.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[600px] w-full">
            <TableHeader>
              <TableRow style={{ borderColor: "oklch(.922 0 0)" }}>
                <TableHead>NAME</TableHead>
                <TableHead>KEY</TableHead>
                {/* <TableHead>PLATFORM</TableHead> */}
                {/* <TableHead className="w-[50px]"></TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isMaskedCredentialsLoading ? (
                <TableRow style={{ borderColor: "oklch(.922 0 0)" }}>
                <TableCell
                  colSpan={4}
                  className="p-4 sm:text-center text-sm text-gray-500"
                >
                  Loading...
                </TableCell>
              </TableRow>
              ) : maskedCredentials.length === 0 ? (
                <TableRow style={{ borderColor: "oklch(.922 0 0)" }}>
                  <TableCell
                    colSpan={4}
                    className="p-4 sm:text-center text-sm text-gray-500"
                  >
                    No data source credentials found
                  </TableCell>
                </TableRow>
              ) : (
                maskedCredentials.map(
                  (
                    cred: MaskLLM,
                    idx: number
                  ) => {
                    const provider = cred.service_info?.display_name || cred.name;
                    // Use logo from service_info only
                    let logoUrl: string | undefined;
                    let logoAlt: string | undefined;
                    
                    if (cred.service_info?.logo) {
                      logoUrl = cred.service_info.logo;
                      logoAlt = cred.service_info.display_name || cred.service_info.name;
                    }
                    
                    return (
                      <TableRow key={cred.name + idx} style={{ borderColor: "oklch(.922 0 0)" }}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {logoUrl ? (
                              <img
                                src={logoUrl}
                                alt={
                                  logoAlt || provider || cred.name
                                }
                                className="w-6 h-6 rounded-sm object-contain"
                              />
                            ) : (
                              <span className="text-lg">
                                {"🔑"}
                              </span>
                            )}
                            <span className="font-normal text-gray-900">
                              {provider || cred.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm text-gray-900">
                          {String(cred?.value?.key).slice(0, 15) || ""}
                        </TableCell>
                        {/* <TableCell className="text-gray-900">
                          {cred.platform}
                        </TableCell> */}
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="cursor-pointer mr-2"
                            disabled={isDeletingIntegration}
                            onClick={() =>
                              handleDeleteCredential(
                                cred.name,
                                cred.platform
                              )
                            }
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  }
                )
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
} 