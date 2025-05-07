/**
 * Enhanced Analytics Module
 * This module provides advanced tracking capabilities using Google Analytics.
 */

// Declare the gtag function for TypeScript
declare function gtag(...args: any[]): void;

/**
 * Enhanced Analytics class for advanced tracking functionality
 */
export class EnhancedAnalytics {
  private _scrollMarksReached: number[] = [];
  private _loadTime: Date;
  
  /**
   * Initialize the Enhanced Analytics
   */
  constructor() {
    this._loadTime = new Date();
    this._initButtonTracking();
    this._initLinkTracking();
    this._initFormTracking();
    this._initScrollDepthTracking();
    this._initTimeOnPageTracking();
  }
  
  /**
   * Static method to initialize the analytics tracking
   */
  public static init(): void {
    // Initialize only if gtag is available
    if (typeof gtag !== 'undefined') {
      new EnhancedAnalytics();
    } else {
      console.warn('Google Analytics not found, enhanced tracking not initialized');
    }
  }
  
  /**
   * Track button clicks with additional data
   */
  public trackButtonClick(button: HTMLElement, category = 'Engagement'): void {
    try {
      gtag('event', 'button_click', {
        'event_category': category,
        'event_label': button.innerText || button.textContent || 'unnamed button',
        'button_id': button.id || undefined,
        'button_class': button.className || undefined
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  /**
   * Track form submissions
   */
  public trackFormSubmission(form: HTMLFormElement, formName: string): void {
    try {
      gtag('event', 'form_submission', {
        'event_category': 'Forms',
        'event_label': formName,
        'form_id': form.id || undefined,
        'form_fields': form.elements.length
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  /**
   * Track file downloads
   */
  public trackDownload(link: HTMLAnchorElement): void {
    try {
      gtag('event', 'file_download', {
        'event_category': 'Downloads',
        'event_label': link.href.split('/').pop() || 'unnamed file',
        'file_extension': link.href.split('.').pop()
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  /**
   * Track external link clicks
   */
  public trackExternalLink(link: HTMLAnchorElement): void {
    try {
      const host = window.location.hostname;
      
      // Check if the link is external
      if (link.hostname && link.hostname !== host && !link.hostname.includes(host)) {
        gtag('event', 'external_link_click', {
          'event_category': 'Outbound Links',
          'event_label': link.href,
          'destination_domain': link.hostname
        });
      }
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  /**
   * Track post clicks
   */
  public trackPostClick(link: HTMLAnchorElement): void {
    try {
      // Get post title from data attribute or fallback to link text
      const postTitle = link.getAttribute('data-project-title') || link.textContent || 'Unnamed post';
      const projectId = link.getAttribute('href')?.replace('#portfolioModal-', '') || 'unknown';
      
      gtag('event', 'post_click', {
        'event_category': 'Posts',
        'event_label': postTitle,
        'project_id': projectId
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  /**
   * Track portfolio item views
   */
  public trackPortfolioItemView(item: HTMLElement): void {
    try {
      let projectTitle = '';
      
      // Try to get the title from various elements
      const titleElem = item.querySelector('h3, h4, .portfolio-title');
      if (titleElem) {
        projectTitle = titleElem.textContent || '';
      }
      
      // Get the category if available
      let projectCategory = item.dataset.category || 'Uncategorized';
      
      // Send the event
      gtag('event', 'view_project', {
        'event_category': 'Portfolio',
        'event_label': projectTitle,
        'project_category': projectCategory
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  /**
   * Initialize button click tracking
   */
  private _initButtonTracking(): void {
    try {
      document.querySelectorAll('button, .btn').forEach(button => {
        button.addEventListener('click', () => {
          this.trackButtonClick(button as HTMLElement);
        });
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }
  
  /**
   * Initialize link tracking for different types of links
   */
  private _initLinkTracking(): void {
    try {
      // Add post click tracking
      document.querySelectorAll('.portfolio-link').forEach(link => {
        link.addEventListener('click', () => {
          this.trackPostClick(link as HTMLAnchorElement);
        });
      });
      
      // Add download tracking
      document.querySelectorAll('a[download], a[href$=".pdf"], a[href$=".doc"], a[href$=".docx"], a[href$=".xls"], a[href$=".xlsx"], a[href$=".zip"]').forEach(link => {
        link.addEventListener('click', () => {
          this.trackDownload(link as HTMLAnchorElement);
        });
      });
      
      // Add external link tracking
      document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.addEventListener('click', () => {
          this.trackExternalLink(link as HTMLAnchorElement);
        });
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }
  
  /**
   * Initialize form tracking
   */
  private _initFormTracking(): void {
    try {
      document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', () => {
          const formName = form.getAttribute('name') || form.getAttribute('id') || 'unnamed form';
          this.trackFormSubmission(form as HTMLFormElement, formName);
        });
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  /**
   * Initialize scroll depth tracking
   */
  private _initScrollDepthTracking(): void {
    try {
      const scrollMarks = [25, 50, 75, 90, 100];
      
      window.addEventListener('scroll', () => {
        // Calculate current scroll percentage
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPosition = window.scrollY;
        const scrollPercentage = Math.round((scrollPosition / scrollHeight) * 100);
        
        // Check which scroll marks we've passed
        for (const mark of scrollMarks) {
          if (scrollPercentage >= mark && !this._scrollMarksReached.includes(mark)) {
            this._scrollMarksReached.push(mark);
            
            // Track the scroll depth
            gtag('event', 'scroll_depth', {
              'event_category': 'Page Interaction',
              'event_label': `Scrolled ${mark}%`,
              'value': mark
            });
          }
        }
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  /**
   * Initialize time on page tracking
   */
  private _initTimeOnPageTracking(): void {
    try {
      // Track time intervals (30s, 1m, 2m, 5m)
      const timeIntervals = [30, 60, 120, 300];
      
      timeIntervals.forEach(seconds => {
        setTimeout(() => {
          gtag('event', 'time_on_page', {
            'event_category': 'Page Interaction',
            'event_label': `${seconds} seconds`,
            'value': seconds
          });
        }, seconds * 1000);
      });
      
      // Track time on page when leaving
      window.addEventListener('beforeunload', () => {
        const timeSpent = Math.round((new Date().getTime() - this._loadTime.getTime()) / 1000);
        
        gtag('event', 'time_on_page_exit', {
          'event_category': 'Page Interaction',
          'event_label': 'Exit',
          'value': timeSpent
        });
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }
}

// Initialize the enhanced analytics tracking
EnhancedAnalytics.init(); 