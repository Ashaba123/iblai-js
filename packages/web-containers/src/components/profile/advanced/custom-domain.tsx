'use client';

import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
  useCreateCustomDomainMutation,
  useDeleteCustomDomainMutation,
  useGetCustomDomainsQuery,
  type CustomDomain,
  type CustomDomainListResponse,
} from '@iblai/data-layer';
import { Button } from '@web-containers/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@web-containers/components/ui/dialog';
import { Input } from '@web-containers/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@web-containers/components/ui/table';
import { Check, ChevronDown, ChevronUp, Copy, Loader2, Plus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const normalizeCustomDomains = (response?: CustomDomainListResponse): CustomDomain[] => {
  if (!response) {
    return [];
  }

  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.results)) {
    return response.results;
  }

  if (Array.isArray(response.custom_domains)) {
    return response.custom_domains;
  }

  if (response.custom_domain) {
    return [response.custom_domain];
  }

  return [];
};

const sanitizeDomain = (domain: string): string => {
  return domain
    .trim()
    .replace(/^https?:\/\//, '') // Remove http:// or https://
    .replace(/^www\./, ''); // Remove www.
};

interface CustomDomainsContentProps {
  platformKey: string;
  currentSPA: string;
}

export const CustomDomainsContent = ({ platformKey, currentSPA }: CustomDomainsContentProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customDomainValue, setCustomDomainValue] = useState('');
  const [deletingDomainId, setDeletingDomainId] = useState<number | null>(null);
  const [copiedField, setCopiedField] = useState<'name' | 'value' | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const { data, isLoading, isFetching, refetch } = useGetCustomDomainsQuery({
    params: { platform_key: platformKey },
  });

  const [createCustomDomain, { isLoading: isCreating }] = useCreateCustomDomainMutation();

  const [deleteCustomDomain] = useDeleteCustomDomainMutation();

  const customDomains = useMemo(() => normalizeCustomDomains(data), [data]);

  const sslValue = `ssl.${typeof window !== 'undefined' ? window.location.hostname.split('.').slice(-2).join('.') : 'iblai.app'}`;

  // Get the current domain for the current SPA
  const currentDomain = useMemo(() => {
    if (!currentSPA) return null;
    return customDomains.find((domain) =>
      domain.spa?.toLowerCase().includes(currentSPA.toLowerCase()),
    );
  }, [customDomains, currentSPA]);

  const verifyCustomDomain = async (domain: string) => {
    if (!currentDomain?.registered_with_dns_pro) {
      return;
    }
    setIsVerifying(true);
    try {
      const endpoint = `https://dns.google/resolve?name=${domain}&type=CNAME`;
      const res = await fetch(endpoint, { cache: 'no-store' });
      const data = await res.json();

      let verified = false;
      if (data.Answer) {
        // Check if any CNAME record points to sslValue
        verified = data.Answer.some((a: any) => a.data.replace(/\.$/, '') === sslValue);
      }
      setIsVerified(verified);
    } catch (error) {
      console.error('Failed to verify domain:', error);
      setIsVerified(false);
    } finally {
      setIsVerifying(false);
    }
  };

  // Auto-check verification on domain load
  useEffect(() => {
    if (currentDomain?.custom_domain) {
      verifyCustomDomain(currentDomain.custom_domain);
    } else {
      setIsVerified(null);
    }
  }, [currentDomain?.custom_domain]);

  const handleDeleteCustomDomain = async (domain_id: number) => {
    try {
      setDeletingDomainId(domain_id);
      await deleteCustomDomain({
        domain_id,
        platform_key: platformKey,
      }).unwrap();
      await refetch();
      toast.success('Custom domain deleted successfully');
    } catch (error) {
      console.error('Failed to delete custom domain:', error);
      toast.error('Failed to delete custom domain');
    } finally {
      setDeletingDomainId(null);
    }
  };

  const handleResetForm = () => {
    setCustomDomainValue('');
  };

  const handleAddCustomDomain = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!customDomainValue.trim()) {
      toast.error('Please enter a custom domain');
      return;
    }

    const sanitizedDomain = sanitizeDomain(customDomainValue);

    try {
      await createCustomDomain({
        requestBody: {
          platform_key: platformKey,
          custom_domain: sanitizedDomain,
          spa: (currentSPA.endsWith('ai') ? currentSPA : `${currentSPA}ai`) as
            | 'skillsai'
            | 'mentorai'
            | 'analyticsai',
          registered_with_dns_pro: true,
        },
      }).unwrap();
      await refetch();
      toast.success('Custom domain created successfully');
      handleResetForm();
      setIsModalOpen(false);

      // Auto-verify after creation
      setTimeout(() => {
        verifyCustomDomain(sanitizedDomain);
      }, 1000);
    } catch (mutationError) {
      console.error('Failed to create custom domain:', mutationError);
      toast.error('Failed to create custom domain');
    }
  };

  const handleCopyField = async (value: string, fieldType: 'name' | 'value') => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(fieldType);
      toast.success('Copied to clipboard');

      // Reset the icon after 5 seconds
      setTimeout(() => {
        setCopiedField(null);
      }, 5000);
    } catch (copyError) {
      console.error('Failed to copy:', copyError);
      toast.error('Unable to copy');
    }
  };

  return (
    <div
      className="rounded-lg px-6 py-5 border border-gray-200 dark:border-gray-700"
      style={{ borderColor: 'oklch(.922 0 0)' }}
    >
      <div className="flex sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[#646464]">DNS Configuration</span>
          {isFetching && !isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" aria-hidden="true" />
          )}
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {!currentDomain && (
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="secondary" size="sm" className="gap-1">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Your custom domain</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddCustomDomain} className="space-y-4">
                  <div className="space-y-2">
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">!</span>
                        </div>
                        <span className="text-sm text-blue-800">
                          Domain verification is necessary after making changes
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="custom-domain" className="text-sm">
                        Custom Domain
                      </label>
                      <Input
                        id="custom-domain"
                        value={customDomainValue}
                        onChange={(event) => setCustomDomainValue(event.target.value)}
                        placeholder="example.com"
                        className="w-full"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsModalOpen(false);
                        handleResetForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:opacity-90"
                      type="submit"
                      disabled={isCreating}
                    >
                      {isCreating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                      Save
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
          <button
            onClick={() => setIsCollapsed((previous) => !previous)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            aria-label={isCollapsed ? 'Expand custom domain' : 'Collapse custom domain'}
            type="button"
          >
            {isCollapsed ? (
              <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
            ) : (
              <ChevronUp className="h-5 w-5 text-gray-400" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="mt-4">
          {isLoading ? (
            <div className="p-4 text-gray-500">Loading custom domain...</div>
          ) : currentDomain ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span>{currentDomain.custom_domain}</span>
                  {isVerifying ? (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Verifying...
                    </span>
                  ) : isVerified ? (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      Verified
                    </span>
                  ) : !currentDomain.registered_with_dns_pro ? (
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                      Unregistered
                    </span>
                  ) : isVerified === false ? (
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                      Not Verified
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  {!isVerified && isVerified !== null && currentDomain.registered_with_dns_pro && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => verifyCustomDomain(currentDomain.custom_domain)}
                      disabled={isVerifying}
                    >
                      {isVerifying ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Retry
                        </>
                      )}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteCustomDomain(currentDomain.id)}
                    disabled={deletingDomainId === currentDomain.id}
                  >
                    {deletingDomainId === currentDomain.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Delete'
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">i</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-900">Domain verification</h4>
                    <p className="text-sm text-blue-800">
                      To verify your domain ownership and enable it to point to your application,
                      you need to add the following DNS records at your domain registrar (like
                      Namecheap, GoDaddy, or Google Domains).
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5>Domain records</h5>
                </div>

                <div className="">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Type</TableHead>
                        <TableHead>Name/Host</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-sm">CNAME</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{currentDomain.custom_domain}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 shrink-0"
                              onClick={() => handleCopyField(currentDomain.custom_domain, 'name')}
                              aria-label={`Copy name/host: ${currentDomain.custom_domain}`}
                            >
                              {copiedField === 'name' ? (
                                <Check className="h-4 w-4 text-blue-600" aria-hidden="true" />
                              ) : (
                                <Copy className="h-4 w-4" aria-hidden="true" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{sslValue}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 shrink-0"
                              onClick={() => handleCopyField(sslValue, 'value')}
                              aria-label="Copy value/target"
                            >
                              {copiedField === 'value' ? (
                                <Check className="h-4 w-4 text-blue-600" aria-hidden="true" />
                              ) : (
                                <Copy className="h-4 w-4" aria-hidden="true" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          {isVerifying ? (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded flex items-center gap-1 w-fit">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Verifying...
                            </span>
                          ) : isVerified ? (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                              Verified
                            </span>
                          ) : !currentDomain.registered_with_dns_pro ? (
                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                              Unregistered
                            </span>
                          ) : isVerified === false ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => verifyCustomDomain(currentDomain.custom_domain)}
                              disabled={isVerifying}
                              className="h-7 text-xs"
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Retry
                            </Button>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-sm text-gray-500 text-center">
              No custom domain configured for this application.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
