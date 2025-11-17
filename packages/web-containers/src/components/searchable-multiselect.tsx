'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Check, Eye } from 'lucide-react';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';

interface SearchableMultiSelectProps<T = any> {
  items: T[];
  selectedItems: { label: string; value: string }[];
  onSelectionChange: (items: { label: string; value: string }[]) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isLoading: boolean;
  placeholder?: string;
  getItemValue: (item: T) => string;
  getItemLabel: (item: T) => string;
  className?: string;
  maxHeight?: string;
  inputId?: string;
  ariaDescribedBy?: string;
  onSelectedItemAction?: (item: { label: string; value: string }) => void;
  selectedItemActionIcon?: React.ReactNode;
  selectedItemActionAriaLabel?: string;
}

export function SearchableMultiSelect<T = any>({
  items,
  selectedItems,
  onSelectionChange,
  searchQuery,
  onSearchChange,
  isLoading,
  placeholder = 'Search and select items...',
  getItemValue,
  getItemLabel,
  className,
  maxHeight = 'max-h-60',
  inputId,
  ariaDescribedBy,
  onSelectedItemAction,
  selectedItemActionIcon,
  selectedItemActionAriaLabel = 'View item details',
}: SearchableMultiSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectItem = (itemValue: string, itemLabel: string) => {
    const newSelection = selectedItems.some((item) => item.value === itemValue)
      ? selectedItems.filter((item) => item.value !== itemValue)
      : [...selectedItems, { label: itemLabel, value: itemValue }];
    onSelectionChange(newSelection);
  };

  const handleRemoveItem = (itemValue: string) => {
    onSelectionChange(selectedItems.filter((item) => item.value !== itemValue));
  };

  return (
    <div className={cn('space-y-2', className)} ref={containerRef}>
      <div className="relative">
        <div
          className={cn(
            'flex min-h-[40px] w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
            'cursor-pointer',
          )}
        >
          <div className="flex flex-1 items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsOpen(true)}
              id={inputId}
              aria-describedby={ariaDescribedBy}
              className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="flex items-center gap-1">
            {selectedItems.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {selectedItems.length}
              </Badge>
            )}
            <X
              className="h-4 w-4 text-muted-foreground cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onSelectionChange([]);
                onSearchChange('');
                setIsOpen(false);
              }}
            />
          </div>
        </div>

        {isOpen && (
          <div
            className={cn(
              'absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg overflow-auto',
              maxHeight,
            )}
          >
            {isLoading ? (
              <div className="p-3 text-sm text-muted-foreground">Loading...</div>
            ) : items.length > 0 ? (
              items.map((item) => {
                const itemValue = getItemValue(item);
                const itemLabel = getItemLabel(item);
                const isSelected = selectedItems.some((selected) => selected.value === itemValue);

                return (
                  <div
                    key={itemValue}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleSelectItem(itemValue, itemLabel)}
                  >
                    <div className="flex items-center justify-center w-4 h-4">
                      {isSelected && <Check className="h-3 w-3 text-primary" />}
                    </div>
                    <span className="text-sm">{itemLabel}</span>
                  </div>
                );
              })
            ) : (
              <div className="p-3 text-sm text-muted-foreground">
                {searchQuery ? 'No items found' : 'Start typing to search items'}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedItems.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {selectedItems
            .slice()
            .reverse()
            .map((selectedItem) => {
              return (
                <Badge
                  key={selectedItem.value}
                  variant="secondary"
                  className="text-xs whitespace-nowrap flex-shrink-0 font-normal"
                >
                  {selectedItem.label}
                  {onSelectedItemAction && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onSelectedItemAction(selectedItem);
                      }}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                      aria-label={selectedItemActionAriaLabel}
                    >
                      {selectedItemActionIcon ?? <Eye className="h-3 w-3" />}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(selectedItem.value)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </Badge>
              );
            })}
        </div>
      )}
    </div>
  );
}
