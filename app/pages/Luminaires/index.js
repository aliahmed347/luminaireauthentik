import Page from "../../components/Page";
import LuminairesHero from "../../sections/LuminairesHero";
import LuminairesProductsGrid from "../../sections/LuminairesProductsGrid";


export default class Luminaires extends Page {

    constructor() {
        super({
            id: "luminaires",
            element: ".luminaires",
        })

        console.log("Luminaires load");

    }

    create() {

        new LuminairesHero()


        new LuminairesProductsGrid()

    }

    addEventListeners() { }

}

