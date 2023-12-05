// Pay attention that you need to import both additional pages, so the code would be successfully working
import TimeTrackingModal from "../pages/TimeTrackingModal";
import IssueModal from "../pages/IssueModal";

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from failing the test
    return false;
});


describe('Time Estimation Functionality', () => {
  const ISSUE_MODAL_TITLE = 'Try leaving a comment on this issue.'

  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
      cy.visit(url + '/board');
      console.log(ISSUE_MODAL_TITLE)
      IssueModal.openIssueDetailByTitle(ISSUE_MODAL_TITLE);
    });
  });

  it('Should add time estimation successfully', () => {
    IssueModal.editOrAddTimeEstimation(5);
    IssueModal.ensureTimeEstimationIsVisibleOnTimeTracking(5);
  })

  it('Should edit time estimation successfully', () => {
    IssueModal.editOrAddTimeEstimation(6);
    IssueModal.ensureTimeEstimationIsVisibleOnTimeTracking(6);
  })

  it('Should remove time estimation successfully', () => {
    IssueModal.clearTimeEstimation();
    IssueModal.ensureTimeEstimationIsNotExistOnTimeTracking(5);
  })
});

describe('Time Logging Functionality', () => {
  const ISSUE_MODAL_TITLE = 'Try leaving a comment on this issue.'
  
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
      cy.visit(url + '/board');
      console.log(ISSUE_MODAL_TITLE)
      IssueModal.openIssueDetailByTitle(ISSUE_MODAL_TITLE);
    });
  });

  it('Should add time logging successfully', () => {
    IssueModal.getIssueDetailModal().within(() => {
      TimeTrackingModal.openTimeTrackingModal();
    });

    TimeTrackingModal.getTimeTrackingModal().within(() => {
      TimeTrackingModal.addOrEditTimeSpent(3);
      TimeTrackingModal.editTimeRemaining(4);
      TimeTrackingModal.ensureTimeTrackingIsLogged(3);
      TimeTrackingModal.clickDoneButton();
    });

    IssueModal.ensureTimeLoggedIsVisible(3);
    IssueModal.ensureTimeRemainingIsVisible(4);
  });

  it('Should edit time logging successfully', () => {
    IssueModal.getIssueDetailModal().within(() => {
      TimeTrackingModal.openTimeTrackingModal();
    });

    TimeTrackingModal.getTimeTrackingModal().within(() => {
      TimeTrackingModal.addOrEditTimeSpent(5);
      TimeTrackingModal.editTimeRemaining(6);
      TimeTrackingModal.ensureTimeTrackingIsLogged(5);
      TimeTrackingModal.ensureTimeRemainingIsVisible(6);
      TimeTrackingModal.clickDoneButton();
    });

    IssueModal.ensureTimeLoggedIsVisible(5);
    IssueModal.ensureTimeRemainingIsVisible(6);
  });

  it('Should remove time logging successfully', () => {
    IssueModal.getIssueDetailModal().within(() => {
      IssueModal.clearTimeEstimation();      
      TimeTrackingModal.openTimeTrackingModal();
    });

    TimeTrackingModal.getTimeTrackingModal().within(() => {
        TimeTrackingModal.clearTimeSpent();
        TimeTrackingModal.clearTimeRemaining();
        TimeTrackingModal.ensureNoTimeIsLogged();

        // no additional messages like "3h remaining" or "4h estimated"
        TimeTrackingModal.ensureTimeRemainingOrEstimateDoesNotExist();
        TimeTrackingModal.clickDoneButton();
      });

    IssueModal.ensureNoTimeIsLogged();
    IssueModal.ensureTimeRemainingOrEstimateDoesNotExist();
  });
});
