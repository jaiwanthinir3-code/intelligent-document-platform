import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../lib/firebase";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      // Google Sign-In
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user in Supabase
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.uid,
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
        });

      if (error) throw error;

      alert(`Welcome ${user.displayName}`);

      // Go to Dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">

        <h1 className="text-3xl font-bold text-center text-blue-600">
          Intelligent Document Platform
        </h1>

        <p className="text-center text-gray-600 mt-3">
          AI-powered document understanding
        </p>

        <button
          onClick={handleGoogleLogin}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
        >
          Login with Google
        </button>

      </div>
    </div>
  );
}

export default Login;