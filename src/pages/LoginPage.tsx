import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import loginImage from "../assets/img/login.png";
import { isFirebaseConfigured } from "../services/firebase";

/* ══════════════════════════════════════════════
   EYE ICON
══════════════════════════════════════════════ */
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════
   MAIN LOGIN PAGE
══════════════════════════════════════════════ */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuthStore();
  const params = new URLSearchParams(location.search);
  const intent = params.get("intent");
  const returnToParam = params.get("returnTo") || "/";
  const postLoginPath = returnToParam.startsWith("/") ? returnToParam : "/";
  const [mode, setMode]             = useState<"login"|"register"|"forgot">("login");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [firstName, setFirstName]   = useState("");
  const [lastName, setLastName]     = useState("");
  const [showPass, setShowPass]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors]         = useState<Record<string,string>>({});
  const [success, setSuccess]       = useState("");
  const [loading, setLoading]       = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const getGoogleSignInErrorMessage = (error: unknown) => {
    const code = typeof error === "object" && error !== null && "code" in error
      ? String(error.code)
      : "unknown";

    switch (code) {
      case "auth/popup-closed-by-user":
        return "You closed the Google popup before completing sign-in.";
      case "auth/popup-blocked":
        return "The browser blocked the Google popup. Allow popups and try again.";
      case "auth/unauthorized-domain":
        return "This domain is not authorized in Firebase. Add localhost to Authorized domains.";
      case "auth/invalid-api-key":
        return "The Firebase API key is invalid. Check the values in your .env file.";
      case "auth/operation-not-allowed":
        return "Google sign-in is not enabled in Firebase Authentication.";
      case "auth/network-request-failed":
        return "Network error during Google sign-in. Check your connection and try again.";
      case "auth/configuration-not-found":
        return "Google provider is not configured in Firebase Authentication.";
      case "auth/invalid-credential":
        return "Invalid Google credential returned. Try again and confirm provider setup.";
      case "auth/internal-error":
        return "Firebase internal error. Refresh and try again.";
      default:
        return `Google sign-in failed (${code}). Verify Firebase configuration and authorized domains.`;
    }
  };

  /* validation */
  const validate = () => {
    const e: Record<string,string> = {};
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email address";
    if (mode !== "forgot") {
      if (password.length < 8) e.password = "Password must be at least 8 characters";
    }
    if (mode === "register") {
      if (!firstName.trim()) e.firstName = "Required";
      if (!lastName.trim())  e.lastName  = "Required";
      if (password !== confirmPass) e.confirmPass = "Passwords do not match";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setSuccess("");
    
    try {
      if (mode === "forgot") {
        // Simular envío de email
        await new Promise(resolve => setTimeout(resolve, 1400));
        setSuccess("Password reset link sent to " + email);
        setTimeout(() => setMode("login"), 3000);
      } else if (mode === "register") {
        // Simular registro
        await new Promise(resolve => setTimeout(resolve, 1400));
        // Registrar y hacer login automático con nombre completo
        const fullName = `${firstName} ${lastName}`;
        await login(email, password, fullName);
        setSuccess("Account created! Redirecting…");
        setTimeout(() => navigate(postLoginPath), 1000);
      } else {
        // Login real usando authStore
        await login(email, password);
        setSuccess("Login successful! Redirecting…");
        setTimeout(() => navigate(postLoginPath), 1000);
      }
    } catch (error) {
      setErrors({ email: "Invalid credentials" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isFirebaseConfigured) {
      setErrors({ email: "Firebase is not configured yet. Fill in the .env values first." });
      return;
    }

    setLoadingGoogle(true);
    setSuccess("");
    setErrors({});

    try {
      await loginWithGoogle();
      setSuccess("Google login successful! Redirecting...");
      setTimeout(() => navigate(postLoginPath), 800);
    } catch (error) {
      setErrors({ email: getGoogleSignInErrorMessage(error) });
    } finally {
      setLoadingGoogle(false);
    }
  };

  const inputStyle = (err?: string): React.CSSProperties => ({
    width: "100%", padding: "13px 16px",
    background: "#1a1a1a", border: `1.5px solid ${err ? "#cc4444" : "#2a2a2a"}`,
    borderRadius: 8, color: "#fff", fontSize: 14,
    outline: "none", fontFamily: "'DM Sans',sans-serif",
    transition: "border-color .2s",
  });

  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: "#888",
    letterSpacing: 1.2, textTransform: "uppercase" as const,
    display: "block", marginBottom: 7,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sansita:wght@400;700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #000; }
        .lg-root { font-family: 'DM Sans', sans-serif; min-height: 100vh; display: flex; }
        input, button { font-family: 'DM Sans', sans-serif; }

        .lg-input:focus {
          border-color: #c8960c !important;
          box-shadow: 0 0 0 3px rgba(200,150,12,.15);
        }
        .lg-btn-primary {
          width: 100%;
          padding: 15px;
          background: #c8960c;
          border: none;
          border-radius: 8px;
          color: #fff;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background .2s, transform .1s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .lg-btn-primary:hover { background: #d4a020; }
        .lg-btn-primary:active { transform: scale(.98); }
        .lg-btn-primary:disabled { background: #555; cursor: not-allowed; }

        .lg-btn-social {
          flex: 1;
          padding: 12px;
          background: #1a1a1a;
          border: 1.5px solid #2a2a2a;
          border-radius: 8px;
          color: #ccc;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: border-color .2s, background .2s;
        }
        .lg-btn-social:hover { border-color: #c8960c; background: #222; color: #fff; }
        .lg-btn-social:disabled { opacity: .65; cursor: not-allowed; }

        .lg-link { color: #c8960c; font-weight: 700; cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; font-size: inherit; text-decoration: none; }
        .lg-link:hover { text-decoration: underline; }

        .fade-in { animation: fadeIn .4s ease; }
        @keyframes fadeIn { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }

        .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .divider { display: flex; align-items: center; gap: 12; color: #444; font-size: 12px; margin: 20px 0; }
        .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: #2a2a2a; }
      `}</style>

      <div className="lg-root">

        {/* ── LEFT PANEL — GPU IMAGE ── */}
        <div style={{
          flex: "0 0 50%", position: "relative", overflow: "hidden",
          background: "#000", minHeight: "100vh",
        }}>
          {/* GPU Background Image */}
          <img 
            src={loginImage} 
            alt="GPU Graphics Card"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center"
            }}
          />

          {/* overlay gradient to blend into right panel */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, transparent 60%, #0d0d0d 100%)",
            pointerEvents: "none",
          }}/>

          {/* bottom text */}
          <div style={{ position: "absolute", bottom: 48, left: 40, right: 80, zIndex: 10 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10, marginBottom: 10,
            }}>
              <div style={{ width: 28, height: 1.5, background: "#c8960c" }}/>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#c8960c", letterSpacing: 2, textTransform: "uppercase" }}>
                Premium Performance
              </span>
            </div>
            <h2 style={{
              fontFamily: "'Sansita', sans-serif",
              fontSize: 38, fontWeight: 900, color: "#fff",
              lineHeight: 1.05, marginBottom: 10,
            }}>
              ENGINEERED FOR<br/>
              <span style={{ color: "#c8960c" }}>EXCELLENCE</span>
            </h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.55)", maxWidth: 260, lineHeight: 1.65 }}>
              Experience the next generation of computing hardware with VendoLaptops.
            </p>
          </div>
        </div>

        {/* ── RIGHT PANEL — FORM ── */}
        <div style={{
          flex: "0 0 50%", background: "#0d0d0d",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "space-between",
          padding: "32px 48px", minHeight: "100vh",
        }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, alignSelf: "center" }}>
            <svg width="28" height="28" viewBox="0 0 32 32">
              <polygon points="16,2 30,26 2,26" fill="#c8960c"/>
              <polygon points="16,8 26,24 6,24" fill="#0d0d0d"/>
              <polygon points="16,14 21,24 11,24" fill="#c8960c" opacity="0.6"/>
            </svg>
            <span style={{ fontFamily: "'Sansita',sans-serif", fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: 1 }}>
              VENDO<span style={{ color: "#c8960c" }}>LAPTOPS</span>
            </span>
          </div>

          {/* ── FORM CARD ── */}
          <div className="fade-in" style={{ width: "100%", maxWidth: 420 }}>

            {/* Title */}
            <div style={{ marginBottom: 28 }}>
              {intent === "cart" && (
                <p style={{
                  fontSize: 13,
                  color: "#f5c518",
                  marginBottom: 10,
                  border: "1px solid rgba(245,197,24,.35)",
                  background: "rgba(245,197,24,.08)",
                  borderRadius: 8,
                  padding: "8px 10px",
                }}>
                  Ingresa tu correo para iniciar sesion y agregar productos al carrito.
                </p>
              )}
              {mode === "login"    && <><h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Welcome Back</h1><p style={{ fontSize: 14, color: "#666" }}>Enter your credentials to access your account.</p></>}
              {mode === "register" && <><h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Create Account</h1><p style={{ fontSize: 14, color: "#666" }}>Join VendoLaptops and start shopping.</p></>}
              {mode === "forgot"   && <><h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Reset Password</h1><p style={{ fontSize: 14, color: "#666" }}>We'll send a reset link to your email.</p></>}
            </div>

            {/* Success message */}
            {success && (
              <div style={{ background: "#0d2a14", border: "1.5px solid #2a6a30", borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#4ade80", display: "flex", alignItems: "center", gap: 8 }}>
                ✓ {success}
              </div>
            )}

            {/* ── REGISTER: name fields ── */}
            {mode === "register" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>First Name</label>
                  <input className="lg-input" value={firstName} onChange={e=>setFirstName(e.target.value)}
                    placeholder="John" style={inputStyle(errors.firstName)}/>
                  {errors.firstName && <div style={{ fontSize:11, color:"#cc4444", marginTop:3 }}>{errors.firstName}</div>}
                </div>
                <div>
                  <label style={labelStyle}>Last Name</label>
                  <input className="lg-input" value={lastName} onChange={e=>setLastName(e.target.value)}
                    placeholder="Doe" style={inputStyle(errors.lastName)}/>
                  {errors.lastName && <div style={{ fontSize:11, color:"#cc4444", marginTop:3 }}>{errors.lastName}</div>}
                </div>
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Email Address</label>
              <input className="lg-input" type="email" value={email} onChange={e=>setEmail(e.target.value)}
                placeholder="name@company.com" style={inputStyle(errors.email)}/>
              {errors.email && <div style={{ fontSize:11, color:"#cc4444", marginTop:3 }}>{errors.email}</div>}
            </div>

            {/* Password */}
            {mode !== "forgot" && (
              <div style={{ marginBottom: mode === "register" ? 16 : 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                  {mode === "login" && (
                    <button className="lg-link" style={{ fontSize: 12 }} onClick={() => setMode("forgot")}>
                      Forgot password?
                    </button>
                  )}
                </div>
                <div style={{ position: "relative" }}>
                  <input className="lg-input"
                    type={showPass ? "text" : "password"}
                    value={password} onChange={e=>setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ ...inputStyle(errors.password), paddingRight: 44 }}/>
                  <button onClick={()=>setShowPass(v=>!v)} style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex",
                  }}>
                    <EyeIcon open={showPass}/>
                  </button>
                </div>
                {errors.password && <div style={{ fontSize:11, color:"#cc4444", marginTop:3 }}>{errors.password}</div>}

                {/* Password strength */}
                {mode === "register" && password.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: "flex", gap: 4, marginBottom: 3 }}>
                      {["Weak","Fair","Good","Strong"].map((_,i) => {
                        const score = password.length < 6 ? 0 : password.length < 8 ? 1 : password.length < 12 ? 2 : 3;
                        return <div key={i} style={{ flex:1, height:3, borderRadius:2, background: i<=score ? ["#cc4444","#e07020","#d4a020","#22c55e"][score] : "#2a2a2a" }}/>;
                      })}
                    </div>
                    <span style={{ fontSize:10, color:"#888" }}>
                      {password.length < 6 ? "Weak" : password.length < 8 ? "Fair" : password.length < 12 ? "Good" : "Strong"} password
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Confirm password */}
            {mode === "register" && (
              <div style={{ marginBottom: 6 }}>
                <label style={labelStyle}>Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <input className="lg-input"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPass} onChange={e=>setConfirmPass(e.target.value)}
                    placeholder="••••••••"
                    style={{ ...inputStyle(errors.confirmPass), paddingRight: 44 }}/>
                  <button onClick={()=>setShowConfirm(v=>!v)} style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex",
                  }}>
                    <EyeIcon open={showConfirm}/>
                  </button>
                </div>
                {errors.confirmPass && <div style={{ fontSize:11, color:"#cc4444", marginTop:3 }}>{errors.confirmPass}</div>}
              </div>
            )}

            {/* Remember me (login only) */}
            {mode === "login" && (
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#888", cursor: "pointer", marginBottom: 20, marginTop: 8 }}>
                <div onClick={()=>setRememberMe(v=>!v)} style={{
                  width: 18, height: 18, borderRadius: 4,
                  border: `2px solid ${rememberMe ? "#c8960c" : "#2a2a2a"}`,
                  background: rememberMe ? "#c8960c" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, cursor: "pointer",
                }}>
                  {rememberMe && <svg width="10" height="10" viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2" fill="none"/></svg>}
                </div>
                Keep me logged in
              </label>
            )}

            {/* Submit */}
            <button className="lg-btn-primary" onClick={handleSubmit} disabled={loading} style={{ marginBottom: 0 }}>
              {loading
                ? <div className="spinner"/>
                : mode === "login"    ? "Login to Account"
                : mode === "register" ? "Create Account"
                : "Send Reset Link"
              }
            </button>

            {/* Social auth (login/register only) */}
            {mode !== "forgot" && (
              <>
                <div className="divider" style={{ display:"flex", alignItems:"center", gap:12, color:"#444", fontSize:12, margin:"20px 0" }}>
                  <div style={{ flex:1, height:1, background:"#2a2a2a" }}/>
                  <span>OR CONTINUE WITH</span>
                  <div style={{ flex:1, height:1, background:"#2a2a2a" }}/>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button className="lg-btn-social" onClick={handleGoogleSignIn} disabled={loadingGoogle || loading}>
                    <svg width="16" height="16" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    {loadingGoogle ? "Connecting..." : "Google"}
                  </button>
                  <button className="lg-btn-social">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Apple
                  </button>
                </div>
              </>
            )}

            {/* Switch mode */}
            <div style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "#666" }}>
              {mode === "login" && (
                <>Don't have an account? <button className="lg-link" onClick={()=>{setMode("register");setErrors({});setSuccess("");}}>Sign up for free</button></>
              )}
              {mode === "register" && (
                <>Already have an account? <button className="lg-link" onClick={()=>{setMode("login");setErrors({});setSuccess("");}}>Log in</button></>
              )}
              {mode === "forgot" && (
                <>Remembered it? <button className="lg-link" onClick={()=>{setMode("login");setErrors({});setSuccess("");}}>Back to login</button></>
              )}
            </div>
          </div>

          {/* Footer links */}
          <div style={{ display: "flex", gap: 24, fontSize: 11, color: "#444", letterSpacing: 0.8, textTransform: "uppercase" as const }}>
            {["Privacy Policy","Terms of Service","Contact Us"].map(l=>(
              <a key={l} href="#" style={{ color:"#444", textDecoration:"none" }}
                onMouseEnter={e=>(e.currentTarget.style.color="#c8960c")}
                onMouseLeave={e=>(e.currentTarget.style.color="#444")}>
                {l}
              </a>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
