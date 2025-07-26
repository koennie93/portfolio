import $ from 'jquery';

interface GalleryState {
  [galleryId: string]: {
    currentSlide: number;
    totalSlides: number;
    slideWidth: number;
  };
}

interface FullscreenGallery {
  images: string[];
  currentIndex: number;
  galleryId: string;
}

class ImageGallery {
  private galleries: GalleryState = {};
  private currentGallery: FullscreenGallery | null = null;
  private modal: HTMLElement | null = null;
  private modalImage: HTMLImageElement | null = null;
  private prevButton: HTMLElement | null = null;
  private nextButton: HTMLElement | null = null;
  private counter: HTMLElement | null = null;
  private closeButton: HTMLElement | null = null;
  private scrollPreventionActive: boolean = false;

  constructor() {
    this.initializeGalleries();
    this.initializeModal();
    this.setupEventListeners();
  }

  private initializeGalleries(): void {
    // Initialize all compact galleries on page load
    const galleryContainers = document.querySelectorAll('.gallery-container');
    
    galleryContainers.forEach((container) => {
      const slides = container.querySelectorAll('.gallery-slide');
      
      if (slides.length > 0) {
        // Extract modal ID from slide IDs (format: slide-4-0, slide-4-1, etc.)
        const firstSlide = slides[0] as HTMLElement;
        const slideId = firstSlide.id;
        const modalId = slideId.split('-')[1]; // Extract modal ID from slide-X-Y format
        const galleryId = `gallery-${modalId}`;
        
        this.galleries[galleryId] = {
          currentSlide: 0, // 0-based index
          totalSlides: slides.length,
          slideWidth: 0 // Not needed for this approach
        };
        
        // Set initial active dot
        this.updateDots(galleryId, 0);
      }
    });
  }

  private initializeModal(): void {
    this.modal = document.getElementById('fullscreen-modal');
    this.modalImage = document.getElementById('fullscreen-image') as HTMLImageElement;
    this.prevButton = document.getElementById('fullscreen-prev');
    this.nextButton = document.getElementById('fullscreen-next');
    this.counter = document.getElementById('fullscreen-counter');
    this.closeButton = document.getElementById('fullscreen-close');
  }

