import { useState } from "react";

function ChatBox({ document }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) {
      alert("Please enter a question");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          document: document,
          question: question,
        }),
      });

      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      console.error(error);
      alert("Error talking to AI");
    }

    setLoading(false);
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        🤖 Chat with your PDF
      </h2>

      <textarea
        className="w-full border rounded-lg p-3"
        rows="3"
        placeholder="Ask anything about this document..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        onClick={askAI}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {answer && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold mb-2">AI Answer</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default ChatBox;