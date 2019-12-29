const template = document.createElement('template');

template.innerHTML = `
<style>
.list-items {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-content: start;
  padding: 0 0.6rem 0.5rem;
  overflow-y: auto;
  height : 200px;
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
</ul>`;

class CardItems extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });

    this.cards = [
      {
        "id": 1,
        "title": "Card 1",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "columnId": 1
    },
    {
        "id": 2,
        "title": "Card 2",
        "description": "Quisque et pellentesque sem.",
        "columnId": 1
    },
    {
        "id": 3,
        "title": "Card 3",
        "description": "Nulla porttitor erat a sollicitudin volutpat.",
        "columnId": 1
    },
    {
        "id": 4,
        "title": "Card 4",
        "description": "Quisque id scelerisque felis, sit amet scelerisque nunc.",
        "columnId": 2
    },
    {
        "id": 5,
        "title": "Card 5",
        "description": "Suspendisse posuere ipsum at dui lacinia, ut faucibus lectus mollis.",
        "columnId": 2
    }
    ];


     this.id = this.getAttribute('id');

    for(let i=0;i<this.cards.length;i++) {

      if(this.cards[i].columnId === parseInt(this.id)) {
        template.content.querySelector('.list-items').innerHTML += `
        <li id="${this.cards[i].id}">${this.cards[i].title}</li>    
        `;
      }
    }


    this._shadowRoot.appendChild(template.content.cloneNode(true));

    this.$listItem = this._shadowRoot.querySelectorAll('li');

    this.$listItem.forEach((item) => {
      item.addEventListener('click',this);
    });


    this.$span = this._shadowRoot.querySelector('span');
  }

  handleEvent(e) {
    this.$listItem.forEach((item) => {
      if(item.id == e.target.id) {
        item.textContent = this.cards.filter(item => item.id ==  e.target.id)[0].description;
      }
    });

  }

  connectedCallback() {
    if (!this.hasAttribute('color')) {
      this.setAttribute('color', 'orange');
    }

    if (!this.hasAttribute('text')) {
      this.setAttribute('text', '');
    }



    this._render();
  }

  static get observedAttributes() {
    return ['color', 'text'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    switch (name) {
      case 'color':
        this._color = newVal;
        break;
      case 'text':
        this._text = newVal;
        break;
    };

    this._render();
  }

  _render() {
   // this.$headline.style.color = this._color;
  //  this.$span.innerHTML = this._text;
  }
}

window.customElements.define('card-items', CardItems);
