import { UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { getAuth } from "firebase/auth";

export default function UploadCard() {
  const fileInputRef = useRef();

  const [summary, setSummary] = useState("");
  const [documentText, setDocumentText] = useState("");
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState(null);
  const handleUpload = async (event) => {
  const file = event.target.files[0];

  if (!file) return;

  if (file.type !== "application/pdf") {
    alert("Please upload a PDF.");
    return;
  }
const auth = getAuth();
const user = auth.currentUser;

if (!user) {
  alert("Please login first.");
  return;
}

  setLoading(true);

  const fileName = `${Date.now()}-${file.name}`;

  // 1. Upload PDF to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("document")
    .upload(fileName, file);

  if (uploadError) {
    alert(uploadError.message);
    setLoading(false);
    return;
  }

  // 2. Save document metadata
  const { data: insertedDoc, error: dbError } = await supabase
    .from("documents")
    .insert({
      filename: file.name,
      filepath: fileName,
      filesize: file.size,
      uploaded_by: user.uid,
      processing_status: "Processing",
    })
    .select()
    .single();

  if (dbError) {
    alert(dbError.message);
    setLoading(false);
    return;
  }

  // 3. Send PDF to FastAPI
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/summarize",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    console.log("Backend Response:", data);

    // Check HTTP error
    if (!response.ok) {
      throw new Error(data.error || "Backend Error");
    }

    const summaryText = data.summary || "";

    // Check for temporary Gemini errors
    const summaryFailed =
      summaryText.includes("503") ||
      summaryText.includes("UNAVAILABLE") ||
      summaryText.includes("high demand") ||
      summaryText.startsWith("ERROR:");

    // 4. Gemini summary failed, but document extraction succeeded
    if (summaryFailed) {
      console.warn(
        "Gemini Summary Failed:",
        summaryText
      );

      const { error: updateError } = await supabase
        .from("documents")
        .update({
          document_text: data.document || "",
          pages: data.pages || 0,
          words: data.words || 0,
          characters: data.characters || 0,
          processing_status: "Completed",
        })
        .eq("id", insertedDoc.id);

      if (updateError) {
        throw updateError;
      }

      setSummary(
        "AI summary is temporarily unavailable. Please try again later."
      );

      setDocumentText(data.document || "");

      localStorage.setItem(
        "documentText",
        data.document || ""
      );

      localStorage.setItem(
        "documentName",
        file.name
      );

      setStats({
        pages: data.pages || 0,
        words: data.words || 0,
        characters: data.characters || 0,
      });

      alert(
        "✅ PDF uploaded successfully, but AI summary is temporarily unavailable."
      );

      return;
    }

    // 5. Successful summary
    setSummary(summaryText);
    setDocumentText(data.document || "");

    localStorage.setItem(
      "documentText",
      data.document || ""
    );

    localStorage.setItem(
      "documentName",
      file.name
    );

    setStats({
      pages: data.pages || 0,
      words: data.words || 0,
      characters: data.characters || 0,
    });

    // 6. Save successful result to Supabase
    const { error: updateError } = await supabase
      .from("documents")
      .update({
        summary: summaryText,
        document_text: data.document || "",
        pages: data.pages || 0,
        words: data.words || 0,
        characters: data.characters || 0,
        processing_status: "Completed",
      })
      .eq("id", insertedDoc.id);

    console.log("Update Error:", updateError);

    if (updateError) {
      throw updateError;
    }

    alert("✅ PDF Uploaded Successfully!");

  } catch (err) {
    console.error("Summary Error:", err);

    const { error: failError } = await supabase
      .from("documents")
      .update({
        processing_status: "Failed",
      })
      .eq("id", insertedDoc.id);

    console.log(
      "Fail Update Error:",
      failError
    );

    alert(err.message);

  } finally {
    setLoading(false);
  }
};
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Upload Document
      </h2>

      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-10 mt-6 text-center bg-white dark:bg-gray-800 transition-colors duration-300">
        <UploadCloud
          size={60}
          className="mx-auto text-blue-500"
        />

        <p className="mt-4  text-gray-700 dark:text-gray-200">
          Upload your PDF document
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          hidden
          onChange={handleUpload}
        />

        <button
          onClick={() => fileInputRef.current.click()}
          className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          Browse Files
        </button>
      </div>

      {loading && (
        <div className="mt-6">
          <p className="text-blue-600 font-semibold">
            🤖 Generating AI Summary...
          </p>
        </div>
      )}

      {summary && (
        <div className="mt-6 bg-gray-50 p-4 rounded-xl rounded-xl transition-colors duration-300">
          <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
            📄 AI Summary
          </h3>

          <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
            {summary}
          </p>
        </div>
      )}

      {stats && (
        <div className="mt-6 bg-white rounded-xl shadow p-5 transition-colors duration-300">
          <h3 className="text-lg font-bold mb-4  text-gray-900 dark:text-white">
            📊 Document Statistics
          </h3>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.pages}
              </p>
              <p className="text-gray-700 dark:text-gray-200">
  Pages
</p>
            </div>

            <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.words}
              </p>
              <p className="text-gray-700 dark:text-gray-200">
  Words
</p>
            </div>

            <div className="bg-purple-50  dark:bg-purple-950 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.characters}
              </p>
              <p className="text-gray-700 dark:text-gray-200">
  Characters
</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <a
          href="/chat"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Open AI Chat →
        </a>
      </div>
    </div>
  );
}