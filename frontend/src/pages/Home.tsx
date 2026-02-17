import React, { useEffect, useRef, useState, useCallback } from "react";
import { FiBriefcase, FiLink } from "react-icons/fi";
import { FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";
import { SiLinktree } from "react-icons/si";
import {
  LuBuilding2, LuUsers, LuCode, LuMessageSquare,
  LuFileText, LuCircleCheck, LuArrowRight, LuStar,
} from "react-icons/lu";
import { Link } from "react-router-dom";
import { FaDiscord } from "react-icons/fa6";
import "../styles/Animations.css";

const OpportuneLogo = "/assets/OpportuneLogo.png";

/* ═══ Scroll-reveal hook ═══ */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ═══ Animated counter hook ═══ */
function useCounter(target: number, duration = 1600, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0; const step = target / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(id); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [active, target, duration]);
  return val;
}

/* ═══ Typewriter hook — cycles through phrases ═══ */
function useTypewriter(phrases: string[], speed = 60, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause);
        } else setCharIdx(c => c + 1);
      } else {
        setDisplay(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setPhraseIdx(i => (i + 1) % phrases.length);
          setCharIdx(0);
        } else setCharIdx(c => c - 1);
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, phraseIdx, phrases, speed, pause]);

  return display;
}

/* ═══ UCSD Trident SVG ═══ */
const TridentSVG: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <rect x="36" y="30" width="8"  height="80" rx="3" fill="currentColor" />
    <rect x="14" y="18" width="7"  height="50" rx="3" fill="currentColor" />
    <rect x="59" y="18" width="7"  height="50" rx="3" fill="currentColor" />
    <polygon points="40,0 34,22 46,22" fill="currentColor" />
    <polygon points="17.5,0 11,15 24,15" fill="currentColor" />
    <polygon points="62.5,0 56,15 69,15" fill="currentColor" />
    <rect x="12" y="60" width="56" height="7" rx="3.5" fill="currentColor" />
  </svg>
);

/* ═══ Orbiting Dot ═══ */
const OrbitDot: React.FC<{ r: number; size: number; color: string; duration: number; delay?: number; ccw?: boolean }> = ({ r, size, color, duration, delay = 0, ccw }) => (
  <div
    className="absolute top-1/2 left-1/2"
    style={{
      width: size, height: size, marginTop: -size / 2, marginLeft: -size / 2,
      animation: `${ccw ? "orbitCCW" : "orbit"} ${duration}s linear ${delay}s infinite`,
      ["--orbit-r" as string]: `${r}px`,
    }}
  >
    <div className="w-full h-full rounded-full" style={{ background: color }} />
  </div>
);

/* ═══ Floating Particle ═══ */
const Particle: React.FC<{ x: number; color: string; size: number; dur: number; delay: number; variant: 1 | 2 | 3 }> = ({ x, color, size, dur, delay, variant }) => (
  <div
    className={`absolute bottom-0 rounded-full particle-${variant}`}
    style={{
      left: x, width: size, height: size, background: color, opacity: 0,
      ["--dur" as string]: `${dur}s`, ["--delay" as string]: `${delay}s`,
    }}
  />
);

