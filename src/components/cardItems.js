
let start = 0;
let target = undefined;

const cardtemplate = document.createElement('template');

cardtemplate.innerHTML = `
<style>
/* Lists */
.list-items {
    align-content: start;
    padding: 0 0.6rem 0.5rem;
    overflow-y: auto;
}

.list-items::-webkit-scrollbar {
    width: 1.6rem;
}

.list-items::-webkit-scrollbar-thumb {
    background-color: #c4c9cc;
    border-right: 0.6rem solid #e2e4e6;
}
.list-items li {
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.3;
  background-color: #fff;
  padding: 0.65rem 0.6rem;
  color: #4d4d4d;
  border-bottom: 0.1rem solid #ccc;
  border-radius: 0.3rem;
  margin-bottom: 0.6rem;
  word-wrap: break-word;
  cursor: pointer;
}

.list-items li:last-of-type {
  margin-bottom: 0;
}

.list-items li:hover {
  background-color: #eee;
}

                              </style>                      
                              <ul class="list-items">
                            </ul>	
                            `;
class CardItems extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this.cards = [];
  }

  handleEvent(e) {
    this.$listItem.forEach((item) => {
      if (item.id == e.target.id) {
        item.textContent = this.cards.filter(item => item.id == e.target.id)[0].description;
      }
    });
  }

  connectedCallback() {
    this.getCards();
  };

  async getCards() {
    const cards = await fetch('http://localhost:3000/cards');
    this.cards = await cards.json();
    this._render();
  };

  dragstart(e) {
    start = e.target.attributes.column.value;
    target = e.target;
  }

  dragDrop(e) {
    //get Drop details.
    if (e.target.attributes.column.value !== start) {
      this.dispatchEvent(new CustomEvent('updateCards', {
        detail: {
          "id": target.id,
          "title": target.innerHTML,
          "description": target.attributes.desc.value,
          "columnId": parseInt(this.id)
        }
    }));
    }
  }

  _render() {
    cardtemplate.content.querySelector('.list-items').innerHTML = '';
    this.id = this.getAttribute('id');
    for (let i = 0; i < this.cards.length; i++) {
      if (this.cards[i].columnId === parseInt(this.id)) {
        cardtemplate.content.querySelector('.list-items').innerHTML += `
        <li id="${this.cards[i].id}" desc="${this.cards[i].description}" column="${this.cards[i].columnId}" draggable="true">${this.cards[i].title}</li>    
        `;
      }
    }
    this._shadowRoot.appendChild(cardtemplate.content.cloneNode(true));
    this.$listItem = this._shadowRoot.querySelectorAll('li');
    this.$listItem.forEach((item) => {
      item.addEventListener('click', this);
      item.addEventListener('dragstart', this.dragstart);
      item.addEventListener('drop', this.dragDrop.bind(this));
    });
    this.$span = this._shadowRoot.querySelector('span');
  };


}

window.customElements.define('card-items', CardItems);
