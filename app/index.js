import '../styles/index.scss';
import Navigation from "./components/Navigation"
import Preloader from "./components/Preloader"

class App {
    constructor() {
        this.createContent()

        this.createPreloader()

        this.createNavigation()
    }


    createContent() {
        this.content = document.querySelector('.content')
        this.template = this.content.getAttribute('data-template')

    }

    createPreloader() {
        this.preloader = new Preloader()
    }

    createNavigation() {
        this.navigation = new Navigation()
    }


}




new App()


