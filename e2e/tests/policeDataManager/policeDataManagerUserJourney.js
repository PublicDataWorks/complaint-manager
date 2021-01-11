const TEST_USER = process.env.TEST_USER;
const TEST_PASS = process.env.TEST_PASS;

if (!TEST_PASS) {
  console.log("Set the password in the ENV VAR 'TEST_PASS' for login");
  process.exit(1);
}

if (!TEST_USER) {
  console.log("Set the username in the ENV VAR 'TEST_USER' for login");
  process.exit(1);
}

if (TEST_PASS && TEST_USER) {
  module.exports = {
    before: browser => {
      console.log("Browser Launch URL", browser.launch_url);
      browser.url(browser.launch_url).resizeWindow(1366, 768);
      browser.url(function (result) {
        console.log("Current URL", result);
      });

      if (!browser.globals.disableAuthentication) {
        const loginPage = browser.page.Login();
        loginPage.isOnPage().loginAs(TEST_USER, TEST_PASS);
      } else {
        console.log("Authentication is disabled. Skipping login page check.");
      }

      const caseDashboardPage = browser.page.CaseDashboard();
      caseDashboardPage.isOnPage();
    },

    "should create case": browser => {
      const caseDashboardPage = browser.page.CaseDashboard();
      const snackbar = browser.page.SnackbarPOM();

      caseDashboardPage
        .isOnPage()
        .createNewCase()
        .setFirstName("Night")
        .setLastName("Watch")
        .setPhoneNumber("1234567890", browser)
        .setIntakeSourceId(2)
        .submitCase();

      snackbar.presentWithMessage("successfully created").close();
    },

    "should add and display case tag": browser => {
      const tagName = "Tofu";
      const caseDetailsPage = browser.page.CaseDetails();
      const snackbar = browser.page.SnackbarPOM();
      const caseTagDialog = browser.page.CaseTagDialog();

      caseDetailsPage.isOnPage().clickAddTagButton();

      caseTagDialog.dialogIsOpen().setTagValue(tagName).clickSubmitNewTag();

      snackbar.presentWithMessage("Case tag was successfully added").close();
      caseDetailsPage.caseTagIsPresent(tagName);
    },

    "should remove a case tag": browser => {
      const tagName = "Tofu";
      const caseDetailsPage = browser.page.CaseDetails();
      const snackbar = browser.page.SnackbarPOM();
      const removeCaseTagDialog = browser.page.RemoveCaseTagDialog();

      caseDetailsPage.isOnPage().clickRemoveTagButton(tagName);

      removeCaseTagDialog.dialogIsOpen().clickRemoveTagButton();

      snackbar.presentWithMessage("Case tag was successfully removed").close();
      caseDetailsPage.noCaseTagsArePresent();
    },

    "should add and remove an attachment": browser => {
      const caseDetailsPage = browser.page.CaseDetails();
      const snackbar = browser.page.SnackbarPOM();
      const fileName = "dog_nose.jpg";

      caseDetailsPage
        .isOnPage()
        .attachFileWithName(fileName)
        .setDescription("a description")
        .uploadFile();

      snackbar.presentWithMessage("File was successfully attached").close();

      caseDetailsPage.removeFile().confirmRemoveAttachmentInDialog();

      snackbar.presentWithMessage("File was successfully removed").close();

      caseDetailsPage.thereAreNoAttachments();
    },

    "should open edit civilian form and set gender, race/ethnicity, and title": browser => {
      const caseDetailsPage = browser.page.CaseDetails();
      const civilianDialog = browser.page.CivilianDialog();

      caseDetailsPage.editComplainant();

      civilianDialog
        .dialogIsOpen()
        .setGenderIdentity(4)
        .setRaceEthnicity(2)
        .setTitle(2);
    },

    "should check civilian as anonymous in referral letter": browser => {
      const civilianDialog = browser.page.CivilianDialog();

      civilianDialog.toggleIsAnonymous();
    },

    "should display address suggestions when text is entered": browser => {
      const civilianDialog = browser.page.CivilianDialog();

      civilianDialog.typeInAddress("6500").thereAreSuggestions();
    },

    "should not complete suggestion and not select address when navigating through them": browser => {
      const civilianDialog = browser.page.CivilianDialog();

      civilianDialog
        .arrowDown()
        .addressSuggestionFieldNotPopulated()
        .addressFieldsAreEmpty();
    },

    "should select suggestion on enter/click": browser => {
      const civilianDialog = browser.page.CivilianDialog();

      civilianDialog.selectSuggestion().addressFieldsAreNotEmpty();
    },

    "should submit address": browser => {
      const civilianDialog = browser.page.CivilianDialog();
      const snackbar = browser.page.SnackbarPOM();

      civilianDialog.submitCivilianDialog();

      snackbar.presentWithMessage("Civilian was successfully updated").close();
    },

    "should display the address in the Complainant & Witnesses section of the Case Detail": browser => {
      const caseDetailsPage = browser.page.CaseDetails();

      caseDetailsPage.expandCivilianDetails().civilianAddressIsSpecified();
    },

    "should submit blank address when cleared and submitted": browser => {
      const caseDetailsPage = browser.page.CaseDetails();
      const civilianDialog = browser.page.CivilianDialog();
      const snackbar = browser.page.SnackbarPOM();

      caseDetailsPage.editComplainant();

      civilianDialog
        .dialogIsOpen()
        .setAddressSuggestionFieldToEmpty()
        .addressFieldsAreEmpty()
        .submitCivilianDialog();

      snackbar.presentWithMessage("Civilian was successfully updated").close();
    },

    "should show case reference with prefix AC in header of Case Details page": browser => {
      const caseDetailsPage = browser.page.CaseDetails();

      caseDetailsPage.caseReferenceIsAC();
    },

    "should show case reference with prefix AC in list of cases on Case Dashboard": browser => {
      const caseDetailsPage = browser.page.CaseDetails();
      const caseDashboard = browser.page.CaseDashboard();

      caseDetailsPage.returnToCaseDashboard();

      caseDashboard.isOnPage().hasCaseWithAC();
    },

    "should return to AC case details and un-anonymize the primary complainant": browser => {
      const caseDashboard = browser.page.CaseDashboard();
      const caseDetailsPage = browser.page.CaseDetails();
      const civilianDialog = browser.page.CivilianDialog();
      const snackbar = browser.page.SnackbarPOM();

      caseDashboard.isOnPage().goToACCase();

      caseDetailsPage.isOnPage().caseReferenceIsAC().editComplainant();

      civilianDialog.dialogIsOpen().toggleIsAnonymous().submitCivilianDialog();

      snackbar.presentWithMessage("Civilian was successfully updated").close();
    },

    "should not show address in Complainant & Witnesses section of Case Detail": browser => {
      const caseDetailsPage = browser.page.CaseDetails();

      caseDetailsPage.expandCivilianDetails().civilianAddressIsNotSpecified();
    },

    "should open incident details and add": browser => {
      const caseDetailsPage = browser.page.CaseDetails();

      caseDetailsPage
        .isOnPage()
        .setNarrativeSummary()
        .setNarrativeDetails()
        .saveNarrative()
        .openIncidentDetails();
    },

    "should enter and fill incident details into incident dialog": browser => {
      const incidentDetailsDialog = browser.page.IncidentDetailsDialog();
      const snackbar = browser.page.SnackbarPOM();

      incidentDetailsDialog
        .dialogIsOpen()
        .typeInAddress("canal st & bourbon st")
        .saveIncidentDetails()
        .fillAddress()
        .setIncidentDate()
        .setIncidentTime()
        .setDistrict(2)
        .saveIncidentDetails();

      snackbar
        .presentWithMessage("Incident details were successfully updated")
        .close();
    },

    "should click add witness civilian within nopd": browser => {
      const caseDetailsPage = browser.page.CaseDetails();

      caseDetailsPage
        .incidentAddressIsSpecified()
        .addWitnessCivilianWithinNopd();
    },

    "should see add employee page and add civilian within nopd": browser => {
      const addCivilianWithinNopdSearchPage = browser.page.AddCivilianWithinNopdSearch();

      addCivilianWithinNopdSearchPage
        .isOnPage()
        .setLastName("Jaskolski")
        .searchForCivilianWithinNopd()
        .selectNewCivilianWithinNopd();
    },

    "should return to edit civilian within nopd details and save civilian nopd": browser => {
      const addCivilianWithinNopdDetailsPage = browser.page.AddCivilianWithinNopdDetails();
      const snackBar = browser.page.SnackbarPOM();

      addCivilianWithinNopdDetailsPage
        .isOnPage()
        .selectRole(2)
        .submitCivilianWithinNopd();

      snackBar
        .presentWithMessage("Civilian (NOPD) was successfully added")
        .close();
    },

    "should display civilian within nopd on case details page": browser => {
      const caseDetailsPage = browser.page.CaseDetails();

      caseDetailsPage.thereIsAKnownCivilianWithinNopd("Amira");
    },

    "should display the incident location in the Incident Details section of the Case Detail": browser => {
      const caseDetailsPage = browser.page.CaseDetails();

      caseDetailsPage.addAccusedOfficer();
    },

    "should navigate to add officer form for unknown officer and add unknown accused officer": browser => {
      const addOfficerSearchPage = browser.page.AddOfficerSearch();
      const addOfficerDetailsPage = browser.page.AddOfficerDetails();

      addOfficerSearchPage.isOnPage().clickUnknownOfficerLink();

      addOfficerDetailsPage
        .isOnPageForUnknownOfficer()
        .selectRole(0)
        .submitOfficer();
    },

    "should see Unknown Officer in Accused section when added": browser => {
      const caseDetailsPage = browser.page.CaseDetails();
      const snackbar = browser.page.SnackbarPOM();

      caseDetailsPage.isOnPage().thereIsAnUnknownOfficer();

      snackbar.presentWithMessage("Officer was successfully added").close();
    },

    "should see Edit Officer page when Edit Officer clicked": browser => {
      const caseDetailsPage = browser.page.CaseDetails();
      const editOfficerDetailsPage = browser.page.EditOfficerDetails();

      caseDetailsPage.clickManageUnknownOfficer().clickEditOfficer();

      editOfficerDetailsPage.isOnPageForUnknownOfficer().changeOfficer();
    },

    "should see Edit Officer search and search for officer to replace unknown": browser => {
      const editOfficerSearchPage = browser.page.EditOfficerSearch();

      editOfficerSearchPage
        .isOnPage()
        .setLastName("Ri")
        .searchForOfficer()
        .selectNewOfficer();
    },

    "should return to Edit Officer Details when new officer selected and save Officer": browser => {
      const editOfficerDetailsPage = browser.page.EditOfficerDetails();

      editOfficerDetailsPage.isOnPageForKnownOfficer().saveOfficer();
    },

    "should see that officer is no longer unknown in accused officers": browser => {
      const caseDetailsPage = browser.page.CaseDetails();
      const snackbar = browser.page.SnackbarPOM();

      caseDetailsPage.isOnPage();

      snackbar.presentWithMessage("Officer was successfully updated").close();

      caseDetailsPage.thereIsAKnownOfficer("Ri");
    },

    "should add an allegation to the officer": browser => {
      const caseDetailsPage = browser.page.CaseDetails();
      const allegationPage = browser.page.Allegations();
      const snackbar = browser.page.SnackbarPOM();

      caseDetailsPage.clickManageKnownOfficer().clickManageAllegations();

      allegationPage
        .isOnPage()
        .setRule()
        .searchForAllegations()
        .selectAllegation()
        .setAllegationDetails("Used department property.")
        .setAllegationSeverity()
        .addAllegation()
        .newAllegationExists();

      snackbar.presentWithMessage("Allegation was successfully added").close();

      allegationPage.returnToCase();
    },

    "should navigate to Add Case Officer Page to add second officer": browser => {
      const caseDetailsPage = browser.page.CaseDetails();
      const addOfficerSearchPage = browser.page.AddOfficerSearch();

      caseDetailsPage.isOnPage().addAccusedOfficer();

      addOfficerSearchPage.isOnPage().clickUnknownOfficerLink();
    },

    "should navigate to add officer form for unknown second officer": browser => {
      const addOfficerDetailsPage = browser.page.AddOfficerDetails();

      addOfficerDetailsPage
        .isOnPageForUnknownOfficer()
        .selectRole(0)
        .submitOfficer();
    },

    "should see Unknown Second Officer in Accused section when added": browser => {
      const caseDetailsPage = browser.page.CaseDetails();
      const snackbar = browser.page.SnackbarPOM();

      caseDetailsPage.isOnPage().thereIsAnUnknownOfficer();

      snackbar.presentWithMessage("Officer was successfully added").close();
    },

    "should not see officer on case when removed": browser => {
      const caseDetailsPage = browser.page.CaseDetails();
      const snackbar = browser.page.SnackbarPOM();

      caseDetailsPage
        .clickManageUnknownOfficer()
        .clickRemoveOfficer()
        .confirmRemoveOfficerInDialog();

      snackbar.presentWithMessage("Officer was successfully removed").close();

      caseDetailsPage.thereIsNoUnknownOfficer();
    },

    "should create a case note and tag someone": browser => {
      const caseDetailsPage = browser.page.CaseDetails();
      const snackbar = browser.page.SnackbarPOM();
      const caseNoteDialog = browser.page.CaseNoteDialog();

      caseDetailsPage.isOnPage().clickAddCaseNoteButton();

      caseNoteDialog
        .dialogIsOpen()
        .setActionTaken()
        .writeCaseNote("Needs another review ")
        .tagPersonInCaseNote("Syd Botz")
        .clickSubmitButton();

      snackbar.presentWithMessage("Case note was successfully created").close();

      caseDetailsPage.caseNoteIsPresent("Needs another review @Syd Botz");
    },

    "should begin letter and navigate to case details review page": browser => {
      const caseDetails = browser.page.CaseDetails();
      const caseReview = browser.page.CaseReview();
      const snackbar = browser.page.SnackbarPOM();

      caseDetails.isOnPage().beginLetter().confirmUpdateStatusInDialog();

      caseReview.isOnPage();

      snackbar.presentWithMessage("Status was successfully updated").close();

      caseReview.clickPreview();
    },

    "should show missing officer history modal when submitting letter with incomplete history details": browser => {
      const letterPreview = browser.page.LetterPreview();
      const incompleteHistoryDialog = browser.page.IncompleteHistoryDialog();

      letterPreview.clickSubmit();
      incompleteHistoryDialog.incompleteOfficerHistoryDialogIsOpen();
      incompleteHistoryDialog.clickReturn();
    },

    "should add allegations to officer complaint history": browser => {
      const snackbar = browser.page.SnackbarPOM();
      const complaintHistory = browser.page.ComplaintHistory();

      complaintHistory
        .isOnPage()
        .clickFourthOption()
        .setHighAllegations(2)
        .setMedAllegations(3)
        .setLowAllegations(5)
        .countAllegations(10)
        .clickNext();

      snackbar
        .presentWithMessage(
          "Officer complaint history was successfully updated"
        )
        .close();
    },

    "should check retaliation concerns and recommended action": browser => {
      const recommendedActions = browser.page.RecommendedActions();
      const snackbar = browser.page.SnackbarPOM();

      recommendedActions.isOnPage();

      recommendedActions
        .toggleRetaliationConcerns()
        .toggleNthOfficersNthRecommendedAction(0, 1)
        .clickNext();
    },

    "should show missing classifications modal when submitting letter with incomplete classifications": browser => {
      const letterPreview = browser.page.LetterPreview();
      const incompleteHistoryDialog = browser.page.IncompleteHistoryDialog();
      const snackbar = browser.page.SnackbarPOM();

      letterPreview.clickSubmit();
      incompleteHistoryDialog.incompleteClassificationsDialogIsOpen();
      incompleteHistoryDialog.clickReturn();
    },

    "should select multiple classifications that are not declines to classify": browser => {
      const recommendedActions = browser.page.RecommendedActions();
      const snackbar = browser.page.SnackbarPOM();

      recommendedActions.isOnPage();

      recommendedActions
        .selectClassification("use-of-force")
        .selectClassification("criminal-misconduct")
        .selectClassification("declines-to-classify")
        .classificationsAreDisabled()
        .clickNext();

      snackbar
        .presentWithRegex(
          "(Classifications were successfully updated)|(Recommended actions were successfully updated)"
        )
        .close();
    },

    "should check letter preview contents": browser => {
      const letterPreview = browser.page.LetterPreview();

      letterPreview
        .isOnPage()
        .letterContains("Name: Night Watch")
        .letterContains("Name: Ansel W Rice")
        .letterContains(
          "Location: Bourbon St & Canal St, New Orleans, LA 70112"
        )
        .letterContains(
          "10 total complaints including 2 HIGH RISK allegations, 3 MEDIUM RISK allegations, 5 LOW RISK allegations"
        )
        .letterContains(
          "Retaliation Concerns and Request for Notice to Accused"
        )
        .letterContains(
          "Be temporarily or permanently reassigned from his/her current assignment"
        )
        .letterContains(
          "OIPM declines to classify the complaint at this time."
        );
    },

    "should edit letter": browser => {
      const letterPreview = browser.page.LetterPreview();
      const editLetter = browser.page.EditLetter();
      const snackbar = browser.page.SnackbarPOM();

      letterPreview.clickEditLetter().confirmEditLetterOnDialog();
      editLetter.isOnPage();
      snackbar.presentWithMessage("Letter was successfully updated").close();

      editLetter
        .makeEditsWithText("Susie and Phoebe and Sarah are the G.O.A.T.s")
        .saveEdits();

      letterPreview
        .isOnPage()
        .waitForData()
        .letterContains("Susie and Phoebe and Sarah are the G.O.A.T.s");

      snackbar.presentWithMessage("Letter was successfully updated").close();
    },

    "should submit for review": browser => {
      const letterPreview = browser.page.LetterPreview();
      const caseDetails = browser.page.CaseDetails();
      const snackbar = browser.page.SnackbarPOM();

      letterPreview.clickSubmit();

      letterPreview.confirmSubmit();

      caseDetails.isOnPage();

      snackbar.presentWithMessage("Status was successfully updated").close();
    },

    "should redirect to review-and-approve page and approve letter": browser => {
      const caseDetails = browser.page.CaseDetails();
      const reviewAndApprove = browser.page.ReviewAndApproveLetter();
      const snackbar = browser.page.SnackbarPOM();

      caseDetails.clickReviewAndApproveButton();

      reviewAndApprove
        .isOnPage()
        .clickApproveLetter()
        .clickApproveLetterOnDialog();

      caseDetails.isOnPage();

      snackbar.presentWithMessage("Status was successfully updated").close();
    },

    "should update status to closed": browser => {
      const caseDetails = browser.page.CaseDetails();
      const snackbar = browser.page.SnackbarPOM();

      caseDetails.closeCase().confirmUpdateStatusInDialog();

      snackbar.presentWithMessage("Status was successfully updated").close();
    },
    "should archive case": browser => {
      const caseDetails = browser.page.CaseDetails();
      const snackbar = browser.page.SnackbarPOM();
      const caseDashboard = browser.page.CaseDashboard();

      caseDetails.archiveCase().confirmArchiveInDialog();

      snackbar.presentWithMessage("Case was successfully archived").close();

      caseDashboard.isOnPage();
    },
    "should go to archived cases page and open archived case": browser => {
      const navBar = browser.page.NavBar();
      const archivedCasesPage = browser.page.ArchivedCases();

      navBar.goToArchivedCases();

      archivedCasesPage.isOnPage().openArchivedCase();
    },
    "should restore archived case": browser => {
      const caseDetailsPage = browser.page.CaseDetails();
      const caseDashboardPage = browser.page.CaseDashboard();
      const snackbar = browser.page.SnackbarPOM();

      caseDetailsPage.isOnPage().restoreCase().confirmRestoreInDialog();
      snackbar.presentWithMessage("Case was successfully restored").close();
      caseDetailsPage.goBackToAllCases();

      caseDashboardPage.isOnPage();
    },
    "should navigate to all exports page and export all cases": browser => {
      const navBar = browser.page.NavBar();
      const allExportsPage = browser.page.AllExports();

      navBar.goToAllExports();

      allExportsPage
        .isOnPage()
        .exportAllCases()
        .confirmExportInDialog()
        .waitForJobCompletion();
    },
    "should log out of the system": browser => {
      if (browser.globals.disableAuthentication) {
        console.log("Authentication is disabled. Skipping test.");
        return;
      }
      const navBar = browser.page.NavBar();
      const loginPage = browser.page.Login();

      navBar.clickHamburgerButton().clickLogout();

      loginPage.isOnPage();
    },
    "end user journey ;)": browser => {
      browser.end();
    }
  };
}
