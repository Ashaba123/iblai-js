import { StorageService } from "@data-layer/services/StorageService";
import Config from "@data-layer/config";
import { IblDataLayer } from "@data-layer/core";

export const initializeDataLayer = (
  dmUrl: string,
  lmsUrl: string,
  storageService: StorageService,
  httpErrorHandler: Record<number, () => void> = {}
): void => {
  IblDataLayer.storage = storageService;
  Config.dmUrl = dmUrl;
  Config.lmsUrl = lmsUrl;
  Config.httpErrorHandlers = httpErrorHandler;
};
