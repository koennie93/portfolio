/*!
 * Start Bootstrap - Freelancer Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

import { jQueryReady } from './lib/jqueryReady';
import 'jquery.easing';

/**
 * FreelancerTheme class to handle theme-specific functionality
 */
export class FreelancerTheme {
    private _jquery: JQueryStatic;
    
    /**
     * Initialize the Freelancer theme functionality
     * @param $ jQuery instance
     */
    constructor(jquery: JQueryStatic) {
        this._jquery = jquery;
        this._initPageScrolling();
        this._initFloatingLabels();
        this._initScrollspy();
        this._initResponsiveMenu();
    }
    
    /**
     * Initialize smooth page scrolling with easing
     */
    private _initPageScrolling(): void {
        this._jquery('.page-scroll a').on('click', (event) => {
            const $anchor = this._jquery(event.currentTarget);
            const targetElement = this._jquery($anchor.attr('href') || '');
            
            if (targetElement.length) {
                this._jquery('html, body').stop().animate({
                    scrollTop: targetElement.offset()?.top || 0
                }, 1500, 'easeInOutExpo');
                event.preventDefault();
            }
        });
    }
    
    /**
     * Initialize floating label headings for the contact form
     */
    private _initFloatingLabels(): void {
        this._jquery("body")
            .on("input propertychange", ".floating-label-form-group", (e) => {
                this._jquery(e.currentTarget).toggleClass(
                    "floating-label-form-group-with-value", 
                    !!this._jquery(e.target).val()
                );
            })
            .on("focus", ".floating-label-form-group", (e) => {
                this._jquery(e.currentTarget).addClass("floating-label-form-group-with-focus");
            })
            .on("blur", ".floating-label-form-group", (e) => {
                this._jquery(e.currentTarget).removeClass("floating-label-form-group-with-focus");
            });
    }
    
    /**
     * Initialize scrollspy functionality
     */
    private _initScrollspy(): void {
        this._jquery('body').on('scroll', () => {
            const scrollspy = this._jquery('body').data('bs.scrollspy');
            if (scrollspy) {
                scrollspy.process();
            }
        });
    }
    
    /**
     * Initialize responsive menu closing on item click
     */
    private _initResponsiveMenu(): void {
        this._jquery('.navbar-collapse ul li a').on('click', () => {
            this._jquery('.navbar-toggle:visible').click();
        });
    }
    
    /**
     * Static method to initialize the theme
     */
    public static init(): void {
        jQueryReady(($) => {
            new FreelancerTheme($);
        });
    }
}

// Initialize the freelancer theme
FreelancerTheme.init(); 