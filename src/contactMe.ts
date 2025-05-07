import { Component } from './lib/Component';

// Define interface for form data
interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

// Define interface for AJAX response
interface AjaxResponse {
  success: boolean;
  message?: string;
}

/**
 * Class that manages the contact form functionality
 */
class ContactFormManager extends Component {
  private _isStaticMode: boolean = false;
  
  constructor() {
    super('#contactForm');
  }
  
  /**
   * Initialize the form manager
   */
  protected init($: JQueryStatic): void {
    if (!this.element || !this.$element) {
      console.error('Contact form not found');
      return;
    }
    
    this._isStaticMode = this.$element.attr('data-static') === 'true';
    
    if (!this._isStaticMode) {
      this._setupValidation($);
      this._setupSubmitHandler($);
    }
    
    this._setupTabHandlers($);
    this._setupSuccessMessageClear($);
  }
  
  /**
   * Setup form validation
   */
  private _setupValidation($: JQueryStatic): void {
    // Add required attribute to form fields
    $("input#name, input#email, input#phone, textarea#message").attr('required', 'required');
    
    // Add email validation pattern
    $("input#email").attr('pattern', '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$');
    
    // Add phone validation pattern
    $("input#phone").attr('pattern', '\\d{10,}');
  }
  
  /**
   * Setup form submission handler
   */
  private _setupSubmitHandler($: JQueryStatic): void {
    if (!this.element) return;
    
    this.element.addEventListener('submit', (event: Event): void => {
      event.preventDefault(); // prevent default submit behaviour
      
      // Form is valid (HTML5 validation passed)
      // get values from FORM
      const formData: ContactFormData = {
        name: $("input#name").val() as string,
        email: $("input#email").val() as string,
        phone: $("input#phone").val() as string,
        message: $("textarea#message").val() as string
      };
      
      let firstName: string = formData.name; // For Success/Failure Message
      // Check for white space in name for Success/Fail message
      if (firstName && firstName.indexOf(' ') >= 0) {
        firstName = formData.name.split(' ').slice(0, -1).join(' ');
      }
      
      this._submitForm($, formData);
    });
  }
  
  /**
   * Submit form data via AJAX
   */
  private _submitForm($: JQueryStatic, formData: ContactFormData): void {
    $.ajax({
      url: "././mail/contact_me.php",
      type: "POST",
      data: formData,
      cache: false,
      success: (): void => {
        this._handleSuccess($);
      },
      error: (): void => {
        this._handleError($);
      },
    });
  }
  
  /**
   * Handle successful form submission
   */
  private _handleSuccess($: JQueryStatic): void {
    // Success message
    $('#success').html("<div class='alert alert-success'>");
    $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
      .append("</button>");
    $('#success > .alert-success')
      .append("<strong>Your message has been sent. </strong>");
    $('#success > .alert-success')
      .append('</div>');

    //clear all fields
    $('#contactForm').trigger("reset");
  }
  
  /**
   * Handle form submission error
   */
  private _handleError($: JQueryStatic): void {
    // Fail message
    $('#success').html("<div class='alert alert-danger'>");
    $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
      .append("</button>");
    $('#success > .alert-danger').append("<strong>Sorry, it seems that my mail server is not responding. Please try again later!");
    $('#success > .alert-danger').append('</div>');
    //clear all fields
    $('#contactForm').trigger("reset");
  }
  
  /**
   * Setup tab handling for navigation
   */
  private _setupTabHandlers($: JQueryStatic): void {
    $("a[data-toggle=\"tab\"]").on('click', (e: JQuery.TriggeredEvent): void => {
      e.preventDefault();
      $(e.currentTarget).tab("show");
    });
  }
  
  /**
   * Setup handlers to clear success/error messages
   */
  private _setupSuccessMessageClear($: JQueryStatic): void {
    $('#name').on('focus', (): void => {
      $('#success').html('');
    });
  }
}

// Initialize the contact form manager
new ContactFormManager(); 