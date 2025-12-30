import Component from "../classes/Component";
import { split, calculate } from "../utils/text";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import each from "lodash/each";

gsap.registerPlugin(ScrollTrigger);

export default class TextMediaV1 extends Component {
    constructor(elementSelector = '.text__media__v1') { // Add parameter with default
        super({
            element: elementSelector, // Use the parameter
            elements: {
                title: '.right__content__heading',
                contentText: '.right__content__text',
                contentCta: '.right__content__section .btn',
                leftImage: ".left__image__media__image",
                leftImageMedia: '.left__image__media',
                productButtonInner: '.product__button__inner',
                productLinks: '.product__links'
            }
        });

        this.init();
    }

    init() {
        if (!this.element) return;

        this.splitText();
        this.setupAnimations();
        this.setupProductButton();
    }

    splitText() {
        // Split title into spans
        split({ element: this.elements.title, append: true });

        // Calculate title lines based on position
        const titleSpans = this.elements.title.querySelectorAll('span');
        this.titleLines = calculate(titleSpans);

        // Wrap title lines
        this.wrapTitleLines();

        // Split content text into spans
        split({ element: this.elements.contentText, append: true });

        // Calculate text lines
        const textSpans = this.elements.contentText.querySelectorAll('span');
        this.textLines = calculate(textSpans);

        // Wrap text lines
        this.wrapTextLines();
    }

    wrapTitleLines() {
        this.elements.title.innerHTML = '';
        this.titleLinesWrapped = [];

        each(this.titleLines, (words) => {
            const lineDiv = document.createElement('div');
            lineDiv.classList.add('line');
            lineDiv.style.overflow = 'hidden';

            const lineInner = document.createElement('div');
            lineInner.classList.add('line__inner');

            let lineHTML = '';
            each(words, (word, index) => {
                lineHTML += word.outerHTML;
                if (index < words.length - 1) {
                    lineHTML += ' ';
                }
            });
            lineInner.innerHTML = lineHTML;

            lineDiv.appendChild(lineInner);
            this.elements.title.appendChild(lineDiv);
            this.titleLinesWrapped.push(lineInner);
        });
    }

    wrapTextLines() {
        this.elements.contentText.innerHTML = '';
        this.textLinesWrapped = [];

        each(this.textLines, (words) => {
            const lineDiv = document.createElement('div');
            lineDiv.classList.add('line');
            lineDiv.style.overflow = 'hidden';

            const lineInner = document.createElement('div');
            lineInner.classList.add('line__inner');

            let lineHTML = '';
            each(words, (word, index) => {
                lineHTML += word.outerHTML;
                if (index < words.length - 1) {
                    lineHTML += ' ';
                }
            });
            lineInner.innerHTML = lineHTML;

            lineDiv.appendChild(lineInner);
            this.elements.contentText.appendChild(lineDiv);
            this.textLinesWrapped.push(lineInner);
        });
    }

    setupAnimations() {
        // Set initial states
        gsap.set(this.titleLinesWrapped, { y: '100%' });
        gsap.set(this.textLinesWrapped, { y: '100%' });
        gsap.set(this.elements.leftImage, {
            clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)',
        });

        // Set CTA initial state if exists
        if (this.elements.contentCta) {
            gsap.set(this.elements.contentCta, { opacity: 0, y: 20 });
        }

        // Set product button initial state if exists
        if (this.elements.productButtonInner) {
            gsap.set(this.elements.productButtonInner, { opacity: 0, scale: 0.8 });
        }

        // Create main timeline with ScrollTrigger
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: this.element, // This now correctly targets the specific instance
                start: 'top center',
                end: 'top 20%',
                toggleActions: 'play none none none',
                // markers: true, // Uncomment to debug
            }
        });

        // Animate image scale in
        tl.to(this.elements.leftImage, {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', // Expands to full width
            duration: 1.5,
            ease: 'expo.out'
        }, 0);

        // Animate title lines with stagger
        each(this.titleLinesWrapped, (line, index) => {
            tl.to(line, {
                y: '0%',
                duration: 1.2,
                ease: 'expo.out'
            }, 0.3 + (index * 0.08));
        });

        // Animate text lines with stagger
        each(this.textLinesWrapped, (line, index) => {
            tl.to(line, {
                y: '0%',
                duration: 1,
                ease: 'expo.out'
            }, 0.5 + (index * 0.06));
        });

        // Animate CTA button if exists
        if (this.elements.contentCta) {
            tl.to(this.elements.contentCta, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out'
            }, 0.7);
        }

        // Animate product button if exists
        if (this.elements.productButtonInner) {
            tl.to(this.elements.productButtonInner, {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: 'back.out(1.2)'
            }, 0.6);
        }
    }

    setupProductButton() {
        // Only setup if product button exists
        if (!this.elements.productButtonInner || !this.elements.productLinks) {
            return;
        }

        const buttonInner = this.elements.productButtonInner;
        const productLinks = this.elements.productLinks;

        // Set initial states for hover interaction
        gsap.set(buttonInner, {
            width: '10rem',
            overflow: 'hidden'
        });

        gsap.set(productLinks, {
            height: '0',
            opacity: 0,
            overflow: 'hidden'
        });

        // Store bound handlers for cleanup
        this.handleButtonEnter = () => {
            gsap.to(buttonInner, {
                width: '100%',
                duration: 0.7,
                ease: 'power1.out'
            });

            gsap.to(productLinks, {
                height: 'auto',
                opacity: 1,
                duration: 0.5,
                ease: 'power1.out'
            });
        };

        this.handleButtonLeave = () => {
            gsap.to(buttonInner, {
                width: '10rem',
                duration: 1,
                ease: 'power1.out'
            });

            gsap.to(productLinks, {
                height: '0',
                opacity: 0,
                duration: 0.7,
                ease: 'power1.out'
            });
        };

        // Attach event listeners
        buttonInner.addEventListener('mouseenter', this.handleButtonEnter);
        buttonInner.addEventListener('mouseleave', this.handleButtonLeave);
    }

    destroy() {
        // Kill all GSAP animations
        if (this.titleLinesWrapped && this.textLinesWrapped) {
            const elementsToKill = [
                ...this.titleLinesWrapped,
                ...this.textLinesWrapped,
                this.elements.leftImage
            ];

            // Add optional elements if they exist
            if (this.elements.contentCta) {
                elementsToKill.push(this.elements.contentCta);
            }

            if (this.elements.productButtonInner) {
                elementsToKill.push(this.elements.productButtonInner);
            }

            if (this.elements.productLinks) {
                elementsToKill.push(this.elements.productLinks);
            }

            gsap.killTweensOf(elementsToKill);
        }

        // Remove product button event listeners if they exist
        if (this.elements.productButtonInner && this.handleButtonEnter && this.handleButtonLeave) {
            this.elements.productButtonInner.removeEventListener('mouseenter', this.handleButtonEnter);
            this.elements.productButtonInner.removeEventListener('mouseleave', this.handleButtonLeave);
        }

        // Kill ScrollTrigger instance
        ScrollTrigger.getAll().forEach(trigger => {
            if (trigger.trigger === this.element) {
                trigger.kill();
            }
        });
    }
}