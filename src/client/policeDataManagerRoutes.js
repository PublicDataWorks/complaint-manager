import { lazy } from "react";
import FeatureRequestPage from "./policeDataManager/requestFeature/featureRequestPage";

const AllegationSearchContainer = lazy(() =>
  import("./policeDataManager/allegations/AllegationSearchContainer")
);
const OfficerHistories = lazy(() =>
  import(
    "./policeDataManager/cases/ReferralLetter/OfficerHistories/OfficerHistories"
  )
);
const ArchivedCases = lazy(() =>
  import("./policeDataManager/cases/ArchivedCases")
);
const EditOfficerSearch = lazy(() =>
  import("./policeDataManager/officers/OfficerSearch/EditOfficerSearch")
);
const CaseDashboard = lazy(() =>
  import("./policeDataManager/cases/CaseDashboard")
);
const AddOfficerSearch = lazy(() =>
  import("./policeDataManager/officers/OfficerSearch/AddOfficerSearch")
);
const CaseDetails = lazy(() =>
  import("./policeDataManager/cases/CaseDetails/CaseDetails")
);
const CaseHistory = lazy(() =>
  import("./policeDataManager/cases/CaseDetails/CaseHistory/CaseHistory")
);
const EditLetter = lazy(() =>
  import("./policeDataManager/cases/ReferralLetter/EditLetter/EditLetter")
);
const AddOfficerDetails = lazy(() =>
  import("./policeDataManager/officers/OfficerDetails/AddOfficerDetails")
);
const RecommendedActions = lazy(() =>
  import(
    "./policeDataManager/cases/ReferralLetter/RecommendedActions/RecommendedActions"
  )
);
const RedirectToCaseDashboard = lazy(() => import("./RedirectToCaseDashboard"));
const LetterReview = lazy(() =>
  import("./policeDataManager/cases/ReferralLetter/LetterReview/LetterReview")
);
const JobDashboard = lazy(() =>
  import("./policeDataManager/export/JobDashboard")
);
const EditOfficerDetails = lazy(() =>
  import("./policeDataManager/officers/OfficerDetails/EditOfficerDetails")
);
const LetterPreview = lazy(() =>
  import("./policeDataManager/cases/ReferralLetter/LetterPreview/LetterPreview")
);
const ReviewAndApproveLetter = lazy(() =>
  import(
    "./policeDataManager/cases/ReferralLetter/ReviewAndApproveLetter/ReviewAndApproveLetter"
  )
);
const DataDashboard = lazy(() =>
  import("./policeDataManager/data/DataDashboard")
);
const SearchCasesPage = lazy(() =>
  import("./policeDataManager/cases/SearchCases/SearchCasesPage")
);
const TagManagementPage = lazy(() =>
  import("./policeDataManager/tags/TagManagementPage")
);

const AdminPortal = lazy(() => import("./policeDataManager/admin/AdminPortal"));

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
  },
  {
    path: "/admin-portal",
    component: AdminPortal
  },
  {
    path: "/feature-request",
    component: FeatureRequestPage
  }
];

export default policeDataManagerRoutes;
