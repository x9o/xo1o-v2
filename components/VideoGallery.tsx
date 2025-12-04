import React from 'react';
import { VideoProject } from '../types';
import RevealOnScroll from './RevealOnScroll';
import { PlayCircle } from './Icons';

interface VideoGalleryProps {
  videos: VideoProject[];
  title: string;
  subtitle?: string;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ videos, title, subtitle }) => {
  return (
    <div className="w-full">
      <RevealOnScroll>
        <div className="mb-12 text-center md:text-left relative">
            <div className="absolute -left-10 -top-10 w-20 h-20 bg-primary/20 blur-2xl rounded-full pointer-events-none"></div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight relative z-10">
            {title}
            </h2>
            {subtitle && <p className="text-gray-400 max-w-2xl relative z-10 text-lg">{subtitle}</p>}
        </div>
      </RevealOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video, index) => (
          <RevealOnScroll key={video.id} delay={index * 100}>
            <div className="group bg-surface rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              {/* Embed Wrapper */}
              <div className="relative w-full pt-[56.25%] bg-black overflow-hidden">
                 <div className="absolute inset-0 bg-black/50 group-hover:bg-transparent transition-colors z-10 pointer-events-none" />
                <iframe
                  src={`https://www.youtube.com/embed/${video.videoId}?modestbranding=1&rel=0`}
                  title={video.title}
                  className="absolute top-0 left-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              
              <div className="p-6 relative">
                 <div className="absolute top-0 left-6 -translate-y-1/2 w-10 h-10 bg-surface border border-white/10 rounded-full flex items-center justify-center text-primary shadow-lg group-hover:scale-110 transition-transform">
                    <PlayCircle size={20} />
                 </div>
                <h3 className="text-lg font-bold text-white mb-2 mt-2 group-hover:text-primary transition-colors">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {video.description}
                </p>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
};

export default VideoGallery;