import Page from "../../components/Page";
import Hero from "../../sections/Hero"
import LeftContentRightImage from "../../sections/LeftContentRightImage";
import MediasComposition from "../../sections/MediasComposition";
import ProductsSelection from "../../sections/ProductsSelection";
import QuoteImagesTrail from "../../sections/QuoteImagesTrail";
import SliderText from "../../sections/SliderText";
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

        // Initialize first slider instance
        // Find all slider instances on the page
        const sliderElements = document.querySelectorAll('.slider__text');

        // Initialize each slider separately
        this.sliders = [];
        sliderElements.forEach((sliderElement, index) => {
            // Add unique identifier to each slider
            sliderElement.setAttribute('data-slider-index', index);

            // Initialize slider with specific element
            const slider = new SliderText(`.slider__text[data-slider-index="${index}"]`);
            this.sliders.push(slider);
        });


        new TextMediaV3()

    }

    addEventListeners() { }

}

