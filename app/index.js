import '../styles/index.scss';
import Navigation from "./components/Navigation"
import Preloader from "./components/Preloader"
import Home from './pages/Home';

class App {
    constructor() {

        this.createContent()

        this.createPreloader()

        this.createNavigation()
        this.createPages()
    }


    createContent() {
        this.content = document.querySelector('.content')
        this.template = this.content.getAttribute('data-template')
    }


    createPages() {
        this.pages = {
            "home": new Home(),
        }
        this.page = this.pages[this.template]
        this.page.create()
    }

    createPreloader() {
        this.preloader = new Preloader()
        // this.preloader.once('completed', this.onPreloader.bind(this))
    }

    createNavigation() {
        this.navigation = new Navigation()
    }


}




new App()


