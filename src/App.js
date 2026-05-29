import { useState, useRef, useCallback, useEffect } from 'react';

const API = process.env.REACT_APP_API_URL || '';

// Inject keyframe animations
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
    }
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

// SVG Icons
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
};

function CircularProgress({ current, total }) {
  const radius = 36;
  const stroke = 5;
  const normalizedRadius = radius - stroke / 2;
  const circum = 2 * Math.PI * normalizedRadius;
  const pct = total > 0 ? current / total : 0;
  const offset = circum - pct * circum;

  return (
    <div style={{ position: 'relative', width: 88, height: 88 }}>
      <svg width={88} height={88}>
        <circle
          cx="44" cy="44" r={normalizedRadius}
          fill="none" stroke={theme.border} strokeWidth={stroke}
        />
        <circle
          cx="44" cy="44" r={normalizedRadius}
          fill="none" stroke={theme.orange} strokeWidth={stroke}
          strokeDasharray={circum}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 44 44)"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: theme.text, lineHeight: 1 }}>
          {Math.round(pct * 100)}
        </span>
        <span style={{ fontSize: 10, fontWeight: 600, color: theme.textSecondary }}>
          %
        </span>
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
  const animRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const uploadAudio = useCallback(async (blob) => {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('word', word.word);
      fd.append('audio', blob, `${word.word.replace(/\s+/g, '_')}.webm`);
      const res = await fetch(`${API}/api/collect/submit`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error(await res.text());
      setDoneAnim(true);
      setTimeout(() => { setDoneAnim(false); onDone(); }, 800);
    } catch (_) {
      setError('Erreur lors de l\'envoi. Vérifie ta connexion.');
    } finally {
      setUploading(false);
    }
  }, [word.word, onDone]);

  const stopRecording = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCountdown(null);
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
    }
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
      timerRef.current = setInterval(() => {
        elapsed++;
        setCountdown(10 - elapsed);
        if (elapsed >= 10) stopRecording();
      }, 1000);

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
      setError('Accès au micro refusé. Autorise-le dans ton navigateur.');
    }
  }, [uploadAudio, stopRecording]);

  if (doneAnim) {
    return (
      <div style={cardStyles.container}>
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <Icons.Check size={56} />
          <div style={{ fontSize: 18, fontWeight: 700, color: theme.green, marginTop: 12 }}>
            Enregistré !
          </div>
        </div>
      </div>
    );
  }

  const barHeights = [14, 22, 30, 22, 36, 22, 30, 22, 14];

  return (
    <div style={cardStyles.container}>
      {/* Word section */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={cardStyles.label}>PRONONCE CE MOT</div>
        <div style={cardStyles.word}>{word.word}</div>
        <div style={cardStyles.count}>
          <span style={{ color: theme.orange }}>●</span>
          {' '}{word.count} enregistrement{word.count > 1 ? 's' : ''}
        </div>
      </div>

      {error && <div style={cardStyles.error}>{error}</div>}

      {/* Controls */}
      <div style={cardStyles.controls}>
        {!recording ? (
          <button
            onClick={startRecording}
            disabled={uploading}
            style={cardStyles.recordBtn}
          >
            {uploading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={cardStyles.spinner} />
                Envoi en cours…
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icons.Mic size={22} />
                Enregistrer
              </span>
            )}
          </button>
        ) : (
          <div style={cardStyles.recordingBox}>
            <div style={cardStyles.waveBox}>
              {barHeights.map((h, i) => (
                <div
                  key={i}
                  style={{
                    ...cardStyles.bar,
                    height: h,
                    animationDelay: `${i * 0.1}s`,
                    opacity: 0.3 + (i % 3) * 0.35,
                  }}
                />
              ))}
            </div>
            <button onClick={stopRecording} style={cardStyles.stopBtn}>
              <Icons.Stop size={18} />
              Arrêter
            </button>
            {countdown !== null && (
              <div style={cardStyles.countdown}>
                <span style={{ fontWeight: 700, color: theme.orange }}>{countdown}</span>s restantes
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const cardStyles = {
  container: {
    background: theme.card,
    borderRadius: 20,
    padding: '28px 24px',
    boxShadow: `0 2px 20px ${theme.shadow}`,
  },
  label: {
    fontSize: 11,
    fontWeight: 700,
    color: theme.textTertiary,
    letterSpacing: '0.08em',
    marginBottom: 10,
  },
  word: {
    fontSize: 26,
    fontWeight: 700,
    color: theme.text,
    lineHeight: 1.3,
    marginBottom: 8,
  },
  count: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  error: {
    background: theme.orangeLight,
    color: theme.orange,
    fontSize: 13,
    fontWeight: 500,
    padding: '10px 14px',
    borderRadius: theme.radiusSm,
    marginBottom: 18,
    textAlign: 'center',
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
  },
  recordBtn: {
    border: 'none',
    padding: '16px 0',
    borderRadius: 14,
    background: `linear-gradient(135deg, ${theme.orange}, ${theme.orangeDark})`,
    color: '#fff',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    width: '100%',
    boxShadow: `0 4px 16px ${theme.orange + '55'}`,
    transition: 'transform 0.15s',
  },
  spinner: {
    width: 18,
    height: 18,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  recordingBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 14,
    width: '100%',
  },
  waveBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 40,
  },
  bar: {
    width: 4,
    borderRadius: 2,
    background: theme.orange,
    animation: 'barWave 0.7s ease-in-out infinite alternate',
  },
  stopBtn: {
    border: 'none',
    padding: '14px 0',
    borderRadius: 14,
    background: theme.red,
    color: '#fff',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: `0 4px 16px ${theme.red + '44'}`,
  },
  countdown: {
    fontSize: 13,
    color: theme.textSecondary,
    fontWeight: 500,
  },
};

function TabBar({ active, onChange }) {
  const tabs = [
    { key: 'record', icon: Icons.Home, label: 'Collecte' },
    { key: 'stats', icon: Icons.Stats, label: 'Progrès' },
    { key: 'settings', icon: Icons.Settings, label: 'Réglages' },
  ];

  return (
    <div style={tabStyles.bar}>
      {tabs.map(t => {
        const isActive = active === t.key;
        const Icon = t.icon;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            style={tabStyles.tab}
          >
            <Icon active={isActive} />
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              color: isActive ? theme.orange : theme.textTertiary,
              marginTop: 4,
            }}>
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
  bar: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    background: theme.card,
    borderRadius: 20,
    padding: '6px 8px',
    marginTop: 12,
    marginBottom: 8,
    boxShadow: `0 -2px 20px ${theme.shadow}`,
  },
  tab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    padding: '8px 16px',
    position: 'relative',
    flex: 1,
  },
  indicator: {
    position: 'absolute',
    bottom: -2,
    width: 20,
    height: 3,
    borderRadius: 2,
    background: theme.orange,
  },
};

function StatsScreen({ doneWords, words, onBack }) {
  const totalDone = words.reduce((s, w) => s + w.count, 0);
  const wordsWithMin = words.filter(w => w.done).length;
  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={onBack} style={backBtn}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5m0 0l6-6m-6 6l6 6" stroke={theme.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span style={{ fontSize: 20, fontWeight: 700, color: theme.text }}>Progrès</span>
      </div>

      <div style={{
        background: theme.card, borderRadius: 20, padding: 24,
        boxShadow: `0 2px 20px ${theme.shadow}`, marginBottom: 16
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: theme.orange }}>{totalDone}</div>
            <div style={{ fontSize: 12, color: theme.textSecondary, fontWeight: 500 }}>Enregistrements</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: theme.green }}>{wordsWithMin}</div>
            <div style={{ fontSize: 12, color: theme.textSecondary, fontWeight: 500 }}>Mots complétés</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: theme.text }}>{words.length}</div>
            <div style={{ fontSize: 12, color: theme.textSecondary, fontWeight: 500 }}>Mots total</div>
          </div>
        </div>
      </div>

      <div style={{
        background: theme.card, borderRadius: 20, padding: 20,
        boxShadow: `0 2px 20px ${theme.shadow}`,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: theme.textSecondary, letterSpacing: '0.05em', marginBottom: 14 }}>
          DÉTAIL PAR MOT
        </div>
        {words.map(w => (
          <div key={w.word} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
            borderBottom: '1px solid ' + theme.border,
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: w.done ? theme.greenLight : theme.orangeLight,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12,
            }}>
              {w.done ? <Icons.Check size={14} /> : <span style={{ color: theme.orange }}>{w.count}</span>}
            </div>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: theme.text }}>
              {w.word}
            </span>
            <div style={{
              width: 60, height: 4, borderRadius: 2,
              background: theme.border, overflow: 'hidden',
            }}>
              <div style={{
                width: `${Math.min(100, (w.count / 15) * 100)}%`,
                height: '100%',
                borderRadius: 2,
                background: w.done ? theme.green : theme.orange,
                transition: 'width 0.5s ease',
              }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: w.done ? theme.green : theme.textSecondary, minWidth: 32, textAlign: 'right' }}>
              {w.count}/15
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const backBtn = {
  border: 'none', background: theme.card, cursor: 'pointer',
  width: 40, height: 40, borderRadius: 12,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: `0 2px 10px ${theme.shadow}`,
};

