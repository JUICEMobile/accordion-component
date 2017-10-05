/**
 *
 * Copyright (c) 2017, JUICEMobile
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */

/**
 * 
 * JUICEMobile Accordion Module
 * @author Tyler Kivari <tyler.kivari@juicemobile.com>
 * 
 */
class Accordion {

    /**
     * Accordion constructor
     * @param Object options
     */
    constructor(options) {
        this.selected_slide = null;
        this.has_valid_options = true;
        this.required_fields = ['background_image','slide_data','element'];

        this.templates = [];
                
        let accordion = this;

        // Check that the required options have been provided.
        this.required_fields.forEach(function(field) {
            if (!options.hasOwnProperty(field)) {
                console.error(field + ' is a required field. Please add the field to your options object and then reload this page.');
                accordion.has_valid_options = false;
            }
        });

        // if any required fields are missing, halt initialization.
        if (!this.has_valid_options) {
            return false;
        }

        // copy fields from options to this instance of the object
        this.required_fields.forEach((field) => {
          	this[field] = options[field];
        });

        // start the accordion and add the elements
        this.init();
    }

    /**
     * add slide elements & titles from the this.slide_data
     */
    addSlides() {
        let accordion = this;

        // add each slide specified in options
        this.slide_data.forEach((slide, ix) => {
            
            // create the slide info panel
            let slide_info = this.createElement({type: 'div', class: ['accordion-info','invisible'], attributes: {id: 'accordion-slide-'+ix}});

            // add close button for desktop size
            let slide_x = this.createElement({type: 'div', class: ['circle','close','white','unselected','invisible'], html: 'x'});
            slide_info.appendChild(slide_x);

            // add close button for mobile size
            let slide_x2 = this.createElement({type: 'div', class: ['circle','close','white','unselected','invisible'], html: 'x'});

            // add the slide content container
            let slide_content = this.createElement({type: 'div', class: 'accordion-content'});
            slide_info.appendChild(slide_content);
            
            // Add the slide title elements
            let slide_title = this.createElement({type: 'div', class: 'accordion-title', attributes: {id: 'slide-title-'+ix}});
            let slide_wrap = this.createElement({type: 'div', class: 'wrap', html: slide.title.replace(/\s+/g, "&nbsp;")})

            // Add the + sign button to each slide element
            let slide_plus = this.createElement({type: 'div', class: ['circle','white','unselected'], html: '+'});


            // Append child elements to the title
            slide_title.appendChild(slide_wrap);
            slide_title.appendChild(slide_plus);
            slide_title.appendChild(slide_x2);
            
            // Append the title and info panel to the accordion parent
            accordion.dom_element.appendChild(slide_title);
            accordion.dom_element.appendChild(slide_info);

            /*
             * Add the hover state for the title
             */
            slide_title.addEventListener("mouseenter", function() {
                slide_title.classList.add("hover");
            });

            /*
             * Remove the hover state
             */
            slide_title.addEventListener("mouseout", function(event) {
                // do not remove the hover class if the event was triggered by mousing over a child element
                let e = event.toElement || event.relatedTarget;
                if (e && (e.parentNode == this || e == this)) {
                    return;
                }
                slide_title.classList.remove("hover");
            });

            /*
             * Add click event listener for the X button on desktop screen sizes
             */
            slide_x.addEventListener("click", function() {
                
                // deselect all slides
                accordion.dom_element.classList.remove('slide_selected');

                /*
                 * We are using a for loop for lists built using document.querySelectorAll
                 * because the .forEach() method does not exist on these lists 
                 * in Internet Explorer, and babelJS won't correct that type of loop.
                 */

                // deselect all titles
                let titles = document.querySelectorAll(".accordion-title");
                for (let i = 0; i < titles.length; ++i) {
                    titles[i].classList.remove('selected');
                }
                

                // deselect and hide all info panels
                let infos = document.querySelectorAll(".accordion-info");
                for (let i = 0; i < infos.length; ++i) {
                    infos[i].classList.remove("selected");
                    infos[i].classList.add("invisible");
                }

                // hide the "close" buttons (mobile and desktop)
                slide_x2.classList.add("invisible");
                this.classList.add("invisible");

                // change the background image back to the main background.
                accordion.dom_element.style.backgroundImage = "url(" + accordion.bg.src + ")";
            });

            /*
             * Add click event listener for the X button on mobile
             */
            slide_x2.addEventListener("click", function(e) {
                e.stopPropagation();
                e.preventDefault();
                
                // deselect all slides
                accordion.dom_element.classList.remove('slide_selected');

                // deselect all titles
                let titles = document.querySelectorAll(".accordion-title");
                for (let i = 0; i < titles.length; ++i) {
                    titles[i].classList.remove("selected");
                    titles[i].classList.remove("hover");
                }
                
                // deselect and hide all info panels
                let infos = document.querySelectorAll(".accordion-info");
                for (let i = 0; i < infos.length; ++i) {
                    infos[i].classList.remove("selected");
                    infos[i].classList.add("invisible");
                }

                // hide the "close" button
                this.classList.add("invisible");

                // set the background image back to the main background image
                accordion.dom_element.style.backgroundImage = "url(" + accordion.bg.src + ")";
            });

            /*
             * Add click event listener for the slide title element.
             */
            slide_title.addEventListener("click", function() {
                accordion.dom_element.classList.add('slide_selected');

                // Using preloaded images, update the current background image to the slide image specified.
                accordion.dom_element.style.backgroundImage = "url(" + accordion.loaded_images.find(i => i.index == ix).image.src + ")";
                
                // hide all "close" buttons
                let circles = document.querySelectorAll(".circle.close");
                for (let i = 0; i < circles.length; ++i) {
                    circles[i].classList.add("invisible");
                }

                // set all slide titles to unselected
                let titles = document.querySelectorAll(".accordion-title");
                for (let i = 0; i < titles.length; ++i) {
                    titles[i].classList.remove("selected");
                }

                // set all slides to unselected and hide them
                let infos = document.querySelectorAll(".accordion-info");
                for (let i = 0; i < infos.length; ++i) {
                    infos[i].classList.remove("selected");
                    infos[i].classList.add("invisible");
                }

                // set the current slide title to selected
                slide_title.classList.add("selected");

                // show the current slide panel and set it to selected
                slide_info.classList.remove("invisible");
                slide_info.classList.add("selected");

                // show the "close" buttons for the current slide
                slide_x.classList.remove("invisible");
                slide_x2.classList.remove("invisible");

                // if the current slide data has not been cached,
                // load it and add it to the template cache.
                // if HTML is not specified, load the template via AJAX from specified URL
                if (!accordion.templates[ix]) {
                    if (slide.hasOwnProperty('html') && slide.html) {
                        accordion.setTemplate(ix, slide.html);
                        slide_content.innerHTML = accordion.getTemplate(ix);
                    } else if (slide.hasOwnProperty('template') && slide.template) {
                        accordion.loadTemplate(slide.template).then(function(tpl) {
                            accordion.setTemplate(ix, tpl);
                            slide_content.innerHTML = accordion.getTemplate(ix);
                        });                        
                    }
                } else { // if a cached version of the template exists, use it.
                    slide_content.innerHTML = accordion.getTemplate(ix);
                }
                
                

            });

        });

    }

