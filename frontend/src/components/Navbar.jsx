import { LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">

      <h1 className="text-2xl font-bold text-blue-600">
        📄 Intelligent Document Platform
      </h1>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
      >
        <LogOut size={18} />
        Logout
      </button>

    </nav>
  );
}