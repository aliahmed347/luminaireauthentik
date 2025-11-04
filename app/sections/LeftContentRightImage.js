import Component from "../classes/Component";
import { split, calculate } from "../utils/text";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import each from "lodash/each";

gsap.registerPlugin(ScrollTrigger);

export default class LeftContentRightImage extends Component {
    constructor() {
        super({
            element: '.left__title__image__right__image',
            elements: {
                title: '.left__title',
                ctaBtn: '.btn',
                smallImage: '.small__image__media__image',
                largeImage: ".right__image__media__image",
                smallImageMedia: '.small__image__media',
                largeImageMedia: '.right__image__media'
            }
        });

        this.init();
    }

    init() {
        if (!this.element) return;

        this.splitText();
        this.setupAnimations();
        this.setupImageHover();
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

            // Build HTML string to preserve spaces
            let lineHTML = '';
            each(words, (word, index) => {
                lineHTML += word.outerHTML;
                // Add space after each word except the last one
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
        gsap.set(this.elements.ctaBtn, { opacity: 0, scale: 0.5 });
        gsap.set(this.elements.smallImage, { scale: 0.5 });
        gsap.set(this.elements.largeImage, { scale: 0.5 });

        // Create main timeline with ScrollTrigger
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: this.element,
                start: 'top 80%',
                end: 'top 20%',
                toggleActions: 'play none none none',
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

        // Animate CTA button
        tl.to(this.elements.ctaBtn, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power1.out'
        }, 0.3);

        // Animate small image with scale from 0.5 to 1
        tl.to(this.elements.smallImage, {
            scale: 1,
            duration: 1.4,
            ease: 'expo.out'
        }, 0.5);

        // Animate large image with scale from 0.5 to 1
        tl.to(this.elements.largeImage, {
            scale: 1,
            duration: 1.4,
            ease: 'expo.out'
        }, 0.6);
    }

    setupImageHover() {
        const img = this.elements.smallImage;
        const container = this.elements.smallImageMedia;
        const secondSrc = img.getAttribute('data-src');
        if (!secondSrc) return;

        // Create second image on top
        const hoverImg = document.createElement('img');
        hoverImg.src = secondSrc;
        hoverImg.style.position = 'absolute';
        hoverImg.style.top = 0;
        hoverImg.style.left = 0;
        hoverImg.style.width = '100%';
        hoverImg.style.height = '100%';
        hoverImg.style.objectFit = 'cover';
        hoverImg.style.opacity = 0;
        hoverImg.style.transition = 'opacity 0.3s ease-in-out';
        container.style.position = 'relative';
        container.appendChild(hoverImg);

        // Hover effects
        container.addEventListener('mouseenter', () => {
            hoverImg.style.opacity = 1;
        });

        container.addEventListener('mouseleave', () => {
            hoverImg.style.opacity = 0;
        });
    }


    destroy() {
        if (this.titleLinesWrapped) {
            gsap.killTweensOf([...this.titleLinesWrapped, this.elements.ctaBtn, this.elements.smallImage, this.elements.largeImage]);
        }

        // Kill ScrollTrigger instance
        ScrollTrigger.getAll().forEach(trigger => {
            if (trigger.trigger === this.element) {
                trigger.kill();
            }
        });
    }
}