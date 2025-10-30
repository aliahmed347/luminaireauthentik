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
        this.animateIn(true);
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

        // Store image wrappers for creating duplicate images
        this.slideImageWrapper = this.activeSlide.querySelector('.hero__slider__slide__image__wrapper');
        this.slideFooterImageWrapper = this.activeSlide.querySelector('.slide__footer__image');

        // Make wrappers position relative for absolute positioning of duplicates
        this.slideImageWrapper.style.position = 'relative';
        this.slideFooterImageWrapper.style.position = 'relative';
    }

    splitText() {
        // Split label and title into spans
        split({ element: this.slideLabel, append: true });
        split({ element: this.slideTitle, append: true });

        // Get label spans (words)
        const labelSpans = this.slideLabel.querySelectorAll('span');

        // Calculate title lines based on position
        const titleSpans = this.slideTitle.querySelectorAll('span');
        this.titleLines = calculate(titleSpans);

        // Wrap label words and title lines
        this.wrapLabel(labelSpans);
        this.wrapTitleLines();
    }

    wrapLabel(labelSpans) {
        // Wrap each word in the label individually
        this.slideLabel.innerHTML = '';
        this.labelWordsWrapped = [];

        each(labelSpans, (word) => {
            const wordDiv = document.createElement('div');
            wordDiv.classList.add('word');
            wordDiv.style.display = 'inline-block';
            wordDiv.style.overflow = 'hidden';

            const wordInner = document.createElement('div');
            wordInner.classList.add('word__inner');
            wordInner.innerHTML = word.outerHTML;

            wordDiv.appendChild(wordInner);
            this.slideLabel.appendChild(wordDiv);

            // Add space after each word except the last
            if (labelSpans[labelSpans.length - 1] !== word) {
                this.slideLabel.appendChild(document.createTextNode(' '));
            }

            this.labelWordsWrapped.push(wordInner);
        });
    }

    wrapTitleLines() {
        // Wrap title lines
        this.slideTitle.innerHTML = '';
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

    animateIn(isFirstLoad = false) {
        const tl = gsap.timeline();

        // Animate label words in with stagger (normal order: first to last)
        each(this.labelWordsWrapped, (word, index) => {
            tl.fromTo(word, {
                y: '100%',
            }, {
                duration: 1,
                y: '0%',
                ease: 'expo.out'
            }, index * 0.08);
        });

        // Animate title lines in with stagger (normal order: first to last)
        each(this.titleLinesWrapped, (line, index) => {
            tl.fromTo(line, {
                y: '100%',
            }, {
                duration: 1.2,
                y: '0%',
                ease: 'expo.out'
            }, index * 0.08 + 0.2);
        });

        // Only animate images with clip-path if not first load
        if (!isFirstLoad) {
            // Reveal images with clip-path from right to left
            tl.fromTo(this.slideImage, {
                clipPath: 'inset(0 100% 0 0)',
            }, {
                clipPath: 'inset(0 0% 0 0)',
                duration: 1.4,
                ease: 'expo.inOut',
                onComplete: () => {
                    // Remove temporary images after animation
                    this.removeTempImages();
                }
            }, 0);

            tl.fromTo(this.slideFooterImage, {
                clipPath: 'inset(0 100% 0 0)',
            }, {
                clipPath: 'inset(0 0% 0 0)',
                duration: 1.4,
                ease: 'expo.inOut'
            }, 0.1);
        } else {
            // First load - simple fade in
            tl.fromTo([this.slideImage, this.slideFooterImage], {
                opacity: 0,
            }, {
                opacity: 1,
                duration: 1.2,
                ease: 'power3.out'
            }, 0.3);
        }

        // Fade in CTA
        tl.fromTo(this.sliderCta, {
            opacity: 0,
            scale: 0.5
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power1.in'
        }, 0);
    }

    animateTextOut() {
        const tl = gsap.timeline();

        // Get total number of words and lines
        const labelWordsCount = this.labelWordsWrapped.length;
        const titleCount = this.titleLinesWrapped.length;

        // Animate label words out with REVERSE stagger (last to first)
        each(this.labelWordsWrapped, (word, index) => {
            // Calculate reverse index: last word = 0 delay, first word = max delay
            const reverseIndex = labelWordsCount - 1 - index;
            tl.to(word, {
                y: '100%',
                duration: 0.6,
                ease: 'power1.in'
            }, reverseIndex * 0.1);
        });

        // Animate title out with REVERSE stagger (last to first)
        each(this.titleLinesWrapped, (line, index) => {
            // Calculate reverse index: last item = 0 delay, first item = max delay
            const reverseIndex = titleCount - 1 - index;
            tl.to(line, {
                y: '100%',
                duration: 0.6,
                ease: 'power1.in'
            }, reverseIndex * 0.1);
        });

        // Fade out CTA
        tl.to(this.sliderCta, {
            opacity: 0,
            duration: 0.5,
            ease: 'power1.in'
        }, 0);

        return tl;
    }

    animateImagesIn() {
        const tl = gsap.timeline({
            onComplete: () => {
                // Remove temporary images after animation
                this.removeTempImages();
            }
        });

        // Reveal images with clip-path from right to left
        tl.fromTo(this.slideImage, {
            clipPath: 'inset(0 100% 0 0)',
        }, {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.2,
            ease: 'power1.in'
        }, 0);

        tl.fromTo(this.slideFooterImage, {
            clipPath: 'inset(0 0 100% 0)',
        }, {
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.2,
            ease: 'power1.in'
        }, 0.1);

        return tl;
    }

    createTempImages() {
        // Create temporary image for main slide image
        this.tempSlideImage = document.createElement('img');
        this.tempSlideImage.src = this.slideImage.src;
        this.tempSlideImage.className = this.slideImage.className;
        this.tempSlideImage.style.position = 'absolute';
        this.tempSlideImage.style.top = '0';
        this.tempSlideImage.style.left = '0';
        this.tempSlideImage.style.width = '100%';
        this.tempSlideImage.style.height = '100%';
        this.tempSlideImage.style.objectFit = 'cover';
        this.tempSlideImage.style.borderRadius = '0.5rem';
        this.tempSlideImage.style.zIndex = '1';
        this.slideImageWrapper.appendChild(this.tempSlideImage);

        // Create temporary image for footer image
        this.tempFooterImage = document.createElement('img');
        this.tempFooterImage.src = this.slideFooterImage.src;
        this.tempFooterImage.className = this.slideFooterImage.className;
        this.tempFooterImage.style.position = 'absolute';
        this.tempFooterImage.style.top = '0';
        this.tempFooterImage.style.left = '0';
        this.tempFooterImage.style.width = '100%';
        this.tempFooterImage.style.height = '100%';
        this.tempFooterImage.style.objectFit = 'cover';
        this.tempFooterImage.style.borderRadius = '0.5rem';
        this.tempFooterImage.style.zIndex = '1';
        this.slideFooterImageWrapper.appendChild(this.tempFooterImage);

        // Make new images positioned above with z-index
        this.slideImage.style.position = 'relative';
        this.slideImage.style.zIndex = '2';
        this.slideFooterImage.style.position = 'relative';
        this.slideFooterImage.style.zIndex = '2';
    }

    removeTempImages() {
        if (this.tempSlideImage && this.tempSlideImage.parentNode) {
            this.tempSlideImage.parentNode.removeChild(this.tempSlideImage);
            this.tempSlideImage = null;
        }
        if (this.tempFooterImage && this.tempFooterImage.parentNode) {
            this.tempFooterImage.parentNode.removeChild(this.tempFooterImage);
            this.tempFooterImage = null;
        }
    }

    updateContent(index) {
        const data = this.slidesData[index];

        // Update text content (using innerHTML to preserve any HTML tags)
        this.slideLabel.innerHTML = data.label;
        this.slideTitle.innerHTML = data.title;

        // Update images - new images will be positioned on top
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
        // Create temporary images BEFORE transition
        this.createTempImages();

        // Get the data for new slide
        const data = this.slidesData[newIndex];

        // Update image sources immediately
        this.slideImage.src = data.image;
        this.slideFooterImage.src = data.footerImage;

        // Start BOTH animations at the same time
        const textOutTimeline = this.animateTextOut();
        const imagesInTimeline = this.animateImagesIn();

        // When text animation completes, update text content and animate in
        textOutTimeline.eventCallback('onComplete', () => {
            this.slideLabel.innerHTML = data.label;
            this.slideTitle.innerHTML = data.title;
            this.sliderCta.href = data.ctaHref;
            this.sliderCta.querySelector('span').setAttribute('data-text', data.ctaText);
            this.sliderCta.querySelector('span').textContent = data.ctaText;

            // Re-split and wrap text for new content
            this.splitText();

            // Animate new text in (without images since they're already showing)
            this.animateTextIn();
        });
    }

    animateTextIn() {
        const tl = gsap.timeline();

        // Animate label words in with stagger (normal order: first to last)
        each(this.labelWordsWrapped, (word, index) => {
            tl.fromTo(word, {
                y: '100%',
            }, {
                duration: 1,
                y: '0%',
                ease: 'expo.out'
            }, index * 0.08);
        });

        // Animate title lines in with stagger (normal order: first to last)
        each(this.titleLinesWrapped, (line, index) => {
            tl.fromTo(line, {
                y: '100%',
            }, {
                duration: 1.2,
                y: '0%',
                ease: 'expo.out'
            }, index * 0.08 + 0.2);
        });

        // Fade in CTA
        tl.fromTo(this.sliderCta, {
            opacity: 0,
            scale: 0.5
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power1.in'
        }, 0);
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
        this.removeTempImages();
        if (this.labelWordsWrapped && this.titleLinesWrapped) {
            gsap.killTweensOf([...this.labelWordsWrapped, ...this.titleLinesWrapped, this.slideImage, this.slideFooterImage, this.sliderCta]);
        }
    }
}