import React, { useRef, useState } from 'react';
import { GameProject } from '../types';
import { MousePointer2, Users, ExternalLink, Play, Loader2 } from './Icons';
import { useRobloxStats } from '../hooks/useRobloxStats';

interface GameCardProps {
  project: GameProject;
  showDescription?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ project, showDescription = true }) => {
  const { stats, isLoading } = useRobloxStats(
    project.gameLink, 
    project.stats.visits, 
    project.stats.activePlayers
  );
  
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div 
        ref={divRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group relative rounded-2xl overflow-hidden bg-black/40 backdrop-blur-md border border-white/5 shadow-xl transition-transform duration-300 hover:-translate-y-1"
    >
      {/* Spotlight Effect Border */}
      <div 
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(99, 102, 241, 0.4), transparent 40%)`
        }}
      />
      
      {/* Inner Card Content Wrapper (creates the border by covering the background except for 1px) */}
      <div className="absolute inset-[1px] bg-black/40 backdrop-blur-md rounded-2xl z-10" />

      {/* Actual Content */}
      <div className="relative z-20 h-full flex flex-col">
          {/* Image Container */}
          <div className="relative h-56 w-full overflow-hidden rounded-t-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-80" />
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-sm">
              <a 
                href={project.gameLink} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-full font-bold font-mono text-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                <Play size={16} fill="currentColor" />
                PLAY
              </a>
            </div>

            {/* Top Badges */}
            <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2 max-w-[90%]">
                {project.tags.slice(0, 3).map(tag => (
                     <span key={tag} className="px-2 py-1 bg-white text-black rounded text-[10px] uppercase font-bold shadow-lg font-mono tracking-wider">
                        {tag}
                     </span>
                ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                    {project.title}
                </h3>
                <a href={project.gameLink} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors">
                    <ExternalLink size={16} />
                </a>
                </div>
                
                {showDescription && (
                  <p className="text-gray-400 text-sm mb-6 line-clamp-2 h-10 leading-relaxed">
                  {project.description}
                  </p>
                )}
            </div>

            {/* Stats Grid - Enhanced */}
            <div className={`grid grid-cols-2 gap-3 ${showDescription ? 'mt-auto' : 'mt-4'}`}>
              <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg p-3 flex flex-col items-center justify-center border border-white/5 group/stat">
                <div className="flex items-center gap-2 text-gray-500 group-hover/stat:text-primary transition-colors mb-1">
                  <MousePointer2 size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Visits</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold font-mono tracking-tight text-sm">
                    {isLoading && stats.visits === 'Play' ? (
                       <Loader2 size={14} className="animate-spin text-gray-500" />
                    ) : (
                      stats.visits
                    )}
                  </span>
                </div>
              </div>

              <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg p-3 flex flex-col items-center justify-center border border-white/5 group/stat">
                <div className="flex items-center gap-2 text-gray-500 group-hover/stat:text-green-400 transition-colors mb-1">
                  <Users size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Active</span>
                </div>
                <div className="flex items-center gap-2">
                   {!isLoading && stats.playing !== 'Live' && (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                      </span>
                   )}
                  <span className="text-white font-bold font-mono tracking-tight text-sm">
                    {isLoading && stats.playing === 'Live' ? (
                       <Loader2 size={14} className="animate-spin text-gray-500" />
                    ) : (
                      stats.playing
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default GameCard;