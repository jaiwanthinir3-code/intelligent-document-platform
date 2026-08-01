
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function DocumentList() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("uploaded_at", { ascending: false });

    if (!error) {
      setDocuments(data);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-5">
        📄 Recent Documents
      </h2>

      {documents.length === 0 ? (
        <p className="text-gray-500">
          No documents uploaded yet.
        </p>
      ) : (
        documents.map((doc) => (
          <div
            key={doc.id}
            className="border rounded-lg p-4 mb-4"
          >
            <h3 className="font-semibold">
              {doc.filename}
            </h3>

            <p className="text-gray-500 text-sm">
              {(doc.filesize / 1024).toFixed(1)} KB
            </p>

            <p className="text-gray-400 text-xs">
              {new Date(doc.uploaded_at).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}