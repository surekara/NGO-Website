import React, { useState, useEffect } from 'react';
import './GallerySection.css';
import { motion } from 'framer-motion';
import { DrawLine, Shimmer, SplitWords } from '@/components/motion';

interface GalleryImage { src: string; cropTop?: boolean }

// New photos + non-duplicate existing gallery images
// cropTop: true = object-position top, hides GPS watermarks at bottom
const images: GalleryImage[] = [
  { src: '/gallery-new-1.jpg', cropTop: true },   // 3 students at shop
  { src: '/gallery-new-2.jpg' },                   // group cleanup drive
  { src: '/gallery-new-3.jpg', cropTop: true },   // food serving
  { src: '/gallery-new-4.jpg' },                   // onboarding session
  { src: '/gallery-new-5.jpg', cropTop: true },   // volunteers with family
  { src: '/Copy of 19f2a1ee-42ec-4015-8100-bb731905297a.jpeg' },
  { src: '/Copy of 9c9d2438-adde-413f-862a-31baebd1ec25.jpeg' },
  { src: '/Copy of IMG-20250610-WA0020.jpg' },
  { src: '/Copy of IMG-20250610-WA0028.jpg' },
  { src: '/Copy of WhatsApp Image 2024-12-18 at 08.38.42.jpeg' },
  { src: '/Copy of WhatsApp Image 2025-02-26 at 15.50.57.jpeg' },
  { src: '/Copy of WhatsApp Image 2025-03-04 at 17.08.10 (1).jpeg' },
];

const GallerySection: React.FC = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (imageIndex: number) => {
    setCurrentImageIndex(imageIndex);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [lightboxOpen]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [lightboxOpen]);

  return (
    <section className="py-16 overflow-hidden bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="relative overflow-hidden inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            <Shimmer />
            📸 Moments of Impact
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white">
            <SplitWords text="Our" inView />{" "}
            <SplitWords text="Gallery" inView delay={0.12} wordClassName="text-yellow-400 italic pr-1" />
          </h2>
          <DrawLine className="mx-auto mb-5 h-[3px] w-24 rounded-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
          <p className="text-gray-400 text-lg">
            A glimpse into our community initiatives and the lives we've touched. Click any image to view it full size.
          </p>
        </div>
      </div>

      {/* Split images into 3 non-overlapping groups so each row shows unique photos */}
      {(() => {
        const row1 = images.filter((_, i) => i % 3 === 0);  // indices 0,3,6,9
        const row2 = images.filter((_, i) => i % 3 === 1);  // indices 1,4,7,10
        const row3 = images.filter((_, i) => i % 3 === 2);  // indices 2,5,8,11
        const origIdx = (rowImages: GalleryImage[], localIdx: number) =>
          images.indexOf(rowImages[localIdx % rowImages.length]);

        const renderRow = (
          rowImages: GalleryImage[],
          animClass: string,
          rowKey: string,
        ) => (
          <motion.div
            className="scrolling-row-container"
            initial={{ opacity: 0, x: rowKey === 'row2' ? 200 : -200 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: rowKey === 'row1' ? 0 : rowKey === 'row2' ? 0.15 : 0.3 }}
          >
            <div className={`scrolling-row ${animClass}`}>
              {[...rowImages, ...rowImages].map((img, index) => {
                const globalIdx = origIdx(rowImages, index);
                return (
                  <button key={`${rowKey}-${index}`} className="gallery-image-button"
                    onClick={() => openLightbox(globalIdx)} aria-label={`View image ${globalIdx + 1}`}>
                    <img src={img.src} alt={`Foundation work ${globalIdx + 1}`}
                      className={`gallery-image${img.cropTop ? ' gallery-image-crop-top' : ''}`} />
                  </button>
                );
              })}
            </div>
          </motion.div>
        );

        return (
          <div className="flex flex-col gap-5">
            {renderRow(row1, 'animate-scroll-slow',   'row1')}
            {renderRow(row2, 'animate-scroll-medium', 'row2')}
            {renderRow(row3, 'animate-scroll-fast',   'row3')}
          </div>
        );
      })()}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="lightbox-overlay" 
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <div 
            className="lightbox-content" 
            onClick={(e) => e.stopPropagation()}
            role="img"
            aria-label={`Image ${currentImageIndex + 1} of ${images.length}`}
          >
            <button className="lightbox-close" onClick={closeLightbox}>
              ×
            </button>
            
            <button className="lightbox-nav lightbox-prev" onClick={prevImage}>
              ‹
            </button>
            
            <img
              src={images[currentImageIndex].src}
              alt={`Foundation work ${currentImageIndex + 1}`}
              className="lightbox-image"
            />
            
            <button className="lightbox-nav lightbox-next" onClick={nextImage}>
              ›
            </button>
            
            <div className="lightbox-counter">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
