import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { flushSync } from "react-dom";
import emailjs from '@emailjs/browser';
import HeroImage from './hero-character.png'; 
import {
  Github, Linkedin, Mail, Instagram, Sun, Moon,
  ArrowRight, Radio, Battery, Wifi, Cpu, ChevronLeft, ChevronRight
} from "lucide-react";
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase (Read Only for Public)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

function cn(...classes) { return classes.filter(Boolean).join(" "); }
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check(); window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

// --- ICONS & STYLES ---
const XIcon = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const GlobalStyles = () => (
  <style>{`
    @font-face { font-family: 'Ndot55'; src: url('Ndot55Caps-Regular.otf') format('opentype'); }
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap');
    :root { --nothing-red: #D71921; }
    body { font-family: 'Inter', sans-serif; }
    .font-dot { font-family: 'Ndot55', monospace !important; }
    .glitch-hover:hover { animation: glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite; }
    @keyframes glitch { 0% { transform: translate(0) } 20% { transform: translate(-2px, 2px) } 40% { transform: translate(-2px, -2px) } 60% { transform: translate(2px, 2px) } 80% { transform: translate(2px, -2px) } 100% { transform: translate(0) } }
    .bg-nothing-dots { background-image: radial-gradient(#808080 1px, transparent 1px); background-size: 20px 20px; }
    .dark .bg-nothing-dots { background-image: radial-gradient(#333 1px, transparent 1px); }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #808080; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #D71921; }
    ::selection { background: var(--nothing-red); color: white; }
    ::view-transition-old(root), ::view-transition-new(root) { animation: none; mix-blend-mode: normal; }
    :root.dark { color-scheme: dark; }
  `}</style>
);

const NothingButton = ({ children, onClick, active, className, ...props }) => (
  <button onClick={onClick} className={cn("relative px-6 py-3 font-dot uppercase tracking-wider text-sm transition-all duration-200 rounded-3xl flex items-center justify-center gap-2 group overflow-hidden border", active ? "bg-black text-white border-transparent dark:bg-white dark:text-black" : "bg-transparent text-zinc-800 border-zinc-400 hover:bg-zinc-100 dark:text-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-900", className)} {...props}>
    <span className="relative z-10 flex items-center gap-2">{children}</span>
    <span className="absolute right-3 top-3 w-1.5 h-1.5 rounded-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
  </button>
);

const NothingCard = ({ className, children, ...props }) => (
  <div className={cn("bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-zinc-300 dark:border-zinc-800 rounded-[2rem] p-6 shadow-sm", className)} {...props}>{children}</div>
);

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-12 relative inline-block max-w-full">
    <h2 className="text-3xl md:text-5xl font-dot uppercase font-bold text-black dark:text-white mb-2 relative z-10 whitespace-nowrap">{title}</h2>
    <div className="h-1 w-full bg-red-600 mb-2 transform origin-left scale-x-50 transition-transform hover:scale-x-100" />
    <p className="text-zinc-500 font-mono text-xs md:text-sm uppercase tracking-widest truncate">{subtitle}</p>
    <div className="absolute -right-8 -top-4 flex gap-1 hidden md:flex"><div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" /><div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" /><div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" /></div>
  </div>
);

