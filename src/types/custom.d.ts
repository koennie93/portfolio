// Type definitions for third-party libraries and custom interfaces

// jQuery extensions
interface JQuery<TElement = HTMLElement> {
  // jqBootstrapValidation
  jqBootstrapValidation(options?: JQBootstrapValidationOptions): JQuery<TElement>;
  
  // Bootstrap related
  tab(action?: string): JQuery<TElement>;
  scrollspy(options?: ScrollSpyOptions): JQuery<TElement>;
  
  // Custom extensions
  easing: JQueryCustomEasing;
}

// Window extensions
interface Window {
  $: JQueryStatic;
  jQuery: JQueryStatic;
  
  // Add any other global variables here
  dataLayer?: any[];
  gtag?: (...args: any[]) => void;
}

// Bootstrap ScrollSpy options
interface ScrollSpyOptions {
  offset?: number;
  target?: string | Element;
  method?: string;
}

// jqBootstrapValidation options
interface JQBootstrapValidationOptions {
  preventSubmit?: boolean;
  submitError?: Function;
  submitSuccess?: Function;
  semanticallyStrict?: boolean;
  autoAdd?: {
    helpBlocks?: boolean;
  };
  filter?: string;
}

// For custom element attributes
interface HTMLElement {
  // Add any custom element properties here
  dataInitialized?: boolean;
}

// jQuery easing extensions
interface JQueryCustomEasing {
  [key: string]: Function;
}

// Declare modules without types
declare module 'classie';
declare module 'jquery.easing';
declare module 'bootstrap-validator';

// Image file declarations
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.png';
declare module '*.svg';
declare module '*.gif'; 