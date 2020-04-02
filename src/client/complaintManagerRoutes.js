import React from "react";
import AllegationSearchContainer from "./complaintManager/allegations/AllegationSearchContainer";
import OfficerHistories from "./complaintManager/cases/ReferralLetter/OfficerHistories/OfficerHistories";
import ArchivedCases from "./complaintManager/cases/ArchivedCases";
import EditOfficerSearch from "./complaintManager/officers/OfficerSearch/EditOfficerSearch";
import CaseDashboard from "./complaintManager/cases/CaseDashboard";
import AddOfficerSearch from "./complaintManager/officers/OfficerSearch/AddOfficerSearch";
import CaseDetails from "./complaintManager/cases/CaseDetails/CaseDetails";
import CaseHistory from "./complaintManager/cases/CaseDetails/CaseHistory/CaseHistory";
import IAProCorrections from "./complaintManager/cases/ReferralLetter/IAProCorrections/IAProCorrections";
import EditLetter from "./complaintManager/cases/ReferralLetter/EditLetter/EditLetter";
import AddOfficerDetails from "./complaintManager/officers/OfficerDetails/AddOfficerDetails";
import RecommendedActions from "./complaintManager/cases/ReferralLetter/RecommendedActions/RecommendedActions";
import RedirectToCaseDashboard from "./RedirectToCaseDashboard";
import LetterReview from "./complaintManager/cases/ReferralLetter/LetterReview/LetterReview";
import JobDashboard from "./complaintManager/export/JobDashboard";
import EditOfficerDetails from "./complaintManager/officers/OfficerDetails/EditOfficerDetails";
import LetterPreview from "./complaintManager/cases/ReferralLetter/LetterPreview/LetterPreview";
import ReviewAndApproveLetter from "./complaintManager/cases/ReferralLetter/ReviewAndApproveLetter/ReviewAndApproveLetter";
import DataDashboard from "./complaintManager/data/DataDashboard";

const complaintManagerRoutes = [
  {
    path: "/archived-cases",
    component: ArchivedCases
  },
  {
    path: "/",
    component: CaseDashboard
  },
  {
    path: "/data",
    component: DataDashboard,
    toggleName: "dataVisualizationFeature"
  },
  {
    path: "/cases/:id/officers/search",
    component: AddOfficerSearch
  },
  {
    path: "/cases/:id/officers/details",
    component: AddOfficerDetails
  },
  {
    path: "/cases/:id/officers/:caseOfficerId",
    component: EditOfficerDetails
  },
  {
    path: "/cases/:id/officers/:caseOfficerId/search",
    component: EditOfficerSearch
  },
  {
    path: "/cases/:id/history",
    component: CaseHistory
  },
  {
    path: "/cases/:id",
    component: CaseDetails
  },
  {
    path: "/cases/:id/letter/review",
    component: LetterReview
  },
  {
    path: "/cases/:id/letter/officer-history",
    component: OfficerHistories
  },
  {
    path: "/cases/:id/letter/iapro-corrections",
    component: IAProCorrections
  },
  {
    path: "/cases/:id/letter/recommended-actions",
    component: RecommendedActions
  },
  {
    path: "/cases/:id/letter/letter-preview",
    component: LetterPreview
  },
  {
    path: "/cases/:id/letter/edit-letter",
    component: EditLetter
  },
  {
    path: "/cases/:id/letter/review-and-approve",
    component: ReviewAndApproveLetter
  },
  {
    path: "/export/all",
    component: JobDashboard
  },
  {
    path: "/cases/:id/cases-officers/:caseOfficerId/allegations/search",
    component: AllegationSearchContainer
  },
  {
    path: "/cases/:id",
    component: RedirectToCaseDashboard
  }
];

export default complaintManagerRoutes;
