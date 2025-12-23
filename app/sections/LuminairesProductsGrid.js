import Component from "../classes/Component";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { before } from "lodash";
import each from "lodash/each";

gsap.registerPlugin(ScrollTrigger);

export default class LuminairesProductsGrid extends Component {
    constructor() {
        super({
            element: '.luminaires__products__wrapper',
            elements: {
                productsHeader: '.luminaires__products__heading',
                productsFilters: '.luminaires__products__filters',
                productsGrid: '.luminaires__products__grid',
                viewButtons: '.view__btn',
                products: '.product',
            }
        });

        this.currentView = 'grid-4'; // Default view
        this.init();
    }

    init() {
        if (!this.element) return;

        this.setupAnimations();
        this.setupFiltersToggle();
        this.setupGridViewToggle();
    }

    setupAnimations() {
        // Set initial states
        gsap.set(this.elements.productsHeader, { autoAlpha: 0, opacity: 0 });
        gsap.set(this.elements.productsFilters, { y: '10%', opacity: 0 });
        gsap.set(this.elements.productsGrid, { y: '10%', opacity: 0 });

        // Create main timeline with ScrollTrigger
        const tl = gsap.timeline({
            // scrollTrigger: {
            //     trigger: this.element,
            //     start: 'top 20%',
            //     end: 'top 80%',
            //     toggleActions: 'play none none none',
            // }
        });

        // Animate product grid
        tl.to(this.elements.productsGrid, {
            opacity: 1,
            y: "0",
            duration: 1,
            ease: 'power1.out',
        }, 0.3);

        // Animate product header
        tl.to(this.elements.productsHeader, {
            opacity: 1,
            autoAlpha: 1,
            duration: 1,
            ease: 'power1.out',
        }, 0.6);

        // Animate product filters
        tl.to(this.elements.productsFilters, {
            opacity: 1,
            y: "0",
            duration: 1,
            ease: 'power1.out',
        }, 0.5);
    }

    setupFiltersToggle() {
        // Loop over each filter element
        each(this.elements.productsFilters.children, (child) => {
            const button = child.querySelector('.filter__button');
            const body = child.querySelector('.filter__accordion__body');

            button.addEventListener('click', () => {
                child.classList.toggle('active');

                if (child.classList.contains('active')) {
                    body.style.maxHeight = body.scrollHeight / 10 + 'rem';
                } else {
                    body.style.maxHeight = '0';
                }
            });
        });
    }

    setupGridViewToggle() {
        if (!this.elements.viewButtons) return;

        const gridViewContainer = this.element.querySelector('.grid__view');

        each(this.elements.viewButtons, (button, index) => {
            button.addEventListener('click', () => {
                // Check if this button is already active
                if (button.classList.contains('active')) return;

                // Remove active class from all buttons
                each(this.elements.viewButtons, (btn) => {
                    btn.classList.remove('active');
                });

                // Add active class to clicked button
                button.classList.add('active');

                // Animate the background indicator
                this.animateViewIndicator(index, gridViewContainer);

                // Determine new view based on button index
                const newView = index === 0 ? 'grid-4' : 'grid-2';

                // Only animate if view is changing
                if (this.currentView !== newView) {
                    this.switchGridView(newView);
                }
            });
        });
    }

    animateViewIndicator(index, container) {
        if (index === 0) {
            container.classList.remove('right');
        } else {
            container.classList.add('right');
        }
    }


    switchGridView(newView) {
        const grid = this.elements.productsGrid;
        const products = grid.querySelectorAll('.product');

        // Create timeline for the view switch
        const tl = gsap.timeline();

        // Step 1: Animate all products down and fade out (staggered)
        tl.to(products, {
            y: 30,
            opacity: 0,
            duration: 0.7,
            stagger: {
                amount: 0.4,
                from: "start"
            },
            ease: 'power2.in'
        });


        // Step 2: Switch grid class (happens while products are invisible)
        tl.call(() => {
            grid.classList.remove(this.currentView);
            grid.classList.add(newView);
            this.currentView = newView;
        });

        // Step 3: Reset position and animate products back up (staggered)
        tl.set(products, { y: 30 });



        tl.to(products, {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: {
                amount: 0.3,
                from: "start"
            },
            ease: 'power2.out'
        }, '+=0.1');
    }

    destroy() {
        // Kill ScrollTrigger instance
        ScrollTrigger.getAll().forEach(trigger => {
            if (trigger.trigger === this.element) {
                trigger.kill();
            }
        });

        // Kill any ongoing GSAP animations on this component
        gsap.killTweensOf(this.elements.productsGrid);
        if (this.elements.products) {
            const products = this.elements.productsGrid.querySelectorAll('.product');
            gsap.killTweensOf(products);
        }

        // Remove event listeners
        if (this.elements.viewButtons) {
            each(this.elements.viewButtons, (button) => {
                button.replaceWith(button.cloneNode(true));
            });
        }

        each(this.elements.productsFilters.children, (child) => {
            const button = child.querySelector('.filter__button');
            if (button) {
                button.replaceWith(button.cloneNode(true));
            }
        });
    }
}