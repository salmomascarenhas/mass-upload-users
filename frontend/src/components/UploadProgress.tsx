'use client';

import { connectToSocket } from '@/lib/socket';
import { useEffect, useState } from 'react';

interface ErrorDetail {
  chunkIndex: number;
  line: number;
  messages: string[];
}

interface UploadFinishedData {
  jobId: string;
  result: {
    flowId: string;
    totalSuccess: number;
    totalErrors: number;
    errorDetails: ErrorDetail[];
  };
}

export default function UploadProgress({ flowId }: { flowId: string }) {
  const [progress, setProgress] = useState(0);
  const [finalResult, setFinalResult] = useState<null | UploadFinishedData['result']>(null);

  useEffect(() => {
    const socket = connectToSocket(flowId);

    socket.on('upload-progress', (data: { flowId: string; progress: number }) => {
      if (data.flowId === flowId) {
        setProgress(data.progress);
      }
    });

    socket.on('upload-finished', (data: UploadFinishedData) => {
      if (data.jobId === flowId) {
        setFinalResult(data.result);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [flowId]);

  if (finalResult) {
    return (
      <div className="p-4 border border-green-300 rounded">
        <p className="font-semibold">Upload Finalizado!</p>
        <p>Sucesso: {finalResult.totalSuccess}</p>
        <p>Erros: {finalResult.totalErrors}</p>

        {finalResult.errorDetails.length > 0 && (
          <div className="mt-2 text-sm">
            <p className="font-medium">Detalhes dos erros:</p>
            <ul className="list-disc pl-4">
              {finalResult.errorDetails.map((err, i) => (
                <li key={i}>
                  Chunk {err.chunkIndex}, linha {err.line}: {err.messages.join(', ')}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 border rounded shadow-sm">
      <p className="font-medium">Progresso Global: {progress}%</p>
      <div className="relative w-full bg-gray-200 h-4 rounded mt-2">
        <div
          className="absolute top-0 left-0 h-4 bg-blue-500 rounded"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
