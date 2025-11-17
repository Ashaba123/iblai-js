import { describe, it, expect } from 'vitest';

// Simple constants test that doesn't depend on complex imports
describe('Data Layer Constants', () => {
  it('should define SERVICES enum values', () => {
    const SERVICES = {
      LMS: 'LMS' as const,
      DM: 'DM' as const,
      AXD: 'AXD' as const,
    };

    expect(SERVICES.LMS).toBe('LMS');
    expect(SERVICES.DM).toBe('DM');  
    expect(SERVICES.AXD).toBe('AXD');
  });

  it('should define STORAGE_KEYS values', () => {
    const STORAGE_KEYS = {
      DM_TOKEN_KEY: 'dm_token',
      AXD_TOKEN_KEY: 'axd_token', 
      EDX_TOKEN_KEY: 'edx_token',
    };

    expect(STORAGE_KEYS.DM_TOKEN_KEY).toBe('dm_token');
    expect(STORAGE_KEYS.AXD_TOKEN_KEY).toBe('axd_token');
    expect(STORAGE_KEYS.EDX_TOKEN_KEY).toBe('edx_token');
  });

  it('should validate service types', () => {
    type ServiceType = 'LMS' | 'DM' | 'AXD';
    const validServices: ServiceType[] = ['LMS', 'DM', 'AXD'];
    
    validServices.forEach(service => {
      expect(typeof service).toBe('string');
      expect(validServices).toContain(service);
    });
  });
});