import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "./ui/styles";
import "./css/alignment.css";
import "./css/spacing.css";
import "./css/flex.css";
import Pages from "./pages";
import PrivateRoute from "auth/PrivateRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/jobs" />} />
      <Route
        path="/analytics"
        element={
          <PrivateRoute>
            <Pages.AnalyticsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/analytics/tasks_duration_per_job"
        element={
          <PrivateRoute>
            <Pages.TasksDurationPerJobPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/analytics/latest_jobs_status"
        element={
          <PrivateRoute>
            <Pages.LatestJobStatusPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/analytics/latest_jobs_status/:topic_name"
        element={
          <PrivateRoute>
            <Pages.LatestJobStatusDetailsPage />
          </PrivateRoute>
        }
      />
      <Route path="/jobs">
        <Route
          index
          element={
            <PrivateRoute>
              <Pages.JobsPage />
            </PrivateRoute>
          }
        />
        <Route
          path=":job_id"
          element={
            <PrivateRoute>
              <Pages.JobPage />
            </PrivateRoute>
          }
        >
          <Route
            index
            element={
              <PrivateRoute>
                <Pages.JobStatesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="jobStates"
            element={
              <PrivateRoute>
                <Pages.JobStatesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="tests"
            element={
              <PrivateRoute>
                <Pages.JobTestsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="files"
            element={
              <PrivateRoute>
                <Pages.JobFilesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="settings"
            element={
              <PrivateRoute>
                <Pages.JobSettingsPage />
              </PrivateRoute>
            }
          />
        </Route>
      </Route>

      <Route
        path="/files/:file_id"
        element={
          <PrivateRoute>
            <Pages.FilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/products"
        element={
          <PrivateRoute>
            <Pages.ProductsPage />
          </PrivateRoute>
        }
      />

      <Route path="/topics">
        <Route
          index
          element={
            <PrivateRoute>
              <Pages.TopicsPage />
            </PrivateRoute>
          }
        />
        <Route
          path=":topic_id/components/"
          element={
            <PrivateRoute>
              <Pages.TopicPage />
            </PrivateRoute>
          }
        >
          <Route
            path=":component_id"
            element={
              <PrivateRoute>
                <Pages.ComponentPage />
              </PrivateRoute>
            }
          />
        </Route>
      </Route>
      <Route
        path="/remotecis"
        element={
          <PrivateRoute>
            <Pages.RemotecisPage />
          </PrivateRoute>
        }
      />
      <Route path="/feeders">
        <Route
          index
          element={
            <PrivateRoute>
              <Pages.FeedersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="create"
          element={
            <PrivateRoute>
              <Pages.CreateFeederPage />
            </PrivateRoute>
          }
        />
        <Route
          path=":feeder_id"
          element={
            <PrivateRoute>
              <Pages.EditFeederPage />
            </PrivateRoute>
          }
        />
      </Route>

      <Route path="/teams">
        <Route
          index
          element={
            <PrivateRoute>
              <Pages.TeamsPage />
            </PrivateRoute>
          }
        />
        <Route
          path=":team_id"
          element={
            <PrivateRoute>
              <Pages.TeamPage />
            </PrivateRoute>
          }
        />
      </Route>

      <Route
        path="/users"
        element={
          <PrivateRoute>
            <Pages.UsersPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/users/:user_id"
        element={
          <PrivateRoute>
            <Pages.EditUserPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/currentUser/settings"
        element={
          <PrivateRoute>
            <Pages.SettingsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/currentUser/notifications"
        element={
          <PrivateRoute>
            <Pages.NotificationsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/permissions"
        element={
          <PrivateRoute>
            <Pages.PermissionsPage />
          </PrivateRoute>
        }
      />
      <Route path="/login" element={<Pages.LoginPage />} />
      <Route path="/login_callback" element={<Pages.LoginCallbackPage />} />
      <Route path="/silent_redirect" element={<Pages.SilentRedirectPage />} />
      <Route path="*" element={<Pages.Page404 />} />
    </Routes>
  );
}
