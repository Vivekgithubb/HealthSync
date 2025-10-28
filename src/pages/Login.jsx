import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/UseAuth";
import { Activity } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Logging");
    setError("");
    setLoading(true);
    try {
      const result = await login(email, password, captchaToken);
      console.log("Logging done");
      if (result.success) {
        navigate("/");
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Activity className="w-12 h-12 text-amber-500" />
            <h1 className="text-4xl font-bold text-blue-900">HealthSync</h1>
          </div>
          <p className="text-gray-500">Manage your health, all in one place</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-300">
          <h2 className="text-2xl font-semibold text-blue-900 mb-6">Login</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-300 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="••••••••"
              />
            </div>

            {siteKey ? (
              <div className="flex justify-center">
                <ReCAPTCHA sitekey={siteKey} onChange={setCaptchaToken} />
              </div>
            ) : (
              <div className="p-3 bg-yellow-50 border border-yellow-300 rounded text-yellow-800 text-sm">
                reCAPTCHA not configured. Set VITE_RECAPTCHA_SITE_KEY in your
                .env and restart the dev server.
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !siteKey || !captchaToken}
              className="w-full bg-amber-500 text-white py-3 rounded-md font-semibold hover:bg-amber-500/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-500 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-amber-500 hover:underline font-medium"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
