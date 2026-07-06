'use client';

import React, { useState } from 'react';
import { getProductGallery } from '@/lib/productImages';

type Props = {
  title: string;
  category: string;
  badge: string;
  images: string[];
  productId?: string;
};

export default function ProductMediaGallery({ title, category, badge, images, productId = '' }: Props) {
  const gallery = getProductGallery({ images, category, id: productId });
  const [activeImg, setActiveImg] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative h-96 sm:h-[480px] bg-gray-100 rounded-2xl overflow-hidden shadow-sm border border-gray-200">
        <img
          src={gallery[activeImg]}
          alt={`${title} — photo ${activeImg + 1}`}
          className="w-full h-full object-cover transition-all duration-300"
        />
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <span className="bg-black/80 text-white border border-white/10 text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-lg">
            {category}
          </span>
          <span className="bg-crimson text-white text-[9px] font-extrabold tracking-widest uppercase px-2.5 py-0.5 rounded-md shadow-sm">
            {badge}
          </span>
        </div>
      </div>

      {gallery.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {gallery.map((img, idx) => (
            <button
              key={`${img}-${idx}`}
              type="button"
              onClick={() => setActiveImg(idx)}
              className={`h-16 w-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                activeImg === idx
                  ? 'border-crimson scale-95 shadow-md'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
