import { useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  const titles = {
    "/dashboard": "Dashboard",
    "/upload": "Upload Document",
    "/documents": "My Documents",
    "/chat": "AI Chat",
  };

  return (
    <div className="bg-white shadow rounded-xl p-5 flex justify-between items-center mb-6">

      <div>
        <h1 className="text-2xl font-bold">
          {titles[location.pathname]}
        </h1>

        <p className="text-gray-500 text-sm">
          Intelligent Document Platform
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-2xl">
          🔔
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            J
          </div>

          <div>
            <p className="font-semibold">
              Jaiwanthini
            </p>

            <p className="text-sm text-gray-500">
              Student
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}