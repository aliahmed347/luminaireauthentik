import Page from "../../components/Page";
import Hero from "../../sections/Hero"

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

    }

}