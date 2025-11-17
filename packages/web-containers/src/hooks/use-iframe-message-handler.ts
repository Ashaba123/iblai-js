"use client";

import { useEffect, useRef } from "react";

type IframeMessage = {
  type: string;
  payload?: any;
};

type MessageHandler = (
  payload: any,
  rawEvent: MessageEvent
) => void | Promise<void>;

type UseIframeMessageHandlerOptions = {
  handlers: Record<string, MessageHandler>;
  allowedOrigins?: string[]; // restrict origins for security
  defaultHandler?: (data: any) => void;
};

export function useIframeMessageHandler({
  handlers,
  allowedOrigins,
  defaultHandler,
}: UseIframeMessageHandlerOptions): void {
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    const listener = async (event: MessageEvent): Promise<void> => {
      // Security: validate origin
      if (allowedOrigins && !allowedOrigins.includes(event.origin)) {
        console.warn(`Blocked message from disallowed origin: ${event.origin}`);
        return;
      }

      const { data } = event;
      if (typeof data !== "object" || !data?.type) {
        console.warn("No type in data. Using defaultHandler if passed");
        defaultHandler?.(data);
        return;
      }

      const { type, payload } = data as IframeMessage;

      const handler = handlersRef.current[type];
      if (!handler) {
        console.warn(
          `Unhandled iframe message type: ${type}. Using defaultHandler if passed`
        );
        defaultHandler?.(data);
        return;
      }

      try {
        await handler(payload, event);
      } catch (error) {
        console.error(`Error handling iframe message "${type}":`, error);
      }
    };

    window.addEventListener("message", listener);
    return (): void => window.removeEventListener("message", listener);
  }, [allowedOrigins]);
}
