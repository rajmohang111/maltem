import './components/cardItems.js';

const template = document.createElement('template');

template.innerHTML = `
<style>
/* Lists */

.lists-container::-webkit-scrollbar {
    height: 2.4rem;
}

.lists-container::-webkit-scrollbar-thumb {
    background-color: #66a3c7;
    border: 0.8rem solid #0079bf;
    border-top-width: 0;
}

.lists-container {
    display: flex;
    align-items: start;
    padding: 0 0.8rem 0.8rem;
    overflow-x: auto;
    /* height: calc(100vh - 8.6rem); */
}

.list {
    flex: 0 0 27rem;
    display: flex;
    flex-direction: column;
    background-color: #e2e4e6;
    max-height: calc(100vh - 11.8rem);
    border-radius: 0.3rem;
    margin-right: 1rem;
}


.list:last-of-type {
  margin-right: 0;
}

.list-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #333;
  padding: 1rem;
}
</style>
<section class="lists-container">
  </section>
`;

class Card extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this.columns = [];
  }

  connectedCallback() {
    this.getColumns();
  }

  async getColumns() {
    const columns = await fetch('http://localhost:3000/columns');
    this.columns = await columns.json();
    this._render();
  };

  _render() {
    for (let i = 0; i < this.columns.length; i++) {
      template.content.querySelector('.lists-container').innerHTML += ` <div class="list">
    <h3 class="list-title">${this.columns[i].title}</h3>
    <card-items id="${this.columns[i].id}"></card-items>
    </div>`;
    }
    this._shadowRoot.appendChild(template.content.cloneNode(true));
  };
}

window.customElements.define('maltem-card', Card);
