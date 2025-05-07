import { jQueryReady } from './jqueryReady';

/**
 * Base Component class that all UI components can extend
 * 
 * This class provides a standard initialization lifecycle for UI components:
 * 1. Component is instantiated
 * 2. If autoInit is true (default), waits for jQuery to be ready
 * 3. Finds the component's DOM element using the provided selector
 * 4. Calls the component's init method with jQuery
 * 
 * Components with special initialization requirements (like needing to initialize
 * before DOM is fully loaded) can override this flow by setting autoInit to false
 * and implementing their own initialization logic.
 */
export abstract class Component {
  /** Whether the component has been fully initialized */
  protected initialized: boolean = false;
  
  /** The component's DOM element */
  protected element: HTMLElement | null = null;
  
  /** jQuery wrapper for the component's element */
  protected $element: JQuery | null = null;
  
  /** CSS selector for the component's root element */
  protected selector: string;
  
  /**
   * Creates a new component
   * 
   * @param selector CSS selector for the component's root element
   * @param autoInit Whether to automatically initialize the component via the standard lifecycle.
   *                 Set to false for components that need custom initialization timing.
   */
  constructor(selector: string, autoInit: boolean = true) {
    this.selector = selector;
    
    if (autoInit) {
      this.autoInitialize();
    }
  }
  
  /**
   * Auto-initialize the component when jQuery is ready
   * 
   * This is the standard initialization flow that:
   * 1. Waits for jQuery to be ready
   * 2. Finds the component's DOM element
   * 3. Creates a jQuery wrapper for the element
   * 4. Calls the component-specific init method
   * 
   * Components with special timing requirements should set autoInit to false
   * and implement their own initialization.
   */
  protected autoInitialize(): void {
    jQueryReady(($: JQueryStatic) => {
      this.element = document.querySelector(this.selector);
      
      if (this.element) {
        this.$element = $(this.selector);
        this.init($);
        this.initialized = true;
      } else {
        console.warn(`Element not found for selector: ${this.selector}`);
      }
    });
  }
  
  /**
   * Initialize the component (to be implemented by subclasses)
   * 
   * This method is called by the standard initialization flow when:
   * 1. jQuery is ready
   * 2. The component's DOM element has been found
   * 
   * @param $ The jQuery instance
   */
  protected abstract init($: JQueryStatic): void;
  
  /**
   * Check if component is initialized
   * @returns True if the component has been initialized
   */
  public isInitialized(): boolean {
    return this.initialized;
  }
  
  /**
   * Get the component's root element
   * @returns The component's DOM element or null if not found
   */
  public getElement(): HTMLElement | null {
    return this.element;
  }
  
  /**
   * Get the component's jQuery wrapper
   * @returns jQuery object for the component or null if not found
   */
  public getJQueryElement(): JQuery | null {
    return this.$element;
  }
  
  /**
   * Helper to show the component
   */
  public show(): void {
    if (this.$element) {
      this.$element.show();
    }
  }
  
  /**
   * Helper to hide the component
   */
  public hide(): void {
    if (this.$element) {
      this.$element.hide();
    }
  }
} 