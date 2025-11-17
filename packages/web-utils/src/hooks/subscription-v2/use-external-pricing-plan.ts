"use client";

import { isJSON } from "@web-utils/utils";
import { useEffect, useRef } from "react";
import { PricingModalData } from "@web-utils/types/subscription";

export const useExternalPricingPlan = ({
  pricingModalData,
  userEmail,
}: {
  pricingModalData: PricingModalData;
  userEmail: string;
}) => {
  const pricingBoxIframeRef = useRef(null);

  const getIFrameReadyData = async () => {
    return {
      referenceId: pricingModalData?.referenceId || "",
      customerEmail: pricingModalData?.customerEmail || userEmail,
      publishableKey: pricingModalData?.publishableKey || "",
      ...(pricingModalData?.pricingTableId && {
        pricingTableId: pricingModalData.pricingTableId,
      }),
    };
  };

  const handleIframePostMessageInteractions = async (event: {
    data: string;
  }) => {
    const message = isJSON(event?.data) ? JSON.parse(event.data) : null;
    if (message?.ready) {
      const dataToSend = await getIFrameReadyData();
      (
        pricingBoxIframeRef?.current as unknown as HTMLIFrameElement
      )?.contentWindow?.postMessage(JSON.stringify({ data: dataToSend }), "*");
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleIframePostMessageInteractions);
    return () => {
      window.removeEventListener(
        "message",
        handleIframePostMessageInteractions,
      );
    };
  }, []);

  return {
    pricingBoxIframeRef,
  };
};
