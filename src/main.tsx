import { createRoot } from "react-dom/client";
import { AuthProvider } from "react-oidc-context";
import { AWS_CONFIG } from "./config/constants";
import App from "./App.tsx";
import "./index.css";

// Configure AWS Cognito OIDC settings
const cognitoAuthConfig = {
  authority: AWS_CONFIG.COGNITO.AUTHORITY,
  client_id: AWS_CONFIG.COGNITO.CLIENT_ID,
  redirect_uri: AWS_CONFIG.COGNITO.REDIRECT_URI,
  response_type: "code",
  scope: AWS_CONFIG.COGNITO.SCOPES,
  post_logout_redirect_uri: AWS_CONFIG.COGNITO.POST_LOGOUT_REDIRECT_URI,
};

createRoot(document.getElementById("root")!).render(
  <AuthProvider {...cognitoAuthConfig}>
    <App />
  </AuthProvider>
);
