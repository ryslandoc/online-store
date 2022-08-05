import CardList from "./components/card-list.js";
import Pagination from "./components/pagination.js";
import Cart from "./components/cart.js";

// products?_page=1&_limit=8 -> параметри живуть окремо від основного url

const BACKEND_URL = `https://online-store.bootcamp.place/api/`;

export default class OnlineStorePage {
    constructor() {
        this.products = [];
        this.cartProducts = []
        this.pageSize = 9;
        this.components = {};

        this.url = new URL('products', BACKEND_URL);
        this.url.searchParams.set('_limit', this.pageSize);

        this.initComponents();
        this.render();
        this.renderComponents();

        this.initEvent();

        this.update(1);
    }

    async loadData(pageNumber) {
        this.url.searchParams.set('_page', pageNumber);
        const response = await fetch(this.url);
        const products = await response.json();

        return products;
    }

    initComponents() {
        // TODO: remove hardcoded value
        const totalElements = 100;

        const totalPages = Math.ceil(totalElements / this.pageSize);

        // методом slice берем под-масив
        const cardList = new CardList(this.products);
        const pagination = new Pagination({
            activePageIndex: 0,
            totalPages: totalPages,
        });
        const cart = new Cart();

        this.components.cardList = cardList;
        this.components.pagination = pagination;
        this.components.cart = cart;
    }

    renderComponents() {
        const cardListContainer = this.element.querySelector('[data-element="cardList"]')
        const paginationContainer = this.element.querySelector('[data-element="pagination"]');

        cardListContainer.append(this.components.cardList.element);
        paginationContainer.append(this.components.pagination.element);

        this.element.appendChild(this.components.cart.element)
    }

    getTemplate() {
        return `
        <div>
            <div data-element="cardList">
            
            </div>
            <div class="wrapper-pagination-box" data-element="pagination">
            
            </div>
        </div>
        `;
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.getTemplate();
        this.element = wrapper;
    }

    initEvent() {
        // this is DOM event
        this.components.pagination.element.addEventListener('page-changed', event => {
            const pageIndex = event.detail;

            this.update(pageIndex + 1);
        })

        this.components.cardList.element.addEventListener('add-to-cart', event => {
            this.addProductToCart(event.detail);
        })

        this.components.cart.element.addEventListener('decrement-cart-product', event => {
            this.decrementCartProduct(event.detail);
        })

        this.components.cart.element.addEventListener('increment-cart-product', event => {
            this.incrementCartProduct(event.detail);
        })
    }

    decrementCartProduct(id) {
        const cartItem = this.cartProducts.find((item) => item.id === id);
        if (cartItem.quantity > 1) {
            cartItem.quantity--;
        } else {
            const idx = this.cartProducts.findIndex((item) => item.id === id);
            this.cartProducts.splice(idx, 1);
        }
        this.updateCartData();
    }

    incrementCartProduct(id) {
        const cartItem = this.cartProducts.find((item) => item.id === id);
        cartItem.quantity++;
        this.updateCartData();
    }

    addProductToCart(product) {
        const cartItem = this.cartProducts.find(item => item.id === product.id);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            product.quantity = 1;
            this.cartProducts.push(product);
        }
        this.updateCartData();
    }

    updateCartData() {
        const totalQuantity = this.getTotalQuantity(this.cartProducts);
        document.querySelector('[data-element="cartQuantity"]').innerHTML = totalQuantity;
        this.components.cart.update(this.cartProducts);
    }

    getTotalQuantity(products) {
        if (!products.length) return ''
        return products.reduce((acc, cur) => {
            return acc + cur.quantity;
        }, 0)
    }

    async update(pageNumber) {
        const data = await this.loadData(pageNumber);

        this.components.cardList.update(data);
    }
}