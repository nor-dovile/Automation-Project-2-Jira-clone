Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});

describe('Test Case 1: Issue Deletion', () => {
    beforeEach(() => {
      createTestIssue('TEST-ISSUE-TITLE-4579845987544');
      cy.contains('Issue has been successfully created.').should('be.visible');
      cy.reload();
      cy.contains('Issue has been successfully created.').should('not.exist');

      cy.visit('/');
      cy.url().should('include', `${Cypress.env('baseUrl')}project`).then(() => {
        cy.visit(`${Cypress.env('baseUrl')}project/board`);
        cy.contains('TEST-ISSUE-TITLE-4579845987544').click();

        // assert that the detail view is visible
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');
      });
    });

    it('Should delete issue', () => {
      getIssueDetailsModal().within(() => {
        cy.get('[data-testid="icon:trash"]').click();
      })
      cy.get('[data-testid="modal:confirm"]').should('be.visible');
      cy.contains('Delete issue').click();
      cy.wait(5000);
      cy.reload();
      
      cy.contains('TEST-ISSUE-TITLE-4579845987544').should('not.exist');
    });

    it('Should cancel the deletion process', () => {
      getIssueDetailsModal().within(() => {
        cy.get('[data-testid="icon:trash"]').click();
        cy.wait(1000);
      });
      cy.get('[data-testid="modal:confirm"]').should('be.visible');
      cy.contains('Cancel').click();
      cy.get('[data-testid="modal:confirm"]').should('not.exist');
      cy.get('[data-testid="modal:issue-details"]').get('[data-testid="icon:close"]').first().click();
      cy.get('[data-testid="modal:issue-details"]').should('not.exist');
      cy.reload();
      cy.contains('TEST-ISSUE-TITLE-4579845987544').should('exist');

    });
});

function createTestIssue(title) {
  cy.visit('/');
  console.log(cy.url());
  cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
    cy.visit(url + '/board?modal-issue-create=true');
  });

  cy.get('[data-testid="modal:issue-create"]').within(() => {
    fillAndSubmitCreationModal('Story', 'TEST_DESCRIPTION', title, 'Lord Gaben', 'Lord Gaben', 'Highest');
  });
}
  
function fillAndSubmitCreationModal(type, description, title, reporter, asignee, priority) {
  // Open issue type dropdown and choose Task
  const defaultType = 'Task';
  if (type !== defaultType) {
    cy.get('[data-testid="select:type"]').click();
    cy.get(`[data-testid="select-option:${type}"]`).trigger('click');
  }

  // Fill up description
  cy.get('.ql-editor').type(description);

  //Fill up title
  cy.get('input[name="title"]').type(title);

  // Select reporter
  const defaultReporter = 'Lord Gaben';
  if (reporter !== defaultReporter) {
    cy.get('[data-testid="select:reporterId"]').click();
    cy.get(`[data-testid="select-option:${reporter}"]`).click();
  }
        
  // Select asignee
  cy.get('[data-testid="select:userIds"]').click();
  cy.get(`[data-testid="select-option:${asignee}"]`).click();

  // Select priority
  cy.get('[data-testid="select:priority"]').click();
  cy.get(`[data-testid="select-option:${priority}"]`).click();

  // Click on button "Create issue"
  cy.get('button[type="submit"]').click();
}

function getIssueDetailsModal() {
  return cy.get('[data-testid="modal:issue-details"]');
}