export default function App() {
  const [words, setWords] = useState([]);
  const [doneWords, setDoneWords] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [tab, setTab] = useState('record');

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

  const handleDone = useCallback(() => {
    setDoneWords(prev => [...prev, words[index].word]);
    const next = index + 1;
    if (next < words.length && !words[next].done) {
      setIndex(next);
    } else {
      const nextUndone = words.findIndex((w, i) => i > index && !w.done);
      setIndex(nextUndone >= 0 ? nextUndone : words.length);
    }
  }, [index, words]);

  const undoneWords = words.filter(w => !w.done);
  const currentWord = words[index];
  const currentProgress = words.filter(w => w.count > 0).length;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Icons.Wave size={48} />
          <h1 style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: '16px 0 4px' }}>
            Tékré
          </h1>
          <p style={{ fontSize: 14, color: theme.textSecondary, margin: '0 0 24px' }}>
            Collecte audio
          </p>
          <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: '50%',
                background: theme.orange,
                animation: 'pulse 1.2s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
              }} />
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
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke={theme.red} strokeWidth="1.8" opacity="0.5"/>
            <line x1="12" y1="8" x2="12" y2="13" stroke={theme.red} strokeWidth="1.8" strokeLinecap="round"/>
            <circle cx="12" cy="16" r="1" fill={theme.red}/>
          </svg>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: theme.text, margin: '16px 0 8px' }}>
            Connexion impossible
          </h2>
          <p style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 1.5, margin: '0 auto 24px', maxWidth: 280 }}>
            {fetchError}
          </p>
          <p style={{ fontSize: 12, color: theme.textTertiary, margin: '0 0 16px' }}>
            Assure-toi que <code style={{ background: theme.border, padding: '2px 6px', borderRadius: 4 }}>php artisan serve</code> tourne sur le port 8000
          </p>
          <button onClick={fetchWords} style={{
            border: 'none', padding: '14px 32px', borderRadius: 14,
            background: `linear-gradient(135deg, ${theme.orange}, ${theme.orangeDark})`,
            color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer',
            boxShadow: `0 4px 16px ${theme.orange + '55'}`,
          }}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (tab === 'stats') {
    return (
      <div style={{ minHeight: '100vh', background: theme.bg, padding: '0 16px' }}>
        <StatsScreen words={words} doneWords={doneWords} onBack={() => setTab('record')} />
        <TabBar active={tab} onChange={setTab} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, padding: '0 16px', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ paddingTop: 24, paddingBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, ${theme.orange}, ${theme.orangeDark})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icons.Mic size={18} color="#fff" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, color: theme.text }}>Tékré</span>
          </div>
          <div style={{
            background: theme.card, borderRadius: 10, padding: '4px 12px 4px 8px',
            display: 'flex', alignItems: 'center', gap: 5,
            boxShadow: `0 2px 8px ${theme.shadow}`,
          }}>
            <Icons.Sparkle />
            <span style={{ fontSize: 12, fontWeight: 700, color: theme.orange }}>
              {currentProgress}/{words.length}
            </span>
          </div>
        </div>

        {/* Progress + stats row */}
        <div style={{
          background: theme.card, borderRadius: 20, padding: '16px 20px',
          boxShadow: `0 2px 20px ${theme.shadow}`,
          display: 'flex', alignItems: 'center', gap: 20,
        }}>
          <CircularProgress current={currentProgress} total={words.length} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 4 }}>
              {undoneWords.length > 0
                ? `Il reste ${undoneWords.length} mot${undoneWords.length > 1 ? 's' : ''}`
                : 'Mission accomplie !'}
            </div>
            <div style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.4 }}>
              {undoneWords.length > 0
                ? `Continue à enregistrer pour améliorer la reconnaissance vocale.`
                : 'Tous les mots ont assez d\'échantillons. Merci !'}
            </div>
          </div>
        </div>
      </div>

      {/* Main card */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '8px 0' }}>
        {currentWord && !currentWord.done ? (
          <WordCard
            key={currentWord.word + doneWords.length}
            word={currentWord}
            current={doneWords.length + 1}
            total={words.length}
            onDone={handleDone}
          />
        ) : (
          <div style={{
            background: theme.card, borderRadius: 20, padding: '40px 24px',
            textAlign: 'center', boxShadow: `0 2px 20px ${theme.shadow}`,
          }}>
            <Icons.Trophy size={56} />
            <h2 style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: '16px 0 8px' }}>
              Mission accomplie !
            </h2>
            <p style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 1.5, margin: '0 auto 20px', maxWidth: 280 }}>
              Tous les mots ont été enregistrés.{' '}
              {doneWords.length > 0 && `Tu as contribué avec ${doneWords.length} mot${doneWords.length > 1 ? 's' : ''} dans cette session.`}
            </p>
            <button onClick={fetchWords} style={{
              border: 'none', padding: '14px 32px', borderRadius: 14,
              background: `linear-gradient(135deg, ${theme.orange}, ${theme.orangeDark})`,
              color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer',
              boxShadow: `0 4px 16px ${theme.orange + '55'}`,
            }}>
              Vérifier à nouveau
            </button>
          </div>
        )}
      </div>

      {/* Tab bar */}
      <TabBar active={tab} onChange={setTab} />
    </div>
  );
}
