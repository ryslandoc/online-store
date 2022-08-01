import Card from "./card.js";

export default class CardList {
    //products -> data
    constructor(products = []) {
        this.products = products;

        this.render();
        this.renderCards();
    }

    getTemplate() {
        return `
        <div>
            <div class="wrapper-products-box" data-element="body">
                
            </div>
        </div>
        `
    }

    renderCards() {
        const cards = this.products.map(item => {
            const card = new Card(item);
            return card.element;
        })

        const body = this.element.querySelector('[data-element="body"]');
        body.innerHTML = '';
        body.append(...cards);
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.getTemplate();
        this.element = wrapper;
    }

    update(data = []) {
        this.products = data;
        this.renderCards();
    }
}