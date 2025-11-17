export interface TopBannerProps {
  parentContainerSelector: string;
  bannerText?: string;
  loading?: boolean;
  tooltipText?: string;
  buttonHandler?: () => void;
  buttonLabel?: string;
  onLoad?: (bannerRef: HTMLDivElement) => void;
  onClose?: () => void;
}
