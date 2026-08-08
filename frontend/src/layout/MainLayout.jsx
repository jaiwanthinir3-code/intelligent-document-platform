/*import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MainLayout({ children }) {
  return (
    <div className="flex">

      <Sidebar />

      <main className="ml-64 w-full min-h-screen bg-gray-100 p-8">

        <Header />

        {children}

      </main>

    </div>
  );
}*/

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { MdLightMode } from "react-icons/md";

export default function MainLayout({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
      
      <Sidebar />

      <main className="ml-64 min-h-screen p-8 bg-gray-100 dark:bg-gray-950 transition-colors duration-300">

        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="
              px-4 py-2 rounded-lg shadow
              bg-white dark:bg-gray-800
              text-gray-800 dark:text-white
              transition-colors duration-300
            "
          >
            {darkMode ?  "🌙 Dark Mode" : "☀️ Light Mode" }
          </button>
        </div>

        {children}

      </main>
    </div>
  );
}