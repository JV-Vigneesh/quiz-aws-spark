import { createRoot } from "react-dom/client";
import { AuthProvider } from "react-oidc-context";
import App from "./App.tsx";
import "./index.css";

// Configure AWS Cognito OIDC settings
const cognitoAuthConfig = {
  authority: "", // Add your Cognito domain: https://cognito-idp.{region}.amazonaws.com/{userPoolId}
  client_id: "", // Add your Cognito App Client ID
  redirect_uri: `${window.location.origin}/callback`,
  response_type: "code",
  scope: "aws.cognito.signin.user.admin email openid profile",
  post_logout_redirect_uri: window.location.origin,
};

createRoot(document.getElementById("root")!).render(
  <AuthProvider {...cognitoAuthConfig}>
    <App />
  </AuthProvider>
);
