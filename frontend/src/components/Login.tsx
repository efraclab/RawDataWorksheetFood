import { useState } from "react";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  LogIn,
  FileSpreadsheet,
  Beaker,
  FileEdit,
  BarChart3,
  FileText,
  Shield,
  Wifi,
} from "lucide-react";
import { login } from "../services/api";

interface LoginProps { onLoginSuccess: () => void; }
interface LoginFormData { employeeId: string; password: string; }
interface ValidationErrors { employeeId?: string; password?: string; }

const decodeAndStoreUserData = (token: string): boolean => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return false;
    const decoded = JSON.parse(atob(base64Url.replace(/-/g, "+").replace(/_/g, "/")));
    if (decoded) {
      localStorage.setItem("EmployeeId",  decoded.EmployeeId  || "");
      localStorage.setItem("Username",    decoded.Username    || "");
      localStorage.setItem("Department",  decoded.Department  || "");
      localStorage.setItem("Role",        decoded.Role        || "");
      return true;
    }
    return false;
  } catch { return false; }
};

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [formData, setFormData]         = useState<LoginFormData>({ employeeId: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [apiError, setApiError]         = useState<string | null>(null);
  const [success, setSuccess]           = useState(false);
  const [errors, setErrors]             = useState<ValidationErrors>({});
  const [focused, setFocused]           = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name as keyof ValidationErrors]) setErrors(p => ({ ...p, [name]: "" }));
    if (apiError) setApiError(null);
  };

  const validate = (): boolean => {
    const e: ValidationErrors = {};
    if (!formData.employeeId.trim()) e.employeeId = "Employee ID is required";
    if (!formData.password.trim())   e.password   = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.MouseEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setIsLoading(true); setApiError(null);
    try {
      const res: any = await login({ employeeId: formData.employeeId.trim(), password: formData.password.trim() });
      if (res?.token) {
        localStorage.setItem("authToken", res.token);
        if (decodeAndStoreUserData(res.token)) { setSuccess(true); setTimeout(onLoginSuccess, 900); }
        else throw new Error("Token decoding failed.");
      } else throw new Error(res?.message || "Invalid credentials.");
    } catch (err: any) {
      let msg = err.message || "Login failed.";
      if (msg.includes("401") || msg.includes("Unauthorized") || msg.includes("invalid"))
        msg = "Invalid Employee ID or Password.";
      setApiError(msg);
    } finally { setIsLoading(false); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading && !success)
      (document.getElementById("submit-btn") as HTMLButtonElement)?.click();
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden">
      <style>{`
        /* ── Keyframes ─────────────────────────────────────── */
        @keyframes gradientFlow {
          0%  { background-position:0%   50%; }
          50% { background-position:100% 50%; }
          100%{ background-position:0%   50%; }
        }
        @keyframes morphBlob {
          0%,100%{ border-radius:60% 40% 30% 70%/60% 30% 70% 40%; }
          50%    { border-radius:30% 60% 70% 40%/50% 60% 30% 60%; }
        }
        @keyframes floatSlow {
          0%,100%{ transform:translateY(0)    rotate(0deg); }
          33%    { transform:translateY(-13px) rotate(2deg); }
          66%    { transform:translateY(5px)   rotate(-1deg); }
        }
        @keyframes orbit {
          from{ transform:rotate(0deg); }
          to  { transform:rotate(360deg); }
        }
        @keyframes orbitRev {
          from{ transform:rotate(0deg); }
          to  { transform:rotate(-360deg); }
        }
        @keyframes fadeInUp {
          from{ opacity:0; transform:translateY(20px); }
          to  { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeInLeft {
          from{ opacity:0; transform:translateX(-18px); }
          to  { opacity:1; transform:translateX(0); }
        }
        @keyframes fadeInRight {
          from{ opacity:0; transform:translateX(20px); }
          to  { opacity:1; transform:translateX(0); }
        }
        @keyframes popIn {
          0%  { opacity:0; transform:scale(0.55) rotate(-10deg); }
          65% { transform:scale(1.1) rotate(3deg); }
          100%{ opacity:1; transform:scale(1) rotate(0deg); }
        }
        @keyframes shimmerText {
          0%  { background-position:-200% center; }
          100%{ background-position: 200% center; }
        }
        @keyframes pulseDot {
          0%,100%{ opacity:1;    transform:scale(1);   }
          50%    { opacity:0.45; transform:scale(1.4); }
        }
        @keyframes successPop {
          0%  { opacity:0; transform:scale(0.75); }
          60% { transform:scale(1.08); }
          100%{ opacity:1; transform:scale(1); }
        }
        @keyframes errorShake {
          0%,100%{ transform:translateX(0); }
          20%    { transform:translateX(-7px); }
          40%    { transform:translateX(7px); }
          60%    { transform:translateX(-4px); }
          80%    { transform:translateX(4px); }
        }
        @keyframes shimmerBtn {
          0%  { transform:translateX(-130%); }
          100%{ transform:translateX(130%); }
        }
        @keyframes countUp {
          from{ opacity:0; transform:translateY(8px) scale(0.85); }
          to  { opacity:1; transform:translateY(0)   scale(1); }
        }
        @keyframes lineGrow {
          from{ transform:scaleX(0); opacity:0; }
          to  { transform:scaleX(1); opacity:1; }
        }

        /* ── Utility ───────────────────────────────────────── */
        .nav-gradient {
          background: linear-gradient(-45deg,#064e3b,#065f46,#047857,#0f766e,#1e3a5f);
          background-size:300% 300%;
          animation:gradientFlow 14s ease infinite;
        }
        .dot-grid {
          background-image:radial-gradient(rgba(255,255,255,0.65) 1px,transparent 1px);
          background-size:20px 20px;
        }
        .morph-blob  { animation:morphBlob  9s ease-in-out infinite,       floatSlow  8s ease-in-out infinite; }
        .morph-blob2 { animation:morphBlob 11s ease-in-out infinite reverse,floatSlow 10s ease-in-out infinite reverse; }
        .morph-blob3 { animation:morphBlob 13s ease-in-out infinite 2s,    floatSlow 12s ease-in-out infinite; }

        .orbit-r1 { animation:orbit    9s linear infinite; }
        .orbit-r2 { animation:orbitRev 14s linear infinite; }

        .shimmer-name {
          background:linear-gradient(90deg,#6ee7b7,#a7f3d0,#34d399,#6ee7b7);
          background-size:200% auto;
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent;
          animation:shimmerText 4s linear infinite;
        }
        .dot-live { animation:pulseDot 2.2s ease-in-out infinite; }

        .anim-up    { animation:fadeInUp    0.55s cubic-bezier(0.16,1,0.3,1) both; }
        .anim-left  { animation:fadeInLeft  0.55s cubic-bezier(0.16,1,0.3,1) both; }
        .anim-right { animation:fadeInRight 0.55s cubic-bezier(0.16,1,0.3,1) both; }
        .anim-pop   { animation:popIn       0.55s cubic-bezier(0.16,1,0.3,1) both; }
        .anim-count { animation:countUp     0.6s  cubic-bezier(0.16,1,0.3,1) both; }
        .anim-error { animation:errorShake  0.45s ease both; }
        .anim-ok    { animation:successPop  0.5s  cubic-bezier(0.16,1,0.3,1) both; }

        /* Feature card */
        .feat-card {
          transition:transform 0.28s cubic-bezier(0.34,1.56,0.64,1),
                     background 0.2s ease, border-color 0.2s ease;
          position:relative; overflow:hidden;
        }
        .feat-card:hover { transform:translateX(5px); background:rgba(255,255,255,0.11) !important; }

        /* Input — rounded bordered */
        .input-line {
          background:#f8fafc;
          border:1.5px solid #e2e8f0;
          border-radius:14px;
          width:100%;
          padding:11px 40px 11px 40px;
          font-size:13.5px; color:#475569; font-weight:400;
          transition:border-color 0.22s ease, box-shadow 0.22s ease, background 0.2s ease;
        }
        .input-line:focus {
          outline:none;
          background:#ffffff;
          border-color:#10b981;
          box-shadow:0 0 0 3px rgba(16,185,129,0.12);
        }
        .input-line.err   { border-color:#fca5a5; background:#fff8f8; }
        .input-line.err:focus { border-color:#f87171; box-shadow:0 0 0 3px rgba(248,113,113,0.12); }
        .input-line::placeholder { color:#94a3b8; font-size:13px; }

        /* Focus ring glow (replaces underline) */
        .focus-line { display:none; }

        /* Submit button */
        .btn-submit {
          background:linear-gradient(-45deg,#059669,#0d9488,#047857,#065f46);
          background-size:260% 260%;
          animation:gradientFlow 5s ease infinite;
          transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease, opacity 0.2s;
          position:relative; overflow:hidden;
        }
        .btn-submit:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 18px 40px -6px rgba(5,150,105,0.5); }
        .btn-submit:active:not(:disabled){ transform:translateY(0); }
        .btn-submit::after {
          content:''; position:absolute; top:0; left:0; width:45%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.13),transparent);
          transform:translateX(-130%);
        }
        .btn-submit:hover:not(:disabled)::after { transform:translateX(300%); transition:transform 0.7s ease; }
      `}</style>

      {/* ════════════════════════════════════════════
           LEFT — brand panel
          ════════════════════════════════════════════ */}
      <div className="lg:w-[52%] relative nav-gradient flex flex-col overflow-hidden min-h-[260px] lg:min-h-screen">

        {/* Dot-grid texture */}
        <div className="absolute inset-0 dot-grid opacity-[0.037] pointer-events-none" />

        {/* Top shine */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-300/30 to-transparent" />

        {/* Morphing blobs */}
        <div className="absolute -top-28 -left-28 w-96 h-96 bg-emerald-400/9  blur-3xl pointer-events-none morph-blob"  />
        <div className="absolute top-1/2  -right-24 w-80 h-80 bg-teal-300/7   blur-3xl pointer-events-none morph-blob2" />
        <div className="absolute -bottom-20 left-1/3  w-72 h-72 bg-cyan-400/6  blur-3xl pointer-events-none morph-blob3" />

        {/* Small floating spheres */}
        <div className="absolute top-[16%] right-[14%] w-3   h-3   rounded-full bg-emerald-300/25 blur-sm" style={{ animation:"floatSlow 5s ease-in-out infinite" }} />
        <div className="absolute top-[63%] left-[9%]  w-2   h-2   rounded-full bg-teal-200/20   blur-sm" style={{ animation:"floatSlow 7s ease-in-out infinite reverse" }} />
        <div className="absolute bottom-[18%] right-[24%] w-4 h-4 rounded-full bg-emerald-200/18 blur-sm" style={{ animation:"floatSlow 9s ease-in-out infinite 1s" }} />

        <div className="relative z-10 flex flex-col justify-between h-full px-10 py-12 max-w-[520px] mx-auto w-full">
          <div>

            {/* ── Logo ── */}
            <div className="flex items-center gap-4 mb-7 anim-left" style={{ animationDelay:"0.05s" }}>
              <div className="relative anim-pop" style={{ animationDelay:"0.1s" }}>
                {/* Outer dashed orbit ring */}
                <div className="absolute inset-[-18px] rounded-full border border-dashed border-white/14 orbit-r2" />
                {/* Inner orbit ring with glowing dot */}
                <div className="absolute inset-[-9px] rounded-full border border-white/20 orbit-r1">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.95)]" />
                </div>
                {/* Glow halo */}
                <div className="absolute inset-0 bg-white/15 rounded-2xl blur-xl" />
                {/* Icon box */}
                <div className="relative w-[60px] h-[60px] bg-white/14 border border-white/24 rounded-2xl flex items-center justify-center shadow-xl backdrop-blur-sm">
                  <FileSpreadsheet className="w-7 h-7 text-white" />
                </div>
                {/* Live dot */}
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-emerald-900 dot-live" />
              </div>

              <div>
                <p className="text-[9px] font-normal uppercase tracking-[0.35em] text-emerald-400/60 mb-1.5">
                  Laboratory System · EFRAC
                </p>
                <h1 className="text-xl font-light text-white/88 leading-snug tracking-wide">
                  Rawdata{" "}
                  <span className="shimmer-name font-semibold">Worksheet</span>
                </h1>
                <p className="text-[10.5px] text-emerald-200/45 font-light tracking-widest mt-0.5">
                  Management System
                </p>
              </div>
            </div>

            {/* ── Divider ── */}
            <div className="flex items-center gap-3 mb-5 anim-left" style={{ animationDelay:"0.13s" }}>
              <div className="h-px flex-1 bg-gradient-to-r from-emerald-400/30 to-transparent" />
              <Shield className="w-3.5 h-3.5 text-emerald-400/45" />
              <div className="h-px flex-1 bg-gradient-to-l from-emerald-400/30 to-transparent" />
            </div>

            <p className="text-[12.5px] text-emerald-100/45 font-light leading-relaxed mb-8 anim-left" style={{ animationDelay:"0.16s" }}>
              Streamline your laboratory data management with precision and full audit traceability.
            </p>

            {/* ── Mini stats strip ── */}
            <div className="hidden lg:grid grid-cols-3 gap-2.5 mb-7 anim-up" style={{ animationDelay:"0.2s" }}>
              {[
                { val: "240+", label: "Parameters" },
                { val: "12",   label: "Active Labs" },
                { val: "100%", label: "Audit Ready" },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className="bg-white/7 border border-white/10 rounded-xl px-3 py-3 text-center anim-count"
                  style={{ animationDelay: `${0.24 + i * 0.06}s` }}
                >
                  <p className="text-[17px] font-semibold text-white/80 leading-none">{s.val}</p>
                  <p className="text-[9.5px] text-emerald-200/40 font-light tracking-wide mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* ── Feature cards ── */}
            <div className="hidden lg:flex flex-col gap-2.5">
              {[
                { icon: Beaker,    title: "Raw Data Management",   desc: "Track and organise laboratory raw data",          accent: "from-emerald-400 to-teal-400",  delay: "0.26s" },
                { icon: FileEdit,  title: "Preparation Templates", desc: "Build and reuse worksheet prep templates",        accent: "from-teal-400 to-cyan-400",     delay: "0.33s" },
                { icon: BarChart3, title: "Data Analysis",         desc: "Comprehensive analysis and validation tools",     accent: "from-cyan-400 to-blue-400",     delay: "0.40s" },
                { icon: FileText,  title: "Report Generation",     desc: "Generate detailed reports and documentation",    accent: "from-blue-400 to-indigo-400",   delay: "0.47s" },
              ].map((f) => (
                <div
                  key={f.title}
                  className="feat-card anim-left flex items-center gap-3.5 px-4 py-3 rounded-xl bg-white/7 border border-white/10 cursor-default"
                  style={{ animationDelay: f.delay }}
                >
                  {/* Left colour accent bar */}
                  <div className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-gradient-to-b ${f.accent} opacity-60`} />

                  <div className="w-9 h-9 bg-white/10 border border-white/14 rounded-xl flex items-center justify-center flex-shrink-0 ml-1">
                    <f.icon className="w-4 h-4 text-emerald-200/75" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-white/72 leading-none mb-0.5">{f.title}</p>
                    <p className="text-[10px] text-emerald-100/38 font-light leading-snug">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div className="hidden lg:flex items-center justify-between pt-6 border-t border-white/10 mt-8">
            <p className="text-[9.5px] text-emerald-300/38 font-light tracking-wide">
              © 2025 EFRAC. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <Wifi className="w-3 h-3 text-emerald-400/50" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 dot-live" />
              <span className="text-[9.5px] text-emerald-400/55 font-light">System Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
           RIGHT — login form
          ════════════════════════════════════════════ */}
      <div className="lg:w-[48%] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 relative overflow-hidden px-6 py-12 lg:py-0">

        {/* Corner glows */}
        <div className="absolute -top-24  -right-24 w-72 h-72 rounded-full bg-emerald-100/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-teal-100/20  blur-3xl pointer-events-none" />

        {/* Subtle dot texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.022]"
          style={{ backgroundImage:"radial-gradient(rgba(5,150,105,0.8) 1px,transparent 1px)", backgroundSize:"24px 24px" }} />

        <div
          className="relative z-10 w-full max-w-[400px] anim-right"
          style={{ animationDelay:"0.12s" }}
          onKeyDown={handleKeyDown}
        >
          {/* Form header */}
          <div className="mb-9">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="w-px h-4 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
              <span className="text-[9.5px] font-medium uppercase tracking-[0.3em] text-emerald-500/70">
                Secure Access
              </span>
            </div>
            <h2 className="text-[27px] font-light text-slate-700 tracking-wide mb-1">
              Welcome <span className="font-semibold text-slate-800">back</span>
            </h2>
            <p className="text-[12.5px] text-slate-400 font-light leading-relaxed">
              Sign in to access the Rawdata Worksheet Management System
            </p>
          </div>

          {/* Fields */}
          <div className="space-y-7">

            {/* Employee ID */}
            <div className="anim-up" style={{ animationDelay:"0.22s" }}>
              <label className={`block text-[10px] font-medium uppercase tracking-[0.22em] mb-3 transition-colors duration-200 ${
                errors.employeeId ? "text-red-400" : focused === "employeeId" ? "text-emerald-500" : "text-slate-400"
              }`}>
                Employee ID
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200 ${
                  errors.employeeId ? "text-red-400" : focused === "employeeId" ? "text-emerald-500" : "text-slate-350"
                }`}>
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  onFocus={() => setFocused("employeeId")}
                  onBlur={() => setFocused(null)}
                  placeholder="Your employee ID"
                  className={`input-line ${errors.employeeId ? "err" : ""}`}
                />
                {focused === "employeeId" && !errors.employeeId && (
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 dot-live block" />
                  </div>
                )}
              </div>
              {errors.employeeId && (
                <p className="mt-1.5 text-[11px] text-red-400 font-normal flex items-center gap-1.5 anim-up">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" /> {errors.employeeId}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="anim-up" style={{ animationDelay:"0.29s" }}>
              <label className={`block text-[10px] font-medium uppercase tracking-[0.22em] mb-3 transition-colors duration-200 ${
                errors.password ? "text-red-400" : focused === "password" ? "text-emerald-500" : "text-slate-400"
              }`}>
                Password
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200 ${
                  errors.password ? "text-red-400" : focused === "password" ? "text-emerald-500" : "text-slate-350"
                }`}>
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  placeholder="Your password"
                  className={`input-line ${errors.password ? "err" : ""}`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-350 hover:text-slate-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-[11px] text-red-400 font-normal flex items-center gap-1.5 anim-up">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" /> {errors.password}
                </p>
              )}
            </div>

            {/* API error */}
            {apiError && (
              <div className="flex items-start gap-3 px-4 py-3.5 bg-red-50/80 rounded-2xl border border-red-200/60 anim-error">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-[12.5px] text-red-500 font-normal leading-relaxed">{apiError}</p>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-center gap-3 px-4 py-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200/60 anim-ok">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <p className="text-[12.5px] text-emerald-600 font-normal">Login successful! Redirecting…</p>
              </div>
            )}

            {/* Submit */}
            <div className="pt-2 anim-up" style={{ animationDelay:"0.36s" }}>
              <button
                id="submit-btn"
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || success}
                className="btn-submit w-full py-3.5 rounded-2xl text-white text-[13.5px] font-medium tracking-wide shadow-lg disabled:opacity-55 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /><span>Signing in…</span></>
                ) : success ? (
                  <><CheckCircle2 className="w-4 h-4" /><span>Success!</span></>
                ) : (
                  <><LogIn className="w-4 h-4" /><span>Sign In</span></>
                )}
              </button>
            </div>

            {/* Support */}
            <p className="text-center text-[11.5px] text-slate-400 font-light anim-up" style={{ animationDelay:"0.42s" }}>
              Having trouble signing in?{" "}
              <button
                type="button"
                className="text-emerald-600 hover:text-emerald-500 font-medium transition-colors underline underline-offset-2 decoration-emerald-300/60"
              >
                Contact Support
              </button>
            </p>
          </div>
        </div>

        {/* Mobile copyright */}
        <div className="lg:hidden absolute bottom-5 left-0 right-0 text-center">
          <p className="text-[10px] text-slate-400 font-light">© 2025 EFRAC. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
