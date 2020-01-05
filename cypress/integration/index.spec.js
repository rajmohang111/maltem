
describe('Maltem Trello End to End test', function () {
  let dom = null;
  let columnFormDom = null;
  beforeEach(() => {
    cy.visit('http://localhost:8080/');
    cy.get('maltem-card').should(e => {
      [dom] = e.get();
      columnFormDom = dom.$columnForm.shadowRoot;
    });
  })

  it('Test page blocks are loaded properly', function () {
    expect(dom.shadowRoot.querySelector('#column').className).to.equal('card');
    expect(dom.shadowRoot.querySelector('#search').className).to.equal('card');
    expect(dom.shadowRoot.querySelector('#container').className).to.equal('container');
  });

  it('Test column form loaded properly', function () {
    expect(columnFormDom.querySelector('input').id).to.equal('cardName');
    expect(columnFormDom.querySelector('input[type="submit"]').id).to.equal('add-card');
  });

})