/* ═══ Stat item with animated counter ═══ */
const StatItem: React.FC<{ value: number; suffix: string; label: string; active: boolean; delay: number }> = ({ value, suffix, label, active, delay }) => {
  const [go, setGo] = useState(false);
  useEffect(() => { if (active) { const t = setTimeout(() => setGo(true), delay); return () => clearTimeout(t); } }, [active, delay]);
  const count = useCounter(value, 1400, go);
  return (
    <div className="text-center stat-item pb-3">
      <div className="text-3xl font-bold stat-shimmer">{go ? count.toLocaleString() : 0}{suffix}</div>
      <div className="text-[#6b7280] text-sm mt-2">{label}</div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════ */
const Home: React.FC = () => {
  const featuresRef  = useInView();
  const ctaRef       = useInView();
  const statsRef     = useInView();
  const marqueeRef   = useInView(0.05);

  const typed = useTypewriter(
    ["Dream Internships", "Tech Careers", "Alumni Connections", "Interview Success", "Your Future"],
    65, 1800
  );

  const features = [
    { icon: <LuBuilding2 className="w-7 h-7" />, title: "Companies Directory", description: "Browse top tech companies like Google, Meta, Apple, and more. Get insider insights and company-specific preparation tips.", accent: "#5b8ef4", gradientFrom: "rgba(91,142,244,0.15)", gradientTo: "rgba(91,142,244,0.03)", border: "rgba(91,142,244,0.25)", glow: "rgba(91,142,244,0.15)" },
    { icon: <LuUsers className="w-7 h-7" />, title: "Alumni Network", description: "Connect with UCSD alumni working at your dream companies. Get mentorship and referrals from industry professionals.", accent: "#7c3aed", gradientFrom: "rgba(124,58,237,0.15)", gradientTo: "rgba(124,58,237,0.03)", border: "rgba(124,58,237,0.25)", glow: "rgba(124,58,237,0.15)" },
    { icon: <LuCode className="w-7 h-7" />, title: "LeetCode Practice", description: "Access curated coding problems from real interviews. Practice with company-specific question sets and difficulty levels.", accent: "#10b981", gradientFrom: "rgba(16,185,129,0.15)", gradientTo: "rgba(16,185,129,0.03)", border: "rgba(16,185,129,0.25)", glow: "rgba(16,185,129,0.12)" },
    { icon: <LuMessageSquare className="w-7 h-7" />, title: "Interview Prep", description: "Get ready with behavioral questions, technical challenges, and real interview experiences from fellow students.", accent: "#f59e0b", gradientFrom: "rgba(245,158,11,0.15)", gradientTo: "rgba(245,158,11,0.03)", border: "rgba(245,158,11,0.25)", glow: "rgba(245,158,11,0.12)" },
    { icon: <LuFileText className="w-7 h-7" />, title: "Application Tracking", description: "Keep track of all your applications, deadlines, and interview stages in one organized dashboard.", accent: "#ec4899", gradientFrom: "rgba(236,72,153,0.15)", gradientTo: "rgba(236,72,153,0.03)", border: "rgba(236,72,153,0.25)", glow: "rgba(236,72,153,0.12)" },
  ];

  const marqueeItems = [
    "Google", "Meta", "Apple", "Amazon", "Microsoft", "Nvidia", "OpenAI",
    "Stripe", "Figma", "Airbnb", "Uber", "LinkedIn", "Salesforce", "Palantir",
  ];

  return (
    <div className="h-screen overflow-auto" style={{ background: "linear-gradient(160deg, #0a0e1a 0%, #0f1419 40%, #141b2e 100%)" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        /* ── Typewriter cursor ── */
        .type-cursor { display: inline-block; width: 3px; background: #FFCD00; margin-left: 3px; border-radius: 1px; animation: cursorBlink 0.75s step-end infinite; }
        @keyframes cursorBlink { 0%,100%{opacity:1;} 50%{opacity:0;} }

        /* ── Shimmer stat text ── */
        @keyframes shimmerText { 0%{background-position:-200% center;} 100%{background-position:200% center;} }
        .stat-shimmer { background: linear-gradient(90deg,#5b8ef4 0%,#FFCD00 35%,#a78bfa 65%,#5b8ef4 100%); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmerText 3s linear infinite; }

        /* ── Stat underline ── */
        .stat-item { position:relative; }
        .stat-item::after { content:''; position:absolute; bottom:-8px; left:50%; transform:translateX(-50%); width:24px; height:2px; background:linear-gradient(90deg,#FFCD00,#f59e0b); border-radius:2px; }

        /* ── Pulse dot ── */
        @keyframes pulseDot { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0.5);} 50%{box-shadow:0 0 0 6px rgba(16,185,129,0);} }
        .pulse-dot { animation: pulseDot 2s ease-in-out infinite; }

        /* ── Scroll reveal ── */
        .reveal { opacity:0; transform:translateY(24px); transition:opacity .65s ease,transform .65s ease; }
        .reveal.visible { opacity:1; transform:translateY(0); }
        .reveal-d1{transition-delay:.08s;} .reveal-d2{transition-delay:.16s;}
        .reveal-d3{transition-delay:.24s;} .reveal-d4{transition-delay:.32s;}
        .reveal-d5{transition-delay:.40s;} .reveal-d6{transition-delay:.50s;}

        /* ── Feature card ── */
        .feature-card { transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease; }
        .feature-card:hover { transform:translateY(-7px); }

        /* ── Orbit keyframes ── */
        @keyframes orbit { from{transform:rotate(0deg) translateX(var(--orbit-r)) rotate(0deg);} to{transform:rotate(360deg) translateX(var(--orbit-r)) rotate(-360deg);} }
        @keyframes orbitCCW { from{transform:rotate(0deg) translateX(var(--orbit-r)) rotate(0deg);} to{transform:rotate(-360deg) translateX(var(--orbit-r)) rotate(360deg);} }

        /* ── Particle drift ── */
        @keyframes particleDrift1 { 0%{transform:translate(0,0) scale(1);opacity:.7;} 100%{transform:translate(15px,-130px) scale(0);opacity:0;} }
        @keyframes particleDrift2 { 0%{transform:translate(0,0) scale(1);opacity:.6;} 100%{transform:translate(-20px,-110px) scale(0);opacity:0;} }
        @keyframes particleDrift3 { 0%{transform:translate(0,0) scale(.8);opacity:.8;} 100%{transform:translate(25px,-120px) scale(0);opacity:0;} }
        .particle-1{animation:particleDrift1 var(--dur,3s) ease-out var(--delay,0s) infinite;}
        .particle-2{animation:particleDrift2 var(--dur,4s) ease-out var(--delay,0.5s) infinite;}
        .particle-3{animation:particleDrift3 var(--dur,3.5s) ease-out var(--delay,1s) infinite;}

        /* ── Marquee ── */
        @keyframes marquee { from{transform:translateX(0);} to{transform:translateX(-50%);} }
        .marquee-inner { display:flex; animation:marquee 22s linear infinite; white-space:nowrap; }
        .marquee-wrap { overflow:hidden; mask-image:linear-gradient(to right,transparent,black 10%,black 90%,transparent); -webkit-mask-image:linear-gradient(to right,transparent,black 10%,black 90%,transparent); }

        /* ── Button glow ── */
        .btn-primary:hover { box-shadow:0 6px 30px rgba(91,142,244,0.55) !important; }

        /* ── CTA grid texture ── */
        .cta-grid { background-image:linear-gradient(rgba(255,205,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,205,0,0.03) 1px,transparent 1px); background-size:44px 44px; }

        /* ── Wave bars ── */
        @keyframes wave { 0%,100%{transform:scaleY(1);} 25%{transform:scaleY(1.5);} 75%{transform:scaleY(0.6);} }
        .wave-bar { display:inline-block; width:4px; border-radius:2px; background:linear-gradient(to top,#5b8ef4,#FFCD00); }
        .wave-bar:nth-child(1){animation:wave 1.1s ease-in-out infinite 0.0s;}
        .wave-bar:nth-child(2){animation:wave 1.1s ease-in-out infinite 0.15s;}
        .wave-bar:nth-child(3){animation:wave 1.1s ease-in-out infinite 0.30s;}
        .wave-bar:nth-child(4){animation:wave 1.1s ease-in-out infinite 0.45s;}
        .wave-bar:nth-child(5){animation:wave 1.1s ease-in-out infinite 0.60s;}

        /* ── Morph blob ── */
        @keyframes morphBlob { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%;} 25%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%;} 50%{border-radius:50% 60% 30% 60%/30% 40% 70% 50%;} 75%{border-radius:40% 50% 60% 30%/70% 30% 50% 60%;} }
        .morph-blob { animation:morphBlob 8s ease-in-out infinite; filter:blur(50px); }

        /* ── Trident animations ── */
        @keyframes tridentFloat { 0%,100%{transform:translateY(0) rotate(-8deg);opacity:.13;} 50%{transform:translateY(-18px) rotate(-8deg);opacity:.22;} }
        @keyframes tridentFloatR { 0%,100%{transform:translateY(0) rotate(12deg);opacity:.09;} 50%{transform:translateY(-14px) rotate(12deg);opacity:.16;} }
        @keyframes tridentDrift { 0%,100%{transform:translateY(0) rotate(0deg);opacity:.10;} 33%{transform:translateY(-10px) rotate(3deg);opacity:.18;} 66%{transform:translateY(6px) rotate(-2deg);opacity:.12;} }
        @keyframes tridentGlow { 0%,100%{filter:drop-shadow(0 0 6px rgba(255,205,0,.3));opacity:.12;} 50%{filter:drop-shadow(0 0 14px rgba(255,205,0,.6));opacity:.22;} }
        .trident-float    { animation:tridentFloat 7s ease-in-out infinite; }
        .trident-float-r  { animation:tridentFloatR 9s ease-in-out infinite; }
        .trident-drift    { animation:tridentDrift 11s ease-in-out infinite; }
        .trident-glow     { animation:tridentGlow 4s ease-in-out infinite; }
        .trident-gold     { color:#FFCD00; }
        .trident-gold-dim { color:#c9a200; }
      `}} />

      {/* ═══ AMBIENT LAYER ═══ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Mesh gradients */}
        <div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(ellipse 80% 60% at 20% 10%, rgba(91,142,244,0.11) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 80%, rgba(124,58,237,0.09) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,205,0,0.04) 0%, transparent 70%)" }} />

        {/* Morphing gold blobs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 morph-blob" style={{ background: "rgba(255,205,0,0.06)" }} />
        <div className="absolute bottom-1/3 right-1/4 w-56 h-56 morph-blob" style={{ background: "rgba(91,142,244,0.07)", animationDelay: "-4s" }} />

        {/* Floating tridents */}
        <TridentSVG className="absolute trident-gold trident-float"   style={{ width:90, height:120, top:"12%", left:"6%" }} />
        <TridentSVG className="absolute trident-gold trident-float-r"  style={{ width:60, height:80,  top:"55%", right:"5%" }} />
        <TridentSVG className="absolute trident-gold-dim trident-drift" style={{ width:44, height:58,  bottom:"22%", left:"14%" }} />
        <TridentSVG className="absolute trident-gold trident-glow"     style={{ width:34, height:46,  top:"30%", right:"17%" }} />

        {/* Soft orbs */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-3xl animate-float"         style={{ background: "radial-gradient(circle,rgba(91,142,244,.09),transparent 70%)" }} />
        <div className="absolute top-1/2 -left-48 w-[400px] h-[400px] rounded-full blur-3xl animate-float delay-300" style={{ background: "radial-gradient(circle,rgba(124,58,237,.08),transparent 70%)" }} />
        <div className="absolute -bottom-32 right-1/3 w-80 h-80 rounded-full blur-3xl animate-float delay-500"       style={{ background: "radial-gradient(circle,rgba(255,205,0,.05),transparent 70%)" }} />
      </div>

      {/* ═══ HERO ═══ */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 animate-fadeIn">

        {/* Orbiting decoration — top right */}
        <div className="absolute top-10 right-16 w-28 h-28 pointer-events-none hidden lg:block">
          <OrbitDot r={52} size={6}  color="#5b8ef4" duration={4} />
          <OrbitDot r={52} size={4}  color="#FFCD00" duration={7} delay={2} />
          <OrbitDot r={36} size={5}  color="#7c3aed" duration={5} delay={1} ccw />
          <div className="absolute inset-0 flex items-center justify-center">
            <LuStar className="text-[#FFCD00]/30 w-5 h-5" />
          </div>
        </div>

        {/* Orbiting decoration — bottom left */}
        <div className="absolute bottom-16 left-10 w-20 h-20 pointer-events-none hidden lg:block">
          <OrbitDot r={38} size={5} color="#10b981" duration={6} />
          <OrbitDot r={38} size={3} color="#FFCD00" duration={9} delay={3} ccw />
        </div>

        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-[#2d3748] bg-[#1e2433]/80 text-[#9ca3af] backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-[#10b981] pulse-dot" />
            Trusted by UCSD Students
            {/* Wave bars accent */}
            <span className="flex items-end gap-0.5 h-4 ml-1">
              <span className="wave-bar" style={{ height:"6px" }} />
              <span className="wave-bar" style={{ height:"10px" }} />
              <span className="wave-bar" style={{ height:"8px" }} />
              <span className="wave-bar" style={{ height:"12px" }} />
              <span className="wave-bar" style={{ height:"7px" }} />
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-[#e8eaed] mb-4 leading-tight animate-slideUp">
            Your Gateway to
          </h1>

          {/* Typewriter line */}
          <div className="flex items-center justify-center gap-2 mb-8 animate-slideUp delay-100" style={{ minHeight: "1.2em" }}>
            <span className="text-4xl md:text-6xl font-bold" style={{ background:"linear-gradient(135deg,#5b8ef4,#FFCD00,#7c3aed)", backgroundSize:"200%", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              {typed}
            </span>
            <span className="type-cursor" style={{ height: "3.5rem", verticalAlign: "middle" }} />
          </div>

          <p className="text-lg text-[#9ca3af] mb-10 max-w-2xl mx-auto leading-relaxed animate-slideUp delay-200">
            Connect with UCSD alumni, practice coding interviews, and land internships at top tech companies. Everything you need for your career journey, all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 items-center justify-center animate-slideUp delay-200">
            <Link to="/companies" className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5"
              style={{ background:"linear-gradient(135deg,#5b8ef4,#7c3aed)", boxShadow:"0 4px 20px rgba(91,142,244,0.35)" }}>
              Browse Companies <FiBriefcase className="w-4 h-4" />
            </Link>
            <Link to="/connect" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-[#e8eaed] border border-[#2d3748] bg-[#1e2433]/80 hover:border-[#5b8ef4] hover:-translate-y-0.5 transition-all backdrop-blur-sm">
              Alumni Directory <FiLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Animated stats */}
          <div ref={statsRef.ref} className="mt-16 flex flex-wrap items-center justify-center gap-12">
            <StatItem value={500}  suffix="+"  label="Alumni Listed"    active={statsRef.inView} delay={0}   />
            <StatItem value={100}  suffix="+"  label="Companies"        active={statsRef.inView} delay={200} />
            <StatItem value={1000} suffix="+"  label="Students Helped"  active={statsRef.inView} delay={400} />
          </div>
        </div>

        {/* Floating accent shapes */}
        <div className="absolute top-16 left-8 w-14 h-14 rounded-full border border-[#FFCD00]/15 animate-float" />
        <div className="absolute top-32 right-12 w-8 h-8 rounded-full animate-float delay-300" style={{ background:"rgba(255,205,0,0.06)" }} />
        <div className="absolute bottom-8 left-1/4 w-10 h-10 rounded-full border border-[#FFCD00]/10 animate-float delay-500" />
      </section>

      {/* ═══ MARQUEE — Company logos strip ═══ */}
      <div ref={marqueeRef.ref} className={`py-6 mb-2 reveal ${marqueeRef.inView ? "visible" : ""}`}>
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#4b5563] mb-4">Alumni now working at</p>
        <div className="marquee-wrap">
          <div className="marquee-inner">
            {[...marqueeItems, ...marqueeItems].map((company, i) => (
              <span key={i} className="mx-8 text-[#4b5563] hover:text-[#9ca3af] transition-colors font-semibold text-sm tracking-wide cursor-default select-none">
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#2d3748] to-transparent mx-8" />

      {/* ═══ FEATURES ═══ */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={featuresRef.ref} className={`text-center mb-14 reveal ${featuresRef.inView ? "visible" : ""}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest border border-[#FFCD00]/25 mb-5"
            style={{ color:"#FFCD00", background:"rgba(255,205,0,0.06)" }}>
            <LuCircleCheck className="w-3.5 h-3.5" /> Platform Features
          </div>
          <h2 className="text-4xl font-bold text-[#e8eaed] mb-4">Everything You Need to Succeed</h2>
          <p className="text-[#9ca3af] max-w-xl mx-auto">
            {"From company research to interview prep, we've got every aspect of your internship search covered."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const dc = `reveal-d${Math.min(i + 1, 6)}`;
            return (
              <div key={i}
                className={`feature-card rounded-2xl p-7 border cursor-default reveal ${dc} ${featuresRef.inView ? "visible" : ""}`}
                style={{ background:`linear-gradient(145deg,${f.gradientFrom},${f.gradientTo})`, borderColor:f.border, backdropFilter:"blur(12px)" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = `0 16px 40px ${f.glow}`; el.style.borderColor = f.accent + "55"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "none"; el.style.borderColor = f.border; }}
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                  style={{ background:`linear-gradient(135deg,${f.accent}22,${f.accent}44)`, border:`1px solid ${f.border}`, color:f.accent }}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-[#e8eaed] mb-3">{f.title}</h3>
                <p className="text-[#9ca3af] text-sm leading-relaxed mb-4">{f.description}</p>
                <div className="flex items-center gap-1 text-xs font-semibold" style={{ color:f.accent }}>
                  Learn more <LuArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#2d3748] to-transparent mx-8" />

      {/* ═══ CTA BANNER ═══ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div ref={ctaRef.ref}
          className={`max-w-4xl mx-auto rounded-2xl p-12 text-center border border-[#2d3748] relative overflow-hidden cta-grid reveal ${ctaRef.inView ? "visible" : ""}`}
          style={{ background:"linear-gradient(135deg,#1a1f2e 0%,#1e2433 50%,#252d3f 100%)" }}
        >
          {/* Top glow */}
          <div className="absolute inset-0 pointer-events-none" style={{ background:"radial-gradient(ellipse at 50% -20%,rgba(255,205,0,0.10) 0%,transparent 65%)" }} />

          {/* Floating particles inside CTA */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <Particle x={40}  color="#FFCD00" size={5} dur={3.5} delay={0}   variant={1} />
            <Particle x={80}  color="#5b8ef4" size={4} dur={4.2} delay={0.8} variant={2} />
            <Particle x={200} color="#7c3aed" size={6} dur={3.8} delay={1.5} variant={3} />
            <Particle x={320} color="#FFCD00" size={3} dur={4.5} delay={0.4} variant={1} />
            <Particle x={500} color="#10b981" size={5} dur={3.2} delay={1.2} variant={2} />
            <Particle x={620} color="#5b8ef4" size={4} dur={4.0} delay={0.6} variant={3} />
            <Particle x={720} color="#FFCD00" size={6} dur={3.6} delay={2.0} variant={1} />
          </div>

          {/* Orbiting decoration in CTA */}
          <div className="absolute top-8 right-8 w-16 h-16 pointer-events-none hidden md:block">
            <OrbitDot r={28} size={4} color="#FFCD00" duration={5} />
            <OrbitDot r={28} size={3} color="#5b8ef4" duration={7} delay={2} ccw />
          </div>

          {/* Watermark tridents */}
          <TridentSVG className="absolute right-8 bottom-4 trident-gold"     style={{ width:80, height:108, opacity:.08 }} />
          <TridentSVG className="absolute left-8 top-4 trident-gold-dim"     style={{ width:56, height:76,  opacity:.07 }} />

          {/* Badge */}
          <div className={`reveal ${ctaRef.inView ? "visible" : ""}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest border mb-6"
              style={{ borderColor:"rgba(255,205,0,0.3)", color:"#FFCD00", background:"rgba(255,205,0,0.06)" }}>
              <TridentSVG style={{ width:12, height:16 }} className="trident-gold" />
              Built for Tritons
            </div>
          </div>

          <h2 className={`text-3xl md:text-4xl font-bold text-[#e8eaed] mb-4 relative z-10 reveal reveal-d1 ${ctaRef.inView ? "visible" : ""}`}>
            Ready to Land Your Dream Internship?
          </h2>
          <p className={`text-[#9ca3af] mb-10 max-w-2xl mx-auto leading-relaxed relative z-10 reveal reveal-d2 ${ctaRef.inView ? "visible" : ""}`}>
            Join many UCSD students who have successfully secured internships at top tech companies. Your future career starts here.
          </p>

          <div className={`flex flex-wrap gap-4 items-center justify-center relative z-10 reveal reveal-d3 ${ctaRef.inView ? "visible" : ""}`}>
            <Link to="/companies" className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5"
              style={{ background:"linear-gradient(135deg,#5b8ef4,#7c3aed)", boxShadow:"0 4px 20px rgba(91,142,244,0.3)" }}>
              Browse Companies <FiBriefcase className="w-4 h-4" />
            </Link>
            <Link to="/connect" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-[#e8eaed] border border-[#2d3748] bg-[#1a1f2e]/80 hover:border-[#5b8ef4] hover:-translate-y-0.5 transition-all backdrop-blur-sm">
              View Alumni Directory <FiLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-[#2d3748] py-12 px-4 sm:px-6 lg:px-8" style={{ background:"#0d1117" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#1e2433] rounded-xl border border-[#2d3748] flex items-center justify-center">
                  <img src={OpportuneLogo} className="w-6 h-6" alt="Opportune Logo" />
                </div>
                <span className="text-lg font-bold text-[#e8eaed]">Opportune</span>
              </div>
              <p className="text-[#6b7280] text-sm leading-relaxed">Empowering UCSD students to achieve their career goals through community-driven resources and connections.</p>
              <div className="flex items-center gap-2 text-xs text-[#4b5563]">
                <TridentSVG className="trident-gold-dim" style={{ width:13, height:17, opacity:.5 }} />
                <span>UC San Diego · La Jolla, CA</span>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <h3 className="text-sm font-semibold text-[#e8eaed] uppercase tracking-wider">Open Source Project</h3>
              <div className="text-[#6b7280] text-sm space-y-2">
                <p>Developed by <span className="text-[#9ca3af] font-medium">CSES OpenSource</span></p>
                <p>Made by UCSD students, for UCSD students. Check out our{" "}
                  <a className="text-[#5b8ef4] hover:text-[#7c3aed] underline transition-colors" href="https://github.com/CSES-Open-Source/Opportune" target="_blank" rel="noopener noreferrer">GitHub Repo</a> to contribute!</p>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <h3 className="text-sm font-semibold text-[#e8eaed] uppercase tracking-wider">Connect With Us</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { href:"https://www.linkedin.com/company/ucsdcses", icon:<FaLinkedin className="w-4 h-4"/>, label:"LinkedIn" },
                  { href:"https://www.instagram.com/cses_at_ucsd",    icon:<FaInstagram className="w-4 h-4"/>, label:"Instagram" },
                  { href:"https://github.com/CSES-Open-Source",        icon:<FaGithub className="w-4 h-4"/>,   label:"GitHub" },
                  { href:"https://discord.com/invite/UkdACyy2h8",      icon:<FaDiscord className="w-4 h-4"/>,  label:"Discord" },
                  { href:"https://linktr.ee/cses_at_ucsd",             icon:<SiLinktree className="w-4 h-4"/>, label:"Linktree" },
                ].map(({ href, icon, label }) => (
                  <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-[#6b7280] hover:text-[#e8eaed] border border-[#2d3748] hover:border-[#5b8ef4] bg-[#1e2433] transition-all hover:-translate-y-0.5">
                    {icon}
                  </a>
                ))}
                <a href="https://csesucsd.com/" aria-label="CSES Website" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[#6b7280] hover:text-[#e8eaed] border border-[#2d3748] hover:border-[#5b8ef4] bg-[#1e2433] transition-all hover:-translate-y-0.5 text-[10px] font-bold">
                  CS
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-[#2d3748] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#6b7280] text-sm">&copy; 2025 Opportune. All rights reserved.</p>
            <p className="text-[#6b7280] text-sm">Made with passion by UCSD students</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;