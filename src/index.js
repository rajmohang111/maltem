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

    console.log(' template.content',  template.content.querySelector('.lists-container').innerHTML);

     this.columns =  [
      {
        "id": 1,
        "title": "Column 1"
      },
      {
        "id": 2,
        "title": "Column 2"
      }
    ];

    for(let i=0;i<this.columns.length;i++) {
      template.content.querySelector('.lists-container').innerHTML += ` <div class="list">
    
      <h3 class="list-title">${this.columns[i].title}</h3>
    
      <card-items id="${this.columns[i].id}"></card-items>
    
      </div>`;
    }

    this._shadowRoot.appendChild(template.content.cloneNode(true));

    this.$input = this._shadowRoot.querySelector('input');
    this.$input.addEventListener('input', this._handleChange.bind(this));

   // this.$allSaySomething = this._shadowRoot.querySelectorAll('say-something');
  }

  _handleChange() {
    // this.$allSaySomething.forEach(element => {
    //   element.setAttribute('text', this.$input.value)
    // });
  }
}

window.customElements.define('maltem-card', Card);
