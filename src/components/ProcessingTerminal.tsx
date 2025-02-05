import React from 'react';
import { Terminal, StopCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

export function ProcessingTerminal() {
  const { processingLogs, isProcessing, setShouldStop, processedCount } = useStore();
  const terminalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [processingLogs]);

  const handleStop = () => {
    setShouldStop(true);
  };

  if (!processingLogs.length) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-4">
      <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-mono text-gray-300">Processing Log</span>
          </div>
          {isProcessing && (
            <button
              onClick={handleStop}
              className="flex items-center gap-1 px-2 py-1 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              <StopCircle className="w-4 h-4" />
              Stop Processing
            </button>
          )}
        </div>
        <div className="px-4 py-2 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">
              Processed Items: <span className="text-green-400">{processedCount}</span>
            </span>
          </div>
        </div>
        <div 
          ref={terminalRef}
          className="p-4 h-48 overflow-y-auto font-mono text-sm"
        >
          {processingLogs.map((log, index) => (
            <div
              key={index}
              className={`mb-1 ${
                log.type === 'error' 
                  ? 'text-red-400' 
                  : log.type === 'success'
                    ? 'text-green-400'
                    : log.type === 'progress'
                      ? 'text-blue-400'
                      : 'text-gray-300'
              }`}
            >
              <span className="text-gray-500">[{log.timestamp}]</span>{' '}
              {log.message}
              {log.data && (
                <pre className="ml-4 text-xs text-gray-400 overflow-x-auto">
                  {JSON.stringify(log.data, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}