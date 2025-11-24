import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { flushSync } from "react-dom";
import emailjs from '@emailjs/browser';
import HeroImage from './hero-character.png';
import {
  Github, Linkedin, Mail, Twitter, Code2, User, Moon, Sun, Home,
  UserCircle, Briefcase, MessageSquare, ChevronLeft, ChevronRight, ArrowRight, Plus,
  Trash2, X, Loader2, Lock, Upload, Image as ImageIcon, Cpu, Radio, Battery, Wifi
} from "lucide-react";
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client - REPLACE WITH YOUR ACTUAL CREDENTIALS
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Utility function - ONLY DEFINED ONCE
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Utility to compress and convert image to base64
const processImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7); 
        resolve(dataUrl);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

/* --- CUSTOM HOOKS --- */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return isMobile;
}

/**
 * ==========================================
 * NOTHING OS UI COMPONENTS
 * ==========================================
 */

// Global Font Injection & CSS Variables
const GlobalStyles = () => (
  <style>{`
    @font-face {
      font-family: 'Ndot55';
      src: url('Ndot55Caps-Regular.otf') format('opentype');
      font-weight: normal;
      font-style: normal;
    }

    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
    
    :root {
      --nothing-red: #D71921;
      --nothing-black: #000000;
      --nothing-white: #FFFFFF;
      --nothing-grey: #808080;
      --nothing-light-grey: #E5E5E5;
      --nothing-dark-grey: #1A1A1A;
    }

    body {
      font-family: 'Inter', sans-serif;
    }

    .font-dot {
      font-family: 'Ndot55', monospace !important;
    }

    .nothing-border {
      border: 1px solid var(--nothing-light-grey);
    }
    .dark .nothing-border {
      border: 1px solid var(--nothing-dark-grey);
    }

    /* Glitch Animation */
    @keyframes glitch {
      0% { transform: translate(0) }
      20% { transform: translate(-2px, 2px) }
      40% { transform: translate(-2px, -2px) }
      60% { transform: translate(2px, 2px) }
      80% { transform: translate(2px, -2px) }
      100% { transform: translate(0) }
    }
    .glitch-hover:hover {
      animation: glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite;
    }

    /* Dot Pattern Background */
    .bg-nothing-dots {
      background-image: radial-gradient(#808080 1px, transparent 1px);
      background-size: 20px 20px;
    }
    .dark .bg-nothing-dots {
      background-image: radial-gradient(#333 1px, transparent 1px);
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #808080; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #D71921; }

    /* Selection */
    ::selection {
      background: var(--nothing-red);
      color: white;
    }

    /* View Transition for Theme Toggle */
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation: none;
      mix-blend-mode: normal;
    }
    ::view-transition-old(root) {
      z-index: 1;
    }
    ::view-transition-new(root) {
      z-index: 9999;
    }
    :root.dark {
      color-scheme: dark;
    }
  `}</style>
);

const NothingButton = ({ children, onClick, active, className, ...props }) => (
  <button
    onClick={onClick}
    className={cn(
      "relative px-6 py-3 font-dot uppercase tracking-wider text-sm transition-all duration-200",
      "rounded-3xl flex items-center justify-center gap-2 group overflow-hidden border",
      // FIXED: Mutually exclusive styles to prevent text-color conflicts
      active 
        ? "bg-black text-white border-transparent dark:bg-white dark:text-black" 
        : "bg-transparent text-zinc-800 border-zinc-400 hover:bg-zinc-100 dark:text-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-900",
      className
    )}
    {...props}
  >
    <span className="relative z-10 flex items-center gap-2">{children}</span>
    <span className="absolute right-3 top-3 w-1.5 h-1.5 rounded-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
  </button>
);

