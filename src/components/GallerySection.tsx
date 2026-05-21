import React, { useState, useEffect } from 'react';
import './GallerySection.css';

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
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            📸 Moments of Impact
          </div>
          <h2 className="text-4xl font-bold mb-4 text-white">Our Gallery</h2>
          <p className="text-gray-400 text-lg">
            A glimpse into our community initiatives and the lives we've touched. Click any image to view it full size.
          </p>
        </div>
      </div>

      {/* Vertically stacked rows with continuous scrolling */}
      <div className="flex flex-col gap-5">
        {/* Row 1 - Slowest */}
        <div className="scrolling-row-container">
          <div className="scrolling-row animate-scroll-slow">
            {[...images, ...images].map((img, index) => (
              <button
                key={`row1-${index}`}
                className="gallery-image-button"
                onClick={() => openLightbox(index % images.length)}
                aria-label={`View image ${(index % images.length) + 1}`}
              >
                <img src={img.src} alt={`Community work ${(index % images.length) + 1}`}
                  className={`gallery-image${img.cropTop ? ' gallery-image-crop-top' : ''}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Row 2 - Medium Speed */}
        <div className="scrolling-row-container">
          <div className="scrolling-row animate-scroll-medium">
            {[...images.slice(4), ...images.slice(0, 4), ...images.slice(4), ...images.slice(0, 4)].map((img, index) => {
              const imageIndex = (index + 4) % images.length;
              return (
                <button key={`row2-${index}`} className="gallery-image-button"
                  onClick={() => openLightbox(imageIndex)} aria-label={`View image ${imageIndex + 1}`}>
                  <img src={img.src} alt={`Foundation activities ${imageIndex + 1}`}
                    className={`gallery-image${img.cropTop ? ' gallery-image-crop-top' : ''}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3 - Fastest */}
        <div className="scrolling-row-container">
          <div className="scrolling-row animate-scroll-fast">
            {[...images.slice(7), ...images.slice(0, 7), ...images.slice(7), ...images.slice(0, 7)].map((img, index) => {
              const imageIndex = (index + 7) % images.length;
              return (
                <button key={`row3-${index}`} className="gallery-image-button"
                  onClick={() => openLightbox(imageIndex)} aria-label={`View image ${imageIndex + 1}`}>
                  <img src={img.src} alt={`Outreach programs ${imageIndex + 1}`}
                    className={`gallery-image${img.cropTop ? ' gallery-image-crop-top' : ''}`} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

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
