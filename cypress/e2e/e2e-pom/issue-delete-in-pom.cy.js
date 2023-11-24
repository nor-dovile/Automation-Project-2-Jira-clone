/**
 * This is an example file and approach for POM in Cypress
 */
import IssueModal from "../../pages/IssueModal";

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});

describe('Issue delete with approach in POM', () => {
  // issue title, that we are testing with, saved into variable
  const issueDetails = {
    title: "TEST_TITLE",
    type: "Bug",
    description: "TEST_DESCRIPTION",
    assignee: "Lord Gaben",
  };

  beforeEach(() => {
    cy.visit('/');

    // create issue for test
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`)
    .then((url) => {
      cy.visit(url + '/board?modal-issue-create=true');
      const EXPECTED_AMOUNT_OF_ISSUES = '5';
      IssueModal.createIssue(issueDetails);
      IssueModal.ensureIssueIsCreated(EXPECTED_AMOUNT_OF_ISSUES, issueDetails);
    })
    .then(() => {
      cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {});
    });
  });

  it('Should cancel deletion process successfully', () => {
    IssueModal.openIssueDetailByTitle(issueDetails.title);
    IssueModal.clickDeleteButton();
    IssueModal.cancelDeletion();
    cy.wait(2000);
    IssueModal.closeDetailModal();
    IssueModal.ensureIssueIsVisibleOnBoard(issueDetails.title);
  });

  it('Should delete issue successfully', () => {
    IssueModal.openIssueDetailByTitle(issueDetails.title);
    IssueModal.clickDeleteButton();
    IssueModal.confirmDeletion();
    IssueModal.ensureIssueIsNotVisibleOnBoard(issueDetails.title);
  });
});