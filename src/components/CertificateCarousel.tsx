'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';

type Slide = { src: string; title: string };

type Props = {
  slides: Slide[];
  accentColor?: string;
};

export default function CertificateCarousel({ slides, accentColor = '#017501' }: Props) {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      dragFree: true,
      watchDrag: false,
    },
    [
      AutoScroll({
        speed: 1.2,
        startDelay: 0,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        playOnInit: true,
      }),
    ],
  );

  if (!slides.length) return null;

  return (
    <section
      id="certificates-section"
      className="relative overflow-hidden py-16 sm:py-20 section-bg-white border-b border-hairline"
    >
      <h2 className="text-center section-title text-premium-black mb-10 sm:mb-12 px-4">
        Certificates
      </h2>

      <div className="carousel-viewport" ref={emblaRef}>
        <div className="carousel-track">
          {slides.map((slide) => (
            <div
              key={slide.src}
              className="carousel-slide basis-[72%] sm:basis-[48%] md:basis-[36%] lg:basis-[26%] xl:basis-[22%]"
            >
              <div className="bg-white rounded-sm border border-gray-100 p-2 sm:p-2.5 h-full">
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-white">
                  <img
                    src={slide.src}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-contain object-center"
                    loading="lazy"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ backgroundColor: accentColor }}
        aria-hidden
      />
    </section>
  );
}
