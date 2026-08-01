import { UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import ChatBox from "./ChatBox";

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

    setLoading(true);

    const fileName = `${Date.now()}-${file.name}`;

    // Upload PDF
    const { error: uploadError } = await supabase.storage
      .from("document")
      .upload(fileName, file);

    if (uploadError) {
      alert(uploadError.message);
      setLoading(false);
      return;
    }

    // Save metadata
    const { error: dbError } = await supabase
      .from("documents")
      .insert({
        filename: file.name,
        filepath: fileName,
        filesize: file.size,
        uploaded_by: "demo-user",
      });

    if (dbError) {
      alert(dbError.message);
      setLoading(false);
      return;
    }

    // Send PDF to FastAPI
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/summarize", {
       method: "POST",
       body: formData,
      });

     const data = await response.json();

     console.log("Backend Response:", data);

     if (!response.ok || data.error) {
      throw new Error(data.error || "Backend Error");
     }

     setSummary(data.summary || "");
     setDocumentText(data.document || "");

     setStats({
      pages: data.pages || 0,
      words: data.words || 0,
      characters: data.characters || 0,
     });
      

      

    

    alert("✅ PDF Uploaded Successfully!");
    } catch (err) {
       console.error("Summary Error:", err);
       alert(err.message);
      }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-semibold">
        Upload Document
      </h2>

      <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 mt-6 text-center">

        <UploadCloud
          size={60}
          className="mx-auto text-blue-500"
        />

        <p className="mt-4">
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
        <div className="mt-6 bg-gray-50 p-4 rounded-xl">
          <h3 className="text-lg font-bold mb-2">
            📄 AI Summary
          </h3>

          <p className="whitespace-pre-wrap">
            {summary}
          </p>
        </div>
      )}

      {stats && (
        <div className="mt-6 bg-white rounded-xl shadow p-5">

          <h3 className="text-lg font-bold mb-4">
            📊 Document Statistics
          </h3>

          <div className="grid grid-cols-3 gap-4">

            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold">
                {stats.pages}
              </p>
              <p>Pages</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold">
                {stats.words}
              </p>
              <p>Words</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold">
                {stats.characters}
              </p>
              <p>Characters</p>
            </div>

          </div>

        </div>
      )}

      {documentText && (
        <ChatBox document={documentText} />
      )}

    </div>
  );
}