import Component from "../classes/Component";
import { split, calculate } from "../utils/text";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import each from "lodash/each";

gsap.registerPlugin(ScrollTrigger);

export default class QuoteImagesTrail extends Component {
    constructor() {
        super({
            element: '.quote__images__trail',
            elements: {
                title: '.quote__title',
                trailImagesContainer: '.trail__images',
                quoteImages: '.trail__images img',
                firstBtn: '.first--btn',
                secondBtn: '.second--btn',
                quoteButtons: '.quote__buttons',
            }
        });

        this.currentImageIndex = 0;
        this.imageSources = [];
        this.activeTrailImages = {};
        this.lastMousePosition = { x: 0, y: 0 };
        this.mouseThrottle = null;
        this.throttleDelay = 100;

        // Get actual rem value in pixels
        this.remInPixels = parseFloat(getComputedStyle(document.documentElement).fontSize);
        this.imageSize = 24.7 * this.remInPixels; // Convert 24.7rem to pixels
        this.halfImageSize = this.imageSize / 2;

        this.init();
    }


    init() {
        if (!this.element) return;

        this.splitText();
        this.setupAnimations();
        this.setupTrailImages();
        this.setupMouseTracking();
    }

    splitText() {
        // Split title into spans
        split({ element: this.elements.title, append: true });

        // Calculate title lines based on position
        const titleSpans = this.elements.title.querySelectorAll('span');
        this.titleLines = calculate(titleSpans);

        // Wrap title lines
        this.wrapTitleLines();
    }

    wrapTitleLines() {
        // Wrap title lines
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

    setupAnimations() {
        // Set initial states
        gsap.set(this.titleLinesWrapped, { y: '100%' });
        gsap.set(this.elements.firstBtn, { opacity: 0, scale: 0.5 });
        gsap.set(this.elements.secondBtn, { opacity: 0, scale: 0.5 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: this.element,
                start: 'top center',
                end: 'top 20%',
                toggleActions: 'play none none none',
                // markers: true, 
            }
        });

        // Animate title lines in with stagger
        each(this.titleLinesWrapped, (line, index) => {
            tl.to(line, {
                y: '0%',
                duration: 1.2,
                ease: 'expo.out'
            }, index * 0.08);
        });

        tl.to(this.elements.firstBtn, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power1.out'
        }, 0.3);

        tl.to(this.elements.secondBtn, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power1.out'
        }, 0.3);
    }

    setupTrailImages() {
        if (!this.elements.trailImagesContainer) return;

        this.elements.quoteImages.forEach((img) => {
            this.imageSources.push(img.src);
        });

        this.elements.trailImagesContainer.style.display = 'none';
    }

    setupMouseTracking() {
        this.minDistance = 100;

        this.onMouseMove = (e) => {
            const dx = e.clientX - this.lastMousePosition.x;
            const dy = e.clientY - this.lastMousePosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Always update last mouse position, even if we don't create an image
            const shouldUpdatePosition = distance >= this.minDistance;

            if (shouldUpdatePosition) {
                // Check if mouse is over the buttons area - if yes, DON'T create any images
                if (!this.isMouseOverButtons(e.clientX, e.clientY)) {
                    this.createTrailImage(e.clientX, e.clientY);
                }
                // Update position regardless of whether we created an image
                this.lastMousePosition = { x: e.clientX, y: e.clientY };
            }
        };

        this.element.addEventListener('mousemove', this.onMouseMove);
    }

    isMouseOverButtons(clientX, clientY) {
        if (!this.elements.quoteButtons) return false;

        const buttonsRect = this.elements.quoteButtons.getBoundingClientRect();

        // Calculate the bounds of where the image would appear
        const imageLeft = clientX - this.halfImageSize;
        const imageRight = clientX + this.halfImageSize;
        const imageTop = clientY - this.halfImageSize;
        const imageBottom = clientY + this.halfImageSize;

        // Add extra padding for safety
        const padding = 10;

        // Expand button area with padding
        const buttonLeft = buttonsRect.left - padding;
        const buttonRight = buttonsRect.right + padding;
        const buttonTop = buttonsRect.top - padding;
        const buttonBottom = buttonsRect.bottom + padding;

        // Check if image bounds overlap with button bounds
        // Overlap occurs when:
        // - imageRight is past buttonLeft AND
        // - imageLeft is before buttonRight AND
        // - imageBottom is past buttonTop AND
        // - imageTop is before buttonBottom
        const wouldOverlap = (
            imageRight > buttonLeft &&
            imageLeft < buttonRight &&
            imageBottom > buttonTop &&
            imageTop < buttonBottom
        );

        return wouldOverlap;
    }

    createTrailImage(x, y) {
        const imageIndex = this.currentImageIndex;
        const imageSrc = this.imageSources[imageIndex];

        this.currentImageIndex = (this.currentImageIndex + 1) % this.imageSources.length;

        const imgElement = document.createElement('img');
        imgElement.src = imageSrc;

        // Get the container's bounding rect
        const containerRect = this.element.getBoundingClientRect();

        // Calculate position relative to container
        const relativeX = x - containerRect.left;
        const relativeY = y - containerRect.top;

        imgElement.style.position = 'absolute';
        imgElement.style.left = relativeX + 'px';
        imgElement.style.top = relativeY + 'px';
        imgElement.style.width = '24.7rem';
        imgElement.style.height = '24.7rem';
        imgElement.style.objectFit = 'cover';
        imgElement.style.pointerEvents = 'none';
        imgElement.style.zIndex = '1'; // Changed from '100' to stay behind buttons
        imgElement.style.transform = 'translate(-50%, -50%)';

        this.element.appendChild(imgElement);

        // Get last position (so we can animate from there)
        const { x: lastX, y: lastY } = this.lastMousePosition;

        gsap.fromTo(imgElement, {
            x: lastX - x,
            y: lastY - y,
        }, {
            duration: 0.5,
            ease: 'power2.out',
            x: '0%',
        });

        // Fade out and remove after a short delay
        gsap.to(imgElement, {
            opacity: 0,
            scale: 0.4,
            duration: 0.5,
            ease: 'power2.in',
            delay: 1,
            onComplete: () => imgElement.remove()
        });
    }

    removeTrailImage(imgElement, imageIndex) {
        // Animate out
        gsap.to(imgElement, {
            opacity: 0,
            scale: 0.8,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => {
                // Remove from DOM
                if (imgElement.parentNode) {
                    imgElement.parentNode.removeChild(imgElement);
                }

                // Remove from object
                if (imageIndex !== undefined && this.activeTrailImages[imageIndex] === imgElement) {
                    delete this.activeTrailImages[imageIndex];
                }
            }
        });
    }

    destroy() {
        // Remove event listeners
        if (this.onMouseMove) {
            this.element.removeEventListener('mousemove', this.onMouseMove);
        }

        // Clear throttle timeout
        if (this.mouseThrottle) {
            clearTimeout(this.mouseThrottle);
        }

        // Remove all active trail images
        Object.values(this.activeTrailImages).forEach(img => {
            if (img.parentNode) {
                img.parentNode.removeChild(img);
            }
        });
        this.activeTrailImages = {};

        // Kill GSAP animations
        if (this.titleLinesWrapped) {
            gsap.killTweensOf([
                ...this.titleLinesWrapped,
                this.elements.firstBtn,
                this.elements.secondBtn
            ]);
        }

        // Kill ScrollTrigger instance
        ScrollTrigger.getAll().forEach(trigger => {
            if (trigger.trigger === this.element) {
                trigger.kill();
            }
        });
    }
}