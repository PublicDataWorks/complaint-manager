import React from "react";
import AllegationSearchContainer from "./allegations/AllegationSearchContainer";
import OfficerHistories from "./cases/ReferralLetter/OfficerHistories/OfficerHistories";
import ArchivedCases from "./cases/ArchivedCases";
import EditOfficerSearch from "./officers/OfficerSearch/EditOfficerSearch";
import CaseDashboard from "./cases/CaseDashboard";
import AddOfficerSearch from "./officers/OfficerSearch/AddOfficerSearch";
import CaseDetails from "./cases/CaseDetails/CaseDetails";
import CaseHistory from "./cases/CaseDetails/CaseHistory/CaseHistory";
import IAProCorrections from "./cases/ReferralLetter/IAProCorrections/IAProCorrections";
import EditLetter from "./cases/ReferralLetter/EditLetter/EditLetter";
import AddOfficerDetails from "./officers/OfficerDetails/AddOfficerDetails";
import RecommendedActions from "./cases/ReferralLetter/RecommendedActions/RecommendedActions";
import RedirectToCaseDashboard from "./RedirectToCaseDashboard";
import LetterReview from "./cases/ReferralLetter/LetterReview/LetterReview";
import JobDashboard from "./export/JobDashboard";
import EditOfficerDetails from "./officers/OfficerDetails/EditOfficerDetails";
import LetterPreview from "./cases/ReferralLetter/LetterPreview/LetterPreview";
import ReviewAndApproveLetter from "./cases/ReferralLetter/ReviewAndApproveLetter/ReviewAndApproveLetter";

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
