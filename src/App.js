import { useState, useRef, useCallback, useEffect, createContext, useContext } from 'react';

const API = process.env.REACT_APP_API_URL || '';

(() => {
  const id = 'tekre-styles';
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id;
  s.textContent = `
    @keyframes barWave {
      0% { transform: scaleY(0.4); }
      100% { transform: scaleY(1); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.3; transform: scale(0.8); }
      50% { opacity: 1; transform: scale(1); }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    body {
      margin: 0; padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
      background: ${'#F5F3F0'};
      overflow-x: hidden;
    }
    input, button, textarea { font-family: inherit; }
    button:active { transform: scale(0.96) !important; }
    ::-webkit-scrollbar { display: none; }
  `;
  document.head.appendChild(s);
})();

const theme = {
  orange: '#FF6B2C',
  orangeLight: '#FFF0E8',
  orangeDark: '#E55A1F',
  green: '#2ECC71',
  greenLight: '#EAFAF1',
  red: '#FF4757',
  purple: '#6C5CE7',
  bg: '#F5F3F0',
  card: '#FFFFFF',
  surface: '#FAF9F7',
  text: '#1A1A2E',
  textSecondary: '#8E8E93',
  textTertiary: '#C4C4C6',
  border: '#EFECE8',
  shadow: 'rgba(0,0,0,0.06)',
  radius: 16,
  radiusSm: 10,
};