    /**
     * Create a new element to be added to the dom_element
     * @param Object options - required options:  type: the type of element, eg: div, img, etc; class: a string or array of strings representing class names to add to the object.
     * @return DOMElement
     */
    createElement(options) {
        if (typeof options !== 'object') {
            console.error('Element options must be passed to this function as an object.  Required options include: type, class');
            return;
        }

        // Check that the options object includes 'type' and 'class' properties.
        var required_options = ['type', 'class'];
        required_options.forEach((opt) => {
            if (!options.hasOwnProperty(opt)) {
                debugger;
                console.error('option ' + opt + ' required to create this element.');
                return;
            }
        });

        // create the element
        let element = document.createElement(options.type);
        
        
        // add the class(es)
        if (typeof options.class == 'string') 
        {
            element.classList.add(options.class);
        } else if (typeof options.class == 'object') {
            options.class.forEach((class_name) => {
                element.classList.add(class_name);
            });
        }

        // add the attributes
        if (options.hasOwnProperty('attributes')) {
            if (typeof options.attributes !== 'object') {
                console.error('Element attributes must be passed as an object')
            } else {
                Object.keys(options.attributes).forEach((keyname) => {
                    element.setAttribute(keyname, options.attributes[keyname]);
                });
            }
        }

        // set the element HTML
        if (options.hasOwnProperty('html')) {
            element.innerHTML = options.html;
        }

        return element;
    }

    /**
     * Initialize the accordion object and add the slides
     */
    init() {
        this.accordion_div = document.createElement('div');
        this.accordion_div.classList.add('accordion');
        document.querySelector(this.element).appendChild(this.accordion_div);
        this.dom_element = this.accordion_div;
        this.dom_element.style.backgroundImage = "url(" + this.background_image + ")";
        this.loaded_images = [];
        this.preloadImages().then(() => {
            this.addSlides();
        });
    }

    /**
     * AJAX request to get the contents of a template file.
     */
    loadTemplate(template, template_index, slide_element) {
        return new Promise((resolve, reject) => {
            let DONE = 4;
            let OK = 200;
            let accordion = this;

            let xhr = new XMLHttpRequest();
            xhr.open('GET', template);
            xhr.send(null);

            xhr.onreadystatechange = function () {
                if (xhr.readyState === DONE) {
                    if (xhr.status === OK) {
                        accordion.templates[template_index] = xhr.responseText;
                        resolve(xhr.responseText);
                    } else {
                        console.error('Error: ' + xhr.status); // An error occurred during the request.
                        reject(xhr.status);
                    }
                }
            };
        });
    }


    /**
     * Preload the slide background images provided in the options.
     * @return Promise
     */
    preloadImages() {
        let num_loaded = 0;
        
        // return a promise that will be resolved once all images are preloaded.
        return new Promise((resolve, reject) => {
            this.slide_data.forEach((slide, ix) => {
                let img = new Image();
                img.src = slide.background_image;

                img.onload = () => {
                    let i = {
                        index: ix,
                        image: img
                    };

                    this.loaded_images.push(i);
                    
                    num_loaded++;
                    // num loaded should be the number of slides + 1, to account for the main background image
                    if (num_loaded == this.slide_data.length + 1) {
                        resolve(true);
                    }
                }
            });

            // load the main background image
            let bg = new Image();
            bg.src = this.background_image;

            bg.onload = () => {
                this.bg = bg;
                num_loaded++;
                if (num_loaded == this.slide_data.length + 1) {
                    resolve(true);
                }
            }
        });
    }

    /**
     * Cache the loaded template to avoid making redundant AJAX calls.
     */
    setTemplate(index, template) {
        this.templates[index] = template;
    }

    /**
     * Load the cached template if it exists.
     */
    getTemplate(index) {
        return this.templates[index];
    }
}