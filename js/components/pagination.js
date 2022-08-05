export default class Pagination {
    constructor({activePageIndex = 0, totalPages}) {
        this.activePageIndex = activePageIndex;
        this.totalPages = totalPages;
        this.render();
        this.addEventListeners();
    }

    getTemplate() {
        return `
        <div class="pagination-prev" data-element="pagination-prev">
            <i class="fa-solid fa-caret-left"></i>
        </div>
        ${this.getPages()}
        <div class="pagination-next" data-element="pagination-next">
            <i class="fa-solid fa-caret-right"></i>
        </div>
        `;
    }

    getPages() {
        return `
        <ul class="pagination-list" data-element="pagination">
            ${new Array(this.totalPages).fill(1).map((item, index) => {
            return this.getPageTemplate(index);
        }).join('')}
        </ul>
        `;
    }

    getPageTemplate(pageIndex = 0) {
        const activePage = pageIndex === this.activePageIndex ? 'active' : '';
        return `
        <li class="pagination-item ${activePage}" data-page-index="${pageIndex}" data-element="page-item">
            <a href="javascript:void(0)" class="pagination-link">
                ${pageIndex + 1}
            </a>
        </li>
        `;
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper-pagination');
        wrapper.innerHTML = this.getTemplate();
        this.element = wrapper;
    }

    setPage(pageIndex = 0) {
        if (pageIndex === this.activePageIndex) return;
        if (pageIndex > this.totalPages - 1 || pageIndex < 0) return;

        const activePage = this.element.querySelector('.pagination-item.active');
        if (activePage) {
            activePage.classList.remove('active');
        }

        const nextPage = this.element.querySelector(`[data-page-index="${pageIndex}"]`);
        if (nextPage) {
            nextPage.classList.add('active');
        }

        this.activePageIndex = pageIndex;
        this.dispatchEvent(pageIndex);
    }

    nextPage() {
        const nextPageIndex = this.activePageIndex + 1;
        this.setPage(nextPageIndex);
    }

    prevPage() {
        const prevPageIndex = this.activePageIndex - 1;
        this.setPage(prevPageIndex);
    }

    addEventListeners() {
        const prevBtn = this.element.querySelector('[data-element="pagination-prev"]');
        const nextBtn = this.element.querySelector('[data-element="pagination-next"]');
        const pagination = this.element.querySelector('[data-element="pagination"]');

        prevBtn.addEventListener('click', () => {
            this.prevPage();
        });

        nextBtn.addEventListener('click', () => {
            this.nextPage();
        });

        pagination.addEventListener('click', event => {
            const pageItem = event.target.closest(`[data-element="page-item"]`);
            if (!pageItem) return;

            // const {pageIndex} = pageItem.dataset;
            const pageIndex = pageItem.dataset.pageIndex;
            this.setPage(parseInt(pageIndex, 10));
        });
    }

    // Random name
    dispatchEvent(pageIndex) {
        const customEvent = new CustomEvent('page-changed', {
            detail: pageIndex,
        })

        this.element.dispatchEvent(customEvent);
    }
}