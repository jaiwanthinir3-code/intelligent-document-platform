import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const auth = getAuth();

  const name = localStorage.getItem("name") || "Guest";
  const email = localStorage.getItem("email") || "guest@example.com";

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠" },
    { name: "Upload", path: "/upload", icon: "📤" },
    { name: "Documents", path: "/documents", icon: "📁" },
    { name: "AI Chat", path: "/chat", icon: "💬" },
  ];

  async function handleLogout() {
    try {
      await signOut(auth);

      localStorage.clear();

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Logout failed.");
    }
  }

  return (
    <div className="w-64 h-screen bg-slate-900 text-white p-6 fixed flex flex-col">

      {/* Logo */}
      <div>
        <h1 className="text-2xl font-bold mb-10">
          📄 Intelligent Document Platform
        </h1>

        {/* Navigation */}
        <div className="space-y-3">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block p-3 rounded-lg transition ${
                location.pathname === item.path
                  ? "bg-blue-600"
                  : "hover:bg-slate-700"
              }`}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* User + Logout */}
      <div className="mt-auto border-t border-slate-700 pt-5">

        <div className="mb-5">
          <p className="font-semibold">
            👤 {name}
          </p>

          <p className="text-sm text-gray-400">
            {email}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 p-3 rounded-lg"
        >
          🚪 Logout
        </button>

      </div>

    </div>
  );
}