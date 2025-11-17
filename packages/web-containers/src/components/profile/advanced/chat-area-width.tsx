'use client';

import { useState, useEffect } from 'react';
import { Input } from '@web-containers/components/ui/input';
import { Info } from 'lucide-react';
import { CHAT_AREA_SIZE } from '@iblai/web-utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@web-containers/components/ui/tooltip';

interface ChatAreaWidthProps {
  chatAreaSize: number | undefined;
  isUpdating: boolean;
  onUpdate: (size: number) => void;
  onError: (message: string) => void;
}

export function ChatAreaWidth({ chatAreaSize, isUpdating, onUpdate, onError }: ChatAreaWidthProps) {
  const [chatAreaSizeInput, setChatAreaSizeInput] = useState<string>(
    String(chatAreaSize || CHAT_AREA_SIZE.DEFAULT),
  );

  useEffect(() => {
    const currentSize = chatAreaSize || CHAT_AREA_SIZE.DEFAULT;
    setChatAreaSizeInput(String(currentSize));
  }, [chatAreaSize]);

  const handleChatAreaSizeBlur = () => {
    const value = parseInt(chatAreaSizeInput, 10);
    if (!isNaN(value) && value >= CHAT_AREA_SIZE.MIN && value <= CHAT_AREA_SIZE.MAX) {
      onUpdate(value);
    } else {
      // Reset to current value if invalid
      const currentSize = chatAreaSize || CHAT_AREA_SIZE.DEFAULT;
      setChatAreaSizeInput(String(currentSize));
      onError(`Please enter a value between ${CHAT_AREA_SIZE.MIN} and ${CHAT_AREA_SIZE.MAX}`);
    }
  };

  return (
    <div
      className="flex items-center justify-between rounded-lg border px-6 py-4"
      style={{ borderColor: 'oklch(.922 0 0)' }}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-[#646464]">Chat Area Width (px)</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              aria-label="More info about Chat Area Width"
              className="hidden sm:block"
            >
              <Info className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent className="rounded-lg bg-gray-700 px-3 py-2 text-sm font-medium whitespace-nowrap text-white shadow-sm transition-opacity duration-300 z-50">
              <p>
                Configure the width of the chat area (default: {CHAT_AREA_SIZE.DEFAULT}px, max:{' '}
                {CHAT_AREA_SIZE.MAX}px)
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={CHAT_AREA_SIZE.MIN}
          max={CHAT_AREA_SIZE.MAX}
          value={chatAreaSizeInput}
          onChange={(e) => setChatAreaSizeInput(e.target.value)}
          onBlur={handleChatAreaSizeBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleChatAreaSizeBlur();
            }
          }}
          disabled={isUpdating}
          className="w-[120px] font-medium text-[#646464]"
        />
        {isUpdating && (
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        )}
      </div>
    </div>
  );
}
