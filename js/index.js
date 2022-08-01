import CardList from "./card-list.js";
import Pagination from "./pagination.js";

// products?_page=1&_limit=8 -> параметри живуть окремо від основного url

const BACKEND_URL = `https://online-store.bootcamp.place/api/`;

export default class OnlineStorePage {
    constructor() {
        this.products = [];
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

        this.components.cardList = cardList;
        this.components.pagination = pagination;
    }

    renderComponents() {
        const cardListContainer = this.element.querySelector('[data-element="cardList"]')
        const paginationContainer = this.element.querySelector('[data-element="pagination"]');

        cardListContainer.append(this.components.cardList.element);
        paginationContainer.append(this.components.pagination.element);
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
    }

    async update(pageNumber) {
        const data = await this.loadData(pageNumber);

        this.components.cardList.update(data);
    }
}