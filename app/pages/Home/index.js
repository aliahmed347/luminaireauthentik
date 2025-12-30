import Page from "../../components/Page";
import Hero from "../../sections/Hero"
import LeftContentRightImage from "../../sections/LeftContentRightImage";
import MediasComposition from "../../sections/MediasComposition";
import ProductsSelection from "../../sections/ProductsSelection";
import QuoteImagesTrail from "../../sections/QuoteImagesTrail";
import SliderText from "../../sections/SliderText";
import TextMediaV1 from "../../sections/TextMediaV1";
import TextMediaV2 from "../../sections/TextMediaV2";
import TextMediaV3 from "../../sections/TextMediaV3";

export default class Home extends Page {

    constructor() {
        super({
            id: "home",
            element: ".home",
        })

        console.log("Home load");
    }

    create() {

        new Hero()

        new LeftContentRightImage()

        new QuoteImagesTrail()

        new MediasComposition()

        new ProductsSelection()

        new TextMediaV2()

        // Initialize all slider instances
        const sliderElements = document.querySelectorAll('.slider__text');
        this.sliders = [];
        sliderElements.forEach((sliderElement, index) => {
            sliderElement.setAttribute('data-slider-index', index);
            const slider = new SliderText(`.slider__text[data-slider-index="${index}"]`);
            this.sliders.push(slider);
        });

        new TextMediaV3()

        // Initialize all TextMediaV1 instances
        const textMediaElements = document.querySelectorAll('.text__media__v1');
        this.textMediaInstances = [];
        textMediaElements.forEach((element, index) => {
            element.setAttribute('data-textmedia-index', index);
            const textMedia = new TextMediaV1(`.text__media__v1[data-textmedia-index="${index}"]`);
            this.textMediaInstances.push(textMedia);
        });
    }

    addEventListeners() { }

    destroy() {
        // Clean up sliders
        if (this.sliders) {
            this.sliders.forEach(slider => slider.destroy());
        }

        // Clean up text media instances
        if (this.textMediaInstances) {
            this.textMediaInstances.forEach(instance => instance.destroy());
        }

        super.destroy();
    }
}