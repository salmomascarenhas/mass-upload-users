'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiURL } from '../lib/socket';


export default function HomePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleUpload() {
    if (!file) {
      setError('Selecione um arquivo CSV antes de enviar.');
      return;
    }
    setError(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${apiURL}/users/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erro no upload: ${res.status} - ${text}`);
      }

      const data = await res.json();
      if (!data.flowId) {
        throw new Error('flowId não encontrado na resposta do backend');
      }

      router.push(`/${data.flowId}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao enviar arquivo');
      }
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Upload de CSV</h1>

      <div className="space-y-4">
        <div>
          <Label htmlFor="fileInput">Selecione o arquivo CSV</Label>
          <Input
            id="fileInput"
            type="file"
            accept=".csv"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (!e.target.files || e.target.files.length === 0) {
                setFile(null);
                return;
              }
              setFile(e.target.files[0]);
            }}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button onClick={handleUpload} disabled={isUploading}>
          {isUploading ? 'Enviando...' : 'Enviar CSV'}
        </Button>
      </div>
    </main>
  );
}
