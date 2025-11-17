'use client';

import React from 'react';
import { useDispatch } from 'react-redux';

import { useCreateSessionIdMutation } from '@iblai/data-layer';
import { advancedTabsProperties, type AdvancedTab, type ChatMode } from '@iblai/web-utils';
import { chatActions, defaultSessionIds } from '@iblai/web-utils';
import { useSearchParams } from 'next/navigation';

const total_session_ids = Object.keys(advancedTabsProperties).length;

type Props = {
  mode: ChatMode;
  tenantKey: string;
  mentorId: string;
  username: string;
  errorHandler?: (error: string) => void;
};

export function useGetChatDetails({ mode, tenantKey, mentorId, username, errorHandler }: Props) {
  const dispatch = useDispatch();
  const [isLoadingSessionIds, setIsLoadingSessionIds] = React.useState(false);
  const searchParams = useSearchParams();
  const [createSessionId] = useCreateSessionIdMutation();

  const sessionIdsToFetch = mode === 'advanced' ? total_session_ids : 1;

  const fetchMultipleSessionIds = async () => {
    setIsLoadingSessionIds(true);
    try {
      const requestBody = { mentor: mentorId };
      if (searchParams.get('token')) {
        // @ts-expect-error - shareable_link_token is not type of {mentor: string}
        requestBody['shareable_link_token'] = searchParams.get('token');
      }
      console.log('############### creating sessionIds [useGetChatDetails]');
      const sessionCreationPromises = Array.from({
        length: sessionIdsToFetch,
      }).map(() =>
        createSessionId({
          org: tenantKey,
          // @ts-expect-error - userId may not be part of useCreateSessionIdMutation Query definition
          userId: username,
          requestBody,
        }),
      );

      const results = await Promise.all(sessionCreationPromises);

      console.log('fetchMultipleSessionIds results', results);

      const extractedIds = results
        .map((result: any) => {
          if (result.error) {
            console.error('Error creating a session ID:', result.error);
            return null;
          }
          return result.data?.session_id;
        })
        .filter((id: any) => typeof id === 'string') as string[];

      console.log('fetchMultipleSessionIds extractedIds', extractedIds);

      if (extractedIds.length < sessionIdsToFetch) {
        errorHandler?.(`Failed to fetch session ID${sessionIdsToFetch > 1 ? 's' : ''}`);
        return;
      }

      console.log('fetchMultipleSessionIds setSessionIds start');

      const newSessionIds = extractedIds.reduce(
        (acc, id, index) => {
          acc[Object.keys(defaultSessionIds)[index] as AdvancedTab] = id;
          return acc;
        },
        {} as Record<AdvancedTab, string>,
      );

      dispatch(chatActions.setSessionIds(newSessionIds));

      console.log('fetchMultipleSessionIds setSessionIds end');
    } catch (error) {
      console.error('Failed to fetch session IDs:', error);
      dispatch(chatActions.setSessionIds(defaultSessionIds));
    } finally {
      setIsLoadingSessionIds(false);
      console.log('fetchMultipleSessionIds finally');
    }
  };

  return {
    isLoadingSessionIds,
    refetchSessionIds: fetchMultipleSessionIds,
  };
}
