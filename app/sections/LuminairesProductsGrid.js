import Component from "../classes/Component";
import { split, calculate } from "../utils/text";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
            }
        });

        this.init();
    }

    init() {
        if (!this.element) return;
        this.setupAnimations()
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


    destroy() {

        // Kill ScrollTrigger instance
        ScrollTrigger.getAll().forEach(trigger => {
            if (trigger.trigger === this.element) {
                trigger.kill();
            }
        });
    }
}