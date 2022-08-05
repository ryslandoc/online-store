export default class Cart {
    constructor() {
        this.totalPrice = 0;

        this.render();
        this.addEventListeners();

        this.update();
    }

    getTemplate() {
        return `
        <div class="modal">
            <div class="modal-body" data-element="modalContainer">
                <div class="modal-content">
                    <div class="modal-top">
                        <div class="modal-title">
                            <h2>Cart</h2>
                        </div>
                        <div class="modal-close" data-element="closeBtn">
                            <svg class="close-icon">
                                <use href="./images/sprite.svg#close"></use>
                            </svg>
                        </div>
                    </div>
                    <ul class="modal-cart-list" data-element="list">
                        <!-- Products -->
                    </ul>
                    <div class="modal-bottom">
                        <div class="modal-total">
                            Total: <span data-element="total">${this.totalPrice}</span>
                        </div>
                        <button class="modal-order-btn" data-element="order">Order</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    update(products = []) {
        const productItems = products.map(item => {
            const product = document.createElement('div')
            product.innerHTML = `
                <li class="modal-product">
                <div class="product-preview">
                    <img width="60" height="40" src="${item.images[0]}" alt="product image">
                </div>
                <div class="product-title">
                    ${item.title}
                </div>
                <div class="product-counter">
                    <button class="counter-btn" data-control="decrementQuantity" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="counter-btn" data-control="incrementQuantity" data-id="${item.id}">+</button>
                </div>
                <div class="product-price">${item.price}</div>
                </li>
            `;

            return product;
        });

        const list = this.element.querySelector('[data-element="list"]')
        list.innerHTML = ''
        list.append(...productItems)

        this.totalPrice = this.getTotalPrice(products)
        this.element.querySelector('[data-element="total"]').innerHTML = this.totalPrice
    }

    getTotalPrice(products) {
        return products.reduce((acc, cur) => {
            const price = cur.price * cur.quantity
            return acc + price
        }, 0)
    }

    addEventListeners() {
        const openBtn = document.querySelector('[data-element="openCart"]')
        const closeBtn = this.element.querySelector('[data-element="closeBtn"]');
        const modalContainer = this.element.querySelector('[data-element="modalContainer"]');

        openBtn.addEventListener('click', () => {
            this.open()
        })

        closeBtn.addEventListener('click', () => {
            this.close()
        })

        modalContainer.addEventListener('click', event => {
            event.stopPropagation()
        })

        this.element.addEventListener('click', () => {
            this.close()
        })

        const list = this.element.querySelector('[data-element="list"]')
        list.addEventListener('click', event => {
            const {dataset} = event.target
            if (dataset.control) {
                if (dataset.control === 'decrementQuantity') this.dispatchDecrementEvent(dataset.id)
                if (dataset.control === 'incrementQuantity') this.dispatchIncrementEvent(dataset.id)
            }
        })
    }

    dispatchDecrementEvent(productId) {
        this.element.dispatchEvent(new CustomEvent('decrement-cart-product', {
            detail: productId
        }))
    }

    dispatchIncrementEvent(productId) {
        this.element.dispatchEvent(new CustomEvent('increment-cart-product', {
            detail: productId
        }))
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.getTemplate();
        this.element = wrapper;
    }

    open() {
        const modal = this.element.querySelector('.modal');
        if (!modal.classList.contains('modal--visible')) {
            modal.classList.add('modal--visible')
        }
    }

    close() {
        const modal = this.element.querySelector('.modal');
        if (modal.classList.contains('modal--visible')) {
            modal.classList.remove('modal--visible')
        }
    }
}