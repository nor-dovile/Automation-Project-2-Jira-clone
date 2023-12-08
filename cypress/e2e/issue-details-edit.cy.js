describe('Issue details editing', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      cy.contains('This is an issue of type: Task.').click();
    });
  });

  it('Task 1. Should check dropdown "Priority" functionality', () => {
    const expectedLength = 5;
    let actualOptions = [];
    getIssueDetailsModal().within(() => {
      // 1. get and push the current element
      selectPriority().invoke('text')
        .then(text => {
          actualOptions.push(text);
          cy.log(`text: ${text}, length: ${actualOptions.length}`);
        })
        .then(() => {
          // 2. get and iterate all list and add options to array
          clickSelectPriority();
          getPrioritySelection().each(($child) => {
            const text = $child.children().eq(0).children().eq(1).text().trim();
            actualOptions.push(text)
            cy.log(`text: ${text}, length: ${actualOptions.length}`);
          });
        })
        .then(() => {
          cy.wrap(actualOptions).should('have.length', expectedLength);
          cy.log('done');
        });
    })
  })

  it('Task 2. Should check that reporters name has only characters in it', () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:reporter"]').invoke('text')
        .then(text => {
          const regex = /^[A-Za-z\s]+$/
          expect(regex.test(text)).to.be.true
        })
    })
  })

  it.skip('Should update type, status, assignees, reporter, priority successfully', () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click('bottomRight');
      cy.get('[data-testid="select-option:Story"]')
          .trigger('mouseover')
          .trigger('click');
      cy.get('[data-testid="select:type"]').should('contain', 'Story');

      cy.get('[data-testid="select:status"]').click('bottomRight');
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should('have.text', 'Done');

      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should('contain', 'Baby Yoda');
      cy.get('[data-testid="select:assignees"]').should('contain', 'Lord Gaben');

      cy.get('[data-testid="select:reporter"]').click('bottomRight');
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should('have.text', 'Pickle Rick');

      cy.get('[data-testid="select:priority"]').click('bottomRight');
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should('have.text', 'Medium');
    });
  });

  it.skip('Should update title, description successfully', () => {
    const title = 'TEST_TITLE';
    const description = 'TEST_DESCRIPTION';

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get('.ql-snow')
        .click()
        .should('not.exist');

      cy.get('.ql-editor').clear().type(description);

      cy.contains('button', 'Save')
        .click()
        .should('not.exist');

      cy.get('textarea[placeholder="Short summary"]').should('have.text', title);
      cy.get('.ql-snow').should('have.text', description);
    });
  });

});

function getIssueDetailsModal() {
  return cy.get('[data-testid="modal:issue-details"]')
}

function createTestIssue(text1) {
  cy.visit('/');
  console.log(cy.url())
  cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
    cy.visit(url + '/board?modal-issue-create=true');
  });

  cy.get('[data-testid="modal:issue-create"]').within(() => {
    fillAndSubmitCreationModal(text1);
  });
}

function fillAndSubmitCreationModal(text1,) {
  // Open issue type dropdown and choose Task
  //Fill up title
  cy.get('input[name="title"]').type(text1);

  // Click on button "Create issue"
  cy.get('button[type="submit"]').click();
}

function selectPriority() {
  return cy.get('[data-testid="select:priority"]')
    .children()
    .eq(0)
    .children()
    .eq(1);
}

function clickSelectPriority() {
  return cy.get('[data-testid="icon:arrow-up"]').click();
}

function getPrioritySelection() {
  return cy.get('[data-testid="select:priority"]')
    .next()
    .children()
    .eq(1)
    .children();
}