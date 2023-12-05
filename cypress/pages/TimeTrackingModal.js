class TimeTrackingModal {
    constructor() {
        this.submitButton = 'button[type="submit"]';
        this.issueModal = '[data-testid="modal:issue-create"]';
        this.issueDetailModal = '[data-testid="modal:issue-details"]';
        this.title = 'input[name="title"]';
        this.issueType = '[data-testid="select:type"]';
        this.descriptionField = '.ql-editor';
        this.assignee = '[data-testid="select:userIds"]';
        this.backlogList = '[data-testid="board-list:backlog"]';
        this.issuesList = '[data-testid="list-issue"]';
        this.deleteButton = '[data-testid="icon:trash"]';
        this.deleteButtonName = "Delete issue";
        this.cancelDeletionButtonName = "Cancel";
        this.confirmationPopup = '[data-testid="modal:confirm"]';
        this.closeDetailModalButton = '[data-testid="icon:close"]';

        this.doneButton = 'Done';
        this.timeTrackinClockIcon = '[data-testid="icon:stopwatch"]';
        this.timeTrackingModal = '[data-testid="modal:tracking"]'
    }

    openTimeTrackingModal() {
      return cy.get(this.timeTrackinClockIcon)
        .parent()
        .should('be.visible')
        .click()
        .should('exist');
    }

    getTimeTrackingModal() {
      return cy.get(this.timeTrackingModal);
    }

    addOrEditTimeSpent(timeSpent) {
      return cy.contains('Time spent (hours)').next().within(() => {
        cy.get('input[placeholder="Number"]')
        .clear()
        .type(timeSpent);
      });
    }

    editTimeRemaining(timeRemaining) {
      return cy.contains('Time remaining (hours)').next().within(() => {
        cy.get('input[placeholder="Number"]')
        .clear()
        .type(timeRemaining);
      });
    }

    clearTimeSpent() {
      return cy.contains('Time spent (hours)').next().within(() => {
        cy.get('input[placeholder="Number"]')
          .clear();
      });
    }

    clearTimeRemaining() {
      return cy.contains('Time remaining (hours)').next().within(() => {
        cy.get('input[placeholder="Number"]')
          .clear()
        });
    }
    
    clickDoneButton() {
      return cy.contains('button', 'Done')
        .click()
        .should('not.exist');
    }

    ensureTimeTrackingIsLogged(hoursLogged) {
      return cy.contains('Time tracking')
        .next()
        .contains(`${hoursLogged}h logged`)
        .should('be.visible')
    }

    ensureTimeRemainingIsVisible(timeRemaining) {
      return cy.contains('Time tracking')
        .next()
        .contains(`${timeRemaining}h remaining`).should('be.visible')
    }

    ensureNoTimeIsLogged() {
      return cy.contains('Time tracking')
        .next()
        .contains('No time logged').should('be.visible')
    }

    ensureTimeRemainingOrEstimateDoesNotExist() {
      return cy.contains('Time tracking')
        .next()
        .children()
        .eq(1)
        .should('have.length', 1)
    }

    // ensureIssueIsNotVisibleOnBoard(issueTitle) {
    //     cy.get(this.issueDetailModal).should('not.exist');
    //     cy.reload();
    //     cy.contains(issueTitle).should('not.exist');
    // }

    // validateIssueVisibilityState(issueTitle, isVisible = true) {
    //     cy.get(this.issueDetailModal).should('not.exist');
    //     cy.reload();
    //     cy.get(this.backlogList).should('be.visible');
    //     if (isVisible)
    //         cy.contains(issueTitle).should('be.visible');
    //     if (!isVisible)
    //         cy.contains(issueTitle).should('not.exist');
    // }

    clickDoneButton() {
      cy.contains('button', this.doneButton).click().should('not.exist');
    }

    // confirmDeletion() {
    //     cy.get(this.confirmationPopup).within(() => {
    //         cy.contains(this.deleteButtonName).click();
    //     });
    //     cy.get(this.confirmationPopup).should('not.exist');
    //     cy.get(this.backlogList).should('be.visible');
    // }

    // cancelDeletion() {
    //     cy.get(this.confirmationPopup).within(() => {
    //         cy.contains(this.cancelDeletionButtonName).click();
    //     });
    //     cy.get(this.confirmationPopup).should('not.exist');
    //     cy.get(this.issueDetailModal).should('be.visible');
    // }

    // closeDetailModal() {
    //     cy.get(this.issueDetailModal).get(this.closeDetailModalButton).first().click();
    //     cy.get(this.issueDetailModal).should('not.exist');
    // }
}

export default new TimeTrackingModal();