const ThreeDCarousel = ({ items, autoRotate = true, rotateInterval = 4000 }) => {
  const [active, setActive] = useState(0);
  const carouselRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const displayItems = useMemo(() => {
    if (items && items.length > 0) return items.map(item => ({ id: item.id, title: item.title, brand: item.brand, description: item.description, tags: item.tags || [], imageUrl: item.image_url || "", link: item.link || "#" }));
    return [
        { id: '1', title: "System UI Kit", brand: "Interface", description: "Comprehensive design system.", tags: ["React", "Figma"], imageUrl: "", link: "#" },
        { id: '2', title: "Neural Dashboard", brand: "Analytics", description: "AI-driven data visualization.", tags: ["Python", "D3.js"], imageUrl: "", link: "#" },
        { id: '3', title: "Hardware Control", brand: "IoT", description: "Mobile interface for devices.", tags: ["Flutter", "IoT"], imageUrl: "", link: "#" }
    ];
  }, [items]);

  useEffect(() => {
    if (autoRotate && isInView && !isHovering) {
      const interval = setInterval(() => setActive((prev) => (prev + 1) % displayItems.length), rotateInterval);
      return () => clearInterval(interval);
    }
  }, [isInView, isHovering, autoRotate, rotateInterval, displayItems.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { threshold: 0.2 });
    if (carouselRef.current) observer.observe(carouselRef.current);
    return () => observer.disconnect();
  }, []);

  const onTouchStart = (e) => { setTouchStart(e.targetTouches[0].clientX); setTouchEnd(null); };
  const onTouchMove = (e) => { setTouchEnd(e.targetTouches[0].clientX); };
  const onTouchEnd = () => { if (!touchStart || !touchEnd) return; const distance = touchStart - touchEnd; if (distance > minSwipeDistance) setActive((prev) => (prev + 1) % displayItems.length); else if (distance < -minSwipeDistance) setActive((prev) => (prev - 1 + displayItems.length) % displayItems.length); };

  const getCardStyle = (index) => {
    if (index === active) return "scale-100 opacity-100 z-20 translate-x-0";
    if (index === (active + 1) % displayItems.length) return "translate-x-[40%] scale-90 opacity-60 z-10 blur-[1px]";
    if (index === (active - 1 + displayItems.length) % displayItems.length) return "translate-x-[-40%] scale-90 opacity-60 z-10 blur-[1px]";
    return "scale-75 opacity-0 z-0";
  };

  return (
    <div ref={carouselRef} className="relative h-[500px] w-full flex items-center justify-center perspective-1000 overflow-hidden" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <button onClick={() => setActive((prev) => (prev - 1 + displayItems.length) % displayItems.length)} className="hidden md:flex absolute left-4 z-30 w-12 h-12 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-black/50 backdrop-blur items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"><ChevronLeft size={24} className="text-zinc-800 dark:text-zinc-200" /></button>
      <button onClick={() => setActive((prev) => (prev + 1) % displayItems.length)} className="hidden md:flex absolute right-4 z-30 w-12 h-12 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-black/50 backdrop-blur items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"><ChevronRight size={24} className="text-zinc-800 dark:text-zinc-200" /></button>

      <div className="w-full max-w-md h-full flex items-center justify-center relative">
        {displayItems.map((item, index) => (
          <div key={item.id || index} className={`absolute w-full transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${getCardStyle(index)}`} style={{ pointerEvents: index === active ? 'auto' : 'none' }}>
            <div className="bg-zinc-100 dark:bg-black border border-zinc-300 dark:border-zinc-800 rounded-[2rem] overflow-hidden shadow-2xl h-[420px] flex flex-col group hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
              <div className="relative h-48 bg-zinc-200 dark:bg-zinc-900 overflow-hidden">
                 <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px] z-10" />
                 {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" /> : <div className="w-full h-full flex items-center justify-center"><Cpu size={48} className="text-zinc-400 dark:text-zinc-700" /></div>}
                 <div className="absolute top-4 right-4 bg-black/80 text-white text-[10px] px-2 py-1 font-mono rounded backdrop-blur-md z-20 border border-white/10">ID: {String(index + 1).padStart(2, '0')}</div>
              </div>
              <div className="p-6 flex flex-col flex-grow relative">
                <div className="absolute top-0 right-6 w-[1px] h-6 bg-red-600" /><div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" /><p className="text-xs font-mono uppercase text-zinc-500 tracking-widest">{item.brand}</p></div>
                <h3 className="text-2xl font-dot font-bold uppercase text-zinc-900 dark:text-white mb-3 tracking-wide">{item.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-3">{item.description}</p>
                <div className="mt-auto flex justify-between items-end"><div className="flex gap-2">{item.tags?.map((t, i) => (<span key={i} className="text-[10px] uppercase font-mono border border-zinc-300 dark:border-zinc-700 px-2 py-1 rounded-md text-zinc-500">{t}</span>))}</div><a href={item.link} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"><ArrowRight size={16} /></a></div>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute -bottom-8 flex gap-2">{displayItems.map((_, idx) => (<button key={idx} onClick={() => setActive(idx)} className={`w-2 h-2 rounded-full transition-all ${active === idx ? 'bg-red-600 w-6' : 'bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400'}`} />))}</div>
      </div>
    </div>
  );
};

const DynamicNavigation = ({ links, onLinkClick, activeLink, className }) => (
  <nav className={cn("fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-full backdrop-blur-xl transition-all duration-300 p-1 flex items-center max-w-[95vw] bg-white/60 dark:bg-black/60 border border-zinc-300 dark:border-zinc-800 shadow-lg", className)}>
    <ul className="flex justify-between items-center gap-1 relative z-10 m-0 p-0 list-none">{links.map((link) => { const isActive = activeLink === link.id; return (<li key={link.id}><a href={`#${link.id}`} onClick={(e) => { e.preventDefault(); if (onLinkClick) onLinkClick(link.id); }} className={cn("flex gap-1 items-center justify-center px-3 md:px-6 py-2 md:py-2.5 text-[10px] md:text-xs font-dot font-bold uppercase tracking-wider rounded-full transition-all duration-200", isActive ? "bg-red-600 text-white shadow-md" : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10")}>{link.label}</a></li>); })}</ul>
  </nav>
);

const ThemeToggle = ({ duration = 400 }) => {
  const [isDark, setIsDark] = useState(false);
  const buttonRef = useRef(null);
  useEffect(() => { const updateTheme = () => setIsDark(document.documentElement.classList.contains("dark")); updateTheme(); const observer = new MutationObserver(updateTheme); observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] }); return () => observer.disconnect(); }, []);
  const toggle = useCallback(async () => { if (!document.startViewTransition) { const newTheme = !isDark; setIsDark(newTheme); if (newTheme) document.documentElement.classList.add("dark"); else document.documentElement.classList.remove("dark"); localStorage.setItem("theme", newTheme ? "dark" : "light"); return; } const rect = buttonRef.current?.getBoundingClientRect(); const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2; const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2; const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)); await document.startViewTransition(() => { flushSync(() => { const newTheme = !isDark; setIsDark(newTheme); if (newTheme) document.documentElement.classList.add("dark"); else document.documentElement.classList.remove("dark"); localStorage.setItem("theme", newTheme ? "dark" : "light"); }); }).ready; document.documentElement.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] }, { duration: duration, easing: "ease-in-out", pseudoElement: "::view-transition-new(root)" }); }, [isDark, duration]);
  return (<button ref={buttonRef} onClick={toggle} className="fixed bottom-6 right-6 md:top-6 md:right-6 z-50 w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur flex items-center justify-center hover:scale-105 transition-transform text-zinc-800 dark:text-white shadow-lg">{isDark ? <Sun size={20} /> : <Moon size={20} />}</button>);
};

// --- MAIN APP ---
export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [projects, setProjects] = useState([]); 
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [heroOverride, setHeroOverride] = useState(null);

  useEffect(() => { const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000); return () => clearInterval(timer); }, []);

  // Fetch Projects & Hero (Read Only)
  useEffect(() => {
    const fetchAll = async () => {
       const { data: p } = await supabase.from('portfolio_projects').select('*').order('created_at', { ascending: false });
       if(p) setProjects(p);
       const { data: h } = await supabase.from('site_config').select('value').eq('key', 'hero_image').single();
       if(h) setHeroOverride(h.value);
    };
    fetchAll();
    const sub1 = supabase.channel('public_projects').on('postgres_changes', { event: '*', schema: 'public', table: 'portfolio_projects' }, () => fetchAll()).subscribe();
    const sub2 = supabase.channel('public_config').on('postgres_changes', { event: '*', schema: 'public', table: 'site_config' }, (payload) => { if (payload.new && payload.new.key === 'hero_image') setHeroOverride(payload.new.value); }).subscribe();
    return () => { sub1.unsubscribe(); sub2.unsubscribe(); };
  }, []);

  useEffect(() => { if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) { document.documentElement.classList.add('dark'); } else { document.documentElement.classList.remove('dark'); } }, []);
  useEffect(() => { const handleScroll = () => { const sections = ['home', 'about', 'projects', 'contact']; for (const section of sections) { const element = document.getElementById(section); if (element) { const rect = element.getBoundingClientRect(); if (rect.top >= -300 && rect.top <= 300) { setActiveSection(section); break; } } } }; window.addEventListener('scroll', handleScroll); return () => window.removeEventListener('scroll', handleScroll); }, []);
  const handleNavClick = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setActiveSection(id); };
  const navLinks = [{ id: 'home', label: 'Home', href: '#home' }, { id: 'about', label: 'Info', href: '#about' }, { id: 'projects', label: 'Work', href: '#projects' }, { id: 'contact', label: 'Connect', href: '#contact' }];

  // Contact Form
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleContactSubmit = async (e) => {
    e.preventDefault(); setIsSending(true); setSuccessMsg("");
    try {
      await emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID, { name: contactForm.name, email: contactForm.email, message: contactForm.message }, import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
      await supabase.from('contact_messages').insert([contactForm]);
      setSuccessMsg("TRANSMISSION SUCCESSFUL. I WILL BE IN TOUCH."); setContactForm({ name: '', email: '', message: '' }); setTimeout(() => setSuccessMsg(""), 5000);
    } catch (error) { console.error(error); setSuccessMsg("TRANSMISSION FAILED. PLEASE TRY AGAIN."); } finally { setIsSending(false); }
  };

  return (
    <div className="min-h-screen bg-nothing-light-grey dark:bg-nothing-dark-grey text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-500 overflow-x-hidden">
      <GlobalStyles />
      <div className="fixed inset-0 pointer-events-none bg-nothing-dots opacity-30 z-0" />
      <div className="fixed top-0 left-0 w-full px-6 py-2 flex justify-between items-center text-[10px] font-mono text-zinc-500 z-40 uppercase tracking-widest mix-blend-difference"><span>OS Ver 2.5.0</span><span>{time}</span></div>
      <DynamicNavigation links={navLinks} activeLink={activeSection} onLinkClick={handleNavClick} />
      <ThemeToggle />

      <section id="home" className="min-h-screen relative flex flex-col justify-center items-center px-6 pt-24 md:pt-20 z-10">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-6 items-center">
          <div className="md:col-span-8 flex flex-col justify-center space-y-6 md:space-y-8 order-2 md:order-1">
            <div className="inline-flex items-center gap-2 border border-red-600/30 bg-red-600/10 px-3 py-1 rounded-full w-fit"><span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" /><span className="text-xs font-mono text-red-600 font-bold tracking-wider">SYSTEM ONLINE</span></div>
            <div className="space-y-2"><h1 className="text-5xl md:text-9xl font-dot font-bold text-black dark:text-white uppercase tracking-tighter leading-[0.9] md:leading-[0.8]">Nothing<br/><span className="text-zinc-400 dark:text-zinc-600 glitch-hover">Generic</span></h1></div>
            <p className="text-base md:text-xl max-w-xl text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">Designing digital interfaces with raw precision. <span className="block mt-2 font-mono text-xs uppercase tracking-widest text-zinc-500">// Full Stack Developer _ React _ Next.js</span></p>
            <div className="flex flex-wrap gap-4 pt-4"><NothingButton active onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}>Explore Work</NothingButton><NothingButton onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>Contact</NothingButton></div>
          </div>
          <div className="col-span-1 md:col-span-4 flex justify-center relative mt-4 md:mt-0 order-1 md:order-2">
             <div className="scale-90 md:scale-100 w-64 h-96 border-2 border-zinc-300 dark:border-zinc-800 rounded-[3rem] relative overflow-hidden flex flex-col justify-between p-6 bg-zinc-100 dark:bg-black shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="absolute inset-0 z-0"><img src={heroOverride || HeroImage} alt="Avatar" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" /></div>
                <div className="flex justify-between items-center relative z-20"><div className="text-[10px] font-mono bg-black/20 backdrop-blur-md text-white px-2 py-0.5 rounded-full">57°08'N</div><Battery size={16} className="text-white drop-shadow-md" /></div>
                <div className="flex flex-col items-center justify-end flex-1 pb-4 relative z-20"><div className="font-dot text-3xl uppercase text-white drop-shadow-lg tracking-wider">Amal</div><div className="text-xs text-zinc-300 font-mono bg-black/30 px-2 rounded backdrop-blur-md">Dev_Unit_01</div></div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 relative z-20"><span>ID: 8842</span><Wifi size={14} className="text-white" /></div>
             </div>
             <div className="absolute inset-0 bg-red-600/20 blur-[80px] -z-10 rounded-full" />
          </div>
        </div>
      </section>

      <section id="about" className="py-32 px-6 relative z-10 bg-white dark:bg-zinc-950 border-y border-zinc-200 dark:border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="System Info" subtitle="// About_Me_Config" />
          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-6">
              <div className="text-2xl font-light leading-snug">I build <span className="font-dot bg-zinc-200 dark:bg-zinc-800 px-2 rounded">functional</span> web experiences that strip away the unnecessary.</div>
              <p className="text-zinc-500 leading-relaxed">Minimalism isn't just an aesthetic; it's an engineering principle. My code is clean, documented, and built for performance.</p>
              <div className="grid grid-cols-2 gap-4 mt-8"><div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"><h4 className="text-4xl font-dot font-bold mb-1">05<span className="text-red-600">.</span></h4><p className="text-xs uppercase tracking-widest text-zinc-500">Years Active</p></div><div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"><h4 className="text-4xl font-dot font-bold mb-1">50<span className="text-red-600">+</span></h4><p className="text-xs uppercase tracking-widest text-zinc-500">Deployments</p></div></div>
            </div>
            <div className="relative"><div className="absolute inset-0 bg-[radial-gradient(#D71921_1px,transparent_1px)] [background-size:16px_16px] opacity-10 rounded-3xl" /><div className="relative z-10 grid grid-cols-2 gap-4">{['React', 'Next.js', 'TypeScript', 'Node', 'Firebase', 'Tailwind'].map((tech, i) => (<div key={i} className="flex items-center gap-3 p-4 bg-white/50 dark:bg-black/50 backdrop-blur border border-zinc-200 dark:border-zinc-800 rounded-xl"><div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-red-600' : 'bg-zinc-400'}`} /><span className="font-mono text-sm uppercase tracking-wider">{tech}</span></div>))}</div></div>
          </div>
        </div>
      </section>

      <section id="projects" className="py-32 px-6 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16"><SectionHeader title="Selected Works" subtitle="// Archive_2024" /><div className="flex gap-2 mb-12 hidden md:flex"><div className="w-2 h-2 bg-red-600 rounded-full animate-ping" /><span className="text-xs font-mono uppercase text-red-600">Live Database Connection</span></div></div>
          <ThreeDCarousel items={projects} />
        </div>
      </section>

      <section id="contact" className="py-32 px-6 relative z-10 bg-zinc-100 dark:bg-black border-t border-zinc-200 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16"><h2 className="text-5xl md:text-7xl font-dot uppercase font-bold mb-6">Let's Connect</h2><p className="text-zinc-500 font-mono text-sm uppercase tracking-[0.2em]">Initiate Communication Protocol</p></div>
          <NothingCard className="max-w-2xl mx-auto backdrop-blur-3xl bg-white/50 dark:bg-zinc-900/50">
            <form className="space-y-6" onSubmit={handleContactSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Identity</label><input required type="text" placeholder="NAME" value={contactForm.name} onChange={(e) => setContactForm({...contactForm, name: e.target.value})} className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 py-2 text-xl font-dot outline-none focus:border-red-600 transition-colors" /></div>
                <div className="space-y-2"><label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Signal</label><input required type="email" placeholder="EMAIL" value={contactForm.email} onChange={(e) => setContactForm({...contactForm, email: e.target.value})} className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 py-2 text-xl font-dot outline-none focus:border-red-600 transition-colors" /></div>
              </div>
              <div className="space-y-2 pt-4"><label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Transmission</label><textarea required rows={4} placeholder="ENTER MESSAGE..." value={contactForm.message} onChange={(e) => setContactForm({...contactForm, message: e.target.value})} className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 py-2 text-sm font-sans outline-none focus:border-red-600 transition-colors resize-none" /></div>
              {successMsg && (<div className="text-center py-2"><p className={`font-mono text-[10px] uppercase tracking-widest ${successMsg.includes('FAILED') ? 'text-red-500' : 'text-green-500 animate-pulse'}`}>{successMsg}</p></div>)}
              <div className="flex justify-end pt-4"><button type="submit" disabled={isSending} className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-8 py-3 rounded-full font-dot uppercase tracking-wider text-sm transition-all hover:px-10 flex items-center gap-2">{isSending ? 'Transmitting...' : 'Send Data'} <ArrowRight size={16} /></button></div>
            </form>
          </NothingCard>
          <div className="mt-16 flex justify-center gap-8">
            {[{ Icon: Github, link: "https://github.com/Amal-kphilip" }, { Icon: XIcon, link: "https://x.com/AmalkPhilip" }, { Icon: Linkedin, link: "https://www.linkedin.com/in/amal-k-philip" }, { Icon: Instagram, link: "https://instagram.com/amalkp29" }, { Icon: Mail, link: "mailto:amalkphilip2005@gmail.com" }].map(({ Icon, link }, i) => (
              <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="group relative p-4 border border-zinc-300 dark:border-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"><Icon size={20} className="text-zinc-600 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white" /><span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /></a>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-zinc-200 dark:border-zinc-900 bg-white dark:bg-black text-center relative z-10"><div className="flex flex-col items-center justify-center gap-4"><Radio size={24} className="text-zinc-400 animate-pulse" /><p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">System Status: Normal • © {new Date().getFullYear()} Amal.Dev</p></div></footer>
    </div>
  );
}