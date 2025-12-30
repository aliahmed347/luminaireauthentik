import Component from "../classes/Component";
import { split, calculate } from "../utils/text";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import each from "lodash/each";

gsap.registerPlugin(ScrollTrigger);

export default class SliderText extends Component {
    constructor(elementSelector = '.slider__text') {
        super({
            element: elementSelector,
            elements: {
                contentHeading: '.slider__text__content__heading',
                contentText: '.slider__text__content__text',
                contentCta: '.slider__text__content__cta',
                pagination: '.slider__text__pagination',
                paginationCurrent: '.slider__text__pagination .current',
                paginationTotal: '.slider__text__pagination .total',
                navigationBtns: '.slider__text__navigation',
                nextBtn: '.slide__next',
                prevBtn: '.slide__pervious',
                slider: '.slider__text__slider',
                slides: '.slider__text__slide',
                slideImages: '.slider__text__slide__media__image',
                slideTitles: '.slider__text__slide__title',
            }
        });

        this.currentSlide = 0;
        this.totalSlides = 0;
        this.isAnimating = false;
        this.isOnlySlider = this.element?.classList.contains('--only__slider');

        this.init();
    }

    init() {
        if (!this.element) return;


        if (!this.isOnlySlider) {
            this.splitText();
        }

        this.setupSlider();
        this.setupAnimations();
        this.setupSliderControls();
        this.setUpProductButtonAnimation();
    }

    splitText() {

        split({ element: this.elements.contentHeading, append: true });


        const headingSpans = this.elements.contentHeading.querySelectorAll('span');
        this.headingLines = calculate(headingSpans);


        this.wrapHeadingLines();


        split({ element: this.elements.contentText, append: true });


        const textSpans = this.elements.contentText.querySelectorAll('span');
        this.textLines = calculate(textSpans);


        this.wrapTextLines();
    }

    wrapHeadingLines() {
        this.elements.contentHeading.innerHTML = '';
        this.headingLinesWrapped = [];

        each(this.headingLines, (words) => {
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
            this.elements.contentHeading.appendChild(lineDiv);
            this.headingLinesWrapped.push(lineInner);
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

    setUpProductButtonAnimation() {
        each(this.elements.slides, (slide) => {
            const buttonInner = slide.querySelector('.product__button__inner');
            const productLinks = slide.querySelector('.product__links');
            if (buttonInner && productLinks) {
                this.setUpProductButtonHover(buttonInner, productLinks);
            }
        });
    }

    setUpProductButtonHover(buttonInner, productLinks) {
        gsap.set(buttonInner, {
            width: '10rem',
            overflow: 'hidden'
        });

        gsap.set(productLinks, {
            height: '0',
            opacity: 0,
            overflow: 'hidden'
        });

        buttonInner.addEventListener('mouseenter', () => {
            gsap.to(buttonInner, {
                width: '100%',
                opacity: 1,
                duration: 0.7,
                ease: 'power1.out'
            });

            gsap.to(productLinks, {
                height: 'auto',
                opacity: 1,
                duration: 0.5,
                ease: 'power1.out'
            });
        });

        buttonInner.addEventListener('mouseleave', () => {
            gsap.to(buttonInner, {
                width: '10rem',
                opacity: 1,
                duration: 1,
                ease: 'power1.out'
            });

            gsap.to(productLinks, {
                height: '0',
                opacity: 0,
                duration: 0.7,
                ease: 'power1.out'
            });
        });
    }

    setupSlider() {
        this.totalSlides = this.elements.slides.length;


        this.cloneSlides();


        if (this.elements.paginationTotal) {
            this.elements.paginationTotal.textContent = String(this.totalSlides).padStart(2, '0');
        }


        this.updatePagination();


        this.allSlides = this.element.querySelectorAll('.slider__text__slide');
        this.allSlideImages = this.element.querySelectorAll('.slider__text__slide__media__image');
        this.allSlideTitles = this.element.querySelectorAll('.slider__text__slide__title');


        gsap.set(this.allSlideImages, { scale: 1.1 });
        gsap.set(this.allSlideTitles, { opacity: 0, y: 20 });


        gsap.to(this.allSlideImages[0], {
            scale: 1,
            duration: 1.4,
            ease: 'expo.out',
            delay: 0.5
        });

        gsap.to(this.allSlideTitles[0], {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.8
        });
    }

    cloneSlides() {

        const slidesArray = Array.from(this.elements.slides);

        slidesArray.forEach(slide => {
            const clone = slide.cloneNode(true);
            clone.classList.add('slide--clone');
            this.elements.slider.appendChild(clone);
        });
    }

    setupAnimations() {
        if (this.isOnlySlider) {

            gsap.set(this.elements.pagination, { opacity: 0, x: 20 });


            const sliderNavigation = this.element.querySelector('.slider__text__slider__container > .slider__text__navigation');
            if (sliderNavigation) {
                gsap.set(sliderNavigation, { opacity: 0, x: 20 });
            }

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: this.element,
                    start: 'top center',
                    end: 'top 20%',
                    toggleActions: 'play none none none',
                }
            });


            tl.to(this.elements.pagination, {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'power2.out'
            }, 0.3);


            if (sliderNavigation) {
                tl.to(sliderNavigation, {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    ease: 'power2.out'
                }, 0.5);
            }
        } else {

            gsap.set(this.headingLinesWrapped, { y: '100%' });
            gsap.set(this.textLinesWrapped, { y: '100%' });
            gsap.set(this.elements.contentCta, { opacity: 0, y: 20 });
            gsap.set(this.elements.pagination, { opacity: 0, y: -20 });
            gsap.set(this.elements.navigationBtns, { opacity: 0, y: 20 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: this.element,
                    start: 'top center',
                    end: 'top 20%',
                    toggleActions: 'play none none none',
                }
            });


            each(this.headingLinesWrapped, (line, index) => {
                tl.to(line, {
                    y: '0%',
                    duration: 1.2,
                    ease: 'expo.out'
                }, index * 0.08);
            });


            each(this.textLinesWrapped, (line, index) => {
                tl.to(line, {
                    y: '0%',
                    duration: 1,
                    ease: 'expo.out'
                }, 0.3 + (index * 0.06));
            });


            tl.to(this.elements.contentCta, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out'
            }, 0.5);


