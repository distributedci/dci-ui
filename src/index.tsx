import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter } from "react-router-dom";
import "@patternfly/react-core/dist/styles/base.css";
import "./index.css";
import App from "./App";
import { SSOProvider } from "auth/ssoContext";
import { AuthProvider } from "auth/authContext";
import { NewsProvider } from "news/NewsContext";

ReactDOM.render(
  <Provider store={store}>
    <SSOProvider>
      <AuthProvider>
        <NewsProvider>
          <BrowserRouter basename={process.env.PUBLIC_URL}>
            <App />
          </BrowserRouter>
        </NewsProvider>
      </AuthProvider>
    </SSOProvider>
  </Provider>,
  document.getElementById("root")
);
