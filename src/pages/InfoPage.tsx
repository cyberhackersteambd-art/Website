import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function InfoPage() {
  const { slug } = useParams();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/pages/${slug}`)
      .then(res => res.json())
      .then(data => {
        setPage(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="max-w-4xl mx-auto p-20 text-center">Loading...</div>;
  if (!page || page.error) return <div className="max-w-4xl mx-auto p-20 text-center text-red-500">Page not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100">
        <div className="markdown-body prose prose-slate max-w-none">
          <ReactMarkdown>{page.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
