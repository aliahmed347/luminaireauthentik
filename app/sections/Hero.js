import Component from "../classes/Component";
import { split, calculate } from "../utils/text";
import gsap from "gsap";
import each from "lodash/each";

export default class Hero extends Component {
    constructor() {
        super({
            element: '.hero',
            elements: {
                sliderWrapper: '.hero__slider__wrapper',
                slideNextBtn: '.slide__next',
                slidePreviousBtn: '.slide__pervious',
                slides: ".hero__slider__slide",
            }
        });

        this.currentSlide = 0;
        this.totalSlides = this.elements.slides.length;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000;

        // Store all slide data
        this.slidesData = [];

        this.init();
    }

    init() {
        this.collectSlidesData();
        this.setupActiveSlide();
        this.splitText();
        this.addEventListeners();
        this.animateIn();
        // this.startAutoPlay();
    }

    collectSlidesData() {
        // Collect all content from slides
        this.elements.slides.forEach((slide, index) => {
            const slideData = {
                label: slide.querySelector('.slide__label').innerHTML,
                title: slide.querySelector('.slide__title').innerHTML,
                image: slide.querySelector('.slide__image').src,
                footerImage: slide.querySelector('.slide__footer__image img').src,
                ctaHref: slide.querySelector('.slider__cta').href,
                ctaText: slide.querySelector('.slider__cta span').getAttribute('data-text')
            };
            this.slidesData.push(slideData);

            // Hide all slides except first
            if (index > 0) {
                slide.style.display = 'none';
            }
        });
    }

    setupActiveSlide() {
        // Get references to the active (first) slide elements
        this.activeSlide = this.elements.slides[0];
        this.slideLabel = this.activeSlide.querySelector('.slide__label');
        this.slideTitle = this.activeSlide.querySelector('.slide__title');
        this.slideImage = this.activeSlide.querySelector('.slide__image');
        this.slideFooterImage = this.activeSlide.querySelector('.slide__footer__image img');
        this.sliderCta = this.activeSlide.querySelector('.slider__cta');
    }

    splitText() {
        // Split label and title into spans
        split({ element: this.slideLabel, append: true });
        split({ element: this.slideTitle, append: true });

        // Calculate lines based on position
        const labelSpans = this.slideLabel.querySelectorAll('span');
        const titleSpans = this.slideTitle.querySelectorAll('span');

        this.labelLines = calculate(labelSpans);
        this.titleLines = calculate(titleSpans);

        // Wrap each line in a div for animation
        this.wrapLines();
    }

    wrapLines() {
        // Wrap label lines
        this.slideLabel.innerHTML = '';
        this.labelLinesWrapped = [];

        each(this.labelLines, (words) => {
            const lineDiv = document.createElement('div');
            lineDiv.classList.add('line');
            lineDiv.style.overflow = 'hidden';

            const lineInner = document.createElement('div');
            lineInner.classList.add('line__inner');

            each(words, word => {
                lineInner.appendChild(word);
            });

            lineDiv.appendChild(lineInner);
            this.slideLabel.appendChild(lineDiv);
            this.labelLinesWrapped.push(lineInner);
        });

        // Wrap title lines
        this.slideTitle.innerHTML = '';
        this.titleLinesWrapped = [];

        each(this.titleLines, (words) => {
            const lineDiv = document.createElement('div');
            lineDiv.classList.add('line');
            lineDiv.style.overflow = 'hidden';

            const lineInner = document.createElement('div');
            lineInner.classList.add('line__inner');

            each(words, word => {
                lineInner.appendChild(word);
            });

            lineDiv.appendChild(lineInner);
            this.slideTitle.appendChild(lineDiv);
            this.titleLinesWrapped.push(lineInner);
        });
    }

    addEventListeners() {

        if (!this.activeSlide) return

        const nextButtons = this.activeSlide.querySelectorAll('.slide__next');
        const previousButtons = this.activeSlide.querySelectorAll('.slide__pervious');

        nextButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // this.stopAutoPlay();
                this.nextSlide();
                // this.startAutoPlay();
            });
        });

        previousButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // this.stopAutoPlay();
                this.previousSlide();
                // this.startAutoPlay();
            });
        });
    }

    animateIn() {
        const tl = gsap.timeline();

        // Animate label lines in with stagger
        each(this.labelLinesWrapped, (line, index) => {
            tl.fromTo(line, {
                y: '100%',
            }, {
                duration: 1,
                y: '0%',
                ease: 'expo.out'
            }, index * 0.08);
        });

        // Animate title lines in with stagger
        each(this.titleLinesWrapped, (line, index) => {
            tl.fromTo(line, {
                y: '100%',
            }, {
                duration: 1.2,
                y: '0%',
                ease: 'expo.out'
            }, index * 0.08 + 0.2);
        });

        // Fade in images
        tl.fromTo([this.slideImage, this.slideFooterImage], {
            opacity: 0,
            scale: 1.1
        }, {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out'
        }, 0.3);

        // Fade in CTA
        tl.fromTo(this.sliderCta, {
            opacity: 0,
            y: 20
        }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, 0.6);
    }

    animateOut(callback) {
        const tl = gsap.timeline({
            onComplete: callback
        });

        // Animate label out with stagger
        each(this.labelLinesWrapped, (line, index) => {
            tl.to(line, {
                y: '-100%',
                duration: 0.6,
                ease: 'power3.inOut'
            }, index * 0.05);
        });

        // Animate title out with stagger
        each(this.titleLinesWrapped, (line, index) => {
            tl.to(line, {
                y: '-100%',
                duration: 0.6,
                ease: 'power3.inOut'
            }, index * 0.05 + 0.1);
        });

        // Fade out images
        tl.to([this.slideImage, this.slideFooterImage], {
            opacity: 0,
            scale: 0.95,
            duration: 0.6,
            ease: 'power3.inOut'
        }, 0);

        // Fade out CTA
        tl.to(this.sliderCta, {
            opacity: 0,
            y: -20,
            duration: 0.5,
            ease: 'power3.inOut'
        }, 0);
    }

    updateContent(index) {
        const data = this.slidesData[index];

        // Update text content (using innerHTML to preserve any HTML tags)
        this.slideLabel.innerHTML = data.label;
        this.slideTitle.innerHTML = data.title;

        // Update images
        this.slideImage.src = data.image;
        this.slideFooterImage.src = data.footerImage;

        // Update CTA
        this.sliderCta.href = data.ctaHref;
        this.sliderCta.querySelector('span').setAttribute('data-text', data.ctaText);
        this.sliderCta.querySelector('span').textContent = data.ctaText;

        // Re-split and wrap text for new content
        this.splitText();
    }

    changeSlide(newIndex) {
        // Animate out current content
        this.animateOut(() => {
            // Update content
            this.updateContent(newIndex);

            // Animate in new content
            this.animateIn();
        });
    }

    nextSlide() {
        const newIndex = (this.currentSlide + 1) % this.totalSlides;
        this.currentSlide = newIndex;
        this.changeSlide(newIndex);
    }

    previousSlide() {
        const newIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.currentSlide = newIndex;
        this.changeSlide(newIndex);
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    destroy() {
        // this.stopAutoPlay();
        if (this.labelLinesWrapped && this.titleLinesWrapped) {
            gsap.killTweensOf([...this.labelLinesWrapped, ...this.titleLinesWrapped, this.slideImage, this.slideFooterImage, this.sliderCta]);
        }
    }
}