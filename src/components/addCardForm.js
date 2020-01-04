
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

textarea{
	font-style: italic;
	padding: 0px 0px 0px 0px;
    background: transparent;
    margin-top:10px;
	outline: none;
	border: none;
	border-bottom: 1px dashed #83A4C5;
	width: 275px;
	overflow: hidden;
	resize:none;
	height:20px;
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
<label for="field4">
<textarea name="cardDescription" id="cardDescription" placeholder="Description" required="true"></textarea>
</label>
<label>
<input type="submit" id="add-card" class="add-card-btn btn" value="Add a card" />
</label>
</form>`;

class AddCardForm extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this._render();
    }

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
    }

    _render() {
        this._shadowRoot.appendChild(cardtemplate.content.cloneNode(true));
        this.$form = this._shadowRoot.querySelector('form');
        this.$form.addEventListener("submit", this.addCard.bind(this));
    }
}

window.customElements.define('add-card-form', AddCardForm);
