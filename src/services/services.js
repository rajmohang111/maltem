
export default class Services {

    async getColumns() {
        try {
          const columns = await fetch('http://localhost:3000/columns');
          this.columns = await columns.json();
          return this.columns;
        } catch (e) {
          console.log(e);
        }
      }

      async getCards(text) {
        try {
          const columns = await fetch(`http://localhost:3000/cards?description=${text}`);
          this.columns = await columns.json();
          return this.columns;
        } catch (e) {
          console.log(e);
        }
      }
    
      async postCards(e) {
        await fetch('http://localhost:3000/cards', {
          method: 'post', body: JSON.stringify(e.detail), headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      
      async getColumnsByName(columnName) {
        try {
          const columns = await fetch(`http://localhost:3000/columns?title=${columnName}`);
          this.columns = await columns.json();
          return this.columns;
        } catch (e) {
          console.log(e);
        }
      }

      async getCardsByName(cardName, columnId) {
        try {
          const cards = await fetch(`http://localhost:3000/cards?title=${cardName}&columnId=${columnId}`);
          this.cards = await cards.json();
          return this.cards;
        } catch (e) {
          console.log(e);
        }
      }


      async postColumn(e) {
        await fetch('http://localhost:3000/columns', {
          method: 'post', body: JSON.stringify(e.detail), headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    
      async updateCards(e) {
        await fetch(`http://localhost:3000/cards/${e.detail.id}`, {
          method: 'put', body: JSON.stringify(e.detail), headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    
      async deleteCard(e) {
        await fetch(`http://localhost:3000/cards/${e.detail.id}`, {
          method: 'delete', headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    
    
      async deleteColumn(e) {
        await fetch(`http://localhost:3000/columns/${e.target.id}`, {
          method: 'delete', headers: {
            'Content-Type': 'application/json'
          }
        });
      }
}