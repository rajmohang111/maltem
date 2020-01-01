

const columnTemplate = document.createElement('template');

columnTemplate.innerHTML = `
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

    _render() {
        this._shadowRoot.appendChild(columnTemplate.content.cloneNode(true));
        this.$form = this._shadowRoot.querySelector('form');
        this.$form.addEventListener("submit", (e) => {
            e.preventDefault();
            const cardName = this._shadowRoot.querySelector('#cardName').value;
            if (cardName != '') {
                this.dispatchEvent(new CustomEvent('addColumn', {
                    detail: {
                        title: cardName,
                    }
                }));

                this._shadowRoot.querySelector('#cardName').value = '';
            }
        });
    };
}

window.customElements.define('add-column-form', AddColumnForm);
