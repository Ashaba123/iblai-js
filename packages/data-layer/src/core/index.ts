import { fakeBaseQuery, retry } from '@reduxjs/toolkit/query';
import { StorageService } from '../services/StorageService';

export class IblDataLayer {
  public static storage: StorageService;
}

export const iblFakeBaseQuery = retry(fakeBaseQuery(), { maxRetries: 3 });
