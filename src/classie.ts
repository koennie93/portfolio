/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/**
 * ClassHelper utility class for DOM element class manipulation
 */
export class ClassHelper {
  /**
   * Check if an element has a specific class
   */
  public static hasClass(elem: Element, className: string): boolean {
    if ('classList' in document.documentElement) {
      return elem.classList.contains(className);
    } else {
      return this._classReg(className).test(elem.className);
    }
  }

  /**
   * Add a class to an element
   */
  public static addClass(elem: Element, className: string): void {
    if ('classList' in document.documentElement) {
      elem.classList.add(className);
    } else {
      if (!this.hasClass(elem, className)) {
        elem.className = elem.className + ' ' + className;
      }
    }
  }

  /**
   * Remove a class from an element
   */
  public static removeClass(elem: Element, className: string): void {
    if ('classList' in document.documentElement) {
      elem.classList.remove(className);
    } else {
      elem.className = elem.className.replace(this._classReg(className), ' ');
    }
  }

  /**
   * Toggle a class on an element
   */
  public static toggleClass(elem: Element, className: string): void {
    const fn = this.hasClass(elem, className) ? this.removeClass : this.addClass;
    fn.call(this, elem, className);
  }
  
  /**
   * Create a regular expression for matching class names
   */
  private static _classReg(className: string): RegExp {
    return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
  }

}

// Export the ClassHelper as 'classie' for backwards compatibility
export const classie = {
  hasClass: ClassHelper.hasClass.bind(ClassHelper),
  addClass: ClassHelper.addClass.bind(ClassHelper),
  removeClass: ClassHelper.removeClass.bind(ClassHelper),
  toggleClass: ClassHelper.toggleClass.bind(ClassHelper),
  // short names for backwards compatibility
  has: ClassHelper.hasClass.bind(ClassHelper),
  add: ClassHelper.addClass.bind(ClassHelper),
  remove: ClassHelper.removeClass.bind(ClassHelper),
  toggle: ClassHelper.toggleClass.bind(ClassHelper)
};

// Make classie available globally for backwards compatibility
(window as any).classie = classie;