const Icons = {
  Mic: ({ size = 24, color = '#fff' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="9" y="2" width="6" height="11" rx="3" stroke={color} strokeWidth="1.8" fill={color + '22'}/>
      <path d="M5 11a7 7 0 0 0 14 0" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="12" y1="18" x2="12" y2="22" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Stop: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="6" y="6" width="12" height="12" rx="3" fill="#fff"/>
    </svg>
  ),
  Check: ({ size = 20, color = '#2ECC71' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8"/>
      <path d="M8 12l3 3 5-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Wave: ({ size = 32, color = '#FF6B2C' }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="4" y="12" width="3" height="8" rx="1.5" fill={color} opacity="0.4"/>
      <rect x="10" y="8" width="3" height="16" rx="1.5" fill={color} opacity="0.6"/>
      <rect x="16" y="4" width="3" height="24" rx="1.5" fill={color}/>
      <rect x="22" y="8" width="3" height="16" rx="1.5" fill={color} opacity="0.6"/>
      <rect x="28" y="12" width="3" height="8" rx="1.5" fill={color} opacity="0.4"/>
    </svg>
  ),
  Sparkle: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 0l1.5 5.5L15 7l-5.5 1.5L8 14l-1.5-5.5L1 7l5.5-1.5L8 0z" fill={theme.orange}/>
    </svg>
  ),
  Home: ({ size = 22, active = false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke={active ? theme.orange : theme.textTertiary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Stats: ({ size = 22, active = false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke={active ? theme.orange : theme.textTertiary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Settings: ({ size = 22, active = false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke={active ? theme.orange : theme.textTertiary} strokeWidth="1.8"/>
      <circle cx="12" cy="12" r="3" stroke={active ? theme.orange : theme.textTertiary} strokeWidth="1.8"/>
    </svg>
  ),
  Trophy: ({ size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M12 6h24v8c0 6.627-5.373 12-12 12S12 20.627 12 14V6z" fill={theme.orangeLight} stroke={theme.orange} strokeWidth="1.8"/>
      <path d="M12 14H8a2 2 0 01-2-2V8a2 2 0 012-2h4M36 14h4a2 2 0 002-2V8a2 2 0 00-2-2h-4M18 32h12M20 32l-2 10M28 32l2 10M16 42h16" stroke={theme.orange} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  User: ({ size = 22, color = '#8E8E93' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.8"/>
      <path d="M4 21v-1a6 6 0 0112 0v1" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Plus: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <line x1="12" y1="5" x2="12" y2="19" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      <line x1="5" y1="12" x2="19" y2="12" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Crown: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 20h16M4 20l3-14 5 6 5-6 3 14" stroke={theme.orange} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('tk_token');
    if (!token) { setAuthLoading(false); return; }
    fetch(`${API}/api/profile`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => setUser(d.user))
      .catch(() => localStorage.removeItem('tk_token'))
      .finally(() => setAuthLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const r = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!r.ok) {
      const e = await r.json();
      throw new Error(e.message || e.errors?.email?.[0] || 'Email ou mot de passe incorrect.');
    }
    const d = await r.json();
    localStorage.setItem('tk_token', d.token);
    setUser(d.user);
    return d.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const r = await fetch(`${API}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!r.ok) {
      const e = await r.json();
      const msg = e.errors ? Object.values(e.errors).flat()[0] : 'Erreur lors de l\'inscription.';
      throw new Error(msg);
    }
    const d = await r.json();
    localStorage.setItem('tk_token', d.token);
    setUser(d.user);
    return d.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('tk_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, authLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

function apiFetch(path, options = {}) {
  const token = localStorage.getItem('tk_token');
  const headers = { Accept: 'application/json', ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }
  return fetch(`${API}${path}`, { ...options, headers });
}

const inputStyle = {
  width: '100%', padding: '12px 14px', borderRadius: theme.radiusSm, border: `1.5px solid ${theme.border}`,
  fontSize: 15, color: theme.text, background: theme.surface, outline: 'none',
  transition: 'border-color 0.2s',
};

function LoginScreen({ onToggle }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: `linear-gradient(135deg, ${theme.orange}, ${theme.orangeDark})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
          }}>
            <Icons.Mic size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: theme.text, margin: '0 0 4px' }}>Tékré</h1>
          <p style={{ fontSize: 13, color: theme.textSecondary, margin: 0 }}>Connecte-toi pour contribuer</p>
        </div>

        <form onSubmit={handleSubmit} style={{
          background: theme.card, borderRadius: 16, padding: 20,
          boxShadow: `0 2px 20px ${theme.shadow}`,
        }}>
          {error && (
            <div style={{
              background: theme.orangeLight, color: theme.orange, fontSize: 12, fontWeight: 500,
              padding: '8px 12px', borderRadius: theme.radiusSm, marginBottom: 14, textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, display: 'block', marginBottom: 4 }}>
              Email
            </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="exemple@email.com" required style={inputStyle} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, display: 'block', marginBottom: 4 }}>
              Mot de passe
            </label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required style={inputStyle} />
          </div>

          <button type="submit" disabled={loading} style={{
            border: 'none', padding: '13px 0', borderRadius: 12, width: '100%',
            background: `linear-gradient(135deg, ${theme.orange}, ${theme.orangeDark})`,
            color: '#fff', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 12, color: theme.textSecondary, marginTop: 14 }}>
            Pas encore de compte ?{' '}
            <button type="button" onClick={onToggle} style={{
              border: 'none', background: 'none', color: theme.orange, fontWeight: 600, cursor: 'pointer',
              fontSize: 12, padding: 0,
            }}>
              Créer un compte
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

function RegisterScreen({ onToggle }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Le mot de passe doit faire au moins 6 caractères.'); return; }
    setLoading(true);
    try {
      await register(name, email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: `linear-gradient(135deg, ${theme.orange}, ${theme.orangeDark})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
          }}>
            <Icons.Mic size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: theme.text, margin: '0 0 4px' }}>Tékré</h1>
          <p style={{ fontSize: 13, color: theme.textSecondary, margin: 0 }}>Rejoins la collecte audio</p>
        </div>

        <form onSubmit={handleSubmit} style={{
          background: theme.card, borderRadius: 16, padding: 20,
          boxShadow: `0 2px 20px ${theme.shadow}`,
        }}>
          {error && (
            <div style={{
              background: theme.orangeLight, color: theme.orange, fontSize: 12, fontWeight: 500,
              padding: '8px 12px', borderRadius: theme.radiusSm, marginBottom: 14, textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, display: 'block', marginBottom: 4 }}>Pseudo</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Ton pseudo" required style={inputStyle} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, display: 'block', marginBottom: 4 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="exemple@email.com" required style={inputStyle} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, display: 'block', marginBottom: 4 }}>Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Minimum 6 caractères" required minLength={6} style={inputStyle} />
          </div>

          <button type="submit" disabled={loading} style={{
            border: 'none', padding: '13px 0', borderRadius: 12, width: '100%',
            background: `linear-gradient(135deg, ${theme.orange}, ${theme.orangeDark})`,
            color: '#fff', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Inscription…' : 'Créer mon compte'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 12, color: theme.textSecondary, marginTop: 14 }}>
            Déjà un compte ?{' '}
            <button type="button" onClick={onToggle} style={{
              border: 'none', background: 'none', color: theme.orange, fontWeight: 600, cursor: 'pointer',
              fontSize: 12, padding: 0,
            }}>
              Se connecter
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

function CircularProgress({ current, total }) {
  const radius = 36;
  const stroke = 5;
  const normalizedRadius = radius - stroke / 2;
  const circum = 2 * Math.PI * normalizedRadius;
  const pct = total > 0 ? current / total : 0;
  const offset = circum - pct * circum;

  return (
    <div style={{ position: 'relative', width: 72, height: 72 }}>
      <svg width={72} height={72}>
        <circle cx="36" cy="36" r={normalizedRadius} fill="none" stroke={theme.border} strokeWidth={stroke} />
        <circle cx="36" cy="36" r={normalizedRadius} fill="none" stroke={theme.orange} strokeWidth={stroke}
          strokeDasharray={circum} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 36 36)" style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 18, fontWeight: 800, color: theme.text, lineHeight: 1 }}>{Math.round(pct * 100)}</span>
        <span style={{ fontSize: 9, fontWeight: 600, color: theme.textSecondary }}>%</span>
      </div>
    </div>
  );
}

function WordCard({ word, current, total, onDone }) {
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [doneAnim, setDoneAnim] = useState(false);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const uploadAudio = useCallback(async (blob) => {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('word', word.word);
      fd.append('audio', blob, `${word.word.replace(/\s+/g, '_')}.webm`);
      const res = await apiFetch('/api/collect/submit', { method: 'POST', body: fd });
      if (!res.ok) throw new Error(await res.text());
      setDoneAnim(true);
      setTimeout(() => { setDoneAnim(false); onDone(); }, 800);
    } catch (_) {
      setError('Erreur lors de l\'envoi.');
    } finally {
      setUploading(false);
    }
  }, [word.word, onDone]);

  const stopRecording = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCountdown(null);
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') mediaRecorder.current.stop();
    setRecording(false);
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      mediaRecorder.current = mr;
      chunks.current = [];
      let elapsed = 0;
      timerRef.current = setInterval(() => { elapsed++; setCountdown(10 - elapsed); if (elapsed >= 10) stopRecording(); }, 1000);
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunks.current.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunks.current, { type: mr.mimeType });
        setCountdown(null);
        await uploadAudio(blob);
      };
      mr.start();
      setRecording(true);
    } catch (_) {
      setError('Accès au micro refusé.');
    }
  }, [uploadAudio, stopRecording]);

  if (doneAnim) {
    return (
      <div style={cardStyles.container}>
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Icons.Check size={48} />
          <div style={{ fontSize: 16, fontWeight: 700, color: theme.green, marginTop: 10 }}>Enregistré !</div>
        </div>
      </div>
    );
  }

  const barHeights = [14, 22, 30, 22, 36, 22, 30, 22, 14];

  return (
    <div style={cardStyles.container}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={cardStyles.label}>PRONONCE CE MOT</div>
        <div style={cardStyles.word}>{word.word}</div>
        <div style={cardStyles.count}>
          <span style={{ color: theme.orange }}>●</span>
          {' '}{word.count} enregistrement{word.count > 1 ? 's' : ''}
        </div>
      </div>

      {error && <div style={cardStyles.error}>{error}</div>}

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {!recording ? (
          <button onClick={startRecording} disabled={uploading} style={cardStyles.recordBtn}>
            {uploading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={cardStyles.spinner} />Envoi…
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icons.Mic size={20} />Enregistrer
              </span>
            )}
          </button>
        ) : (
          <div style={cardStyles.recordingBox}>
            <div style={cardStyles.waveBox}>
              {barHeights.map((h, i) => (
                <div key={i} style={{ ...cardStyles.bar, height: h, animationDelay: `${i * 0.1}s`, opacity: 0.3 + (i % 3) * 0.35 }} />
              ))}
            </div>
            <button onClick={stopRecording} style={cardStyles.stopBtn}>
              <Icons.Stop size={16} />Arrêter
            </button>
            {countdown !== null && (
              <div style={cardStyles.countdown}>
                <span style={{ fontWeight: 700, color: theme.orange }}>{countdown}</span>s
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const cardStyles = {
  container: { background: theme.card, borderRadius: 16, padding: '24px 20px', boxShadow: `0 2px 20px ${theme.shadow}` },
  label: { fontSize: 11, fontWeight: 700, color: theme.textTertiary, letterSpacing: '0.08em', marginBottom: 8 },
  word: { fontSize: 24, fontWeight: 700, color: theme.text, lineHeight: 1.3, marginBottom: 6, wordBreak: 'break-word', overflowWrap: 'break-word' },
  count: { fontSize: 12, color: theme.textSecondary },
  error: { background: theme.orangeLight, color: theme.orange, fontSize: 12, fontWeight: 500, padding: '8px 12px', borderRadius: theme.radiusSm, marginBottom: 16, textAlign: 'center' },
  recordBtn: { border: 'none', padding: '14px 0', borderRadius: 12, background: `linear-gradient(135deg, ${theme.orange}, ${theme.orangeDark})`, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
  spinner: { width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' },
  recordingBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%' },
  waveBox: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, height: 36 },
  bar: { width: 4, borderRadius: 2, background: theme.orange, animation: 'barWave 0.7s ease-in-out infinite alternate' },
  stopBtn: { border: 'none', padding: '14px 0', borderRadius: 12, background: theme.red, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
  countdown: { fontSize: 12, color: theme.textSecondary, fontWeight: 500 },
};

function TabBar({ active, onChange, isAdmin }) {
  const tabs = [
    { key: 'record', icon: Icons.Home, label: 'Collecte' },
    { key: 'stats', icon: Icons.Stats, label: 'Progrès' },
    { key: 'admin', icon: Icons.Sparkle, label: 'Admin', adminOnly: true },
    { key: 'profile', icon: Icons.User, label: 'Profil' },
  ];

  return (
    <div style={tabStyles.bar}>
      {tabs.filter(t => !t.adminOnly || isAdmin).map(t => {
        const isActive = active === t.key;
        const Icon = t.icon;
        return (
          <button key={t.key} onClick={() => onChange(t.key)} style={tabStyles.tab}>
            <Icon active={isActive} />
            <span style={{ fontSize: 10, fontWeight: 600, color: isActive ? theme.orange : theme.textTertiary, marginTop: 3 }}>
              {t.label}
            </span>
            {isActive && <div style={tabStyles.indicator} />}
          </button>
        );
      })}
    </div>
  );
}

const tabStyles = {
  bar: { display: 'flex', justifyContent: 'space-around', alignItems: 'center', background: theme.card, borderRadius: 16, padding: '4px 6px', marginTop: 10, marginBottom: 6 },
  tab: { display: 'flex', flexDirection: 'column', alignItems: 'center', border: 'none', background: 'none', cursor: 'pointer', padding: '6px 6px', position: 'relative', flex: 1 },
  indicator: { position: 'absolute', bottom: -2, width: 18, height: 3, borderRadius: 2, background: theme.orange },
};

function StatsScreen({ words }) {
  const totalDone = words.reduce((s, w) => s + w.count, 0);
  const wordsWithMin = words.filter(w => w.done).length;

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: theme.text, margin: '0 0 16px' }}>Progrès</h2>

      <div style={{ background: theme.card, borderRadius: 16, padding: 20, boxShadow: `0 2px 20px ${theme.shadow}`, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: theme.orange }}>{totalDone}</div>
            <div style={{ fontSize: 11, color: theme.textSecondary, fontWeight: 500 }}>Enregistrements</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: theme.green }}>{wordsWithMin}</div>
            <div style={{ fontSize: 11, color: theme.textSecondary, fontWeight: 500 }}>Mots complétés</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: theme.text }}>{words.length}</div>
            <div style={{ fontSize: 11, color: theme.textSecondary, fontWeight: 500 }}>Mots total</div>
          </div>
        </div>
      </div>

      <div style={{ background: theme.card, borderRadius: 16, padding: 16, boxShadow: `0 2px 20px ${theme.shadow}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: theme.textSecondary, letterSpacing: '0.05em', marginBottom: 1 }}>
          DÉTAIL PAR MOT
        </div>
        <div>
          {words.map(w => (
            <div key={w.word} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid ' + theme.border }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: w.done ? theme.greenLight : theme.orangeLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>
                {w.done ? <Icons.Check size={12} /> : <span style={{ color: theme.orange }}>{w.count}</span>}
              </div>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: theme.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.word}</span>
              <div style={{ width: 48, height: 4, borderRadius: 2, background: theme.border, overflow: 'hidden', flexShrink: 0 }}>
                <div style={{ width: `${Math.min(100, (w.count / 5) * 100)}%`, height: '100%', borderRadius: 2, background: w.done ? theme.green : theme.orange }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: w.done ? theme.green : theme.textSecondary, minWidth: 28, textAlign: 'right', flexShrink: 0 }}>{w.count}/15</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileScreen() {
  const { user, logout } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/leaderboard')
      .then(r => r.json())
      .then(d => setLeaderboard(d.leaderboard || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const userRank = leaderboard.findIndex(u => u.id === user?.id) + 1;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: theme.text, margin: 0 }}>Profil</h2>
        <button onClick={logout} style={{
          border: 'none', background: 'none', color: theme.red, fontWeight: 600, cursor: 'pointer', fontSize: 13, padding: 0,
        }}>
          Déconnexion
        </button>
      </div>

      <div style={{ background: theme.card, borderRadius: 16, padding: 20, boxShadow: `0 2px 20px ${theme.shadow}`, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${theme.orange}, ${theme.orangeDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icons.User size={22} color="#fff" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: theme.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
            <div style={{ fontSize: 12, color: theme.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
            {user?.role === 'admin' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <Icons.Crown size={12} />
                <span style={{ fontSize: 11, fontWeight: 600, color: theme.orange }}>Administrateur</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ background: theme.card, borderRadius: 16, padding: 20, boxShadow: `0 2px 20px ${theme.shadow}`, marginBottom: 14 }}>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: theme.orange }}>{user?.points || 0}</div>
          <div style={{ fontSize: 12, color: theme.textSecondary, fontWeight: 500 }}>Points</div>
        </div>
        {userRank > 0 && (
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: theme.text }}>#{userRank}</span>
            <span style={{ fontSize: 12, color: theme.textSecondary }}> sur {leaderboard.length}</span>
          </div>
        )}
      </div>

      <div style={{ background: theme.card, borderRadius: 16, padding: 16, boxShadow: `0 2px 20px ${theme.shadow}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: theme.textSecondary, letterSpacing: '0.05em', marginBottom: 12 }}>CLASSEMENT</div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 16, color: theme.textSecondary, fontSize: 13 }}>Chargement…</div>
        ) : leaderboard.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 16, color: theme.textSecondary, fontSize: 13 }}>Aucun joueur pour l&apos;instant.</div>
        ) : (
          <div style={{ maxHeight: 240, overflowY: 'auto' }}>
            {leaderboard.map((u, i) => (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < leaderboard.length - 1 ? `1px solid ${theme.border}` : 'none' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: i === 0 ? theme.orange : i === 1 ? '#A0A0A0' : i === 2 ? '#CD7F32' : theme.border, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: i < 3 ? '#fff' : theme.textSecondary, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <Icons.User size={14} color={theme.textSecondary} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: u.id === user?.id ? 700 : 500, color: u.id === user?.id ? theme.orange : theme.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {u.name} {u.id === user?.id ? '(moi)' : ''}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: u.id === user?.id ? theme.orange : theme.text, flexShrink: 0 }}>{u.points} pts</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminScreen({ onWordAdded }) {
  const [newWord, setNewWord] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const addWord = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await apiFetch('/api/collect/words', { method: 'POST', body: { word: newWord.trim() } });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message || d.errors?.word?.[0] || 'Erreur');
      setSuccess(`« ${d.word.word} » ajouté !`);
      setNewWord('');
      if (onWordAdded) onWordAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
        <Icons.Crown size={18} />
        <h2 style={{ fontSize: 18, fontWeight: 700, color: theme.text, margin: 0 }}>Administration</h2>
      </div>

      <div style={{ background: theme.card, borderRadius: 16, padding: 20, boxShadow: `0 2px 20px ${theme.shadow}` }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: theme.text, margin: '0 0 4px' }}>Ajouter un mot</h3>
        <p style={{ fontSize: 12, color: theme.textSecondary, margin: '0 0 14px' }}>
          Les nouveaux mots seront disponibles pour la collecte.
        </p>

        <form onSubmit={addWord}>
          {error && (
            <div style={{ background: theme.orangeLight, color: theme.orange, fontSize: 12, fontWeight: 500, padding: '8px 12px', borderRadius: theme.radiusSm, marginBottom: 10, textAlign: 'center' }}>{error}</div>
          )}
          {success && (
            <div style={{ background: theme.greenLight, color: theme.green, fontSize: 12, fontWeight: 500, padding: '8px 12px', borderRadius: theme.radiusSm, marginBottom: 10, textAlign: 'center' }}>{success}</div>
          )}
          <input type="text" value={newWord} onChange={e => setNewWord(e.target.value)}
            placeholder="Nom du mot ou produit" required style={inputStyle} />
          <button type="submit" disabled={loading || !newWord.trim()} style={{
            marginTop: 10, border: 'none', padding: '12px 0', borderRadius: 12, width: '100%',
            background: `linear-gradient(135deg, ${theme.orange}, ${theme.orangeDark})`,
            color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            opacity: loading || !newWord.trim() ? 0.6 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            {loading ? 'Ajout…' : <><Icons.Plus size={16} />Ajouter le mot</>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const { user, authLoading } = useAuth();
  const [words, setWords] = useState([]);
  const [doneWords, setDoneWords] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [tab, setTab] = useState('record');
  const [authScreen, setAuthScreen] = useState('login');

  const fetchWords = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(`${API}/api/collect/words`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const d = await res.json();
      setWords(d.words);
      const firstUndone = d.words.findIndex(w => !w.done);
      setIndex(firstUndone >= 0 ? firstUndone : d.words.length);
    } catch (e) {
      setFetchError(`Impossible de joindre le serveur (${e.message}).`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWords(); }, [fetchWords]);

  useEffect(() => {
    if (['admin', 'profile'].includes(tab) && !user) setTab('record');
  }, [tab, user]);

  const handleDone = useCallback(() => {
    setDoneWords(prev => [...prev, words[index].word]);
    const next = index + 1;
    if (next < words.length && !words[next].done) {
      setIndex(next);
    } else {
      const nextUndone = words.findIndex((w, i) => i > index && !w.done);
      setIndex(nextUndone >= 0 ? nextUndone : words.length);
    }
    fetchWords();
  }, [index, words, fetchWords]);

  const undoneWords = words.filter(w => !w.done);
  const currentWord = words[index];
  const currentProgress = words.filter(w => w.count > 0).length;

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', background: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icons.Wave size={40} />
      </div>
    );
  }

  if (!user) {
    if (authScreen === 'register') return <RegisterScreen onToggle={() => setAuthScreen('login')} />;
    return <LoginScreen onToggle={() => setAuthScreen('register')} />;
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Icons.Wave size={40} />
          <h1 style={{ fontSize: 20, fontWeight: 700, color: theme.text, margin: '12px 0 4px' }}>Tékré</h1>
          <p style={{ fontSize: 13, color: theme.textSecondary, margin: '0 0 20px' }}>Collecte audio</p>
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: theme.orange, animation: 'pulse 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div style={{ minHeight: '100vh', background: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke={theme.red} strokeWidth="1.8" opacity="0.5"/>
            <line x1="12" y1="8" x2="12" y2="13" stroke={theme.red} strokeWidth="1.8" strokeLinecap="round"/>
            <circle cx="12" cy="16" r="1" fill={theme.red}/>
          </svg>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: theme.text, margin: '14px 0 6px' }}>Connexion impossible</h2>
          <p style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.4, margin: '0 auto 20px', maxWidth: 260 }}>{fetchError}</p>
          <button onClick={fetchWords} style={{
            border: 'none', padding: '12px 28px', borderRadius: 12,
            background: `linear-gradient(135deg, ${theme.orange}, ${theme.orangeDark})`,
            color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
          }}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (tab === 'stats') {
    return (
      <div style={{ height: '100vh', background: theme.bg, padding: '20px 16px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <StatsScreen words={words} />
        </div>
        <TabBar active={tab} onChange={setTab} isAdmin={user?.role === 'admin'} />
      </div>
    );
  }

  if (tab === 'profile') {
    return (
      <div style={{ height: '100vh', background: theme.bg, padding: '20px 16px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <ProfileScreen />
        </div>
        <TabBar active={tab} onChange={setTab} isAdmin={user?.role === 'admin'} />
      </div>
    );
  }

  if (tab === 'admin' && user?.role === 'admin') {
    return (
      <div style={{ height: '100vh', background: theme.bg, padding: '20px 16px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <AdminScreen onWordAdded={fetchWords} />
        </div>
        <TabBar active={tab} onChange={setTab} isAdmin={true} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, padding: '0 16px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ paddingTop: 20, paddingBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${theme.orange}, ${theme.orangeDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icons.Mic size={18} color="#fff" />
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: theme.text }}>Tékré</span>
          </div>
          <div style={{ background: theme.card, borderRadius: 8, padding: '3px 10px 3px 6px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icons.Sparkle />
            <span style={{ fontSize: 11, fontWeight: 700, color: theme.orange }}>{currentProgress}/{words.length}</span>
          </div>
        </div>

        <div style={{ background: theme.card, borderRadius: 16, padding: '14px 16px', boxShadow: `0 2px 20px ${theme.shadow}`, display: 'flex', alignItems: 'center', gap: 16 }}>
          <CircularProgress current={currentProgress} total={words.length} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 2 }}>
              {undoneWords.length > 0 ? `Il reste ${undoneWords.length} mot${undoneWords.length > 1 ? 's' : ''}` : 'Mission accomplie !'}
            </div>
            <div style={{ fontSize: 12, color: theme.textSecondary, lineHeight: 1.3 }}>
              {undoneWords.length > 0 ? 'Continue à enregistrer.' : 'Tous les mots ont assez d\'échantillons. Merci !'}
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '6px 0' }}>
        {currentWord && !currentWord.done ? (
          <WordCard key={currentWord.word + doneWords.length} word={currentWord}
            current={doneWords.length + 1} total={words.length} onDone={handleDone} />
        ) : (
          <div style={{ background: theme.card, borderRadius: 16, padding: '32px 20px', textAlign: 'center', boxShadow: `0 2px 20px ${theme.shadow}` }}>
            <Icons.Trophy size={48} />
            <h2 style={{ fontSize: 20, fontWeight: 700, color: theme.text, margin: '14px 0 6px' }}>Mission accomplie !</h2>
            <p style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.4, margin: '0 auto 16px', maxWidth: 260 }}>
              Tous les mots ont été enregistrés.
            </p>
            <button onClick={fetchWords} style={{
              border: 'none', padding: '12px 28px', borderRadius: 12,
              background: `linear-gradient(135deg, ${theme.orange}, ${theme.orangeDark})`,
              color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
            }}>
              Vérifier à nouveau
            </button>
          </div>
        )}
      </div>

      <TabBar active={tab} onChange={setTab} isAdmin={user?.role === 'admin'} />
    </div>
  );
}

export { AuthProvider };
