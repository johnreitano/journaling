import { decodeSharedEntry } from "@/lib/sharing";
import SharedEntryView from "@/components/SharedEntryView";

interface SharedPageProps {
  searchParams: Promise<{ data?: string }>;
}

export default async function SharedPage({ searchParams }: SharedPageProps) {
  const params = await searchParams;
  const encoded = params.data;

  if (!encoded) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-500 text-sm">No entry data found in this link.</p>
        </div>
      </div>
    );
  }

  const data = decodeSharedEntry(encoded);

  if (!data) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-500 text-sm">This link appears to be invalid or corrupted.</p>
        </div>
      </div>
    );
  }

  return <SharedEntryView data={data} />;
}
