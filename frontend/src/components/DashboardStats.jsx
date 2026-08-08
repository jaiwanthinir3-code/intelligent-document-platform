import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getAuth } from "firebase/auth";
export default function DashboardStats() {
  const [stats, setStats] = useState({
    documents: 0,
    pages: 0,
    words: 0,
    characters: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const auth = getAuth();
const user = auth.currentUser;

if (!user) {
  return;
}
    const { data, error } = await supabase
      .from("documents")
      .select("pages, words, characters")
      .eq("uploaded_by",user.uid);
    if (error) {
      console.error(error);
      return;
    }

    const documents = data.length;

    const pages = data.reduce(
      (sum, doc) => sum + (Number(doc.pages) || 0),
      0
    );

    const words = data.reduce(
      (sum, doc) => sum + (Number(doc.words) || 0),
      0
    );

    const characters = data.reduce(
      (sum, doc) => sum + (Number(doc.characters) || 0),
      0
    );

    setStats({
      documents,
      pages,
      words,
      characters,
    });
  }

  const cards = [
    { title: "Documents", value: stats.documents, icon: "📄" },
    { title: "Pages", value: stats.pages, icon: "📑" },
    { title: "Words", value: stats.words, icon: "📝" },
    { title: "Characters", value: stats.characters, icon: "🔤" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white  dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-300"
        >
          <div className="text-3xl">{card.icon}</div>

          <h3 className="mt-3 text-gray-500 dark:text-gray-300">
            {card.title}
          </h3>

          <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}