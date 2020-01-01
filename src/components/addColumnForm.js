

const cardtemplate = document.createElement('template');

cardtemplate.innerHTML = `
<style type="text/css">
.form-style-4{
	padding: 10px;
}

input[type=text]
{
	background: transparent;
	border: none;
	border-bottom: 1px dashed #83A4C5;
	width: 275px;
	outline: none;
	padding: 0px 0px 0px 0px;
    font-style: italic;
    margin-top:10px;
}

input[type=submit] {
	background: #576E86;
    border: none;
    margin-top:10px;
	padding: 8px 10px 8px 10px;
	border-radius: 5px;
	color: #A8BACE;
}

</style>
<form class="form-style-4" action="" method="post">
<label for="field1">
<input type="text" name="cardName" id="cardName" placeholder="Name"  required="true"/>
</label>
<input type="submit" id="add-card" class="add-card-btn btn" value="Add a Column" />
</label>
</form>`;

class AddColumnForm extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this._render();
    };

    addCard(e) {
        e.preventDefault();
        const cardName = this._shadowRoot.querySelector('#cardName').value;
        if (cardName != '') {
            this.dispatchEvent(new CustomEvent('addColumn', {
                detail: {
                    title: cardName,
                }
            }));
        }
    };

    _render() {
        this._shadowRoot.appendChild(cardtemplate.content.cloneNode(true));
        this.$addCardButton = this._shadowRoot.querySelector('#add-card');
        this.$addCardButton.addEventListener('click', this.addCard.bind(this));
    };
}

window.customElements.define('add-column-form', AddColumnForm);
