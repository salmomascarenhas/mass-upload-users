import UploadProgress from '@/components/UploadProgress';
import Link from 'next/link';

export default function FlowProgressPage({ params }: { params: { flowId: string } }) {
  return (
    <main className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Status do Upload</h1>

      <UploadProgress flowId={params.flowId} />

      <div className="mt-6">
        <Link
          href="/"
          className="underline text-blue-600 hover:text-blue-800"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </main>
  );
}
