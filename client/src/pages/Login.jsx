import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { login } from "../api/auth";

const Login = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(username, password);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || t("auth.loginError"));
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = username.trim() !== "" && password.trim() !== "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
      <div className="bg-white/1 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <div className="mb-12 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {t("dashboard.title")}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              {t("auth.username")}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-base"
              placeholder={t("auth.username")}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              {t("auth.password")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-base pr-10"
                placeholder={t("auth.password")}
                required
              />

              {password && (
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="cursor-pointer absolute inset-y-0 right-3 flex items-center text-slate-300 hover:text-purple-300 transition"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full cursor-pointer
              bg-gradient-to-r from-purple-500 to-indigo-600 
              text-white py-2.5 md:py-3 rounded-lg font-semibold 
              transition duration-200 shadow-lg transform 
              hover:-translate-y-0.5 hover:from-purple-400 hover:to-indigo-500 hover:shadow-xl 
              active:from-purple-700 active:to-indigo-800 
              disabled:opacity-50 disabled:cursor-not-allowed 
              disabled:hover:from-purple-500 disabled:hover:to-indigo-600 
              disabled:hover:translate-y-0 disabled:hover:shadow-lg 
              touch-manipulation`}
          >
            {loading ? t("common.loading") : t("auth.login")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
