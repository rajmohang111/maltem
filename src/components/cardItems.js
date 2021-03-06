
let start = 0;
let target = null;

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

.delete {
  float: right;
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

  static get observedAttributes() {
    return ['id', 'filterText'];
  }


  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.id = this.getAttribute('id');
      this.getCards(this.id);
    }
  }

  handleEvent(e) {
    this.$listItem.forEach((item) => {
      if (item.id == e.target.id) {
        item.querySelector('span').textContent = this.cards.filter(item => item.id == e.target.id)[0].description;
      }
    });
  }

  async getCards(id) {
    const cards = await fetch(`http://localhost:3000/cards?columnId=${id}`);
    this.cards = await cards.json();
    this._render();
  }


  dragstart(e) {
    start = e.target.attributes.column.value;
    target = e.target;
  }


  dragover(e) {
    e.preventDefault();
  }

  dragDrop(e) {
    if (e.target.attributes.column.value !== start) {
      this.dispatchEvent(new CustomEvent('updateCards', {
        detail: {
          "id": target.id,
          "title": target.children[0].innerHTML,
          "description": target.attributes.desc.value,
          "columnId": parseInt(this.id)
        }
      }));
    }
  }

  delete(e) {
    this.dispatchEvent(new CustomEvent('deleteCard', {
      detail: {
        "id": parseInt(e.target.id)
      }
    }));
  }

  _render() {
    this.filterText = this.getAttribute('filterText');
    this._shadowRoot.appendChild(cardtemplate.content.cloneNode(true));

    if (this._shadowRoot.querySelector('.list-items').innerHTML) {
      this._shadowRoot.querySelector('.list-items').innerHTML = '';
    }

    for (let i = 0; i < this.cards.length; i++) {
      if (this.filterText != 'undefined' && this.filterText.trim() != '') {
        if (this.cards[i].description.search(this.filterText) > 0) {
          this._shadowRoot.querySelector('.list-items').innerHTML += `
          <li id="${this.cards[i].id}" desc="${this.cards[i].description}" column="${this.cards[i].columnId}" draggable="true">
          <span id="card-content">${this.cards[i].title}</span>
          <img  id="${this.cards[i].id}" class="delete" src="https://img.icons8.com/material-sharp/24/000000/delete-sign.png" />
          </li> 
          `;
        }
      } else {
        this._shadowRoot.querySelector('.list-items').innerHTML += `
        <li id="${this.cards[i].id}" desc="${this.cards[i].description}" column="${this.cards[i].columnId}" draggable="true">
        <span id="card-content">${this.cards[i].title}</span>
        <img  id="${this.cards[i].id}" class="delete" src="https://img.icons8.com/material-sharp/24/000000/delete-sign.png" />
        </li> 
        `;
      }
    }
    this.$listItem = this._shadowRoot.querySelectorAll('li');
    this.$listItem.forEach((item) => {
      item.addEventListener('click', this);
      item.addEventListener('dragstart', this.dragstart);
      item.addEventListener('dragend', this.dragover);
      item.addEventListener('dragover', this.dragover);
      item.addEventListener('drop', this.dragDrop.bind(this));
      item.children[1].addEventListener('click', this.delete.bind(this))
    });
  }


}

window.customElements.define('card-items', CardItems);
