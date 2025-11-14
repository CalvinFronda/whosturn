import { useState, useEffect } from "react";
import { signUp, signIn } from "../services/auth";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  // Don't show login form if already logged in (will redirect)
  if (loading || user) {
    return (
      <div className="flex items-center justify-center pt-5">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!email || !password || (isSignUp && !name)) return;
    try {
      if (isSignUp) {
        await signUp(email, password, name);
        // Navigation will happen via useEffect when user state updates
      } else {
        await signIn(email, password);
        // Navigation will happen via useEffect when user state updates
      }
    } catch (error) {
      alert("Authentication failed");
    }
  };

  return (
    <div className="  flex items-center justify-center pt-5 ">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            {/* <Users className="w-8 h-8 text-indigo-600" /> */}
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Turn Tracker</h1>
          <p className="text-gray-600 mt-2">Manage turns with your roommates</p>
        </div>

        <div className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </div>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full mt-4 text-indigo-600 hover:text-indigo-700 text-sm"
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default Login;
