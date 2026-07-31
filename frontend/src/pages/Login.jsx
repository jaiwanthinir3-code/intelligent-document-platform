function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-3xl font-bold text-center text-blue-600">
          Intelligent Document Platform
        </h1>

        <p className="text-center text-gray-500 mt-2">
          AI-powered document understanding
        </p>

        <button
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
}

export default Login;