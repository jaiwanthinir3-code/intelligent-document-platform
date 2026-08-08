import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function DocumentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  useEffect(() => {
    fetchDocument();
  }, [id]);

  async function fetchDocument() {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Document fetch error:", error);
      setLoading(false);
      return;
    }

    setDocument(data);
    setFavorite(data.is_favorite || false);
    setLoading(false);
  }

  async function handleDownload() {
    if (!document?.filepath) return;

    const { data, error } = await supabase.storage
      .from("document")
      .download(document.filepath);

    if (error) {
      console.error("Download error:", error);
      alert("Unable to download document.");
      return;
    }

    const url = URL.createObjectURL(data);

    const link = window.document.createElement("a");
    link.href = url;
    link.download = document.filename;
    link.click();

    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="p-8">
        <p>Loading document...</p>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold">
          Document not found
        </h2>

        <button
          onClick={() => navigate("/documents")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Back to Documents
        </button>
      </div>
    );
  }
  async function handleFavorite() {
  if (!document) return;

  const newFavorite = !favorite;

  const { error } = await supabase
    .from("documents")
    .update({
      is_favorite: newFavorite,
    })
    .eq("id", document.id);

  if (error) {
    console.error("Favorite update error:", error);
    alert("Failed to update favorite.");
    return;
  }

  setFavorite(newFavorite);
  setDocument({
    ...document,
    is_favorite: newFavorite,
  });
}
async function handleDelete() {
  if (!document) return;

  const confirmed = window.confirm(
    `Are you sure you want to delete "${document.filename}"?`
  );

  if (!confirmed) return;

  try {
    // Delete PDF from Supabase Storage
    const { error: storageError } = await supabase.storage
      .from("document")
      .remove([document.filepath]);

    if (storageError) {
      console.error("Storage delete error:", storageError);
      throw storageError;
    }

    // Delete metadata from documents table
    const { error: dbError } = await supabase
      .from("documents")
      .delete()
      .eq("id", document.id);

    if (dbError) {
      console.error("Database delete error:", dbError);
      throw dbError;
    }

    alert("✅ Document deleted successfully!");

    navigate("/documents");

  } catch (error) {
    console.error("Delete error:", error);
    alert("Failed to delete document.");
  }
}
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6">

        <button
          onClick={() => navigate("/documents")}
          className="text-blue-600 mb-4"
        >
          ← Back to Documents
        </button>

        <h1 className="text-3xl font-bold">
          📄 {document.filename}
        </h1>

        <p className="text-gray-500 mt-2">
          Uploaded on{" "}
          {new Date(document.uploaded_at).toLocaleString()}
        </p>

      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">📑 Pages</p>
          <p className="text-3xl font-bold mt-2">
            {document.pages || 0}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">📝 Words</p>
          <p className="text-3xl font-bold mt-2">
            {document.words || 0}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">🔤 Characters</p>
          <p className="text-3xl font-bold mt-2">
            {document.characters || 0}
          </p>
        </div>

      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-2xl font-bold mb-4">
          🤖 AI Summary
        </h2>

        <div className="whitespace-pre-wrap text-gray-700 leading-7">
          {document.summary || "No summary available."}
        </div>

      </div>

      {/* Extracted Text */}
      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-2xl font-bold mb-4">
          📝 Extracted Text
        </h2>

        <div className="bg-gray-50 rounded-lg p-5 max-h-96 overflow-y-auto whitespace-pre-wrap text-gray-700">
          {document.document_text || "No extracted text available."}
        </div>

      </div>

     <div className="bg-white rounded-xl shadow p-6 flex gap-4">

  {/* Download */}
  <button
    onClick={handleDownload}
    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
  >
    ⬇️ Download PDF
  </button>
  <button
    onClick={handleFavorite}
    className={`px-6 py-3 rounded-lg font-semibold ${
      favorite
        ? "bg-yellow-500 text-white"
        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
    }`}
  >
    {favorite ? "⭐ Favorited" : "☆ Add to Favorites"}
  </button>
  {/* Delete */}
  <button
    onClick={handleDelete}
    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
  >
    🗑️ Delete Document
  </button>

</div>

    </div>
  );
}