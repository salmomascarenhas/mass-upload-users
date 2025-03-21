'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
      // Ajuste a URL se o seu backend rodar em outro host/porta
      const res = await fetch('http://localhost:3000/users/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erro no upload: ${res.status} - ${text}`);
      }

      // Espera um JSON { flowId: "...", message: "..."}
      const data = await res.json();
      if (!data.flowId) {
        throw new Error('flowId não encontrado na resposta do backend');
      }

      // Redirecionar para /[flowId]
      router.push(`/${data.flowId}`);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar arquivo');
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
            onChange={(e) => {
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
