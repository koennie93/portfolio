# Portfolio Project

A personal portfolio website built with TypeScript, jQuery, and Jekyll.

## Project Structure

- `src/`: TypeScript source files
- `js/`: Compiled JavaScript output
- `_layouts/`, `_includes/`: Jekyll templates
- `css/`: Stylesheets
- `img/`: Image assets

## TypeScript Components

This project uses a component-based architecture for organizing UI functionality.

### Component Base Class

The project includes a base `Component` class that provides a standard initialization lifecycle:

```typescript
// Create a new component
const myComponent = new MyComponent('#selector');
```

The standard component lifecycle:
1. Component is instantiated
2. Waits for jQuery to be ready
3. Finds the component's DOM element
4. Calls the component's `init` method

### Special Initialization Patterns

Some components require special initialization, such as applying styles before the DOM is fully loaded to prevent Flash of Unstyled Content (FOUC).

#### Standard Initialization

Most components follow the standard initialization pattern:

```typescript
class MyComponent extends Component {
  constructor() {
    super('#my-element'); // Auto-initializes
  }
  
  protected init($: JQueryStatic): void {
    // Initialize when jQuery is ready
  }
}
```

#### Early Initialization

Components that need to initialize before DOM is ready can use the early initialization pattern:

```typescript
class EarlyComponent extends Component {
  constructor() {
    super('#my-element', false); // Disable auto-init
    this.initEarly();
  }
  
  private initEarly(): void {
    // Custom early initialization
  }
  
  protected init($: JQueryStatic): void {
    // Required by abstract class, but may not be primary init method
  }
}
```

### Examples

#### DarkModeManager

The `DarkModeManager` component uses early initialization to prevent flash of unstyled content when applying dark mode:

```typescript
class DarkModeManager extends Component {
  constructor() {
    super('body', false); // Disable auto-init
    this.initEarly();     // Initialize early
  }
  
  private initEarly(): void {
    // Apply theme settings ASAP
  }
  
  protected init($: JQueryStatic): void {
    // Required by Component base class
  }
}
```

#### ContactFormManager

The `ContactFormManager` uses standard initialization since form handling can wait for DOM ready:

```typescript
class ContactFormManager extends Component {
  constructor() {
    super('#contactForm'); // Standard initialization
  }
  
  protected init($: JQueryStatic): void {
    // Set up form validation and submission
  }
}
```

## Build and Development

### Prerequisites

- Node.js
- Ruby and Jekyll

### Commands

- `npm run serve`: Start development server
- `npm run watch`: Watch for changes and rebuild automatically
- `npm run build:webpack`: Build production assets
- `npm run build:gh-pages`: Build for GitHub Pages deployment

## Deployment

The site is deployed to GitHub Pages using GitHub Actions.
