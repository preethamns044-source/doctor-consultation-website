import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import Container from '../layout/Container';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function GallerySection() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data) {
        setImages(data);
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  }, []);

  const nextImage = useCallback((e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  }, [images.length]);

  const prevImage = useCallback((e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, closeLightbox, nextImage, prevImage]);

  if (loading || images.length === 0) {
    return null; // Do not show anything if loading or empty
  }

  return (
    <section id="gallery" className="py-12 sm:py-20 bg-white border-b border-slate-100">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200/80">
            Clinic Gallery
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-3">
            <ImageIcon className="w-8 h-8 text-teal-700" />
            Our Practice
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Take a look at our clinic environment, advanced facilities, and patient care moments.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {images.map((image, index) => (
            <div 
              key={image.id}
              className="group relative rounded-2xl overflow-hidden bg-slate-100 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
              onClick={() => openLightbox(index)}
            >
              <div className="aspect-[4/3] relative">
                <img 
                  src={image.image_url} 
                  alt={image.title || 'Clinic gallery image'} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Title (if exists) */}
                {image.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white font-medium text-sm sm:text-base line-clamp-2">
                      {image.title}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button 
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 p-2 rounded-full transition-colors z-10"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Main Image Container */}
          <div 
            className="relative w-full max-w-6xl max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image area
          >
            <img 
              src={images[currentIndex].image_url} 
              alt={images[currentIndex].title || 'Expanded gallery image'} 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            
            {/* Title Display */}
            {images[currentIndex].title && (
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950/90 to-transparent text-center rounded-b-lg">
                <p className="text-white text-sm sm:text-lg font-medium">
                  {images[currentIndex].title}
                </p>
              </div>
            )}

            {/* Navigation Arrows (Only show if > 1 image) */}
            {images.length > 1 && (
              <>
                <button 
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 p-3 sm:p-4 rounded-full transition-colors"
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
                <button 
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 p-3 sm:p-4 rounded-full transition-colors"
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
              </>
            )}
          </div>
          
          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium bg-slate-900/60 px-3 py-1 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </section>
  );
}
