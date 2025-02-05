import React, { useState } from 'react';
import { FileText, X } from 'lucide-react';

interface FileListProps {
  files: { [key: string]: number };
  itemsPerPage?: number;
}

export function FileList({ files, itemsPerPage = 10 }: FileListProps) {
  const [showAll, setShowAll] = useState(false);
  const fileEntries = Object.entries(files);
  const totalFiles = fileEntries.length;
  
  const displayedFiles = showAll 
    ? fileEntries 
    : fileEntries.slice(0, itemsPerPage);

  return (
    <div className="mt-4 space-y-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Files uploaded: {totalFiles}
        </span>
      </div>

      <div className="space-y-2">
        {displayedFiles.map(([filename, progress]) => (
          <div key={filename} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded-md">
            <FileText className="w-4 h-4 text-gray-600" />
            <span className="flex-1 truncate">{filename}</span>
            {progress === -1 ? (
              <span className="text-red-500 flex items-center gap-1">
                <X className="w-4 h-4" /> Failed
              </span>
            ) : (
              <span className="text-gray-600">{progress}%</span>
            )}
          </div>
        ))}
      </div>

      {totalFiles > itemsPerPage && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 w-full py-2 px-4 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors duration-200"
        >
          {showAll ? 'Show Less' : `Show ${totalFiles - itemsPerPage} More Files`}
        </button>
      )}
    </div>
  );
}