import './components/cardItems.js';
import './components/addCardForm.js';
import './components/addColumnForm.js';
import './components/searchForm.js';

import Services from  './services/services.js';

export const template = document.createElement('template');

template.innerHTML = `
<style>
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: stretch;
}

.card {
  width: 300px;
  margin: 10px;
  border: 1px solid black;
}

.lists-container::-webkit-scrollbar {
  height: 2.4rem;
}

.lists-container::-webkit-scrollbar-thumb {
  background-color: #66a3c7;
  border: 0.8rem solid #0079bf;
  border-top-width: 0;
}

.lists-container {
  padding: 0 0.8rem 0.8rem;
  overflow-x: auto;
  height: 300px;
}

.list {
  max-height: 300px;
  border-radius: 0.3rem;
  margin-right: 1rem;
}

.list-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #333;
  padding: 1rem;
}

.delete {
  float: right;
}
</style>
<div class="container">
<div id="column" class="card">
<add-column-form></add-column-form>
</div>
<div id="search" class="card">
<search-form></search-form>
</div>
</div>
<div id="container" class="container">
  </div>
`;

export default class Card extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this.columns = [];
    this.services = new Services();
  }

  connectedCallback() {
    this._shadowRoot.appendChild(template.content.cloneNode(true));
    this.$columnForm = this._shadowRoot.querySelector('add-column-form');
    this.$columnForm.addEventListener('addColumn', this.postColumn.bind(this));
    this.$searchForm = this._shadowRoot.querySelector('search-form');
    this.$searchForm.addEventListener('search', this.searchCards.bind(this));
    this.getColumns();
  }

  async getColumns() {
    try {
      this.columns = await this.services.getColumns();
      this._render();
    } catch (e) {
      console.log(e);
    }
  };

  async searchCards(e) {
    try {
      this.filterText = e.detail.title;
      this._render();
    } catch (e) {
      console.log(e);
    }
  };

  async postCards(e) {
    const data = await this.services.getCardsByName(e.detail.title, e.detail.columnId);
    if(data.length === 0) {
    await this.services.postCards(e);
    await this.getColumns();
    }else{
      alert('Card name already exists');
    }
  };

  async postColumn(e) {
    const data = await this.services.getColumnsByName(e.detail.title);
    if(data.length === 0) {
      await this.services.postColumn(e);
      await this.getColumns();
    }else{
      alert('Column name already exists');
    }
  };

  async updateCards(e) {
    await this.services.updateCards(e);
    await this.getColumns();
  };

  async deleteCard(e) {
    await this.services.deleteCard(e);
    await this.getColumns();
  };

  async deleteColumn(e) {
    await this.services.deleteColumn(e);
    await this.getColumns();
  };

  _render() {
    if (this._shadowRoot.querySelector('#container')) {
      this._shadowRoot.querySelector('#container').innerHTML = '';
    }

    for (let i = 0; i < this.columns.length; i++) {

      let $card = document.createElement('div');
      $card.classList.add("card");

      let $section = document.createElement('section');
      $section.classList.add("lists-container");

      let $list = document.createElement('div');
      $list.classList.add("list");

      console.log(this.columns[i].id);

      let $item = document.createElement('card-items');
      $item.setAttribute('id', this.columns[i].id);
      $item.setAttribute('filterText', this.filterText);

      let $addCardForm = document.createElement('add-card-form');
      $addCardForm.setAttribute('id', this.columns[i].id);

      let $h3 = document.createElement('h3');
      $h3.classList.add("list-title");
      $h3.textContent = this.columns[i].title;

      let $i = document.createElement('img');
      $i.classList.add("delete");
      $i.setAttribute('id', this.columns[i].id);
      $i.setAttribute('src', 'https://img.icons8.com/material-sharp/24/000000/delete-sign.png');

      $h3.appendChild($i);
      $list.appendChild($h3);
      $list.appendChild($item);
      $section.appendChild($list);
      $card.appendChild($section);
      $card.appendChild($addCardForm);

      this._shadowRoot.querySelector('#container').appendChild($card);
    }


    this.$cards = this._shadowRoot.querySelectorAll('card-items');

    this.$cards.forEach((item) => {
      item.addEventListener('updateCards', this.updateCards.bind(this));
      item.addEventListener('deleteCard', this.deleteCard.bind(this));
    });

    this.$listItem = this._shadowRoot.querySelectorAll('add-card-form');
    this.$listItem.forEach((item) => {
      item.addEventListener('onSubmit', this.postCards.bind(this));
    });

    this.$delete = this._shadowRoot.querySelectorAll('.delete');
    this.$delete.forEach((item) => {
      item.addEventListener('click', this.deleteColumn.bind(this));
    });

  };
}

window.customElements.define('maltem-card', Card);
