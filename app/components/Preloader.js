import GSAP from "gsap"
import Component from "../classes/Component"
import each from "lodash/each"

export default class Preloader extends Component {
    constructor() {
        super({
            element: '.preloader',
            elements: {
                preloaderMediaImages: '.preloader__media'
            }
        })


        this.timeline = GSAP.timeline()

        this.createLoader()

    }

    async createLoader() {

        await this.imagesIn()

        await this.changeImages()

        await this.imagesOut()

        this.destroy()

    }



    changeImages() {

        return new Promise((resolve) => {
            let loaded = 0;

            const totalImages = this.elements.preloaderMediaImages.length

            each(this.elements.preloaderMediaImages, media => {

                const image = media.querySelector('img')

                const dataSrc = image.getAttribute('data-src')

                const newImage = new Image()
                newImage.src = dataSrc


                newImage.onload = () => {
                    const oldImage = image.cloneNode()

                    oldImage.classList.add('second__image')

                    media.appendChild(oldImage)

                    image.style.opacity = 0

                    image.src = dataSrc

                    const tl = GSAP.timeline({
                        onComplete: () => {
                            oldImage.remove()
                            loaded++
                            if (loaded === totalImages) resolve()
                        }
                    })

                    tl.to(oldImage, { opacity: 0, duration: 0.8, ease: "power2.out" }, 0)
                    tl.to(image, { opacity: 1, duration: 0.8, ease: "power2.out" }, 0)

                }

            })
        })

    }

    imagesIn() {

        return new Promise((resolve) => {


            this.timeline.to(this.elements.preloaderMediaImages[0], {
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 1.5
            })

            this.timeline.to(this.elements.preloaderMediaImages[2], {
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 1.5
            }, '-=1.5')

            this.timeline.to(this.elements.preloaderMediaImages[1], {
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 1.5
            }, '-=1.4')

            this.timeline.to(this.elements.preloaderMediaImages[3], {
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 1.5,
                onComplete: resolve
            }, '-=1.3')

        })

    }

    imagesOut() {
        return new Promise((resolve) => {

            this.timeline.to(this.elements.preloaderMediaImages[3], {
                clipPath: 'inset(100% 0% 0% 0%)',
                duration: 2,
                delay: 1,
                ease: 'expo.inOut',
            })

            this.timeline.to(this.elements.preloaderMediaImages[1], {
                clipPath: 'inset(100% 0% 0% 0%)',
                duration: 2,
                ease: 'expo.inOut',
            }, '-=1.9')

            this.timeline.to(this.elements.preloaderMediaImages[2], {
                clipPath: 'inset(100% 0% 0% 0%)',
                duration: 2,
                ease: 'expo.inOut',
            }, '-=1.8')

            this.timeline.to(this.elements.preloaderMediaImages[0], {
                clipPath: 'inset(100% 0% 0% 0%)',
                duration: 2,
                ease: 'expo.inOut',
                onComplete: () => resolve()
            }, '-=1.7')

        })
    }


    destroy() {
        this.emit('completed')
        this.element.parentNode.removeChild(this.element)
    }

}