import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Login() {
  const navigate = useNavigate();

  async function handleGoogleLogin() {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user details for Sidebar
      localStorage.setItem("name", user.displayName || "User");
      localStorage.setItem("email", user.email || "");

      // Save user profile in Supabase
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.uid,
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
        });

      if (error) {
        console.error("Supabase profile error:", error);
      }

      // Go to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error("Login Error:", error);
      alert(error.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-96 text-center">

        <h1 className="text-3xl font-bold mb-3">
          📄 Intelligent Document Platform
        </h1>

        <p className="text-gray-500 mb-8">
          Upload, summarize and chat with your documents using AI.
        </p>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
        >
          Continue with Google
        </button>

      </div>

    </div>
  );
}