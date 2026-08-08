import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { getAuth } from "firebase/auth";
export default function DocumentHistory({ limit }) {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    const auth = getAuth();
const user = auth.currentUser;

if (!user) {
  setDocuments([]);
  return;
}
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("uploaded_by",user.uid)
      .order("uploaded_at", { ascending: false });

    if (error) {
      console.error("Supabase Error:", error);
      return;
    }

    console.log("Fetched Documents:", data);

    if (limit) {
      setDocuments((data || []).slice(0, limit));
    } else {
      setDocuments(data || []);
    }
  }
 const filteredDocuments = documents.filter((doc) => {
  const matchesSearch = doc.filename
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesFavorite = showFavorites
    ? doc.is_favorite === true
    : true;

  return matchesSearch && matchesFavorite;
});
 
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Uploaded Documents
      </h2>

      {!limit && (
        <>
        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        <div className="flex gap-3 mb-6">
  <button
    onClick={() => setShowFavorites(false)}
    className={`px-4 py-2 rounded-lg font-semibold ${
      !showFavorites
        ? "bg-blue-600 text-white"
        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
    }`}
  >
    📁 All Documents
  </button>

  <button
    onClick={() => setShowFavorites(true)}
    className={`px-4 py-2 rounded-lg font-semibold ${
      showFavorites
        ? "bg-yellow-500 text-white"
        : "bg-gray-200  dark:bg-gray-700 text-gray-800 dark:text-gray-200"
    }`}
  >
    ⭐ Favorites
  </button>
</div>
</>
      )}

      {filteredDocuments.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No documents uploaded yet.</p>
      ) : (
        filteredDocuments.map((doc) => (
          <div
            key={doc.id}
            onClick={() => navigate(`/documents/${doc.id}`)}
            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 cursor-pointer hover:shadow-lg hover:border-blue-400 transition-colors duration-300"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {doc.filename}
            </h3>

            <p  className="text-gray-700 dark:text-gray-200">
              Status: {doc.processing_status}
            </p>

            <p  className="text-gray-700 dark:text-gray-200">
              Pages: {doc.pages || 0}
            </p>

            <p  className="text-gray-700 dark:text-gray-200">
              Words: {doc.words || 0}
            </p>

            <p  className="text-gray-700 dark:text-gray-200">
              Characters: {doc.characters || 0}
            </p>

            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {new Date(doc.uploaded_at).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
