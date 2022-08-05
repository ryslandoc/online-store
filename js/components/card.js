export default class Card {
    constructor(productData) {
        this.state = productData;
        this.render();

        this.addEventListeners();
    }

    getTemplate() {
        return `
        <div class="product-block">
            <div class="product-body">
                <div class="product-image">
                    <img src="${this.state.images[0]}" alt="product img">
                </div>
                <div class="product-info">
                    <div class="wrapper-price-block">
                        <div class="wrapper-rating">
                            <span>${this.state.rating}</span>
                            <img src="images/rating-star.svg" alt="rating star">
                        </div>
                        <div class="wrapper-price">
                            <span>${this.state.price}</span>
                        </div>
                    </div>
                    <div class="wrapper-title">
                        <h2>${this.state.title}</h2>
                    </div>
                    <div class="wrapper-category">
                        <span>${this.state.category}</span>
                    </div>
                </div>
            </div>
            <div class="wrapper-product-button">
                <button data-element="addToCart">Add To Cart</button>
            </div>
        </div>
        `
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.getTemplate();
        this.element = wrapper.firstElementChild;
    }

    addEventListeners () {
        const addToCartBtn = this.element.querySelector('[data-element="addToCart"]')
        addToCartBtn.addEventListener('click', event => {
            this.dispatchAddToCartEvent(this.state)
        })
    }

    dispatchAddToCartEvent (productData) {
        this.element.dispatchEvent(new CustomEvent('add-to-cart', {
            detail: productData,
            bubbles: true
        }))
    }
}