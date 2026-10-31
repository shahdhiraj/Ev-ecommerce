import { useState, useEffect } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Zap,
} from "lucide-react"
import { useLocation, useNavigate } from "react-router"
import { AppLink, Button, Input } from "../components/ui"
import { useCommerce } from "../lib/commerceContext"

type AuthMode = "login" | "register" | "forgot" | "reset"

export function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login, registerUser, notify } = useCommerce()

  const getModeFromPath = (): AuthMode => {
    if (location.pathname.includes("register") || location.pathname.includes("signup")) {
      return "register"
    }
    if (location.pathname.includes("forgot")) return "forgot"
    if (location.pathname.includes("reset")) return "reset"
    return "login"
  }

  const [mode, setMode] = useState<AuthMode>(getModeFromPath())
  const [roleTab, setRoleTab] = useState<"customer" | "owner">("customer")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(true)

  // Form states
  const [email, setEmail] = useState("aayush.shrestha@abcevpart.np")
  const [password, setPassword] = useState("AbcEV#2026")
  const [fullName, setFullName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("+977 9841234567")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(true)

  // Status
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; isError?: boolean } | null>(null)
  const [forgotSent, setForgotSent] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)

  useEffect(() => {
    setMode(getModeFromPath())
  }, [location.pathname])

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "", color: "" }
    if (pwd.length < 6) return { score: 1, label: "Too weak", color: "text-rose-600" }
    let score = 1
    if (pwd.length >= 8) score++
    if (/[A-Z]/.test(pwd) || /[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score++
    if (score === 2) return { score: 2, label: "Medium", color: "text-amber-600" }
    return { score: 3, label: "Strong", color: "text-emerald-600" }
  }

  const pwdStrength = getPasswordStrength(password)

  const handleTabSwitch = (newMode: "login" | "register") => {
    setMode(newMode)
    setMessage(null)
    navigate(newMode === "register" ? "/signup" : "/login", { replace: true })
  }

  const handleRoleSelect = (role: "customer" | "owner") => {
    setRoleTab(role)
    setMessage(null)
    if (mode === "login") {
      if (role === "owner") {
        setEmail("admin@abcevpart.com.np")
        setPassword("AbcEV#2026")
      } else {
        setEmail("aayush.shrestha@abcevpart.np")
        setPassword("AbcEV#2026")
      }
    }
  }

  const handleInstantRoleLogin = async (role: "customer" | "owner") => {
    setLoading(true)
    setRoleTab(role)
    const targetEmail = role === "owner" ? "admin@abcevpart.com.np" : "aayush.shrestha@abcevpart.np"
    const targetPwd = "AbcEV#2026"
    setEmail(targetEmail)
    setPassword(targetPwd)
    const res = await login(targetEmail, targetPwd, role)
    setLoading(false)
    if (res.role === "owner") {
      navigate("/owner")
    } else {
      navigate("/account")
    }
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    setTimeout(async () => {
      const res = await login(email, password, roleTab)
      setLoading(false)
      if (res.role === "owner") {
        navigate("/owner")
      } else {
        navigate("/account")
      }
    }, 400)
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      setMessage({ text: "Password must be at least 6 characters.", isError: true })
      return
    }
    if (password !== confirmPassword) {
      setMessage({ text: "Passwords do not match.", isError: true })
      return
    }

    setLoading(true)
    setMessage(null)

    setTimeout(async () => {
      const registeredName =
        fullName.trim() || (roleTab === "owner" ? "Store Owner" : "Aayush Shrestha")
      await registerUser({
        fullName: registeredName,
        email: email.trim() || (roleTab === "owner" ? "admin@abcevpart.com.np" : "aayush.shrestha@abcevpart.np"),
        phone: phoneNumber.trim() || "+977 9841234567",
        role: roleTab,
      })
      setLoading(false)
      if (roleTab === "owner") {
        navigate("/owner")
      } else {
        navigate("/account")
      }
    }, 500)
  }

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setForgotSent(true)
      notify("Recovery link sent.")
    }, 400)
  }

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage({ text: "Passwords do not match.", isError: true })
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setResetSuccess(true)
      notify("Password updated successfully.")
    }, 400)
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-white to-slate-50/80">
      {/* Spacious Big Rounded Border Box */}
      <div className="w-full max-w-2xl bg-white rounded-3xl border-2 border-slate-200/90 shadow-2xl shadow-slate-200/50 p-7 sm:p-11 transition-all">
        {/* Brand & Heading */}
        <div className="text-center mb-8">
          <AppLink to="/" className="inline-flex items-center gap-2.5 mb-3 group hover:opacity-95 transition-opacity">
            <span className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <Zap size={20} className="fill-current" />
            </span>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              ABC EV <span className="text-amber-600">PART</span>
            </span>
          </AppLink>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            {mode === "login"
              ? "Welcome Back"
              : mode === "register"
              ? "Create Your Account"
              : mode === "forgot"
              ? "Reset Your Password"
              : "Choose New Password"}
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {mode === "login"
              ? "Sign in to manage vehicle orders, garage parts, and real-time delivery tracking across Nepal."
              : mode === "register"
              ? "Join ABC EV PART for genuine 800V components, 13% VAT tax receipts, and direct doorstep courier."
              : "Enter your registered credentials to securely restore access to your account."}
          </p>
        </div>

        {/* Mode Switcher: Sign In vs Sign Up */}
        {(mode === "login" || mode === "register") && (
          <div className="flex p-1.5 bg-slate-100/90 rounded-2xl mb-6 text-sm font-bold border border-slate-200/60">
            <button
              type="button"
              onClick={() => handleTabSwitch("login")}
              className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                mode === "login"
                  ? "bg-white text-slate-900 shadow-sm font-extrabold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <User size={16} />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch("register")}
              className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                mode === "register"
                  ? "bg-white text-slate-900 shadow-sm font-extrabold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Zap size={16} />
              <span>Sign Up (Create Account)</span>
            </button>
          </div>
        )}

        {/* Role Selector: Customer vs Store Owner */}
        {(mode === "login" || mode === "register") && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleRoleSelect("customer")}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                roleTab === "customer"
                  ? "border-slate-800 bg-slate-50/80 shadow-xs"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  roleTab === "customer" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                <User size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Customer & Buyer</span>
                  {roleTab === "customer" && <Check size={14} className="text-slate-900" />}
                </div>
                <div className="text-xs text-slate-500 truncate">Personal garage & build orders</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect("owner")}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                roleTab === "owner"
                  ? "border-slate-800 bg-slate-50/80 shadow-xs"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  roleTab === "owner" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                <ShieldCheck size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Store Owner & Admin</span>
                  {roleTab === "owner" && <Check size={14} className="text-slate-900" />}
                </div>
                <div className="text-xs text-slate-500 truncate">Catalog & dispatch management</div>
              </div>
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* SIGN IN MODE */}
        {/* ============================================================== */}
        {mode === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Email Address <span className="text-slate-400 font-normal">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <Input
                  id="login-email"
                  type="email"
                  required
                  placeholder={roleTab === "owner" ? "admin@abcevpart.com.np" : "aayush.shrestha@abcevpart.np"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input pl-11 h-12 w-full text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="login-pwd" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password <span className="text-slate-400 font-normal">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 hover:underline cursor-pointer bg-transparent border-none p-0"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <Input
                  id="login-pwd"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input pl-11 pr-11 h-12 w-full text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-none p-1"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember & Security Info */}
            <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
              <label className="flex items-center gap-2 cursor-pointer font-medium select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-300 cursor-pointer"
                />
                <span>Remember this session on this device</span>
              </label>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400">
                <ShieldCheck size={13} className="text-emerald-600" />
                256-Bit SSL Encrypted
              </span>
            </div>

            {message && (
              <p
                className={`text-xs p-3 rounded-xl ${
                  message.isError
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}
              >
                {message.text}
              </p>
            )}

            {/* Primary Sign In Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center h-12 text-sm font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all"
              disabled={loading}
            >
              {loading ? (
                "Authenticating..."
              ) : (
                <span className="flex items-center gap-2">
                  <span>Sign In as {roleTab === "owner" ? "Store Owner" : "Customer"}</span>
                  <ArrowRight size={16} />
                </span>
              )}
            </Button>

            {/* Social / GitHub Login Option */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200/80" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  Or Continue With
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                login("shahdhiraj@github.com", "GitHub#2026", roleTab)
                notify("Signed in successfully via GitHub (@shahdhiraj)")
                if (roleTab === "owner") navigate("/owner")
                else navigate("/account")
              }}
              className="w-full h-12 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-xs hover:border-slate-400"
            >
              <svg className="w-5 h-5 fill-current text-slate-900" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>Continue with GitHub</span>
            </button>

            {/* Demo Fill Quick Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">1-Click Demo Credentials:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleInstantRoleLogin("customer")}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 hover:text-slate-900 font-bold text-xs cursor-pointer border border-slate-200/80 transition-colors text-slate-700"
                >
                  Customer Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleInstantRoleLogin("owner")}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 hover:text-slate-900 font-bold text-xs cursor-pointer border border-slate-200/80 transition-colors text-slate-700"
                >
                  Store Owner Demo
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ============================================================== */}
        {/* SIGN UP MODE (WITH ALL STANDARD NEEDED FIELDS) */}
        {/* ============================================================== */}
        {mode === "register" && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="reg-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Full Legal Name <span className="text-slate-400 font-normal">*</span>
              </label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <Input
                  id="reg-name"
                  required
                  placeholder="e.g. Aayush Shrestha"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="auth-input pl-11 h-12 w-full text-sm"
                />
              </div>
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Email Address <span className="text-slate-400 font-normal">*</span>
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <Input
                    id="reg-email"
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-input pl-11 h-12 w-full text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Nepal Mobile Phone <span className="text-slate-400 font-normal">*</span>
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <Input
                    id="reg-phone"
                    required
                    placeholder="+977 98XXXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="auth-input pl-11 h-12 w-full text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Sign Up Password and Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Sign Up Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="reg-pwd" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Password <span className="text-slate-400 font-normal">*</span>
                  </label>
                  {password && (
                    <span className={`text-[11px] font-bold ${pwdStrength.color}`}>
                      {pwdStrength.label}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <Input
                    id="reg-pwd"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Create secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input pl-11 pr-11 h-12 w-full text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-none p-1"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {/* Visual Password Strength Indicators */}
                <div className="mt-2 flex gap-1">
                  <div
                    className={`h-1 flex-1 rounded-full transition-all ${
                      password.length > 0
                        ? pwdStrength.score >= 1
                          ? "bg-slate-500"
                          : "bg-slate-200"
                        : "bg-slate-200"
                    }`}
                  />
                  <div
                    className={`h-1 flex-1 rounded-full transition-all ${
                      pwdStrength.score >= 2 ? "bg-slate-600" : "bg-slate-200"
                    }`}
                  />
                  <div
                    className={`h-1 flex-1 rounded-full transition-all ${
                      pwdStrength.score >= 3 ? "bg-emerald-600" : "bg-slate-200"
                    }`}
                  />
                </div>
              </div>

              {/* Confirm Password Box */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="reg-conf" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Confirm Password <span className="text-slate-400 font-normal">*</span>
                  </label>
                  {confirmPassword.length > 0 && (
                    <span
                      className={`text-[11px] font-bold ${
                        password === confirmPassword ? "text-emerald-600" : "text-rose-500"
                      }`}
                    >
                      {password === confirmPassword ? "✓ Passwords match" : "Does not match"}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <Input
                    id="reg-conf"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Re-type your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="auth-input pl-11 pr-11 h-12 w-full text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-none p-1"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400">
                  Minimum 6 characters. Must match password.
                </p>
              </div>
            </div>

            {/* Agreement Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 select-none">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-300 cursor-pointer"
                />
                <span>
                  I agree to the{" "}
                  <AppLink to="/terms" className="text-amber-600 font-bold hover:underline">
                    Terms of Service
                  </AppLink>{" "}
                  and acknowledge the{" "}
                  <AppLink to="/privacy" className="text-amber-600 font-bold hover:underline">
                    Privacy Policy
                  </AppLink>
                  .
                </span>
              </label>
            </div>

            {message && (
              <p
                className={`text-xs p-3 rounded-xl ${
                  message.isError
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}
              >
                {message.text}
              </p>
            )}

            {/* Primary Sign Up Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center h-12 text-sm font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all mt-2"
              disabled={loading}
            >
              {loading ? (
                "Creating Account..."
              ) : (
                <span className="flex items-center gap-2">
                  <span>Complete Registration & Enter {roleTab === "owner" ? "Owner Portal" : "Garage"}</span>
                  <ArrowRight size={16} />
                </span>
              )}
            </Button>

            {/* Social / GitHub Sign Up Option */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200/80" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  Or Sign Up With
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                login("shahdhiraj@github.com", "GitHub#2026", roleTab)
                notify("Registered & signed in successfully via GitHub (@shahdhiraj)")
                if (roleTab === "owner") navigate("/owner")
                else navigate("/account")
              }}
              className="w-full h-12 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-xs hover:border-slate-400"
            >
              <svg className="w-5 h-5 fill-current text-slate-900" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>Continue with GitHub</span>
            </button>
          </form>
        )}

        {/* ============================================================== */}
        {/* FORGOT PASSWORD MODE */}
        {/* ============================================================== */}
        {mode === "forgot" && (
          <div>
            {forgotSent ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <Check size={28} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 m-0">Reset Link Dispatched</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  We've sent a secure password reset link to <strong>{email}</strong>.
                </p>
                <div className="flex gap-3 justify-center pt-3">
                  <Button variant="primary" size="md" onClick={() => setMode("reset")}>
                    Open Link Simulator
                  </Button>
                  <Button variant="secondary" size="md" onClick={() => handleTabSwitch("login")}>
                    Back to Sign In
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-5">
                <div>
                  <label htmlFor="f-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Registered Email Address <span className="text-slate-400 font-normal">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <Input
                      id="f-email"
                      type="email"
                      required
                      placeholder="name@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="auth-input pl-11 h-12 w-full text-sm"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center h-12 text-sm font-bold rounded-xl shadow-lg shadow-amber-500/20"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Secure Reset Link"}
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => handleTabSwitch("login")}
                    className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center justify-center gap-1.5 mx-auto cursor-pointer bg-transparent border-none p-0"
                  >
                    <ArrowLeft size={14} /> Back to Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* RESET PASSWORD MODE */}
        {/* ============================================================== */}
        {mode === "reset" && (
          <div>
            {resetSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <Check size={28} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 m-0">Password Successfully Updated</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  Your account password has been updated. You can now sign in with your new credentials.
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full justify-center h-12 mt-3 text-sm font-bold rounded-xl"
                  onClick={() => handleTabSwitch("login")}
                >
                  Sign In with New Password
                </Button>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="r-pwd" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      New Password <span className="text-slate-400 font-normal">*</span>
                    </label>
                    <Input
                      id="r-pwd"
                      type="password"
                      required
                      placeholder="Min. 6 chars"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="auth-input px-4 h-12 w-full text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="r-conf" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Confirm New Password <span className="text-slate-400 font-normal">*</span>
                    </label>
                    <Input
                      id="r-conf"
                      type="password"
                      required
                      placeholder="Re-type new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="auth-input px-4 h-12 w-full text-sm"
                    />
                  </div>
                </div>

                {message && (
                  <p className="text-xs p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
                    {message.text}
                  </p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center h-12 text-sm font-bold rounded-xl shadow-lg shadow-amber-500/20"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Save New Password"}
                </Button>
              </form>
            )}
          </div>
        )}

        {/* Footer Prompt */}
        {(mode === "login" || mode === "register") && (
          <div className="mt-8 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            {mode === "login" ? (
              <>
                <span>New to ABC EV PART? </span>
                <button
                  type="button"
                  onClick={() => handleTabSwitch("register")}
                  className="font-bold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer bg-transparent border-none p-0 text-xs ml-1"
                >
                  Sign Up (Create Free Account)
                </button>
              </>
            ) : (
              <>
                <span>Already registered with ABC EV PART? </span>
                <button
                  type="button"
                  onClick={() => handleTabSwitch("login")}
                  className="font-bold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer bg-transparent border-none p-0 text-xs ml-1"
                >
                  Sign In to Account
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