const NothingCard = ({ className, children, ...props }) => (
  <div className={cn(
    "bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-zinc-300 dark:border-zinc-800 rounded-[2rem] p-6 shadow-sm",
    className
  )} {...props}>
    {children}
  </div>
);

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-12 relative inline-block max-w-full">
    {/* FIXED: Smaller text on mobile (text-3xl) and whitespace-nowrap to prevent wrapping */}
    <h2 className="text-3xl md:text-5xl font-dot uppercase font-bold text-black dark:text-white mb-2 relative z-10 whitespace-nowrap">
      {title}
    </h2>
    <div className="h-1 w-full bg-red-600 mb-2 transform origin-left scale-x-50 transition-transform hover:scale-x-100" />
    <p className="text-zinc-500 font-mono text-xs md:text-sm uppercase tracking-widest truncate">{subtitle}</p>
    
    <div className="absolute -right-8 -top-4 flex gap-1 hidden md:flex">
      <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
      <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
      <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
    </div>
  </div>
);

/**
 * ==========================================
 * ADMIN & PROJECT MANAGER
 * ==========================================
 */

const ProjectManager = ({ onClose }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState(false);

  const [newProject, setNewProject] = useState({
    title: '', brand: '', description: '', tags: '', link: '#'
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Fetch projects when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    
    fetchProjects();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('portfolio_projects')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'portfolio_projects' 
        }, 
        () => {
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [isAuthenticated]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

const handleLogin = (e) => {
    e.preventDefault();
    // Compare input against the environment variable
    if (passwordInput === import.meta.env.VITE_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setPreviewUrl(URL.createObjectURL(file));
      const processedBase64 = await processImage(file);
      setSelectedImage(processedBase64);
    } catch (err) {
      console.error("Image processing failed", err);
    }
  };

const handleAdd = async (e) => {
  e.preventDefault();
  if (!isAuthenticated) return;
  setLoading(true);
  try {
    // 1. Prepare the new project object
    const newEntry = {
      ...newProject,
      tags: newProject.tags.split(',').map(t => t.trim()).filter(Boolean),
      image_url: selectedImage || '',
      created_at: new Date().toISOString()
    };

    // 2. Send to Supabase
    const { data, error } = await supabase
      .from('portfolio_projects')
      .insert([newEntry]) // insert the object
      .select();

    if (error) throw error;

    // 3. INSTANTLY update the screen (add new item to top of list)
    if (data) {
        setProjects(prev => [data[0], ...prev]);
    }

    // Reset form
    setNewProject({ title: '', brand: '', description: '', tags: '', link: '#' });
    setSelectedImage(null);
    setPreviewUrl('');
  } catch (error) {
    console.error("Error adding project:", error);
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (id) => {
  if (!isAuthenticated || !confirm("Delete system record?")) return;
  
  // 1. INSTANTLY remove from screen (Optimistic update)
  setProjects(prev => prev.filter(p => p.id !== id));

  try {
    // 2. Send delete command to background
    const { error } = await supabase
      .from('portfolio_projects')
      .delete()
      .eq('id', id);

    if (error) {
        // If it failed, put the item back (optional safety)
        throw error; 
    }
  } catch (error) {
    console.error("Error deleting:", error);
    alert("Delete failed check console");
    fetchProjects(); // Revert UI if failed
  }
};

  // --- LOGIN SCREEN (Nothing OS Style) ---
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-zinc-900/90 backdrop-blur-md p-4 font-mono">
        <div className="bg-black w-full max-w-sm rounded-3xl border border-zinc-800 p-8 relative shadow-2xl">
          <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
          <div className="mb-8 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border border-zinc-700 flex items-center justify-center mb-4 relative">
                <Lock size={24} className="text-white" />
                <div className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full animate-pulse" />
            </div>
            <h3 className="font-dot text-2xl text-white uppercase tracking-wider">System Access</h3>
          </div>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="relative">
                <input 
                type="password" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="PASSCODE"
                className={`w-full p-4 bg-zinc-900 border ${authError ? 'border-red-600' : 'border-zinc-800'} text-white rounded-xl focus:border-white outline-none tracking-widest text-center placeholder:text-zinc-700`}
                autoFocus
                />
            </div>
            {authError && <p className="text-xs text-red-500 text-center font-dot">ACCESS DENIED</p>}
            <button type="submit" className="w-full py-4 bg-white hover:bg-zinc-200 text-black rounded-full font-bold uppercase tracking-wider transition-colors">
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- MANAGER DASHBOARD ---
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 text-zinc-200 font-sans">
      <div className="bg-black w-full max-w-5xl rounded-[2rem] border border-zinc-800 overflow-hidden flex flex-col max-h-[90vh] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 bg-red-600 rounded-full" />
             <h3 className="font-dot text-xl uppercase tracking-wider">Content Manager</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row h-full overflow-hidden">
          {/* FORM COLUMN */}
          <div className="p-8 w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-zinc-800 overflow-y-auto bg-black">
            <h4 className="font-mono text-xs text-zinc-500 mb-6 uppercase tracking-widest border-b border-zinc-800 pb-2">New Entry</h4>
            <form onSubmit={handleAdd} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-500">MEDIA ASSET</label>
                <div className="relative group cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleImageSelect} className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" />
                  <div className={`h-40 rounded-2xl border border-dashed flex flex-col items-center justify-center transition-all ${previewUrl ? 'border-zinc-500 bg-zinc-900' : 'border-zinc-800 hover:border-zinc-600'}`}>
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="h-full w-full object-cover rounded-2xl opacity-50" />
                    ) : (
                      <div className="text-center p-4">
                        <Upload className="text-zinc-600 mb-2 mx-auto" size={24} />
                        <span className="text-[10px] text-zinc-600 font-mono uppercase">Upload Image</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <input required value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} placeholder="PROJECT TITLE" className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm focus:border-white transition-colors outline-none font-dot" />
              <input required value={newProject.brand} onChange={e => setNewProject({...newProject, brand: e.target.value})} placeholder="CATEGORY / CLIENT" className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm focus:border-white transition-colors outline-none font-mono" />
              <textarea required rows={3} value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} placeholder="DESCRIPTION DATA..." className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm focus:border-white transition-colors outline-none resize-none font-sans" />
              <input value={newProject.tags} onChange={e => setNewProject({...newProject, tags: e.target.value})} placeholder="TAGS (COMMA SEPARATED)" className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm focus:border-white transition-colors outline-none font-mono" />
              <input value={newProject.link} onChange={e => setNewProject({...newProject, link: e.target.value})} placeholder="EXTERNAL LINK" className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm focus:border-white transition-colors outline-none font-mono" />

              <button type="submit" disabled={loading} className="w-full py-3 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold font-dot uppercase tracking-wider flex items-center justify-center gap-2 transition-colors">
                {loading ? <Loader2 className="animate-spin" size={16} /> : "PUBLISH TO GRID"}
              </button>
            </form>
          </div>

          {/* LIST COLUMN */}
          <div className="p-8 w-full lg:w-2/3 overflow-y-auto bg-zinc-950">
            <h4 className="font-mono text-xs text-zinc-500 mb-6 uppercase tracking-widest border-b border-zinc-800 pb-2">Active Records ({projects.length})</h4>
            {projects.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl">
                <Cpu size={32} className="mx-auto mb-4 text-zinc-800" />
                <p className="font-mono text-xs text-zinc-600">NO DATA FOUND</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {projects.map(p => (
                  <div key={p.id} className="relative group border border-zinc-800 bg-black rounded-2xl overflow-hidden hover:border-zinc-600 transition-colors">
                    <div className="h-32 bg-zinc-900 relative grayscale group-hover:grayscale-0 transition-all duration-500">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-800"><ImageIcon /></div>
                      )}
                      <button onClick={() => handleDelete(p.id)} className="absolute top-2 right-2 p-2 bg-black text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border border-zinc-800 hover:bg-zinc-900">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="p-4">
                      <h5 className="font-dot font-bold text-sm text-white truncate uppercase">{p.title}</h5>
                      <p className="text-[10px] font-mono text-zinc-500 mb-3">{p.brand}</p>
                      <div className="flex flex-wrap gap-1">
                        {p.tags?.slice(0, 3).map((t, i) => (
                          <span key={i} className="text-[9px] px-1.5 py-0.5 border border-zinc-800 text-zinc-400 rounded-md font-mono uppercase">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * ==========================================
 * 3D CAROUSEL COMPONENT (Public)
 * ==========================================
 */

const ThreeDCarousel = ({ items, autoRotate = true, rotateInterval = 4000 }) => {
  const [active, setActive] = useState(0);
  const carouselRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const isMobile = useIsMobile();
  const minSwipeDistance = 50;

  const displayItems = useMemo(() => {
    if (items && items.length > 0) {
      return items.map(item => ({
        id: item.id,
        title: item.title,
        brand: item.brand,
        description: item.description,
        tags: item.tags || [],
        imageUrl: item.image_url || "", // Map image_url to imageUrl
        link: item.link || "#"
      }));
    }
    return [
        { id: '1', title: "System UI Kit", brand: "Interface", description: "Comprehensive design system for next-gen OS.", tags: ["React", "Figma"], imageUrl: "", link: "#" },
        { id: '2', title: "Neural Dashboard", brand: "Analytics", description: "AI-driven data visualization platform.", tags: ["Python", "D3.js"], imageUrl: "", link: "#" },
        { id: '3', title: "Hardware Control", brand: "IoT", description: "Mobile interface for smart home devices.", tags: ["Flutter", "IoT"], imageUrl: "", link: "#" }
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

  // --- TOUCH HANDLERS FOR SWIPE ---
  const onTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      setActive((prev) => (prev + 1) % displayItems.length);
    } else if (distance < -minSwipeDistance) {
      setActive((prev) => (prev - 1 + displayItems.length) % displayItems.length);
    }
  };

  // --- ANIMATION LOGIC ---
  const getCardStyle = (index) => {
    if (index === active) return "scale-100 opacity-100 z-20 translate-x-0";
    if (index === (active + 1) % displayItems.length)
      return "translate-x-[40%] scale-90 opacity-60 z-10 blur-[1px]";
    if (index === (active - 1 + displayItems.length) % displayItems.length)
      return "translate-x-[-40%] scale-90 opacity-60 z-10 blur-[1px]";
    return "scale-75 opacity-0 z-0";
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + displayItems.length) % displayItems.length);
  };

  const handleNext = () => {
    setActive((prev) => (prev + 1) % displayItems.length);
  };

  return (
    <div 
        ref={carouselRef} 
        className="relative h-[500px] w-full flex items-center justify-center perspective-1000 overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
    >
      {/* Desktop Navigation Buttons */}
      <button 
        onClick={handlePrev}
        className="hidden md:flex absolute left-4 z-30 w-12 h-12 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-black/50 backdrop-blur items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
      >
        <ChevronLeft size={24} className="text-zinc-800 dark:text-zinc-200" />
      </button>

      <button 
        onClick={handleNext}
        className="hidden md:flex absolute right-4 z-30 w-12 h-12 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-black/50 backdrop-blur items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
      >
        <ChevronRight size={24} className="text-zinc-800 dark:text-zinc-200" />
      </button>

      <div className="w-full max-w-md h-full flex items-center justify-center relative">
        {displayItems.map((item, index) => (
          <div 
            key={item.id || index} 
            className={`absolute w-full transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${getCardStyle(index)}`}
            style={{ pointerEvents: index === active ? 'auto' : 'none' }}
          >
            <div 
              className="bg-zinc-100 dark:bg-black border border-zinc-300 dark:border-zinc-800 rounded-[2rem] overflow-hidden shadow-2xl h-[420px] flex flex-col group hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="relative h-48 bg-zinc-200 dark:bg-zinc-900 overflow-hidden">
                 <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px] z-10" />
                 
                 {item.imageUrl ? (
                   <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center">
                     <Cpu size={48} className="text-zinc-400 dark:text-zinc-700" />
                   </div>
                 )}
                 <div className="absolute top-4 right-4 bg-black/80 text-white text-[10px] px-2 py-1 font-mono rounded backdrop-blur-md z-20 border border-white/10">
                    ID: {String(index + 1).padStart(2, '0')}
                 </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow relative">
                <div className="absolute top-0 right-6 w-[1px] h-6 bg-red-600" />

                <div className="flex items-center gap-2 mb-2">
                   <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                   <p className="text-xs font-mono uppercase text-zinc-500 tracking-widest">{item.brand}</p>
                </div>
                
                <h3 className="text-2xl font-dot font-bold uppercase text-zinc-900 dark:text-white mb-3 tracking-wide">
                  {item.title}
                </h3>
                
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-3">
                  {item.description}
                </p>

                <div className="mt-auto flex justify-between items-end">
                  <div className="flex gap-2">
                     {item.tags?.map((t, i) => (
                       <span key={i} className="text-[10px] uppercase font-mono border border-zinc-300 dark:border-zinc-700 px-2 py-1 rounded-md text-zinc-500">
                         {t}
                       </span>
                     ))}
                  </div>
                  <a href={item.link} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                    <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="absolute -bottom-8 flex gap-2">
          {displayItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              className={`w-2 h-2 rounded-full transition-all ${active === idx ? 'bg-red-600 w-6' : 'bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * ==========================================
 * NAVIGATION & UI COMPONENTS
 * ==========================================
 */

const DynamicNavigation = ({
  links,
  onLinkClick,
  activeLink,
  className,
}) => {
  return (
    <nav
      className={cn(
        // FIXED: Added width constraints and adjusted positioning
        "fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-full backdrop-blur-xl transition-all duration-300 p-1 flex items-center max-w-[95vw]",
        "bg-white/60 dark:bg-black/60 border border-zinc-300 dark:border-zinc-800 shadow-lg",
        className
      )}
    >
      <ul className="flex justify-between items-center gap-1 relative z-10 m-0 p-0 list-none">
        {links.map((link) => {
          const isActive = activeLink === link.id;
          return (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (onLinkClick) onLinkClick(link.id);
                }}
                className={cn(
                  // FIXED: Responsive padding (px-3 on mobile, px-6 on desktop)
                  // FIXED: Responsive text size (text-[10px] on mobile)
                  "flex gap-1 items-center justify-center px-3 md:px-6 py-2 md:py-2.5 text-[10px] md:text-xs font-dot font-bold uppercase tracking-wider rounded-full transition-all duration-200",
                  isActive
                    ? "bg-red-600 text-white shadow-md"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                )}
              >
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

const ThemeToggle = ({ duration = 400 }) => {
  const [isDark, setIsDark] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    const updateTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const toggle = useCallback(async () => {
    if (!document.startViewTransition) {
        const newTheme = !isDark;
        setIsDark(newTheme);
        if (newTheme) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", newTheme ? "dark" : "light");
        return;
    }

    const rect = buttonRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    await document.startViewTransition(() => {
        flushSync(() => {
            const newTheme = !isDark;
            setIsDark(newTheme);
            if (newTheme) document.documentElement.classList.add("dark");
            else document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", newTheme ? "dark" : "light");
        });
    }).ready;

    document.documentElement.animate(
        {
            clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
        },
        {
            duration: duration,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
        }
    );
  }, [isDark, duration]);

  return (
    <button 
      ref={buttonRef}
      onClick={toggle}
      // FIXED: 'bottom-6' on mobile, 'top-6' on desktop (md)
      className="fixed bottom-6 right-6 md:top-6 md:right-6 z-50 w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur flex items-center justify-center hover:scale-105 transition-transform text-zinc-800 dark:text-white shadow-lg"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

/**
 * ==========================================
 * MAIN APPLICATION
 * ==========================================
 */

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [showAdmin, setShowAdmin] = useState(false);
  const [projects, setProjects] = useState([]); 
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  // Clock for system header
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Supabase data fetching
  useEffect(() => {
    fetchProjects();
    
    // Set up real-time subscription for public viewing
    const subscription = supabase
      .channel('public_projects')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'portfolio_projects' 
        }, 
        () => {
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Theme Init
  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Scroll Spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= -300 && rect.top <= 300) {
             setActiveSection(section);
             break; 
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(id);
  };

  const navLinks = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'about', label: 'Info', href: '#about' },
    { id: 'projects', label: 'Work', href: '#projects' },
    { id: 'contact', label: 'Connect', href: '#contact' },
  ];

  // 1. Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // 2. The Missing Function
const handleContactSubmit = async (e) => {
  e.preventDefault();
  setIsSending(true);
  setSuccessMsg(""); // Reset message

  try {
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        name: contactForm.name,
        email: contactForm.email,
        message: contactForm.message,
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    // Backup to Supabase
    const { error } = await supabase.from('contact_messages').insert([contactForm]);
    if (error) console.error("Database log failed");

    // REPLACED ALERT WITH THIS:
    setSuccessMsg("TRANSMISSION SUCCESSFUL. I WILL BE IN TOUCH."); 
    setContactForm({ name: '', email: '', message: '' }); // Clear form
    
    // Hide message after 5 seconds
    setTimeout(() => setSuccessMsg(""), 5000);

  } catch (error) {
    console.error('Error:', error);
    setSuccessMsg("TRANSMISSION FAILED. PLEASE TRY AGAIN."); // Show error in UI
  } finally {
    setIsSending(false);
  }
};

  return (
    <div className="min-h-screen bg-nothing-light-grey dark:bg-nothing-dark-grey text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-500 overflow-x-hidden">
      <GlobalStyles />
      <div className="fixed inset-0 pointer-events-none bg-nothing-dots opacity-30 z-0" />
      
      {/* System Status Bar */}
      <div className="fixed top-0 left-0 w-full px-6 py-2 flex justify-between items-center text-[10px] font-mono text-zinc-500 z-40 uppercase tracking-widest mix-blend-difference">
         <span>OS Ver 2.5.0</span>
         <span>{time}</span>
      </div>

      <DynamicNavigation 
        links={navLinks} 
        activeLink={activeSection} 
        onLinkClick={handleNavClick} 
      />
      
      <ThemeToggle />

{/* --- HERO SECTION (Updated for Mobile) --- */}
<section id="home" className="min-h-screen relative flex flex-col justify-center items-center px-6 pt-24 md:pt-20 z-10">
  <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-6 items-center">
    
    {/* Left Text Block */}
    <div className="md:col-span-8 flex flex-col justify-center space-y-6 md:space-y-8 order-2 md:order-1">
      <div className="inline-flex items-center gap-2 border border-red-600/30 bg-red-600/10 px-3 py-1 rounded-full w-fit">
        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
        <span className="text-xs font-mono text-red-600 font-bold tracking-wider">SYSTEM ONLINE</span>
      </div>

      <div className="space-y-2">
        {/* FIXED: text-5xl on mobile, text-9xl on desktop */}
        <h1 className="text-5xl md:text-9xl font-dot font-bold text-black dark:text-white uppercase tracking-tighter leading-[0.9] md:leading-[0.8]">
          Nothing<br/>
          <span className="text-zinc-400 dark:text-zinc-600 glitch-hover">Generic</span>
        </h1>
      </div>

      <p className="text-base md:text-xl max-w-xl text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
        Designing digital interfaces with raw precision. 
        <span className="block mt-2 font-mono text-xs uppercase tracking-widest text-zinc-500">
          // Full Stack Developer _ React _ Next.js
        </span>
      </p>

      <div className="flex flex-wrap gap-4 pt-4">
        <NothingButton active onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}>
          Explore Work
        </NothingButton>
        <NothingButton onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
          Contact
        </NothingButton>
      </div>
    </div>

    {/* Right Decorative Block (3D Card) */}
    {/* FIXED: Removed 'hidden'. Added 'mt-4' for spacing on mobile. Added 'order-1' so it stays consistent. */}
    <div className="col-span-1 md:col-span-4 flex justify-center relative mt-4 md:mt-0 order-1 md:order-2">
       {/* FIXED: scale-90 on mobile so it fits narrow screens */}
       <div className="scale-90 md:scale-100 w-64 h-96 border-2 border-zinc-300 dark:border-zinc-800 rounded-[3rem] relative overflow-hidden flex flex-col justify-between p-6 bg-zinc-100 dark:bg-black shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
          
          {/* Background Image Layer */}
          <div className="absolute inset-0 z-0">
            <img 
              src={HeroImage} 
              alt="Avatar" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>

          {/* Card UI Elements (Overlay) */}
          <div className="flex justify-between items-center relative z-20">
             <div className="text-[10px] font-mono bg-black/20 backdrop-blur-md text-white px-2 py-0.5 rounded-full">57°08'N</div>
             <Battery size={16} className="text-white drop-shadow-md" />
          </div>

          <div className="flex flex-col items-center justify-end flex-1 pb-4 relative z-20">
              <div className="font-dot text-3xl uppercase text-white drop-shadow-lg tracking-wider">Alex</div>
              <div className="text-xs text-zinc-300 font-mono bg-black/30 px-2 rounded backdrop-blur-md">Dev_Unit_01</div>
          </div>

          <div className="flex justify-between text-xs font-mono text-zinc-400 relative z-20">
             <span>ID: 8842</span>
             <Wifi size={14} className="text-white" />
          </div>

          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-30" />
       </div>
       
       <div className="absolute inset-0 bg-red-600/20 blur-[80px] -z-10 rounded-full" />
    </div>
  </div>
</section>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="py-32 px-6 relative z-10 bg-white dark:bg-zinc-950 border-y border-zinc-200 dark:border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="System Info" subtitle="// About_Me_Config" />
          
          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-6">
              <div className="text-2xl font-light leading-snug">
                I build <span className="font-dot bg-zinc-200 dark:bg-zinc-800 px-2 rounded">functional</span> web experiences that strip away the unnecessary.
              </div>
              <p className="text-zinc-500 leading-relaxed">
                Minimalism isn't just an aesthetic; it's an engineering principle. My code is clean, documented, and built for performance. I specialize in the React ecosystem, creating interfaces that feel native and responsive.
              </p>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                   <h4 className="text-4xl font-dot font-bold mb-1">05<span className="text-red-600">.</span></h4>
                   <p className="text-xs uppercase tracking-widest text-zinc-500">Years Active</p>
                </div>
                <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                   <h4 className="text-4xl font-dot font-bold mb-1">50<span className="text-red-600">+</span></h4>
                   <p className="text-xs uppercase tracking-widest text-zinc-500">Deployments</p>
                </div>
              </div>
            </div>

            {/* Tech Stack Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-[radial-gradient(#D71921_1px,transparent_1px)] [background-size:16px_16px] opacity-10 rounded-3xl" />
              <div className="relative z-10 grid grid-cols-2 gap-4">
                 {['React', 'Next.js', 'TypeScript', 'Node', 'Firebase', 'Tailwind'].map((tech, i) => (
                   <div key={i} className="flex items-center gap-3 p-4 bg-white/50 dark:bg-black/50 backdrop-blur border border-zinc-200 dark:border-zinc-800 rounded-xl">
                      <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-red-600' : 'bg-zinc-400'}`} />
                      <span className="font-mono text-sm uppercase tracking-wider">{tech}</span>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROJECTS SECTION --- */}
      <section id="projects" className="py-32 px-6 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <SectionHeader title="Selected Works" subtitle="// Archive_2024" />
            <div className="flex gap-2 mb-12 hidden md:flex">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
                <span className="text-xs font-mono uppercase text-red-600">Live Database Connection</span>
            </div>
          </div>
          
          <ThreeDCarousel items={projects} />
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="py-32 px-6 relative z-10 bg-zinc-100 dark:bg-black border-t border-zinc-200 dark:border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-dot uppercase font-bold mb-6">Let's Connect</h2>
            <p className="text-zinc-500 font-mono text-sm uppercase tracking-[0.2em]">Initiate Communication Protocol</p>
          </div>

          <NothingCard className="max-w-2xl mx-auto backdrop-blur-3xl bg-white/50 dark:bg-zinc-900/50">
            <form className="space-y-6" onSubmit={handleContactSubmit}>
  <div className="grid md:grid-cols-2 gap-6">
    <div className="space-y-2">
      <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Identity</label>
      {/* ADDED value and onChange */}
      <input 
        required
        type="text" 
        placeholder="NAME" 
        value={contactForm.name}
        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
        className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 py-2 text-xl font-dot outline-none focus:border-red-600 transition-colors" 
      />
    </div>
    <div className="space-y-2">
      <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Signal</label>
      {/* ADDED value and onChange */}
      <input 
        required
        type="email" 
        placeholder="EMAIL" 
        value={contactForm.email}
        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
        className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 py-2 text-xl font-dot outline-none focus:border-red-600 transition-colors" 
      />
    </div>
  </div>
  <div className="space-y-2 pt-4">
      <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Transmission</label>
      {/* ADDED value and onChange */}
      <textarea 
        required
        rows={4} 
        placeholder="ENTER MESSAGE..." 
        value={contactForm.message}
        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
        className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 py-2 text-sm font-sans outline-none focus:border-red-600 transition-colors resize-none" 
      />
  </div>

  {successMsg && (
  <div className="text-center py-2">
    <p className={`font-mono text-[10px] uppercase tracking-widest ${successMsg.includes('FAILED') ? 'text-red-500' : 'text-green-500 animate-pulse'}`}>
       {successMsg}
    </p>
  </div>
)}
  
  <div className="flex justify-end pt-4">
    {/* ADDED disabled state and loading text */}
    <button 
      type="submit" 
      disabled={isSending}
      className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-8 py-3 rounded-full font-dot uppercase tracking-wider text-sm transition-all hover:px-10 flex items-center gap-2"
    >
       {isSending ? 'Transmitting...' : 'Send Data'} <ArrowRight size={16} />
    </button>
  </div>
</form>
          </NothingCard>

          <div className="mt-16 flex justify-center gap-8">
            {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
              <a key={i} href="#" className="group relative p-4 border border-zinc-300 dark:border-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                 <Icon size={20} className="text-zinc-600 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white" />
                 <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-zinc-200 dark:border-zinc-900 bg-white dark:bg-black text-center relative z-10">
        <div className="flex flex-col items-center justify-center gap-4">
           <Radio size={24} className="text-zinc-400 animate-pulse" />
           <p 
            onDoubleClick={() => setShowAdmin(true)}
            className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 cursor-pointer select-none hover:text-red-600 transition-colors"
          >
            System Status: Normal • © {new Date().getFullYear()} Alex.Dev
          </p>
        </div>
      </footer>

      {/* Admin Modal */}
      {showAdmin && <ProjectManager onClose={() => setShowAdmin(false)} />}
    </div>
  );
}