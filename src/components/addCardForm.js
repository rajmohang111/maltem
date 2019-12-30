
const cardtemplate = document.createElement('template');

cardtemplate.innerHTML = `
                            <style>
                            
                            .add-card-btn {
                              display: block;
                              text-align: left;
                              cursor: pointer;
                             }

                             .field-list {
                              flex: 1;
                              display: flex;
                              flex-direction: column;
                              align-content: start;
                              padding: 0 0.6rem 0.5rem;
                              overflow-y: auto;
                            }

                            .field-list li {
                              font-size: 1.4rem;
                              font-weight: 400;
                              line-height: 1.3;
                              padding: 0 0 0.65rem 0;
                              color: #4d4d4d;
                              cursor: pointer;
                            }

                            input {
                              line-height: 2;
                              width: 24rem;
                            }

                            button {
                              background-color: #0079bf; /* Green */
                              border: none;
                              color: white;
                              text-align: center;
                              text-decoration: none;
                              display: inline-block;
                              font-size: 16px;
                              margin: 4px 2px;
                              cursor: pointer;
                            }
                      
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
            this.postCards({
                "title": cardName,
                "description": cardDescription,
                "columnId": parseInt(this.id)
            });
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
