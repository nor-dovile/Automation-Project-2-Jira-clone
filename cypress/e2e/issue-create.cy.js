import { fakerDE as faker } from '@faker-js/faker';

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});

describe('Issue create', () => {
  beforeEach(() => {
    navigateToIssueCreationModal();
  });

  it('Should create an issue and validate it successfully', () => {
    //System finds modal for creating issue
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      fillAndSubmitCreationModal('Story', 'TEST_DESCRIPTION', 'TEST_TITLE', 'Lord Gaben', 'Lord Gaben', 'Highest')
    });

    // Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');
    
    // Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    // Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {

      // Assert that this list contains 5 issues and first element with tag p has specified text
      cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains('TEST_TITLE');

      // Assert that correct avatar and type icon are visible
      cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
      cy.get('[data-testid="icon:story"]').should('be.visible');
    });
  });

  it('Should validate title is required field if missing', () => {
    // System finds modal for creating issue
    cy.get('[data-testid="modal:issue-create"]').within(() => {

      // Try to click create issue button without filling any data
      cy.get('button[type="submit"]').click();

      // Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should('contain', 'This field is required');
    });
  });
});

describe('Test Case 1: Custom Issue Creation', () => {
  beforeEach(() => {
    navigateToIssueCreationModal();
  });

  it('Should create an issue and validate it successfully', () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      fillAndSubmitCreationModal('Bug', 'My bug description', 'Bug', 'Pickle Rick', 'Pickle Rick', 'Highest')
    });

    // Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');
    
    // Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    // Assert than only one list with name Backlog is visible
    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {

      // Assert that this list contains 5 issues and first element with tag p has specified text
      cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains('Bug');
      
      // Assert that correct avatar and type icon are visible
      cy.get('[data-testid="avatar:Pickle Rick"]').should('be.visible');
      cy.get('[data-testid="icon:bug"]').should('be.visible');
    });
  });

  it('Should validate title is required field if missing', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      //Try to click create issue button without filling any data
      cy.get('button[type="submit"]').click();

      //Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should('contain', 'This field is required');
    });
  });
});

// Describe the test case or test suite
describe('Test Case 2: Random Data Plugin Issue Creation', () => {
  beforeEach(() => {
    navigateToIssueCreationModal();
  });

  it('Should create an issue and validate it successfully', () => {

    // Generate a random one-word title
    const randomTitle = faker.lorem.word();
    const randomDescription = faker.lorem.paragraphs(2);

    cy.get('[data-testid="modal:issue-create"]').within(() => {
      fillAndSubmitCreationModal('Task', randomDescription, randomTitle, 'Baby Yoda', 'Baby Yoda', 'Low')
    });

    //Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');
    
    //Reload the page to be able to see recently created issue
    //Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    //Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      //Assert that this list contains 5 issues and first element with tag p has specified text
      cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains(randomTitle);
      //Assert that correct avatar and type icon are visible
      cy.get('[data-testid="avatar:Baby Yoda"]').should('be.visible');
      cy.get('[data-testid="icon:task"]').should('be.visible');
    });
  });

  it.skip('Should validate title is required field if missing', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      //Try to click create issue button without filling any data
      cy.get('button[type="submit"]').click();

      //Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should('contain', 'This field is required');
    });
  });
});

describe('Task 3', () => {
  
  it('Should verifiy that the application is removing unnecessary spaces', () => {
    const title = '   Hello world!   '; // Title with leading and trailing spaces
    const randomDescription = faker.lorem.paragraphs(2)
    navigateToIssueCreationModal();
    fillAndSubmitCreationModal('Task', randomDescription, title, 'Baby Yoda', 'Baby Yoda', 'Low');

    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');
    cy.wait(3000);

    cy.get('[data-testid="board-list:backlog"]').should('be.visible').within(() => {
      cy.get('[data-testid="list-issue"]')
        .first()
        .find('p')
        .invoke('text')
        .then(text => {
          const trimmedText = text.trim();
          expect(trimmedText).to.equal(title.trim()); 
        });
      });
    });
});

function navigateToIssueCreationModal() {
  cy.visit('/');
  console.log(cy.url())
  cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
    cy.visit(url + '/board?modal-issue-create=true');
  });
}

function fillAndSubmitCreationModal(type, description, title, reporter, asignee, priority) {
  // Open issue type dropdown and choose Task
  const defaultType = 'Task'
  if (type !== defaultType) {
    cy.get('[data-testid="select:type"]').click();
    cy.get(`[data-testid="select-option:${type}"]`).trigger('click');
  }

  // Fill up description
  cy.get('.ql-editor').type(description);

  //Fill up title
  cy.get('input[name="title"]').type(title);

  // Select reporter
  const defaultReporter = 'Lord Gaben'
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

