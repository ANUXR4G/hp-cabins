'use client';

import React from 'react';

type Props = {
  title: string;
  videos: string[];
};

function toEmbedUrl(url: string): string {
  if (url.includes('youtube.com/embed/')) return url;
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  return url;
}

function isFileVideo(url: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url);
}

export default function ProductVideosSection({ title, videos }: Props) {
  if (!videos.length) return null;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-none border border-gray-200/60 space-y-6">
      <h2 className="text-lg font-bold uppercase border-l-2 border-crimson pl-3 text-premium-black font-display">
        Our Videos
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((src, idx) => (
          <div
            key={`${src}-${idx}`}
            className="relative rounded-none overflow-hidden border border-gray-200 bg-black aspect-video"
          >
            {isFileVideo(src) ? (
              <video
                src={src}
                className="w-full h-full object-contain bg-black"
                controls
                playsInline
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <iframe
                src={toEmbedUrl(src)}
                title={`${title} video ${idx + 1}`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
