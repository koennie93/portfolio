// Import and set up jQuery first, before any other modules
import $ from 'jquery';
import 'jquery.easing';

// Import all modules statically for webpack to include them
import './darkMode';
import './classie';
import './cbpAnimatedHeader';
import './freelancer';
import './contactMe';
// import './contact_me_static';
import './analyticsEnhanced';
import './videoPlayer';
import './imageGallery';

// Make jQuery available globally
(window as any).$ = $;
(window as any).jQuery = $;

// Type definition for jQuery with Bootstrap extensions
interface JQueryBootstrap extends JQuery<HTMLElement> {
  modal(action?: string | { [key: string]: any }): JQuery<HTMLElement>;
}

// Wait for the DOM to be ready before initializing
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded, initializing components...');
  
  // Try to use Bootstrap's native methods if available, otherwise fall back to manual implementations
  const isBootstrapModalAvailable = $ && $.fn && typeof ($.fn as any).modal === 'function';
  console.log('Bootstrap modal is available:', isBootstrapModalAvailable);

  // Re-initialize Bootstrap components 
  if (isBootstrapModalAvailable) {
    try {
      // Initialize all modals
      ($('.portfolio-modal') as JQueryBootstrap).modal({
        show: false,
        keyboard: true,
        backdrop: 'static'
      });
      console.log('Bootstrap modals initialized');
    } catch (e) {
      console.error('Error initializing Bootstrap modals:', e);
    }
  }
  
  // Handle portfolio item clicks
  $('.portfolio-link').on('click', function(e) {
    e.preventDefault();
    
    // Get the modal ID from the href attribute
    const modalId = $(this).attr('href');
    console.log('Opening modal:', modalId);
    
    if (isBootstrapModalAvailable) {
      // Try using Bootstrap's built-in modal functionality
      try {
        ($(modalId) as JQueryBootstrap).modal('show');
      } catch (e) {
        console.error('Error showing modal with Bootstrap:', e);
        // Fall back to manual implementation
        manuallyOpenModal(modalId);
      }
    } else {
      // Use our manual implementation
      manuallyOpenModal(modalId);
    }
  });
  
  // Handle modal close buttons
  $('[data-dismiss="modal"]').on('click', function() {
    const $modal = $(this).closest('.modal');
    
    if (isBootstrapModalAvailable) {
      // Try using Bootstrap's built-in modal functionality
      try {
        ($modal as JQueryBootstrap).modal('hide');
      } catch (e) {
        console.error('Error hiding modal with Bootstrap:', e);
        // Fall back to manual implementation
        manuallyCloseModal($modal);
      }
    } else {
      // Use our manual implementation
      manuallyCloseModal($modal);
    }
  });
  
  // Manual implementation to open a modal
  function manuallyOpenModal(modalId: string) {
    const $modal = $(modalId);
    
    // Add modal-open class to body
    $('body').addClass('modal-open');
    
    // Add backdrop
    if ($('.modal-backdrop').length === 0) {
      $('body').append('<div class="modal-backdrop fade in"></div>');
    }
    
    // Show the modal
    $modal.css('display', 'block');
    
    // Add the 'in' class to fade it in
    setTimeout(() => {
      $modal.addClass('in');
    }, 10);
  }
  
  // Manual implementation to close a modal
  function manuallyCloseModal($modal: JQuery<HTMLElement>) {
    // Remove the 'in' class to fade it out
    $modal.removeClass('in');
    
    // Hide the modal after the fade-out animation
    setTimeout(() => {
      $modal.css('display', 'none');
      
      // Remove backdrop if this is the last open modal
      if ($('.modal.in').length === 0) {
        $('.modal-backdrop').remove();
        $('body').removeClass('modal-open');
      }
    }, 300); // 300ms to match Bootstrap's transition duration
  }
  
  console.log('Portfolio site initialized with enhanced modal handlers');
}); 