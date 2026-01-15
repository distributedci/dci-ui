import { Routes, Route, Navigate } from "react-router";

import Alerts from "alerts/Alerts";

import LoginPage from "auth/LoginPage";
import LoginCallbackPage from "auth/LoginCallbackPage";
import SilentRedirectPage from "auth/SilentRedirectPage";
import AdminLoginPage from "auth/AdminLoginPage";

import AuthenticatedRoute from "pages/AuthenticatedRoute";

import NonPrivilegedUserRoute from "pages/NonPrivilegedUserRoute";
import TasksDurationPerJobPage from "analytics/TasksDurationPerJob/TasksDurationPerJobPage";
import AnalyticsPage from "analytics/AnalyticsPage";
import JobStatsPage from "analytics/jobsStats/JobStatsPage";
import ComponentCoveragePage from "analytics/ComponentCoverage/ComponentCoveragePage";
import JunitComparisonPage from "analytics/JunitComparison/JunitComparisonPage";
import PipelinesPage from "analytics/Pipelines/PipelinesPage";
import KeyValuesPage from "analytics/KeyValues/KeyValuesPage";
import TestsAnalysisPage from "analytics/TestsAnalysis/TestsAnalysisPage";
import RedirectPage from "pages/RedirectPage";
import JobsPage from "jobs/JobsPage";
import JobPage from "jobs/job/JobPage";
import JobStatesPage from "jobs/job/jobStates/JobStatesPage";
import JobTestsPage from "jobs/job/tests/JobTestsPage";
import JobFilesPage from "jobs/job/files/JobFilesPage";
import JobSettingsPage from "jobs/job/settings/JobSettingsPage";
import JobHardwarePage from "jobs/job/hardware/JobHardwarePage";
import FilePage from "jobs/job/files/FilePage";
import JobTestPage from "jobs/job/tests/test/JobTestPage";
import ProductsPage from "products/ProductsPage";
import TopicsPage from "topics/TopicsPage";
import TopicPage from "topics/TopicPage";
import ComponentPage from "topics/component/ComponentPage";
import ComponentsPage from "components/ComponentsPage";
import RemotecisPage from "remotecis/RemotecisPage";
import NotificationsPage from "notifications/NotificationsPage";

import AdminOrEpmRoute from "pages/AdminOrEpmRoute";
import AdminPage from "admin/AdminPage";
import AdminTeamsPage from "admin/teams/TeamsPage";
import AdminTeamPage from "admin/teams/TeamPage";
import AdminUsersPage from "admin/users/UsersPage";
import AdminUserPage from "admin/users/UserPage";
import AdminRemotecisPage from "admin/remotecis/RemotecisPage";
import AdminTopicsPage from "admin/topics/TopicsPage";
import AdminFeedersPage from "admin/feeders/FeedersPage";

import Page404 from "pages/Page404";

export default function App() {
  return (
    <>
      <Alerts />
      <Routes>
        <Route path="/">
          <Route index element={<Navigate replace to="jobs" />} />
          <Route>
            <Route path="login" element={<LoginPage />} />
            <Route path="login_callback" element={<LoginCallbackPage />} />
            <Route path="silent_redirect" element={<SilentRedirectPage />} />
            <Route path="dci-admin" element={<AdminLoginPage />} />
          </Route>
          <Route element={<AuthenticatedRoute />}>
            <Route element={<NonPrivilegedUserRoute />}>
              <Route path="analytics">
                <Route index element={<AnalyticsPage />} />
                <Route
                  path="junit_comparison"
                  element={<JunitComparisonPage />}
                />
                <Route
                  path="component_coverage"
                  element={<ComponentCoveragePage />}
                />
                <Route
                  path="tasks_duration_per_job"
                  element={<TasksDurationPerJobPage />}
                />
                <Route path="job_stats" element={<JobStatsPage />} />
                <Route path="pipelines" element={<PipelinesPage />} />
                <Route path="keyvalues" element={<KeyValuesPage />} />
                <Route
                  path="testing_trend"
                  element={<RedirectPage to="/analytics/tests" replace />}
                />
                <Route path="tests" element={<TestsAnalysisPage />} />
              </Route>
              <Route path="jobs">
                <Route index element={<JobsPage />} />
                <Route path=":job_id" element={<JobPage />}>
                  <Route index element={<JobStatesPage />} />
                  <Route path="jobStates" element={<JobStatesPage />} />
                  <Route path="tests">
                    <Route index element={<JobTestsPage />} />
                    <Route path=":file_id" element={<JobTestPage />} />
                  </Route>
                  <Route path="files" element={<JobFilesPage />} />
                  <Route path="hardware" element={<JobHardwarePage />} />
                  <Route path="settings" element={<JobSettingsPage />} />
                </Route>
              </Route>
              <Route path="files/:file_id" element={<FilePage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="topics">
                <Route index element={<TopicsPage />} />
                <Route path=":topic_id/components/" element={<TopicPage />} />
                <Route
                  path=":topic_id/components/:component_id"
                  element={<ComponentPage />}
                />
              </Route>
              <Route path="components">
                <Route index element={<ComponentsPage />} />
                <Route path=":component_id" element={<ComponentPage />} />
              </Route>
              <Route path="remotecis" element={<RemotecisPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
            </Route>
            <Route path="admin" element={<AdminOrEpmRoute />}>
              <Route index element={<AdminPage />} />
              <Route path="teams">
                <Route index element={<AdminTeamsPage />} />
                <Route path=":team_id" element={<AdminTeamPage />} />
              </Route>
              <Route path="users">
                <Route index element={<AdminUsersPage />} />
                <Route path=":user_id" element={<AdminUserPage />} />
              </Route>
              <Route path="topics" element={<AdminTopicsPage />} />
              <Route path="remotecis" element={<AdminRemotecisPage />} />
              <Route path="feeders" element={<AdminFeedersPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </>
  );
}
