import React, { useCallback, useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { processFile } from '../utils/fileProcessors';
import { DndEntity } from '../types/dnd';
import { FileList } from './FileList';
import { ProcessingTerminal } from './ProcessingTerminal';

export function FileUpload() {
  const { setData, setProcessing, resetProcessing } = useStore();
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFiles = async (files: FileList) => {
    resetProcessing();
    setProcessing(true);
    setError(null);
    
    const allowedTypes = ['json', 'html', 'md'];
    const validFiles = Array.from(files).filter(file => 
      allowedTypes.includes(file.name.split('.').pop()?.toLowerCase() || '')
    );

    if (validFiles.length === 0) {
      setError('No valid files selected. Please upload JSON, HTML, or Markdown files.');
      setProcessing(false);
      return;
    }

    try {
      const allEntities: DndEntity[] = [];
      
      for (const file of validFiles) {
        try {
          const entities = await processFile(file);
          allEntities.push(...entities);
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error);
        }
      }

      if (allEntities.length > 0) {
        setData(allEntities);
      } else {
        setError('No valid data could be extracted from the files.');
      }
    } catch (error) {
      console.error('Error processing files:', error);
      setError('Error processing files. Please ensure they are valid.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      processFiles(event.target.files);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div
        className={`relative border-2 ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300 bg-gray-50'
        } rounded-lg p-6 transition-colors duration-200`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <label 
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <Upload className="w-12 h-12 mb-4 text-gray-500" />
          <p className="mb-2 text-sm text-gray-700">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            Support for JSON, HTML, and Markdown files
          </p>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            multiple
            accept=".json,.html,.md,.markdown"
            onChange={handleChange}
          />
        </label>

        {/* File List with Pagination */}
        {Object.keys(uploadProgress).length > 0 && (
          <FileList files={uploadProgress} itemsPerPage={10} />
        )}

        {/* Processing Terminal */}
        <ProcessingTerminal />

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}