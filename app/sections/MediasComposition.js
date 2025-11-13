import Component from "../classes/Component";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default class MediasComposition extends Component {
    constructor() {
        super({
            element: '.medias__composition',
            elements: {
                parallaxBackground: '.medias__composition__parallax',
            }
        });

        this.init();
    }

    init() {
        if (!this.element) return;

        gsap.fromTo(
            this.elements.parallaxBackground,
            {
                y: 0
            },
            {
                y: 180,
                ease: "none",
                scrollTrigger: {
                    trigger: this.element,
                    start: "top bottom",
                    end: "bottom bottom",
                    scrub: true,
                }
            }
        );
    }
}