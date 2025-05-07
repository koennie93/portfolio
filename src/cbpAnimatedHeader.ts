/**
 * cbpAnimatedHeader.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */

import { ClassHelper } from './classie';

/**
 * Animated header class for handling header animation on scroll
 */
export class AnimatedHeader {
	private _docElem: HTMLElement;
	private _header: Element | null;
	private _didScroll: boolean = false;
	private _changeHeaderOn: number = 300;

	/**
	 * Initialize the animated header
	 */
	constructor() {
		this._docElem = document.documentElement;
		this._header = document.querySelector('.navbar-fixed-top');
		this._init();
	}

	/**
	 * Static method to initialize the animated header
	 */
	public static init(): void {
		new AnimatedHeader();
	}

	/**
	 * Initialize scroll event listener
	 */
	private _init(): void {
		window.addEventListener('scroll', () => {
			if (!this._didScroll) {
				this._didScroll = true;
				setTimeout(() => this._scrollPage(), 250);
			}
		}, false);
	}

	/**
	 * Handle scrolling page and header changes
	 */
	private _scrollPage(): void {
		const sy = this._scrollY();
		if (this._header) {
			if (sy >= this._changeHeaderOn) {
				ClassHelper.addClass(this._header, 'navbar-shrink');
			} else {
				ClassHelper.removeClass(this._header, 'navbar-shrink');
			}
		}
		this._didScroll = false;
	}

	/**
	 * Get current scroll position
	 */
	private _scrollY(): number {
		return window.pageYOffset || this._docElem.scrollTop;
	}
}

// Initialize the animated header
AnimatedHeader.init();

// Export for compatibility with existing code
export default AnimatedHeader;