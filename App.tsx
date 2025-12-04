import React, { useEffect, useState } from 'react';
import { Gamepad2, Code2, Layers, Mail, ChevronDown, ExternalLink, Terminal, Zap, Cpu, BarChart3, Database, Globe, Shield, Wallet, Swords, Layout, Users, Clock } from './components/Icons';
import NoiseOverlay from './components/NoiseOverlay';
import BackgroundEffects from './components/BackgroundEffects';
import RevealOnScroll from './components/RevealOnScroll';
import GameCard from './components/GameCard';
import VideoCarousel from './components/VideoCarousel';
import TextScramble from './components/TextScramble';
import SpotlightCard from './components/SpotlightCard';
import { LIVE_GAMES, PAST_WORK, UNRELEASED_WORK } from './constants';
import { fetchGameStats, formatCount } from './services/robloxService';

// Flag to control visibility of the Technical Scope section
const SHOW_TECHNICAL_SCOPE = false;

// Flag to control visibility of descriptions in cards
const SHOW_PROJECT_DESCRIPTIONS = true;

// Internal Icon Components just for social logos if not available in lucide or preferred custom
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z"/>
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

function App() {
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [totalVisits, setTotalVisits] = useState<string>("35M+");
  const [totalCCU, setTotalCCU] = useState<string>("5K+");

  useEffect(() => {
    // Robust smooth scrolling for all anchor links
    const handleSmoothScroll = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      // Check if it's a hash link
      if (anchor && anchor.hash && anchor.hash.startsWith('#')) {
        const targetId = anchor.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          e.preventDefault();
          const headerOffset = 80; // Offset for fixed header
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without triggering default scroll
          window.history.pushState(null, '', anchor.hash);
        }
      }
    };

    document.addEventListener('click', handleSmoothScroll);
    return () => document.removeEventListener('click', handleSmoothScroll);
  }, []);

  useEffect(() => {
    // Calculate total visits and ccu from live games
    const calculateStats = async () => {
        let totalVisitsSum = 0;
        let totalPlayingSum = 0;
        
        const promises = LIVE_GAMES.map(game => fetchGameStats(game.gameLink));
        const results = await Promise.allSettled(promises);
        
        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value) {
                totalVisitsSum += result.value.rawVisits;
                totalPlayingSum += result.value.rawPlaying;
            }
        });

        if (totalVisitsSum > 0) {
            setTotalVisits(formatCount(totalVisitsSum) + "+");
        }
        if (totalPlayingSum > 0) {
            setTotalCCU(formatCount(totalPlayingSum) + "+");
        }
    };
    
    // Slight delay to prioritize main render
    setTimeout(calculateStats, 1000);
  }, []);

  const handleDiscordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('xo1o');
    setShowCopyNotification(true);
    setTimeout(() => setShowCopyNotification(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-background text-white selection:bg-primary/30 selection:text-white overflow-x-hidden font-sans">
      {/* Optimization: Only show dynamic mouse effects on larger screens to save mobile GPU */}
      <div className="hidden md:block">
        <BackgroundEffects />
      </div>
      <NoiseOverlay />

      {/* Copy Notification */}
      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 transform ${showCopyNotification ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="bg-white/10 backdrop-blur-md border border-white/10 text-white px-6 py-3 rounded-full font-mono text-sm shadow-2xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            Copied "xo1o" to clipboard
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-background/70 backdrop-blur-xl border-b border-white/5 supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#home" className="text-xl font-bold tracking-tighter flex items-center gap-2 group cursor-pointer">
            <span className="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm shadow-lg group-hover:shadow-primary/50 transition-all duration-300 font-mono">X</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:to-white transition-all font-mono">xo1o<span className="text-gray-600 group-hover:text-gray-400">.xyz</span></span>
          </a>
          
          <div className="hidden md:flex gap-8 text-xs font-medium font-mono text-gray-400 uppercase tracking-widest">
            <a href="#home" className="hover:text-white transition-colors relative group">
                Home
                <span className="absolute -bottom-5 left-0 w-full h-0.5 bg-primary scale-x-0 transition-transform group-hover:scale-x-100"></span>
            </a>
            {SHOW_TECHNICAL_SCOPE && (
              <a href="#scope" className="hover:text-white transition-colors relative group">
                  Scope
                  <span className="absolute -bottom-5 left-0 w-full h-0.5 bg-primary scale-x-0 transition-transform group-hover:scale-x-100"></span>
              </a>
            )}
            <a href="#games" className="hover:text-white transition-colors relative group">
                Games
                <span className="absolute -bottom-5 left-0 w-full h-0.5 bg-primary scale-x-0 transition-transform group-hover:scale-x-100"></span>
            </a>
            <a href="#unreleased" className="hover:text-white transition-colors relative group">
                DEMOS
                <span className="absolute -bottom-5 left-0 w-full h-0.5 bg-primary scale-x-0 transition-transform group-hover:scale-x-100"></span>
            </a>
            <a href="#contact" className="hover:text-white transition-colors relative group">
                Contact
                <span className="absolute -bottom-5 left-0 w-full h-0.5 bg-primary scale-x-0 transition-transform group-hover:scale-x-100"></span>
            </a>
          </div>

          <div className="flex gap-4 items-center">
            <a href="https://www.roblox.com/users/2575395475/profile" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform">
              <img src="https://cdn.simpleicons.org/roblox/white" alt="Roblox" className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity" />
            </a>
            <a href="https://x.com/xoloxvl" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors hover:scale-110 transform">
              <XIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8">
            <RevealOnScroll delay={100}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-primary/10 border border-primary/20 text-[10px] font-bold font-mono text-primary tracking-wider uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Open for Commissions
              </div>
            </RevealOnScroll>
            
            <RevealOnScroll delay={200}>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.0] mb-6">
                <TextScramble>Build.</TextScramble> <br/>
                <TextScramble>Script.</TextScramble> <br/>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent animate-shimmer bg-[length:200%_auto]">
                  Dominate.
                </span>
              </h1>
              <p className="text-lg text-gray-400 max-w-lg leading-relaxed border-l-2 border-primary/50 pl-6">
                I'm <strong className="text-white">xo1o</strong>, a Full-Stack Roblox Programmer. I write clean, well-structured code and focus on systems that work reliably at scale. 
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={300}>
              <div className="flex flex-wrap gap-4 pt-4">
                <a href="#games" className="group relative px-8 py-4 bg-white text-black font-bold font-mono text-sm rounded-none overflow-hidden transition-all hover:bg-gray-200 flex items-center gap-2">
                  <div className="absolute top-0 right-0 w-2 h-2 bg-black transform translate-x-1 -translate-y-1 rotate-45"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 bg-black transform -translate-x-1 translate-y-1 rotate-45"></div>
                  <span className="relative flex items-center gap-2 uppercase tracking-wide">
                    View Games <Gamepad2 size={16} />
                  </span>
                </a>
                
                <a href="#past-work" className="px-8 py-4 bg-transparent text-white font-bold font-mono text-sm border border-white/20 hover:bg-white/5 transition-all flex items-center gap-2 uppercase tracking-wide">
                  Past Work <Layers size={16} />
                </a>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={400}>
              <div className="pt-10 flex items-center gap-8 text-gray-500 text-sm font-medium border-t border-white/5 mt-8 font-mono">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-primary">
                    <Clock size={16} />
                    <span className="font-bold text-white">4+</span>
                  </div>
                  <span className="text-xs opacity-60">YEARS EXPERIENCE</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-secondary">
                    <Users size={16} />
                    <span className="font-bold text-white">{totalCCU}</span>
                  </div>
                  <span className="text-xs opacity-60">CONTRIBUTED CCU</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-primary">
                    <BarChart3 size={16} />
                    <span className="font-bold text-white">{totalVisits}</span>
                  </div>
                  <span className="text-xs opacity-60">TOTAL VISITS</span>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* 3D Illustration / Hero Image Placeholder */}
          <RevealOnScroll delay={500} className="hidden lg:block">
            <div className="relative z-10 group perspective-1000">
               {/* Glowing backing */}
               <div className="absolute -inset-2 bg-gradient-to-br from-primary via-secondary to-accent opacity-20 blur-3xl group-hover:opacity-40 transition-opacity duration-700"></div>
               
               <div className="relative w-full aspect-[4/3] bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:rotate-1">
                 {/* Terminal Header */}
                 <div className="h-8 bg-[#111] border-b border-white/10 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    <div className="ml-4 text-[10px] font-mono text-gray-500">roblox_studio_v2.exe</div>
                 </div>
                 
                 <div className="relative h-full">
                    <img 
                      src="https://tr.rbxcdn.com/180DAY-473399814d57d63f73e44d7ba2d3bf46/768/432/Image/Webp/noFilter" 
                      alt="Digital Art" 
                      className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                    />
                    
                    {/* Floating Code Snippet Overlay */}
                    <div className="absolute top-10 left-10 right-10 bottom-10 bg-black/80 backdrop-blur-md border border-white/10 rounded p-6 font-mono text-xs leading-relaxed text-gray-400 shadow-2xl">
                        <div className="flex gap-4 mb-4 border-b border-white/10 pb-2">
                           <span className="text-primary font-bold">GameEngine.luau</span>
                           <span className="text-gray-600">ServerScript</span>
                        </div>
                        <div>
                           <span className="text-purple-400">local</span> <span className="text-blue-400">Services</span> = <span className="text-yellow-300">require</span>(game.<span className="text-green-300">ReplicatedStorage</span>.Common.Services)<br/>
                           <br/>
                           <span className="text-purple-400">function</span> <span className="text-blue-400">GameEngine:Init</span>()<br/>
                           &nbsp;&nbsp;<span className="text-gray-500">-- Initialize core mechanics</span><br/>
                           &nbsp;&nbsp;<span className="text-purple-400">self</span>.state = <span className="text-green-300">"LOBBY"</span><br/>
                           &nbsp;&nbsp;<span className="text-purple-400">self</span>._maid = Maid.<span className="text-yellow-300">new</span>()<br/>
                           &nbsp;&nbsp;<br/>
                           &nbsp;&nbsp;<span className="text-purple-400">for</span> _, system <span className="text-purple-400">in</span> <span className="text-yellow-300">pairs</span>(loadedSystems) <span className="text-purple-400">do</span><br/>
                           &nbsp;&nbsp;&nbsp;&nbsp;system:<span className="text-yellow-300">Start</span>()<br/>
                           &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">print</span>(<span className="text-green-300">"Loaded System: "</span> .. system.Name)<br/>
                           &nbsp;&nbsp;<span className="text-purple-400">end</span><br/>
                           <span className="text-purple-400">end</span>
                        </div>
                        <div className="absolute bottom-4 right-4 animate-pulse">
                           <span className="w-2 h-4 bg-primary block"></span>
                        </div>
                    </div>
                 </div>
               </div>
               
               {/* Floating Badges */}
               <div className="absolute -right-6 top-1/4 bg-surface/90 backdrop-blur-xl border border-white/10 p-4 rounded shadow-xl animate-float" style={{ animationDelay: '1s' }}>
                 <Terminal className="text-primary w-6 h-6" />
               </div>
               <div className="absolute -left-6 bottom-1/4 bg-surface/90 backdrop-blur-xl border border-white/10 p-4 rounded shadow-xl animate-float" style={{ animationDelay: '2s' }}>
                 <Code2 className="text-accent w-6 h-6" />
               </div>
            </div>
          </RevealOnScroll>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-600">
           <ChevronDown size={24} />
           <span className="sr-only">Scroll down</span>
        </div>
      </section>

      {/* Scope / Capabilities Section - Temporarily Hidden */}
      {SHOW_TECHNICAL_SCOPE && (
        <section id="scope" className="py-24 relative bg-[#020617] border-b border-white/5">
          {/* Background Grid Accent */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
              <RevealOnScroll>
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
                  <div>
                      <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-500">Technical Scope</h2>
                      <p className="text-gray-400 text-lg">My areas of expertise and technical stack.</p>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent ml-8 hidden md:block mb-4"></div>
                </div>
              </RevealOnScroll>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Column 1: Genres & Tech Stack (4 cols) */}
                  <div className="md:col-span-4 flex flex-col gap-6">
                    <RevealOnScroll delay={100}>
                        <SpotlightCard className="h-full p-8 flex flex-col">
                            <div className="mb-6 flex items-center justify-between">
                              <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-primary">
                                  <Gamepad2 size={24} />
                              </div>
                              <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Expertise</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-6 font-mono">Specialized Genres</h3>
                            <ul className="space-y-3 flex-1">
                              {[
                                { name: "Simulator & Incremental", color: "bg-blue-500" },
                                { name: "Round-based & Tycoon", color: "bg-indigo-500" },
                                { name: 'Viral / "Brainrot" Games', color: "bg-violet-500" }
                              ].map((genre, i) => (
                                <li key={i} className="group/item flex items-center gap-3 text-slate-400 hover:text-white transition-all cursor-default p-2 rounded-lg hover:bg-white/5 hover:translate-x-1">
                                    <span className={`w-1.5 h-1.5 rounded-full ${genre.color} group-hover/item:scale-150 transition-transform`}></span>
                                    {genre.name}
                                </li>
                              ))}
                            </ul>
                        </SpotlightCard>
                    </RevealOnScroll>

                    <RevealOnScroll delay={200}>
                        <SpotlightCard className="h-full p-8 flex flex-col">
                            <div className="mb-6 flex items-center justify-between">
                              <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-accent">
                                  <Layers size={24} />
                              </div>
                              <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Stack</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-6 font-mono">Frameworks</h3>
                            <div className="flex flex-wrap gap-2">
                              {['Rojo', 'Knit', 'ReplicaService', 'Packet', 'Janitor'].map(tech => (
                                  <span key={tech} className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-md text-xs font-mono text-slate-400 hover:text-white hover:border-primary/50 transition-all cursor-default hover:shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                                    {tech}
                                  </span>
                              ))}
                            </div>
                        </SpotlightCard>
                    </RevealOnScroll>
                  </div>

                  {/* Column 2: Systems Engineering (8 cols) */}
                  <div className="md:col-span-8">
                    <RevealOnScroll delay={300}>
                        <SpotlightCard className="h-full p-8" spotlightColor="rgba(56, 189, 248, 0.15)">
                            <div className="flex items-center gap-4 mb-8">
                              <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-secondary">
                                  <Cpu size={24} />
                              </div>
                              <div>
                                  <h3 className="text-xl font-bold text-white font-mono">Systems Architecture</h3>
                                  <p className="text-xs text-slate-500 uppercase tracking-wider">Engineered Solutions</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {[
                                { icon: <Wallet size={20} />, title: "Economy & Currency", desc: "Secure transaction handling", color: "text-emerald-400" },
                                { icon: <Database size={20} />, title: "Inventory Management", desc: "Complex item data structures", color: "text-blue-400" },
                                { icon: <Swords size={20} />, title: "Combat & PvP", desc: "Hit-detection & replication", color: "text-red-400" },
                                { icon: <Globe size={20} />, title: "Global Events", desc: "Live service updates", color: "text-indigo-400" },
                                { icon: <Layout size={20} />, title: "UI Effects", desc: "Smooth animations & UX", color: "text-violet-400" },
                                { icon: <Shield size={20} />, title: "Robust Data", desc: "ProfileService & safety", color: "text-cyan-400" },
                              ].map((item, idx) => (
                                <div key={idx} className="group/grid relative p-4 rounded-xl border border-white/5 bg-black/20 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1">
                                    <div className={`mb-3 text-gray-600 group-hover/grid:${item.color} transition-colors duration-300`}>
                                      {item.icon}
                                    </div>
                                    <h4 className="font-bold text-gray-200 group-hover/grid:text-white text-sm mb-1 font-mono transition-colors">
                                      {item.title}
                                    </h4>
                                    <p className="text-xs text-gray-500 group-hover/grid:text-gray-400 transition-colors">
                                      {item.desc}
                                    </p>
                                </div>
                              ))}
                            </div>
                        </SpotlightCard>
                    </RevealOnScroll>
                  </div>
              </div>
          </div>
        </section>
      )}

      {/* Live Games Section */}
      <section id="games" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <RevealOnScroll>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
              <div>
                <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-500">Games I Worked On</h2>
                <p className="text-gray-400 text-lg"> Games I have contributed to that are currently active.</p>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent ml-8 hidden md:block mb-4"></div>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {LIVE_GAMES.map((project, idx) => (
              <RevealOnScroll key={project.id} delay={idx * 150}>
                <GameCard project={project} showDescription={SHOW_PROJECT_DESCRIPTIONS} />
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Unreleased Section */}
      <section id="unreleased" className="py-32 bg-white/[0.02] relative border-y border-white/5">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <VideoCarousel 
            title="Projects scripted by me" 
            subtitle="Unreleased projects that I have scripted or worked on."
            videos={UNRELEASED_WORK}
            showDescription={SHOW_PROJECT_DESCRIPTIONS}
          />
        </div>
      </section>

      {/* Past Work Section */}
      <section id="past-work" className="py-32 relative">
         <div className="max-w-7xl mx-auto px-6">
          <VideoCarousel
            title="Past Work" 
            subtitle="Different systems and mechanics from a wide range of genres"
            videos={PAST_WORK}
            showDescription={SHOW_PROJECT_DESCRIPTIONS}
          />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 relative overflow-hidden">
        {/* Background glow for contact */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <RevealOnScroll>
            <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-500">Thank you for <br/>your time!</h2>
            <p className="text-gray-400 mb-12 text-xl leading-relaxed">
             If you're looking for someone who delivers quality work and communicates clearly throughout the process, let's discuss your project.
            </p>
          </RevealOnScroll>
          
          <RevealOnScroll delay={300}>
            <div className="mt-16 flex justify-center gap-10">
               {/* Roblox */}
               <a href="https://www.roblox.com/users/2575395475/profile" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-3 text-gray-500 hover:text-white transition-all group w-24">
                 <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-white/10 group-hover:scale-110 transition-all border border-white/5">
                    <img src="https://cdn.simpleicons.org/roblox/white" alt="Roblox" className="w-7 h-7 opacity-70 group-hover:opacity-100 transition-opacity" />
                 </div>
                 <span className="text-xs uppercase font-bold font-mono tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 text-center">
                    <span className="group-hover:hidden"></span>
                    <span className="hidden group-hover:block text-white">X0L00X</span>
                 </span>
               </a>

               {/* Discord */}
               <button onClick={handleDiscordClick} className="flex flex-col items-center gap-3 text-gray-500 hover:text-indigo-400 transition-all group w-24">
                 <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-indigo-500/10 group-hover:scale-110 transition-all border border-white/5">
                    <DiscordIcon className="w-7 h-7" />
                 </div>
                 <span className="text-xs uppercase font-bold font-mono tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 text-center">
                    <span className="group-hover:hidden"></span>
                    <span className="hidden group-hover:block text-white">xo1o</span>
                 </span>
               </button>

               {/* Twitter/X */}
               <a href="https://x.com/xoloxvl" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-3 text-gray-500 hover:text-blue-400 transition-all group w-24">
                 <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-blue-500/10 group-hover:scale-110 transition-all border border-white/5">
                    <XIcon className="w-7 h-7" />
                 </div>
                 <span className="text-xs uppercase font-bold font-mono tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 text-center">
                    <span className="group-hover:hidden"></span>
                    <span className="hidden group-hover:block text-white">XoloXVL</span>
                 </span>
               </a>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-white/5 bg-black text-center relative z-10">
        <div className="flex flex-col items-center justify-center gap-4">
           <div className="text-2xl font-bold tracking-tighter flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="w-6 h-6 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-[10px] font-mono">X</span>
            <span className="font-mono text-sm">xo1o<span className="text-gray-600">.xyz</span></span>
          </div>
          <p className="text-xs font-mono text-gray-600">&copy; {new Date().getFullYear()} Designed by xo1o</p>
        </div>
      </footer>
    </div>
  );
}

export default App;