            tl.to(this.elements.pagination, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out'
            }, 0.6);


            tl.to(this.elements.navigationBtns, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out'
            }, 0.7);
        }
    }

    setupSliderControls() {

        this.handleNext = () => this.goToNextSlide();
        this.handlePrev = () => this.goToPrevSlide();
        this.handleKeyboardBound = this.handleKeyboard.bind(this);


        const allNextBtns = this.element.querySelectorAll('.slide__next');
        const allPrevBtns = this.element.querySelectorAll('.slide__pervious');


        allNextBtns.forEach(btn => {
            btn.addEventListener('click', this.handleNext);
        });


        allPrevBtns.forEach(btn => {
            btn.addEventListener('click', this.handlePrev);
        });


        this.allNextBtns = allNextBtns;
        this.allPrevBtns = allPrevBtns;


        document.addEventListener('keydown', this.handleKeyboardBound);
    }

    handleKeyboard(e) {

        const rect = this.element.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;

        if (!isInView) return;

        if (e.key === 'ArrowLeft') {
            this.goToPrevSlide();
        } else if (e.key === 'ArrowRight') {
            this.goToNextSlide();
        }
    }

    goToNextSlide() {
        if (this.isAnimating) return;

        this.currentSlide++;
        this.animateSlide('next');
    }

    goToPrevSlide() {
        if (this.isAnimating) return;

        this.currentSlide--;
        this.animateSlide('prev');
    }

    animateSlide(direction) {
        this.isAnimating = true;


        const slideWidth = this.allSlides[0].offsetWidth;
        const gap = parseFloat(getComputedStyle(this.allSlides[0]).marginRight);
        const offset = -(slideWidth + gap) * this.currentSlide;


        const actualSlideIndex = ((this.currentSlide % this.totalSlides) + this.totalSlides) % this.totalSlides;


        gsap.to(this.elements.slider, {
            x: offset,
            duration: 1,
            ease: 'power2.inOut',
            onComplete: () => {
                this.isAnimating = false;


                if (this.currentSlide >= this.totalSlides) {
                    this.currentSlide = 0;
                    gsap.set(this.elements.slider, { x: 0 });
                } else if (this.currentSlide < 0) {
                    this.currentSlide = this.totalSlides - 1;
                    const resetOffset = -(slideWidth + gap) * this.currentSlide;
                    gsap.set(this.elements.slider, { x: resetOffset });
                }
            }
        });


        const prevSlideActual = this.currentSlide - 1;
        if (prevSlideActual >= 0) {
            gsap.to(this.allSlideImages[prevSlideActual], {
                scale: 1.1,
                duration: 1,
                ease: 'power2.inOut'
            });

            gsap.to(this.allSlideTitles[prevSlideActual], {
                opacity: 0,
                y: 20,
                duration: 0.4,
                ease: 'power2.in'
            });
        }


        gsap.to(this.allSlideImages[this.currentSlide], {
            scale: 1,
            duration: 1.2,
            ease: 'power2.out',
            delay: 0.2
        });

        gsap.to(this.allSlideTitles[this.currentSlide], {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            delay: 0.4
        });


        this.updatePagination(actualSlideIndex);
    }

    updatePagination(slideIndex) {
        if (this.elements.paginationCurrent) {
            const displayIndex = slideIndex !== undefined ? slideIndex : this.currentSlide;
            this.elements.paginationCurrent.textContent = String(displayIndex + 1).padStart(2, '0');
        }
    }

    destroy() {

        if (this.handleKeyboardBound) {
            document.removeEventListener('keydown', this.handleKeyboardBound);
        }


        if (this.allNextBtns) {
            this.allNextBtns.forEach(btn => {
                btn.removeEventListener('click', this.handleNext);
            });
        }

        if (this.allPrevBtns) {
            this.allPrevBtns.forEach(btn => {
                btn.removeEventListener('click', this.handlePrev);
            });
        }


        const elementsToKill = [
            this.elements.pagination,
            this.elements.slider,
            ...this.allSlideImages,
            ...this.allSlideTitles
        ];

        if (!this.isOnlySlider && this.headingLinesWrapped && this.textLinesWrapped) {
            elementsToKill.push(
                ...this.headingLinesWrapped,
                ...this.textLinesWrapped,
                this.elements.contentCta,
                this.elements.navigationBtns
            );
        } else {

            const sliderNavigation = this.element.querySelector('.slider__text__slider__container > .slider__text__navigation');
            if (sliderNavigation) {
                elementsToKill.push(sliderNavigation);
            }
        }

        gsap.killTweensOf(elementsToKill);


        const clonedSlides = this.element.querySelectorAll('.slide--clone');
        clonedSlides.forEach(clone => clone.remove());


        ScrollTrigger.getAll().forEach(trigger => {
            if (trigger.trigger === this.element) {
                trigger.kill();
            }
        });
    }
}