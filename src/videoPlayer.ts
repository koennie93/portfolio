/*!
 * Simple Video Player Helper
 */

import { jQueryReady } from './lib/jqueryReady';

/**
 * VideoPlayer class to handle custom video player functionality
 */
export class VideoPlayer {
  private _jquery: JQueryStatic;
  
  /**
   * Initialize the VideoPlayer
   * @param $ jQuery instance
   */
  constructor(jquery: JQueryStatic) {
    this._jquery = jquery;
    this.initErrorHandling();
    this.initCustomControls();
    this.initAutoplayOnScroll();
  }
  
  /**
   * Handle video errors
   */
  private initErrorHandling(): void {
    this._jquery('video').on('error', (error: Event) => {
      console.error('Video error:', error);
      
      // When a video fails to load, show the poster image instead
      const video = error.currentTarget as HTMLVideoElement;
      if (this._jquery(video).attr('poster')) {
        this._jquery(video).attr('poster', this._jquery(video).attr('poster') || '');
      }
      
      // Add error class for styling
      this._jquery(video).addClass('video-error');
    });
  }
  
  /**
   * Initialize custom play/pause controls
   */
  private initCustomControls(): void {
    this._jquery('.video-control-play').on('click', (event) => {
      const $button = this._jquery(event.currentTarget);
      const videoId = $button.data('video-target');
      const video = this._jquery('#' + videoId)[0] as HTMLVideoElement;
      
      if (video) {
        if (video.paused) {
          video.play();
          $button.addClass('playing');
        } else {
          video.pause();
          $button.removeClass('playing');
        }
      }
    });
  }
  
  /**
   * Initialize autoplay videos when they come into view
   */
  private initAutoplayOnScroll(): void {
    this._jquery(window).on('scroll', () => {
      this._jquery('video[data-autoplay]').each((_, element) => {
        const video = element as HTMLVideoElement;
        const $video = this._jquery(video);
        const videoTop = $video.offset()?.top || 0;
        const videoHeight = $video.height() || 0;
        const windowHeight = this._jquery(window).height() || 0;
        const windowScrollTop = this._jquery(window).scrollTop() || 0;
        
        // Check if video is in viewport
        if (videoTop < (windowScrollTop + windowHeight) && 
            (videoTop + videoHeight) > windowScrollTop) {
          // Play video if it's paused
          if (video.paused) {
            video.play().catch(e => {
              console.log('Autoplay prevented:', e);
            });
          }
        } else {
          // Pause video if it's playing
          if (!video.paused) {
            video.pause();
          }
        }
      });
    });
  }
  
  /**
   * Static method to initialize the video player
   */
  public static init(): void {
    jQueryReady(($) => {
      new VideoPlayer($);
    });
  }
}

// Initialize the video player
VideoPlayer.init(); 