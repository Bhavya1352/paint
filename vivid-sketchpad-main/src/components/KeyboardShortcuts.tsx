import { useState } from 'react';
import { Keyboard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export const KeyboardShortcuts = () => {
  const shortcuts = [
    { key: 'Ctrl + Z', action: 'Undo last action' },
    { key: 'Ctrl + Y', action: 'Redo last action' },
    { key: 'Ctrl + S', action: 'Save project' },
    { key: 'Delete', action: 'Delete selected object' },
    { key: 'Backspace', action: 'Delete selected object' },
    { key: 'Esc', action: 'Deselect all objects' },
    { key: 'Space + Drag', action: 'Pan canvas' },
    { key: 'Ctrl + +', action: 'Zoom in' },
    { key: 'Ctrl + -', action: 'Zoom out' },
    { key: 'Ctrl + 0', action: 'Reset zoom' },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="w-10 h-10"
          title="Keyboard Shortcuts"
        >
          <Keyboard className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
              <span className="text-sm text-gray-600">{shortcut.action}</span>
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};