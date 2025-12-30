import Page from "../../components/Page";
import LuminairesHero from "../../sections/LuminairesHero";
import LuminairesProductsGrid from "../../sections/LuminairesProductsGrid";
import ProductDetails from "../../sections/ProductDetails";
import SliderText from "../../sections/SliderText";
import TextMediaV1 from "../../sections/TextMediaV1";


export default class Product extends Page {

    constructor() {
        super({
            id: "product",
            element: ".product",
        })

        console.log("Product load");

    }

    create() {

        new ProductDetails()


        new TextMediaV1()

        new SliderText()


    }

    addEventListeners() { }

}

