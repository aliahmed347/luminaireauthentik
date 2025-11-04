import Page from "../../components/Page";
import Hero from "../../sections/Hero"
import LeftContentRightImage from "../../sections/leftContentRightImage";

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

    }

    addEventListeners() { }

}

