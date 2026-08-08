import { useEffect, useRef, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { supabase } from "../lib/supabase";
import { getAuth } from "firebase/auth";

export default function Chat() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Fetch documents when page loads
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // Fetch only current user's documents
  async function fetchDocuments() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("No logged-in user.");
      setDocuments([]);
      return;
    }

    const { data, error } = await supabase
      .from("documents")
      .select("id, filename")
      .eq("uploaded_by", user.uid)
      .order("uploaded_at", { ascending: false });

    if (error) {
      console.error("Error fetching documents:", error);
      return;
    }

    setDocuments(data || []);
  }

  // Load chat history for selected document and current user
 async function loadChatHistory(documentId) {
  if (!documentId) {
    setMessages([]);
    return;
  }

  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.error("No Firebase user logged in.");
    setMessages([]);
    return;
  }

  console.log("Loading chat history...");
  console.log("Firebase UID:", user.uid);
  console.log("Document ID:", documentId);

  const { data, error } = await supabase
    .from("chat_history")
    .select(
      "id, document_id, user_id, question, answer, created_at"
    )
    .eq("document_id", Number(documentId))
    .eq("user_id", user.uid)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    console.error(
      "History loading error:",
      error
    );
    return;
  }

  console.log(
    "Current user's chat history:",
    data
  );

  const history = [];

  (data || []).forEach((chat) => {
    history.push({
      type: "user",
      text: chat.question,
    });

    history.push({
      type: "ai",
      text: chat.answer,
    });
  });

  setMessages(history);
}

  // Clear current user's chat history
  async function handleClearChat() {
    if (!selectedDocument) {
      alert("Please select a document first.");
      return;
    }

    const confirmClear = window.confirm(
      "Are you sure you want to clear this chat?"
    );

    if (!confirmClear) {
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first.");
      return;
    }

    const { error } = await supabase
      .from("chat_history")
      .delete()
      .eq("document_id", Number(selectedDocument))
      .eq("user_id", user.uid);

    if (error) {
      console.error("Clear chat error:", error);
      alert("Could not clear chat.");
      return;
    }

    setMessages([]);

    alert("✅ Chat cleared successfully.");
  }

  // Send question
  async function handleSend(e) {
    e.preventDefault();

    if (!selectedDocument) {
      alert("Please select a document first.");
      return;
    }

    if (!message.trim()) {
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first.");
      return;
    }
    const token = await user.getIdToken();
    const question = message.trim();

    // Show user's question immediately
    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: question,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      // 1. Get selected document text
      const {
        data: documentData,
        error: documentError,
      } = await supabase
        .from("documents")
        .select("document_text")
        .eq("id", Number(selectedDocument))
        .eq("uploaded_by", user.uid)
        .single();

      if (documentError) {
        throw new Error(
          "Could not load the selected document."
        );
      }

      // 2. Send question to FastAPI
      const response = await fetch(
        "http://127.0.0.1:8000/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
             Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            document: documentData.document_text,
            question: question,

            history: messages
              .map(
                (msg) =>
                  `${msg.type === "user" ? "User" : "AI"}: ${
                    msg.text
                  }`
              )
              .join("\n"),
          }),
        }
      );

      const data = await response.json();

      console.log("Chat Response:", data);

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.error ||
            "Backend error"
        );
      }

      // 3. Show AI response
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: data.answer,
        },
      ]);

      // 4. Save conversation to Supabase
      const { error: chatError } = await supabase
        .from("chat_history")
        .insert({
          document_id: Number(selectedDocument),
          user_id: user.uid,
          question: question,
          answer: data.answer,
        });

      if (chatError) {
        console.error(
          "Chat history save error:",
          chatError
        );
      } else {
        console.log("✅ Chat history saved");
      }
    } catch (error) {
      console.error("Chat Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text:
            "Sorry, something went wrong while getting the answer.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const selectedDoc = documents.find(
    (doc) =>
      doc.id.toString() ===
      selectedDocument.toString()
  );

  return (
    <MainLayout>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-300">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          💬 AI Document Chat
        </h1>

        <p className="text-gray-600 dark:text-gray mt-2">
          Ask questions about your uploaded documents
          using AI.
        </p>
      </div>

      {/* Chat Area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6  transition-colors duration-300">

        {/* Document Selector */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6 bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
          <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
            Select Document
          </p>

          <select
            value={selectedDocument}
            onChange={(e) => {
              const documentId = e.target.value;

              setSelectedDocument(documentId);
              loadChatHistory(documentId);
            }}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">
              -- Select a document --
            </option>

            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.filename}
              </option>
            ))}
          </select>

          {selectedDoc && (
            <p className="font-semibold mt-3 text-gray-900 dark:text-white">
              📄 {selectedDoc.filename}
            </p>
          )}
        </div>

        {/* Clear Chat Button */}
        {selectedDocument && (
          <div className="flex justify-end mb-4">
            <button
              onClick={handleClearChat}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold"
            >
              🗑️ Clear Chat
            </button>
          </div>
        )}

        {/* Chat Messages */}
        <div className="min-h-[350px] max-h-[500px] overflow-y-auto border rounded-lg p-4 mb-6 bg-white dark:bg-gray-900 transition-colors duration-300">

          {messages.length === 0 && !loading ? (
            <div className="flex justify-center items-center h-[300px] text-gray-400 dark:text-gray-500">
              Ask a question about your document...
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex mb-4 ${
                    msg.type === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg p-4 ${
                      msg.type === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                    }`}
                  >
                    <p className="font-semibold mb-1">
                      {msg.type === "user"
                        ? "You"
                        : "🤖 AI"}
                    </p>

                    <p className="whitespace-pre-wrap">
                      {msg.text}
                    </p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg p-4">
                    🤖 AI is thinking...
                  </div>
                </div>
              )}
            </>
          )}

          {/* Auto-scroll target */}
          <div ref={chatEndRef} />
        </div>

        {/* Question Input */}
        <form
          onSubmit={handleSend}
          className="flex gap-3"
        >
          <input
            type="text"
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            placeholder={
              selectedDocument
                ? "Ask something about your document..."
                : "Select a document first..."
            }
            disabled={
              !selectedDocument || loading
            }
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-700"
          />

          <button
            type="submit"
            disabled={
              !selectedDocument || loading
            }
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold"
          >
            {loading
              ? "Thinking..."
              : "Send 🚀"}
          </button>
        </form>
      </div>
    </MainLayout>
  );
}