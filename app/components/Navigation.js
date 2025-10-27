import GSAP from "gsap";
import Component from "../classes/Component";

export default class Navigation extends Component {
    constructor() {

        super({
            element: ".navigation",
            elements: {
                navigationHamburger: ".navigation__hamburger__wrapper",
                hamburgerText: '.navigation__hamburger__text span',
                navigationMenuWrapper: '.navigation__menu__wrapper',
            }
        })

    }


    handleNavigation() {

        this.timeline = GSAP.timeline({ paused: true })

        this.timeline.fromTo(this.elements.hamburgerText, {
            y: '0%',
            duration: 0.5,
            ease: "power3.inOut",
        }, {

            y: '-100%',
            duration: 0.5,
            ease: "power3.inOut",

        })

        this.timeline.fromTo(this.elements.navigationMenuWrapper, {
            scaleY: 0,
            duration: 0.5,
            ease: "power3.inOut",
        }, {
            scaleY: 1,
            duration: 0.5,
            ease: "power3.inOut",
        },)


        const isActive = this.element.classList.contains('active')

        if (isActive) {

            this.element.classList.remove('active')

            this.timeline.reverse()

        } else {
            this.element.classList.add('active')

            this.timeline.play()

        }

    }


    addEventListeners() {
        this.elements.navigationHamburger.addEventListener('click', this.handleNavigation.bind(this))
    }




    toggleHamburger() {
        this.element.classList.toggle('active')
    }


}