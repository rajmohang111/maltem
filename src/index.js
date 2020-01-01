import './components/cardItems.js';
import './components/addCardForm.js';
import './components/addColumnForm.js';

const template = document.createElement('template');

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
</style>
<div id="column" class="card">
 <add-column-form></add-column-form>
</div>
<div class="container">
  </div>
`;

class Card extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this.columns = [];
  }

  connectedCallback() {
    this._shadowRoot.appendChild(template.content.cloneNode(true));
    this.getColumns();
  }

  async getColumns() {
    const columns = await fetch('http://localhost:3000/columns');
    this.columns = await columns.json();
    this._render();
  };

  async postCards(e) {
    const cards = await fetch('http://localhost:3000/cards', {
      method: 'post', body: JSON.stringify(e.detail), headers: {
        'Content-Type': 'application/json'
      }
    });
    this.getColumns();
  };

  async postColumn(e) {
    const cards = await fetch('http://localhost:3000/columns', {
      method: 'post', body: JSON.stringify(e.detail), headers: {
        'Content-Type': 'application/json'
      }
    });
    this.getColumns();
  };

  async updateCards(e) {
    const cards = await fetch(`http://localhost:3000/cards/${e.detail.id}`, {
      method: 'put', body: JSON.stringify(e.detail), headers: {
        'Content-Type': 'application/json'
      }
    });
    this.getColumns();
  };


  _render() {
    if (this._shadowRoot.querySelector('.container'))
      this._shadowRoot.querySelector('.container').innerHTML = '';

    for (let i = 0; i < this.columns.length; i++) {
      this._shadowRoot.querySelector('.container').innerHTML += ` <div class="card">
      <section class="lists-container"> <div class="list">
    <h3 class="list-title">${this.columns[i].title}</h3>
    <card-items id="${this.columns[i].id}"></card-items>
    </div></section><add-card-form id="${this.columns[i].id}"></add-card-form>
    </div>`;

    }

    this.$cards = this._shadowRoot.querySelectorAll('card-items');

    this.$cards.forEach((item) => {
      item.addEventListener('updateCards', this.updateCards.bind(this));
    });

    this.$columnForm = this._shadowRoot.querySelector('add-column-form');

    this.$columnForm.addEventListener('addColumn', this.postColumn.bind(this));


    this.$listItem = this._shadowRoot.querySelectorAll('add-card-form');
    this.$listItem.forEach((item) => {
      item.addEventListener('onSubmit', this.postCards.bind(this));
    });

  };
}

window.customElements.define('maltem-card', Card);
