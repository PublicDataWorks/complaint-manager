import React from "react";
import AllegationSearchContainer from "./policeDataManager/allegations/AllegationSearchContainer";
import OfficerHistories from "./policeDataManager/cases/ReferralLetter/OfficerHistories/OfficerHistories";
import ArchivedCases from "./policeDataManager/cases/ArchivedCases";
import EditOfficerSearch from "./policeDataManager/officers/OfficerSearch/EditOfficerSearch";
import CaseDashboard from "./policeDataManager/cases/CaseDashboard";
import AddOfficerSearch from "./policeDataManager/officers/OfficerSearch/AddOfficerSearch";
import CaseDetails from "./policeDataManager/cases/CaseDetails/CaseDetails";
import CaseHistory from "./policeDataManager/cases/CaseDetails/CaseHistory/CaseHistory";
import EditLetter from "./policeDataManager/cases/ReferralLetter/EditLetter/EditLetter";
import AddOfficerDetails from "./policeDataManager/officers/OfficerDetails/AddOfficerDetails";
import RecommendedActions from "./policeDataManager/cases/ReferralLetter/RecommendedActions/RecommendedActions";
import RedirectToCaseDashboard from "./RedirectToCaseDashboard";
import LetterReview from "./policeDataManager/cases/ReferralLetter/LetterReview/LetterReview";
import JobDashboard from "./policeDataManager/export/JobDashboard";
import EditOfficerDetails from "./policeDataManager/officers/OfficerDetails/EditOfficerDetails";
import LetterPreview from "./policeDataManager/cases/ReferralLetter/LetterPreview/LetterPreview";
import ReviewAndApproveLetter from "./policeDataManager/cases/ReferralLetter/ReviewAndApproveLetter/ReviewAndApproveLetter";
import DataDashboard from "./policeDataManager/data/DataDashboard";
import SearchCasesPage from "./policeDataManager/cases/SearchCases/SearchCasesPage";
import TagManagementPage from "./policeDataManager/tags/TagManagementPage";

const policeDataManagerRoutes = [
  {
    path: "/archived-cases",
    component: ArchivedCases
  },
  {
    path: "/",
    component: CaseDashboard
  },
  {
    path: "/search",
    component: SearchCasesPage
  },
  {
    path: "/dashboard",
    component: DataDashboard
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
  },
  {
    path: "/manage-tags",
    component: TagManagementPage
  }
];

export default policeDataManagerRoutes;
