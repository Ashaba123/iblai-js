'use client';

import { useState, useEffect } from 'react';
import { Button } from '@web-containers/components/ui/button';
import { Input } from '@web-containers/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@web-containers/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface CSVEditorProps {
  csvData: {
    headers: string[];
    rows: string[][];
  };
  onSave: (data: { headers: string[]; rows: string[][] }) => void;
  onCancel: () => void;
}

export function CSVEditor({ csvData, onSave, onCancel }: CSVEditorProps) {
  const [headers, setHeaders] = useState<string[]>(csvData.headers);
  const [rows, setRows] = useState<string[][]>(csvData.rows);
  const [isEditing, setIsEditing] = useState<{ row: number; col: number } | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Initialize with default data if empty
  useEffect(() => {
    if (headers.length === 0) {
      setHeaders(['email', 'platform_key']);
    }
    if (rows.length === 0) {
      setRows([['', '']]);
    }
  }, []);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    setIsEditing({ row: rowIndex, col: colIndex });
    setEditValue(rows[rowIndex]?.[colIndex] || '');
  };

  const handleCellChange = (value: string) => {
    setEditValue(value);
  };

  const handleCellBlur = () => {
    if (isEditing) {
      const newRows = [...rows];
      if (!newRows[isEditing.row]) {
        newRows[isEditing.row] = new Array(headers.length).fill('');
      }
      newRows[isEditing.row][isEditing.col] = editValue;
      setRows(newRows);
      setIsEditing(null);
      setEditValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCellBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(null);
      setEditValue('');
    }
  };

  const addRow = () => {
    setRows([...rows, new Array(headers.length).fill('')]);
  };

  const deleteRow = (rowIndex: number) => {
    if (rows.length > 1) {
      const newRows = rows.filter((_, index) => index !== rowIndex);
      setRows(newRows);
    }
  };

  const handleHeaderChange = (colIndex: number, value: string) => {
    const newHeaders = [...headers];
    newHeaders[colIndex] = value;
    setHeaders(newHeaders);
  };

  const validateData = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errors: string[] = [];

    rows.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (headers[colIndex] === 'email' && cell && !emailRegex.test(cell)) {
          errors.push(`Row ${rowIndex + 1}: Invalid email format`);
        }
        if (headers[colIndex] === 'platform_key' && !cell.trim()) {
          errors.push(`Row ${rowIndex + 1}: Platform key is required`);
        }
      });
    });

    return errors;
  };

  const handleSave = () => {
    const errors = validateData();
    if (errors.length > 0) {
      toast.error(`Validation errors:\n${errors.join('\n')}`);
      return;
    }

    // Filter out empty rows
    const filteredRows = rows.filter((row) => row.some((cell) => cell.trim() !== ''));
    onSave({ headers, rows: filteredRows });
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Edit CSV Data</DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto px-6 py-4">
          <div className="overflow-auto max-h-[60vh] overflow-x-auto">
            <table className="w-full border-collapse min-w-full">
              <thead className="sticky top-0 bg-gray-50 z-10">
                <tr>
                  {headers.map((header, colIndex) => (
                    <th
                      key={colIndex}
                      className="border border-gray-300 p-2 bg-gray-100 whitespace-nowrap"
                    >
                      <Input
                        value={header}
                        onChange={(e) => handleHeaderChange(colIndex, e.target.value)}
                        className="h-8 text-sm font-medium border-0 bg-transparent p-1 min-w-[120px]"
                      />
                    </th>
                  ))}
                  <th className="border border-gray-300 p-2 bg-gray-100 whitespace-nowrap"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {row.map((cell, colIndex) => (
                      <td
                        key={`${rowIndex}-${colIndex}`}
                        className="border border-gray-300 p-0 min-w-[120px] whitespace-nowrap"
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                      >
                        {isEditing?.row === rowIndex && isEditing?.col === colIndex ? (
                          <Input
                            value={editValue}
                            onChange={(e) => handleCellChange(e.target.value)}
                            onBlur={handleCellBlur}
                            onKeyDown={handleKeyDown}
                            className="h-8 border-0 rounded-none focus:ring-0 p-2"
                            autoFocus
                          />
                        ) : (
                          <div className="p-2 h-8 flex items-center cursor-pointer hover:bg-blue-50">
                            {cell || <span className="text-gray-400 italic">Click to edit</span>}
                          </div>
                        )}
                      </td>
                    ))}
                    <td className="border border-gray-300 py-2 px-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRow(rowIndex)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        disabled={rows.length <= 1}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={headers.length + 1} className="border border-gray-300 p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={addRow}
                      className="w-full gap-2 text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      Add Row
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-[#2563EB] to-[#93C5FD] hover:opacity-90 text-white"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
