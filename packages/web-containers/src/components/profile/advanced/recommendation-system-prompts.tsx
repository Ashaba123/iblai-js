'use client';

import { useState } from 'react';
import { Button } from '@web-containers/components/ui/button';
import { Textarea } from '@web-containers/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@web-containers/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@web-containers/components/ui/dialog';
import { ChevronDown, ChevronUp, Plus, Edit2, Trash2, Info, Loader2 } from 'lucide-react';
import {
  RecommendedPromptDetailResponse,
  useGetRecommendedPromptsListQuery,
  useCreateRecommendedPromptMutation,
  useUpdateRecommendedPromptMutation,
  useDeleteRecommendedPromptMutation,
  recommendationPromptTypeEnum,
} from '@iblai/data-layer';
import { toast } from 'sonner';

interface RecommendationSystemPromptsContentProps {
  platformKey: string;
  currentSPA?: string;
}

interface PromptFormData {
  prompt_text: string;
  active: boolean;
}

export const RecommendationSystemPromptsContent = ({
  platformKey,
  currentSPA,
}: RecommendationSystemPromptsContentProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<RecommendedPromptDetailResponse | null>(null);
  const [formData, setFormData] = useState<PromptFormData>({
    prompt_text: '',
    active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingPromptId, setDeletingPromptId] = useState<number | null>(null);

  // Determine recommendation type based on currentSPA
  const recommendationType =
    currentSPA?.toLowerCase() === 'skills'
      ? recommendationPromptTypeEnum.catalog
      : recommendationPromptTypeEnum.mentors;

  const {
    data: prompts,
    isLoading: isLoadingPrompts,
    isFetching,
    refetch: refetchPrompts,
  } = useGetRecommendedPromptsListQuery({
    params: {
      platform_key: platformKey,
      recommendation_type: recommendationType,
    },
  });

  const [createPrompt] = useCreateRecommendedPromptMutation();
  const [updatePrompt] = useUpdateRecommendedPromptMutation();
  const [deletePrompt] = useDeleteRecommendedPromptMutation();

  const promptsList = Array.isArray(prompts) ? prompts : [];

  // Check if we can add more prompts (only one prompt per recommendation type)
  // Don't show Add button if there's already any prompt (default or custom)
  const canAddPrompt = promptsList.length === 0;

  const handleOpenDialog = (prompt?: RecommendedPromptDetailResponse) => {
    if (prompt) {
      // If prompt id is null, it's a default prompt - treat as creation with pre-filled text
      if (prompt.id === null) {
        setEditingPrompt(null);
        setFormData({
          prompt_text: prompt.prompt_text,
          active: true,
        });
      } else {
        // Regular edit for custom prompts
        setEditingPrompt(prompt);
        setFormData({
          prompt_text: prompt.prompt_text,
          active: prompt.active,
        });
      }
    } else {
      setEditingPrompt(null);
      setFormData({
        prompt_text: '',
        active: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPrompt(null);
    setFormData({
      prompt_text: '',
      active: true,
    });
  };

  const handleInputChange = (field: keyof PromptFormData, value: string | boolean | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.prompt_text.trim()) {
      toast.error('Please fill in the prompt text');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingPrompt && editingPrompt.id !== null) {
        // Update existing prompt
        await updatePrompt({
          requestBody: {
            prompt_text: formData.prompt_text,
            active: formData.active,
          },
          prompt_id: editingPrompt.id,
          platform_key: platformKey,
        }).unwrap();

        toast.success('Prompt updated successfully');
      } else {
        // Create new prompt
        await createPrompt({
          requestBody: {
            platform_key: platformKey,
            recommendation_type: recommendationType,
            spa_url: window.location.origin.replace('https://', '').replace('http://', ''),
            prompt_text: formData.prompt_text,
            active: formData.active,
            ranking_strategy: 'personalized',
          },
        }).unwrap();

        toast.success('Prompt created successfully');
      }

      handleCloseDialog();
      refetchPrompts();
    } catch (error) {
      console.error('Error saving prompt:', error);
      toast.error('Failed to save prompt');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (promptId: number | null) => {
    // Don't allow deletion of default prompts
    if (promptId === null) {
      return;
    }

    setDeletingPromptId(promptId);
    try {
      await deletePrompt({
        params: {
          prompt_id: promptId,
          platform_key: platformKey,
        },
      }).unwrap();

      toast.success('Prompt deleted successfully');
      refetchPrompts();
    } catch (error) {
      console.error('Error deleting prompt:', error);
      toast.error('Failed to delete prompt');
    } finally {
      setDeletingPromptId(null);
    }
  };

  // Determine if Add button should be shown
  const showAddButton = canAddPrompt;

  return (
    <div
      className="rounded-lg px-6 py-5 border border-gray-200 dark:border-gray-700"
      style={{ borderColor: 'oklch(.922 0 0)' }}
    >
      {/* Header */}
      <div className="flex sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[#646464]">Recommendation System Prompts</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                aria-label="More info about public registration"
                className="hidden sm:block"
              >
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent className="rounded-lg bg-gray-700 px-3 py-2 text-sm font-medium whitespace-nowrap text-white shadow-sm transition-opacity duration-300 z-50">
                <p>Configure the recommendation system prompts</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {isFetching && !isLoadingPrompts && (
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" aria-hidden="true" />
          )}
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {showAddButton && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="gap-1"
              onClick={() => handleOpenDialog()}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add
            </Button>
          )}
          <button
            onClick={() => setIsCollapsed((previous) => !previous)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            aria-label={isCollapsed ? 'Expand prompts list' : 'Collapse prompts list'}
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

      {/* Prompts List - Collapsible */}
      {!isCollapsed && (
        <div className="mt-0">
          {isLoadingPrompts ? (
            <div className="p-4 text-gray-500">Loading prompts...</div>
          ) : promptsList.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 text-center">
              No prompts configured yet. Click "Add" to create your first recommendation prompt.
            </div>
          ) : (
            <div>
              {promptsList
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((prompt, index) => (
                  <div
                    key={prompt.id === null ? 'default-prompt' : prompt.id}
                    className={`py-4 ${index !== promptsList.length - 1 ? 'border-b border-gray-200' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-sm font-medium text-[#646464]">
                            {prompt.recommendation_type === recommendationPromptTypeEnum.catalog
                              ? 'Catalog'
                              : 'Mentor'}{' '}
                            Prompt
                          </h4>
                          {prompt.id === null ? (
                            <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-600">
                              Default
                            </span>
                          ) : (
                            <span
                              className={`px-2 py-0.5 text-xs rounded ${
                                prompt.active
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {prompt.active ? 'Active' : 'Inactive'}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">{prompt.prompt_text}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Only show switch for custom prompts (non-null id) */}
                        {/* {prompt.id !== null && (
                          <Switch
                            checked={prompt.active}
                            onCheckedChange={() => handleToggleActive(prompt)}
                            className="data-[state=checked]:bg-blue-500"
                            aria-label={`Toggle ${prompt.active ? 'deactivate' : 'activate'} prompt`}
                          />
                        )} */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(prompt)}
                          disabled={prompt.id && deletingPromptId === prompt.id}
                          aria-label={
                            prompt.id === null ? 'Create custom prompt from default' : 'Edit prompt'
                          }
                        >
                          <Edit2 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        {/* Only show delete button for custom prompts (non-null id) */}
                        {prompt.id !== null && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(prompt.id)}
                            className="text-red-600 hover:text-red-700"
                            disabled={deletingPromptId === prompt.id}
                            aria-label="Delete prompt"
                          >
                            {deletingPromptId === prompt.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            ) : (
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingPrompt ? 'Edit Prompt' : 'Add New Prompt'}</DialogTitle>
            <DialogDescription>
              {editingPrompt
                ? 'Update the recommendation system prompt details.'
                : `Create a new ${recommendationType === recommendationPromptTypeEnum.catalog ? 'catalog' : 'mentors'} recommendation prompt.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Prompt Text *</label>
              <Textarea
                value={formData.prompt_text}
                onChange={(e) => handleInputChange('prompt_text', e.target.value)}
                placeholder="Enter the prompt text that will guide users to relevant recommendations"
                className="w-full min-h-[120px]"
                rows={8}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseDialog}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:opacity-90"
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.prompt_text.trim()}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {editingPrompt ? 'Update' : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
