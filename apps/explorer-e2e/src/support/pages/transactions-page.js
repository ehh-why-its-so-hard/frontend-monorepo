import BasePage from './base-page';

export default class TransactionsPage extends BasePage {
  transactionsList = 'transactions-list';
  transactionRow = 'transaction-row';
  blockHeight = 'block-height';
  numberOfTransactions = 'num-txs';
  validatorLink = 'validator-link';
  blockTime = 'block-time';
  refreshBtn = 'refresh';
  txHash = 'hash';
  txSubmittedBy = 'submitted-by';
  txBlock = 'block';
  txEncodedTnx = 'encoded-tnx';
  txType = 'tx-type';

  validateTransactionsPagedisplayed() {
    cy.getByTestId(this.transactionsList).should('have.length.above', 1);
    cy.getByTestId(this.blockHeight).first().should('not.be.empty');
    cy.getByTestId(this.numberOfTransactions).first().should('not.be.empty');
    cy.getByTestId(this.validatorLink).first().should('not.be.empty');
    cy.getByTestId(this.blockTime).first().should('not.be.empty');
  }

  verifyAllBlockRowsAreNotEmpty() {
    cy.get(`[data-testid=${this.transactionRow}] > td`).each(($cell) => {
      cy.wrap($cell).should('not.be.empty');
    });
  }

  validateRefreshBtn() {
    cy.getByTestId(this.blockHeight)
      .first()
      .invoke('text')
      .then((blockHeightTxt) => {
        cy.wait(1000); // eslint-disable-line cypress/no-unnecessary-waiting
        //Wait needed to allow blocks to change
        cy.getByTestId(this.refreshBtn).click();

        cy.getByTestId(this.blockHeight)
          .first()
          .invoke('text')
          .should((newBlockHeightText) => {
            expect(blockHeightTxt).not.to.eq(newBlockHeightText);
          });
      });
    cy.getByTestId(this.blockTime).first();
  }

  validateTxDetailsAreDisplayed() {
    cy.getByTestId(this.txHash).invoke('text').should('have.length', 64);
    cy.getByTestId(this.txSubmittedBy)
      .find('a')
      .then(($address) => {
        cy.wrap($address).should('have.attr', 'href');
        cy.wrap($address).invoke('text').should('have.length', 66);
      });
    cy.getByTestId(this.txBlock).should('not.be.empty');
    cy.getByTestId(this.txEncodedTnx).should('not.be.empty');
    cy.getByTestId(this.txType)
      .should('not.be.empty')
      .invoke('text')
      .then((txTypeTxt) => {
        if (txTypeTxt == 'Order Submission') {
          cy.get('.hljs-attr')
            .should('have.length.at.least', 8)
            .each(($propertyName) => {
              cy.wrap($propertyName).should('not.be.empty');
            });
          cy.get('span[style*="color"]')
            .should('have.length.at.least', 8)
            .each(($propertyValue) => {
              cy.wrap($propertyValue).should('not.be.empty');
            });
        }
      });
  }

  clickOnTopTransaction() {
    cy.getByTestId(this.transactionRow).first().find('a').click();
  }
}
