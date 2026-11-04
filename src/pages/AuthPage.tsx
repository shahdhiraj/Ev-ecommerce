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
  const [email, setEmail] = useState("aayush.shrestha@abcevpart.com.np")
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
        setEmail("aayush.shrestha@abcevpart.com.np")
        setPassword("AbcEV#2026")
      }
    }
  }

  const handleInstantRoleLogin = async (role: "customer" | "owner") => {
    setLoading(true)
    setRoleTab(role)
    const targetEmail = role === "owner" ? "admin@abcevpart.com.np" : "aayush.shrestha@abcevpart.com.np"
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
        email: email.trim() || (roleTab === "owner" ? "admin@abcevpart.com.np" : "aayush.shrestha@abcevpart.com.np"),
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
    <div className="page-grid min-h-[90vh] items-center py-12 bg-gradient-to-b from-slate-50 via-white to-slate-50/80">
      {/* Spacious Big Rounded Border Box */}
      <div className="page-content justify-self-center w-full max-w-2xl bg-white rounded-3xl border-2 border-slate-200/90 shadow-2xl shadow-slate-200/50 p-7 sm:p-11 transition-all">
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

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-6">
            {mode === "login"
              ? "Sign In"
              : mode === "register"
              ? "Sign Up"
              : mode === "forgot"
              ? "Reset Password"
              : "New Password"}
          </h1>
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
              <span>Sign Up</span>
            </button>
          </div>
        )}

        {/* Role Selector: Customer vs Store Owner */}
        {(mode === "login" || mode === "register") && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleRoleSelect("customer")}
              className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer flex items-center justify-center gap-2.5 ${
                roleTab === "customer"
                  ? "border-slate-800 bg-slate-50 text-slate-900 font-bold shadow-xs"
                  : "border-slate-200 bg-white hover:border-slate-300 text-slate-600"
              }`}
            >
              <User size={17} className={roleTab === "customer" ? "text-slate-900" : "text-slate-400"} />
              <span className="text-sm">Customer</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect("owner")}
              className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer flex items-center justify-center gap-2.5 ${
                roleTab === "owner"
                  ? "border-slate-800 bg-slate-50 text-slate-900 font-bold shadow-xs"
                  : "border-slate-200 bg-white hover:border-slate-300 text-slate-600"
              }`}
            >
              <ShieldCheck size={17} className={roleTab === "owner" ? "text-slate-900" : "text-slate-400"} />
              <span className="text-sm">Store Owner</span>
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
                  placeholder={roleTab === "owner" ? "admin@abcevpart.com.np" : "aayush.shrestha@abcevpart.com.np"}
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
                "Signing In..."
              ) : (
                <span className="flex items-center gap-2">
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </span>
              )}
            </Button>

            {/* Clean Social Media Login */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-400 font-medium">
                  or
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  login("user@gmail.com", "Google#2026", roleTab)
                  notify("Signed in with Google")
                  if (roleTab === "owner") navigate("/owner")
                  else navigate("/account")
                }}
                className="h-11 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs hover:border-slate-400"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  login("user@icloud.com", "Apple#2026", roleTab)
                  notify("Signed in with Apple")
                  if (roleTab === "owner") navigate("/owner")
                  else navigate("/account")
                }}
                className="h-11 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs hover:border-slate-400"
              >
                <svg className="w-4 h-4 shrink-0 fill-current text-slate-900" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.85-.9.04-2 .6-2.65 1.36-.57.66-.99 1.73-.94 2.76.99.08 1.96-.52 2.58-1.27z" />
                </svg>
                <span>Apple</span>
              </button>
            </div>

            {/* Demo Fill Quick Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">Demo Login:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleInstantRoleLogin("customer")}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 hover:text-slate-900 font-bold text-xs cursor-pointer border border-slate-200/80 transition-colors text-slate-700"
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => handleInstantRoleLogin("owner")}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 hover:text-slate-900 font-bold text-xs cursor-pointer border border-slate-200/80 transition-colors text-slate-700"
                >
                  Store Owner
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
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </span>
              )}
            </Button>
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
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <span>Already have an account? </span>
                <button
                  type="button"
                  onClick={() => handleTabSwitch("login")}
                  className="font-bold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer bg-transparent border-none p-0 text-xs ml-1"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
