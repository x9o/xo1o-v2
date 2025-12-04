import React, { useState, useEffect, useRef, useCallback } from 'react';
import { VideoProject } from '../types';
import RevealOnScroll from './RevealOnScroll';
import { ChevronLeft, ChevronRight, RotateCw, Play } from './Icons';

interface VideoCarouselProps {
  videos: VideoProject[];
  title: string;
  subtitle?: string;
  showDescription?: boolean;
}

// Sub-component for individual cards to handle flip state
const VideoCard: React.FC<{ video: VideoProject; showDescription: boolean; isDragging: boolean }> = ({ 
  video, 
  showDescription, 
  isDragging
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipImageUrl = video.flipImageUrl;
  const canFlip = !!flipImageUrl;

  const handleFlip = (e: React.MouseEvent) => {
    if (isDragging || !canFlip) return;
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
        className={`h-full group bg-black/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative flex flex-col ${canFlip && !isDragging ? 'cursor-pointer' : ''}`}
        onClick={handleFlip}
    >
        {/* Media Container with Flip Logic */}
        <div 
            className="relative w-full pt-[56.25%] bg-black flex-shrink-0" 
            style={{ perspective: '1000px' }}
        >
            {/* Flip Indicator (Now Outside the 3D Container so it doesn't flip/mirror) */}
            {canFlip && (
                <div 
                    className={`absolute top-3 right-3 z-20 transition-opacity duration-300 pointer-events-none ${isFlipped ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}
                >
                    <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white flex items-center gap-2 shadow-xl">
                        <RotateCw size={14} className="text-primary animate-spin-slow" />
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider">Click card to Flip</span>
                    </div>
                </div>
            )}

            {/* 3D Wrapper */}
            <div 
                className="absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out"
                style={{ 
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
            >
                {/* Front Face: YouTube Embed */}
                <div 
                    className="absolute inset-0 w-full h-full bg-black backface-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                     {/* Interaction Blocker for Dragging Only */}
                    <div className={`absolute inset-0 bg-transparent z-30 ${isDragging ? 'block' : 'hidden'}`} />
                    
                    {/* YouTube Iframe Wrapper - Stop Propagation so clicks here don't flip the card */}
                    <div 
                        className="absolute inset-0 w-full h-full"
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <iframe
                            src={`https://www.youtube.com/embed/${video.videoId}?modestbranding=1&rel=0`}
                            title={video.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>

                {/* Back Face: Image */}
                {canFlip && (
                    <div 
                        className="absolute inset-0 w-full h-full bg-surface backface-hidden"
                        style={{ 
                            backfaceVisibility: 'hidden', 
                            transform: 'rotateY(180deg)' 
                        }}
                    >
                         <img 
                            src={flipImageUrl} 
                            alt="Placeholder" 
                            className="w-full h-full object-cover"
                         />
                    </div>
                )}
            </div>
        </div>
    
        {/* Description Area - Clicking here triggers flip due to parent onClick */}
        <div className="p-6 flex-1 relative flex flex-col">
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors truncate">
                {video.title}
            </h3>
            {showDescription && (
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                    {video.description}
                </p>
            )}
            
            {/* Visual hint in the empty area */}
            {canFlip && (
                <div className="mt-auto pt-4 flex justify-end opacity-0 group-hover:opacity-50 transition-opacity duration-300">
                    <RotateCw size={16} className="text-gray-500" />
                </div>
            )}
        </div>
    </div>
  );
};

const VideoCarousel: React.FC<VideoCarouselProps> = ({ videos, title, subtitle, showDescription = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerScreen, setItemsPerScreen] = useState(3);
  
  // Drag / Swipe State
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const lastScrollTime = useRef(0);

  // Responsive logic to determine how many items to show
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerScreen(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerScreen(2);
      } else {
        setItemsPerScreen(3);
      }
    };

    handleResize(); // Init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, videos.length - itemsPerScreen);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => 
      prev >= maxIndex ? 0 : prev + 1
    );
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => 
      prev === 0 ? maxIndex : prev - 1
    );
  }, [maxIndex]);

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(Math.max(0, index), maxIndex));
  };

  // --- Interaction Handlers ---

  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setDragOffset(0);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 50; // Minimum distance to trigger swipe

    if (dragOffset < -threshold) {
        // Dragged Left -> Next
        nextSlide();
    } else if (dragOffset > threshold) {
        // Dragged Right -> Prev
        prevSlide();
    }
    
    setDragOffset(0);
  };

  // Touch Events
  const onTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX);
  
  // Mouse Events
  const onMouseDown = (e: React.MouseEvent) => {
      // Don't prevent default immediately to allow click events to propagate if it's a click
      handleDragStart(e.clientX);
  };
  const onMouseMove = (e: React.MouseEvent) => {
      if(isDragging) e.preventDefault();
      handleDragMove(e.clientX);
  };

  // Wheel Event (Touchpad Swipe)
  const onWheel = (e: React.WheelEvent) => {
      // Basic debounce
      const now = Date.now();
      if (now - lastScrollTime.current < 500) return;

      // Check if horizontal scroll dominates
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 20) {
          lastScrollTime.current = now;
          if (e.deltaX > 0) {
              nextSlide();
          } else {
              prevSlide();
          }
      }
  };

  return (
    <div className="w-full relative group/carousel">
      <RevealOnScroll>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4 relative z-10">
            <div>
                <div className="absolute -left-10 -top-10 w-20 h-20 bg-primary/20 blur-2xl rounded-full pointer-events-none"></div>
                <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-500 relative z-10">
                {title}
                </h2>
                {subtitle && <p className="text-gray-400 text-lg relative z-10">{subtitle}</p>}
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent ml-8 hidden md:block mb-4"></div>
        </div>
      </RevealOnScroll>

      {/* Carousel Track Container */}
      <RevealOnScroll delay={100}>
        <div 
            className="relative w-full -mx-4 px-4 pb-4 pt-4 outline-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={handleDragEnd}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onWheel={onWheel}
        >
            {/* Gradient Overlay to indicate more content */}
            <div 
                className={`absolute top-4 bottom-4 right-0 w-32 bg-gradient-to-l from-[#020617] to-transparent z-10 pointer-events-none transition-opacity duration-300 hidden md:block ${
                    currentIndex >= maxIndex ? 'opacity-0' : 'opacity-100'
                }`} 
            />

            <div className={`overflow-hidden w-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
                <div 
                    className="flex will-change-transform"
                    style={{ 
                        transform: `translateX(calc(-${currentIndex * (100 / itemsPerScreen)}% + ${dragOffset}px))`,
                        transition: isDragging ? 'none' : 'transform 500ms cubic-bezier(0.25, 1, 0.5, 1)'
                    }}
                >
                    {videos.map((video) => (
                        <div 
                            key={video.id} 
                            className="flex-shrink-0 px-4 select-none"
                            style={{ width: `${100 / itemsPerScreen}%` }}
                        >
                            <VideoCard 
                                video={video} 
                                showDescription={showDescription} 
                                isDragging={isDragging} 
                            />
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Controls: Prev | Dots | Next */}
            <div className="flex justify-center items-center mt-10 gap-6">
                <button 
                    onClick={prevSlide}
                    className="p-3 rounded-full bg-surface border border-white/10 hover:border-primary/50 hover:bg-white/5 transition-all active:scale-95 group shadow-lg"
                    aria-label="Previous"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </button>

                <div className="flex gap-2">
                    {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => goToSlide(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                idx === currentIndex 
                                    ? 'w-8 bg-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]' 
                                    : 'w-2 bg-white/20 hover:bg-white/40'
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>

                <button 
                    onClick={nextSlide}
                    className="p-3 rounded-full bg-surface border border-white/10 hover:border-primary/50 hover:bg-white/5 transition-all active:scale-95 group shadow-lg"
                    aria-label="Next"
                >
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </button>
            </div>
        </div>
      </RevealOnScroll>
    </div>
  );
};

export default VideoCarousel;