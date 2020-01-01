
const cardtemplate = document.createElement('template');

cardtemplate.innerHTML = `
                            <style>                  
                              </style>
                            <form>
                            <ul class="field-list">
                            <li><input type="text" name="cardName" id="cardName" placeholder="Name"/></li>
                            <li><input type="text" name="cardDescription" id="cardDescription" placeholder="Description"/></li>
                            <li><button id="add-card" class="add-card-btn btn">Add a card</button></li>
                            </ul>
                            </form>
                            `;
class AddCardForm extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this._render();
    };

    async postCards(card) {
        const cards = await fetch('http://localhost:3000/cards', {
            method: 'post', body: JSON.stringify(card), headers: {
                'Content-Type': 'application/json'
            }
        });
        window.location.reload(false);
    };

    addCard(e) {
        e.preventDefault();
        const cardName = this._shadowRoot.querySelector('#cardName').value;
        const cardDescription = this._shadowRoot.querySelector('#cardDescription').value;
        if (cardName != '' && cardDescription != '') {
            this.dispatchEvent(new CustomEvent('onSubmit', {
                detail: {
                    title: cardName,
                    description: cardDescription,
                    columnId: parseInt(this.id)
                }
            }));
        }
    };

    _render() {
        this.id = this.getAttribute('id');
        this._shadowRoot.appendChild(cardtemplate.content.cloneNode(true));
        this.$addCardButton = this._shadowRoot.querySelector('#add-card');
        this.$addCardButton.addEventListener('click', this.addCard.bind(this));
    };
}

window.customElements.define('add-card-form', AddCardForm);
