import AsyncLoad from "./AsyncLoad";
import GSAP from "gsap";
export default class Page {

    constructor({ element, elements, id }) {
        this.id = id;
        this.selector = element;
        this.selectorChildren = {
            ...elements,
        };

    }


    create() {
        this.element = document.querySelector(this.selector)
        this.elements = {}

        each(this.selectorChildren, (entry, key) => {
            if (entry instanceof window.HTMLElement || entry instanceof window.NodeList || Array.isArray(entry)) {
                this.elements[key] = entry
            } else {
                this.elements[key] = document.querySelectorAll(entry)

                if (this.elements[key].length === 0) {
                    this.elements[key] = null
                } else if (this.elements[key].length === 1) {
                    this.elements[key] = document.querySelector(entry)
                }
            }

        });

        this.createPreloader()

    }

    createPreloader() {

        this.preloaders = map(this.elements.preloaders, element => {
            return new AsyncLoad({ element })
        })

    }

    show() {

        this.animationIn = GSAP.timeline()
        return new Promise(resolve => {
            this.animationIn.fromTo(this.element,
                {
                    autoAlpha: 0,
                }, {
                autoAlpha: 1,
            })

            this.animationIn.call(_ => {
                this.addEventListeners()
                resolve()
            })
        })
    }

    hide() {

        this.destroy()

        this.animationOut = GSAP.timeline()

        return new Promise(resolve => {
            this.animationOut.to(this.element, {
                autoAlpha: 0,
                onComplete: resolve
            });
        })
    }




}