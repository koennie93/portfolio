import { Component } from './lib/Component';

// Define an enum for theme types
enum Theme {
  DARK = 'dark',
  LIGHT = 'light'
}

/**
 * Class that manages the dark mode functionality
 * 
 * This component requires special initialization to prevent flash of unstyled content (FOUC).
 * It uses an early initialization pattern to apply theme settings as soon as possible, rather
 * than waiting for the standard Component initialization flow.
 */
class DarkModeManager extends Component {
  private _toggleSwitch: HTMLInputElement | null = null;
  
  /**
   * Create a new DarkModeManager
   * 
   * Note: We disable the standard Component initialization flow by setting autoInit to false
   * and instead call initEarly() directly to apply theme settings as soon as possible.
   */
  constructor() {
    // We set autoInit to false because we need special initialization logic
    super('body', false);
    this._initEarly();
  }
  
  /**
   * Standard component initialization (called when jQuery is ready)
   * 
   * This implementation is minimal because most initialization happens in initEarly().
   * This method is required by the Component base class but not the primary initialization
   * method for this specific component.
   */
  protected init($: JQueryStatic): void {
    // Additional initialization can be done here if needed
    // But most of our initialization is in initDarkMode
  }
  
  /**
   * Initialize as early as possible, even before DOM is fully loaded
   * 
   * This method initializes the dark mode before the standard Component initialization
   * to prevent flash of unstyled content. It:
   * 1. Attaches to DOM state changes to initialize as early as possible
   * 2. Includes a fallback if the toggle isn't found immediately
   * 3. Sets up listeners for theme toggling
   */
  private _initEarly(): void {
    // Try to initialize as soon as possible
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this._initDarkMode());
    } else {
      // DOM already loaded, run now
      this._initDarkMode();
    }
    
    // Also add a fallback initialization
    window.addEventListener('load', () => {
      const toggleSwitch = document.querySelector('#checkbox') as HTMLInputElement;
      if (toggleSwitch && !toggleSwitch.hasAttribute('data-initialized')) {
        console.log('Initializing dark mode on window load (fallback)');
        this._initDarkMode();
        toggleSwitch.setAttribute('data-initialized', 'true');
      }
    });
  }
  
  /**
   * Toggle dark mode on/off
   * @param isDark Whether to enable dark mode
   */
  private _toggleDarkMode(isDark: boolean): void {
    console.log('Toggling dark mode:', isDark);
    if (isDark) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', Theme.DARK);
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', Theme.LIGHT);
    }
  }
  
  /**
   * Initialize dark mode from saved preferences or system settings
   * 
   * This applies the appropriate theme based on:
   * 1. User's previous preference stored in localStorage
   * 2. System preference via prefers-color-scheme media query
   */
  private _initDarkMode(): void {
    console.log('Initializing dark mode...');
    this._toggleSwitch = document.querySelector('#checkbox') as HTMLInputElement;
    
    if (!this._toggleSwitch) {
      console.error('Dark mode toggle not found in DOM');
      // Try again later when DOM might be ready
      setTimeout(() => this._initDarkMode(), 500);
      return;
    }
    
    const currentTheme: Theme | null = localStorage.getItem('theme') as Theme | null;
    console.log('Current theme from localStorage:', currentTheme);
    
    // Check for saved user preference, if any
    if (currentTheme) {
      if (currentTheme === Theme.DARK) {
        console.log('Applying saved dark theme preference');
        this._toggleSwitch.checked = true;
        this._toggleDarkMode(true);
      }
    } else {
      // Check for system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        console.log('Applying system dark theme preference');
        this._toggleSwitch.checked = true;
        this._toggleDarkMode(true);
      }
    }
    
    // Add event listener for toggle
    this._toggleSwitch.addEventListener('change', (e: Event) => {
      const isDark = (e.target as HTMLInputElement).checked;
      console.log('Toggle switch changed:', isDark);
      this._toggleDarkMode(isDark);
    });
  }
}

// Initialize the dark mode manager
new DarkModeManager(); 