import Component from "../classes/Component";
import gsap from "gsap";
import { split, calculate } from "../utils/text";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import each from "lodash/each";

gsap.registerPlugin(ScrollTrigger);

export default class ProductDetails extends Component {
    constructor() {
        super({
            element: '.product__details',
            elements: {
                productImagesWrapper: '.product__images__wrapper',
                previewImages: '.product__preview__image__figure',
                thumbnails: '.product__preview__thumbnail',
                colorAccordions: '.color__info__ele',
                colorInputs: '.product__color__input',
                quantityCount: '.product__info__quantity__count',
                increaseBtn: '.increse__btn',
                decreaseBtn: '.decrese__btn',
                wishlistBtn: '.product__info__wishlist__btn',
                addToCartBtn: '.cart__btn',
                configurationBtn: '.configuration__btn',
                productTitle: '.product__info__title',

            }
        });

        this.currentImageIndex = 1;
        this.quantity = 1;
        this.selectedColors = {};

        this.init();
    }

    init() {
        if (!this.element) return;

        this.splitText();
        this.setupAnimations();

        this.setupImageGallery();
        this.setupColorAccordions();
        this.setupQuantityControls();
    }

    splitText() {
        // Split title into spans
        split({ element: this.elements.productTitle, append: true });

        // Calculate title lines based on position
        const titleSpans = this.elements.productTitle.querySelectorAll('span');
        this.titleLines = calculate(titleSpans);

        // Wrap title lines
        this.wrapTitleLines();
    }

    wrapTitleLines() {
        // Wrap title lines
        this.elements.productTitle.innerHTML = '';
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
            this.elements.productTitle.appendChild(lineDiv);
            this.titleLinesWrapped.push(lineInner);
        });
    }

    setupAnimations() {
        // Set initial states
        gsap.set(this.titleLinesWrapped, { y: '100%' });

        // Create main timeline with ScrollTrigger
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: this.element,
                start: 'top 20%',
                end: 'top 80%',
                toggleActions: 'play none none none',
            }
        });

        // Animate title lines in with stagger
        each(this.titleLinesWrapped, (line, index) => {
            tl.to(line, {
                y: '0%',
                duration: 1.5,
                ease: 'expo.out'
            }, index * 0.08);
        });

    }

    setupImageGallery() {
        if (!this.elements.thumbnails) return;

        each(this.elements.thumbnails, (thumbnail) => {
            thumbnail.addEventListener('click', () => {
                const imgId = thumbnail.getAttribute('data-img');
                this.switchImage(imgId);
            });
        });
    }

    switchImage(imgId) {
        // Remove active class from all thumbnails and images
        each(this.elements.thumbnails, (thumb) => {
            thumb.classList.remove('active');
        });
        each(this.elements.previewImages, (img) => {
            img.classList.remove('active');
        });

        // Add active class to selected thumbnail and image
        const selectedThumbnail = this.element.querySelector(`.product__preview__thumbnail[data-img="${imgId}"]`);
        const selectedImage = this.element.querySelector(`.product__preview__image__figure[data-img="${imgId}"]`);

        if (selectedThumbnail && selectedImage) {
            selectedThumbnail.classList.add('active');

            // Animate image transition
            gsap.fromTo(selectedImage,
                {
                    opacity: 0,
                },
                {
                    opacity: 1,
                    duration: 1,
                    ease: 'power2.out',
                    onStart: () => {
                        selectedImage.classList.add('active');
                    }
                }
            );
        }
    }

    setupColorAccordions() {
        if (!this.elements.colorAccordions) return;

        each(this.elements.colorAccordions, (child) => {
            const button = child.querySelector('.color__info__button');
            const body = child.querySelector('.color__info__body');

            button.addEventListener('click', () => {
                const isActive = child.classList.contains('active');

                // Close all accordions
                each(this.elements.colorAccordions, (item) => {
                    item.classList.remove('active');
                    const itemBody = item.querySelector('.color__info__body');
                    if (itemBody) {
                        itemBody.style.maxHeight = '0';
                        itemBody.style.overflow = 'hidden';
                    }
                });

                // Open the clicked one
                if (!isActive) {
                    child.classList.add('active');

                    // Keep hidden during animation
                    body.style.overflow = 'hidden';
                    body.style.maxHeight = body.scrollHeight / 10 + 'rem';

                    // Set overflow visible AFTER transition ends
                    const onTransitionEnd = (e) => {
                        if (e.propertyName === 'max-height') {
                            body.style.overflow = 'visible';
                            body.removeEventListener('transitionend', onTransitionEnd);
                        }
                    };

                    body.addEventListener('transitionend', onTransitionEnd);
                }
            });
        });
    }


    setupQuantityControls() {
        if (!this.elements.increaseBtn || !this.elements.decreaseBtn) return;

        // Increase quantity
        this.elements.increaseBtn.addEventListener('click', () => {
            this.quantity++;
            this.updateQuantityDisplay();
        });

        // Decrease quantity
        this.elements.decreaseBtn.addEventListener('click', () => {
            if (this.quantity > 1) {
                this.quantity--;
                this.updateQuantityDisplay();
            }
        });
    }

    updateQuantityDisplay() {
        if (!this.elements.quantityCount) return;

        // Animate number change
        gsap.fromTo(this.elements.quantityCount,
            {
                scale: 1.3,
                opacity: 0.5
            },
            {
                scale: 1,
                opacity: 1,
                duration: 0.3,
                ease: 'back.out(2)',
                onStart: () => {
                    this.elements.quantityCount.textContent = this.quantity;
                }
            }
        );
    }


    destroy() {
        // Kill any ongoing GSAP animations
        if (this.elements.previewImages) {
            gsap.killTweensOf(this.elements.previewImages);
        }
        if (this.elements.quantityCount) {
            gsap.killTweensOf(this.elements.quantityCount);
        }
        if (this.elements.wishlistBtn) {
            gsap.killTweensOf(this.elements.wishlistBtn);
        }
        if (this.elements.addToCartBtn) {
            gsap.killTweensOf(this.elements.addToCartBtn);
        }

        // Remove event listeners by cloning and replacing elements
        if (this.elements.thumbnails) {
            each(this.elements.thumbnails, (thumb) => {
                thumb.replaceWith(thumb.cloneNode(true));
            });
        }

        if (this.elements.colorAccordions) {
            each(this.elements.colorAccordions, (accordion) => {
                const button = accordion.querySelector('.color__info__button');
                if (button) {
                    button.replaceWith(button.cloneNode(true));
                }
            });
        }

        if (this.elements.colorInputs) {
            each(this.elements.colorInputs, (input) => {
                input.replaceWith(input.cloneNode(true));
            });
        }

        if (this.elements.increaseBtn) {
            this.elements.increaseBtn.replaceWith(this.elements.increaseBtn.cloneNode(true));
        }

        if (this.elements.decreaseBtn) {
            this.elements.decreaseBtn.replaceWith(this.elements.decreaseBtn.cloneNode(true));
        }

        if (this.elements.wishlistBtn) {
            this.elements.wishlistBtn.replaceWith(this.elements.wishlistBtn.cloneNode(true));
        }

        if (this.elements.addToCartBtn) {
            this.elements.addToCartBtn.replaceWith(this.elements.addToCartBtn.cloneNode(true));
        }

        if (this.elements.configurationBtn) {
            this.elements.configurationBtn.replaceWith(this.elements.configurationBtn.cloneNode(true));
        }

        // Remove any created modal elements
        const modals = document.querySelectorAll('.color-zoom-modal');
        each(modals, (modal) => modal.remove());
    }
}