'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { YOUTUBE_EMBED } from '@/data/homeSections';

export default function YouTubeCard() {
  const [playing, setPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative group rounded-none overflow-hidden border border-white/10 h-full"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-crimson via-red-500 to-crimson-dark rounded-none opacity-60 blur-lg group-hover:opacity-90 transition-opacity duration-500 animate-pulse" />

      <div className="relative bg-premium-black rounded-none overflow-hidden h-full flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="content text-white/80">Featured Video</span>
          </div>
          <span className="content text-white/40 tabular-nums">India Trade Awards</span>
        </div>

        <div className="relative aspect-video flex-1">
          {!playing ? (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="absolute inset-0 w-full h-full cursor-pointer"
              aria-label="Play Hindustan Portable Cabins video"
            >
              <img
                src="/wp-content/uploads/2025/08/IMG_20210331_103428-scaled.jpg"
                alt="Hindustan Portable Cabins - India Trade Awards"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-crimson/90 backdrop-blur flex items-center justify-center border-2 border-white/30">
                  <Play className="w-7 h-7 sm:w-9 sm:h-9 text-white fill-white ml-1" />
                </div>
              </motion.div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-left">
                <p className="content text-white">Hindustan Portable Cabins</p>
                <p className="content text-white/60 mt-0.5">India Trade Awards Recognition</p>
              </div>
            </button>
          ) : (
            <iframe
              src={`${YOUTUBE_EMBED}?autoplay=1`}
              title="Hindustan Portable Cabins - India Trade Awards"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
