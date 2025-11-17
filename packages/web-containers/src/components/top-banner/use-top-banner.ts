"use client";

import { TopBannerProps } from "./types";
import { useEffect, useRef, useState } from "react";

export const useTopBanner = ({
  parentContainerSelector,
  loading,
  onLoad,
  onClose,
}: TopBannerProps) => {
  const [visible, setVisible] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLoading, setLoading] = useState(loading);
  const bannerRef = useRef<HTMLDivElement>(null);
  const prevParentHeight = useRef<string | null>(null);
  const parentElRef = useRef<HTMLElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if(bannerRef.current){
        onLoad?.(bannerRef.current);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setLoading(loading);
  }, [loading]);

  useEffect(() => {
    if (visible && bannerRef?.current) {
      onLoad?.(bannerRef.current);
    }
    return () => {
      onClose?.();
    };
  }, [visible, bannerRef]);

  useEffect(() => {
    if (!visible) return;
    const parentEl = document.querySelector(
      parentContainerSelector,
    ) as HTMLElement;
    if (!parentEl) return;
    parentElRef.current = parentEl as HTMLElement;

    function updateParentHeight() {
      if (!bannerRef.current || !parentEl) return;
      const bannerHeight = bannerRef.current.offsetHeight;
      parentEl.style.height = `calc(100vh - ${bannerHeight}px)`;
    }

    // Save previous height to restore on unmount
    prevParentHeight.current = parentEl.style.height;
    updateParentHeight();

    // Listen for resize
    const resizeObserver = new window.ResizeObserver(updateParentHeight);
    if (bannerRef.current) {
      resizeObserver.observe(bannerRef.current);
    }
    window.addEventListener("resize", updateParentHeight);

    return () => {
      if (resizeObserver && bannerRef.current) {
        resizeObserver.unobserve(bannerRef.current);
      }
      window.removeEventListener("resize", updateParentHeight);
      // Restore previous height
      if (parentElRef.current && prevParentHeight.current !== null) {
        parentElRef.current.style.height = prevParentHeight.current;
      }
    };
  }, [parentContainerSelector, visible]);

  return {
    visible,
    setVisible,
    showTooltip,
    setShowTooltip,
    bannerRef,
    parentElRef,
    isLoading,
    setLoading,
    isMobile,
  };
};