  private setupEventListeners(): void {
    // Gallery navigation
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      // Handle gallery navigation arrows
      if (target.classList.contains('gallery-nav')) {
        e.preventDefault();
        const galleryId = target.getAttribute('data-gallery');
        const direction = parseInt(target.getAttribute('data-direction') || '0');
        
        if (galleryId) {
          this.navigateGallery(galleryId, direction);
        }
        return;
      }
      
      // Handle dot navigation
      if (target.classList.contains('gallery-dot')) {
        e.preventDefault();
        const galleryId = target.getAttribute('data-gallery');
        const slideIndex = parseInt(target.getAttribute('data-index') || '0');
        
        if (galleryId) {
          this.goToSlide(galleryId, slideIndex);
        }
        return;
      }

      // Handle image clicks for fullscreen
      if (target.tagName === 'IMG' && target.closest('.gallery-slide')) {
        e.preventDefault();
        this.openImageFullscreen(target as HTMLImageElement);
        return;
      }

      // Handle single image fullscreen
      if (target.hasAttribute('data-fullscreen-single')) {
        e.preventDefault();
        this.openSingleImageFullscreen(target as HTMLImageElement);
        return;
      }

      // Handle fullscreen modal close
      if (target === this.modal || target === this.closeButton) {
        this.closeFullscreen();
        return;
      }

      // Handle fullscreen navigation
      if (target === this.prevButton) {
        this.previousImage();
      } else if (target === this.nextButton) {
        this.nextImage();
      }
    });

    // Keyboard navigation for fullscreen
    document.addEventListener('keydown', (e) => {
      if (this.currentGallery && this.modal?.style.display !== 'none') {
        switch (e.key) {
          case 'Escape':
            this.closeFullscreen();
            break;
          case 'ArrowLeft':
            this.previousImage();
            break;
          case 'ArrowRight':
            this.nextImage();
            break;
        }
      }
    });
  }

  private navigateGallery(galleryId: string, direction: number): void {
    if (!this.galleries[galleryId]) return;
    
    const gallery = this.galleries[galleryId];
    let newSlide = gallery.currentSlide + direction;
    
    // Handle wrapping
    if (newSlide >= gallery.totalSlides) {
      newSlide = 0;
    } else if (newSlide < 0) {
      newSlide = gallery.totalSlides - 1;
    }
    
    this.goToSlide(galleryId, newSlide);
  }

  private goToSlide(galleryId: string, slideIndex: number): void {
    if (!this.galleries[galleryId]) return;
    
    const gallery = this.galleries[galleryId];
    
    // Update current slide
    gallery.currentSlide = slideIndex;
    
    // Extract modal ID from gallery ID (format: gallery-4)
    const modalId = galleryId.split('-')[1];
    
    // Hide all slides
    for (let i = 0; i < gallery.totalSlides; i++) {
      const slide = document.getElementById(`slide-${modalId}-${i}`);
      if (slide) {
        slide.style.display = 'none';
      }
    }
    
    // Show current slide
    const currentSlide = document.getElementById(`slide-${modalId}-${slideIndex}`);
    if (currentSlide) {
      currentSlide.style.display = 'block';
    }
    
    // Update dots
    this.updateDots(galleryId, slideIndex);
  }

  private updateDots(galleryId: string, activeSlide: number): void {
    const dots = document.querySelectorAll(`[data-gallery="${galleryId}"].gallery-dot`);
    
    dots.forEach((dot, index) => {
      const dotElement = dot as HTMLElement;
      if (index === activeSlide) {
        dotElement.style.background = 'rgba(255,255,255,1)';
        dotElement.style.transform = 'scale(1.2)';
      } else {
        dotElement.style.background = 'rgba(255,255,255,0.5)';
        dotElement.style.transform = 'scale(1)';
      }
    });
  }

  private openImageFullscreen(img: HTMLImageElement): void {
    // Find the gallery this image belongs to
    const gallerySlide = img.closest('.gallery-slide');
    const galleryContainer = gallerySlide?.parentElement;
    
    if (!galleryContainer) return;
    
    // Extract gallery ID from slide ID (format: slide-4-0)
    const slideElement = gallerySlide as HTMLElement;
    const slideId = slideElement.id;
    const modalId = slideId.split('-')[1];
    const galleryId = `gallery-${modalId}`;
    
    if (!this.galleries[galleryId]) return;

    // Get all images in this gallery
    const slides = galleryContainer.querySelectorAll('.gallery-slide img');
    const images: string[] = [];
    let currentIndex = 0;
    
    slides.forEach((slideImg, index) => {
      const imgElement = slideImg as HTMLImageElement;
      images.push(imgElement.src);
      if (imgElement === img) {
        currentIndex = index;
      }
    });

    this.currentGallery = {
      images,
      currentIndex,
      galleryId
    };

    this.showFullscreenImage();
    this.showNavigationControls(true);
  }

  private openSingleImageFullscreen(img: HTMLImageElement): void {
    const src = img.getAttribute('data-fullscreen-src') || img.src;
    
    this.currentGallery = {
      images: [src],
      currentIndex: 0,
      galleryId: 'single'
    };

    this.showFullscreenImage();
    this.showNavigationControls(false);
  }

  private showFullscreenImage(): void {
    if (!this.currentGallery || !this.modal || !this.modalImage) return;

    const currentImageSrc = this.currentGallery.images[this.currentGallery.currentIndex];
    
    // Fade out
    this.modalImage.style.opacity = '0';
    
    // Load new image
    this.modalImage.onload = () => {
      // Fade in
      this.modalImage.style.opacity = '1';
    };
    
    this.modalImage.src = currentImageSrc;
    
    // Update counter
    if (this.counter && this.currentGallery.images.length > 1) {
      this.counter.textContent = `${this.currentGallery.currentIndex + 1} / ${this.currentGallery.images.length}`;
      this.counter.style.display = 'block';
    } else if (this.counter) {
      this.counter.style.display = 'none';
    }

    // Show modal
    this.modal.style.display = 'block';
    
    // Disable scrolling
    this.preventScrolling();
    
    // Add smooth transition
    this.modalImage.style.transition = 'opacity 0.3s ease';
  }

  private showNavigationControls(show: boolean): void {
    if (!this.prevButton || !this.nextButton) return;
    
    if (show && this.currentGallery && this.currentGallery.images.length > 1) {
      this.prevButton.style.display = 'block';
      this.nextButton.style.display = 'block';
    } else {
      this.prevButton.style.display = 'none';
      this.nextButton.style.display = 'none';
    }
  }

  private previousImage(): void {
    if (!this.currentGallery || this.currentGallery.images.length <= 1) return;
    
    this.currentGallery.currentIndex = 
      this.currentGallery.currentIndex === 0 
        ? this.currentGallery.images.length - 1 
        : this.currentGallery.currentIndex - 1;
    
    this.showFullscreenImage();
  }

  private nextImage(): void {
    if (!this.currentGallery || this.currentGallery.images.length <= 1) return;
    
    this.currentGallery.currentIndex = 
      this.currentGallery.currentIndex === this.currentGallery.images.length - 1 
        ? 0 
        : this.currentGallery.currentIndex + 1;
    
    this.showFullscreenImage();
  }

  private closeFullscreen(): void {
    if (!this.modal) return;
    
    this.modal.style.display = 'none';
    
    // Re-enable scrolling
    this.restoreScrolling();
    
    this.currentGallery = null;
  }

  private preventScrolling(): void {
    if (this.scrollPreventionActive) return;
    
    // CSS approach - hide scrollbars completely
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    // Additional scrollbar hiding
    document.documentElement.style.scrollbarWidth = 'none'; // Firefox
    (document.documentElement.style as any).msOverflowStyle = 'none'; // IE/Edge
    
    // Create or update webkit scrollbar hiding style
    let style = document.getElementById('hide-scrollbars') as HTMLStyleElement;
    if (!style) {
      style = document.createElement('style');
      style.id = 'hide-scrollbars';
      document.head.appendChild(style);
    }
    style.textContent = `
      ::-webkit-scrollbar { display: none !important; }
      body::-webkit-scrollbar { display: none !important; }
      html::-webkit-scrollbar { display: none !important; }
    `;
    
    // Event listener approach
    document.addEventListener('wheel', this.preventScrollEvent, { passive: false });
    document.addEventListener('touchmove', this.preventScrollEvent, { passive: false });
    document.addEventListener('keydown', this.preventScrollKeys, false);
    
    this.scrollPreventionActive = true;
  }

  private restoreScrolling(): void {
    if (!this.scrollPreventionActive) return;
    
    // Restore CSS
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.height = '';
    
    // Restore scrollbar styles
    document.documentElement.style.scrollbarWidth = '';
    (document.documentElement.style as any).msOverflowStyle = '';
    
    // Remove webkit scrollbar hiding style
    const style = document.getElementById('hide-scrollbars');
    if (style) {
      style.remove();
    }
    
    // Remove event listeners
    document.removeEventListener('wheel', this.preventScrollEvent);
    document.removeEventListener('touchmove', this.preventScrollEvent);
    document.removeEventListener('keydown', this.preventScrollKeys);
    
    this.scrollPreventionActive = false;
  }

  private preventScrollEvent = (e: Event): void => {
    e.preventDefault();
    e.stopPropagation();
  }

  private preventScrollKeys = (e: KeyboardEvent): void => {
    // Allow fullscreen navigation keys
    if (['ArrowLeft', 'ArrowRight', 'Escape'].includes(e.key)) {
      return;
    }
    
    // Prevent page scroll keys
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  // Public method to manually navigate gallery
  public navigateToSlide(galleryId: string, slideIndex: number): void {
    this.goToSlide(galleryId, slideIndex);
  }
}

// Initialize gallery immediately when module loads
new ImageGallery();

// Also initialize when DOM is ready (for edge cases)
document.addEventListener('DOMContentLoaded', () => {
  new ImageGallery();
});

export default ImageGallery; 