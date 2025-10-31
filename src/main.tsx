import { createRoot } from "react-dom/client";
import { AuthProvider } from "react-oidc-context";
import App from "./App.tsx";
import "./index.css";

// Configure AWS Cognito OIDC settings
const cognitoAuthConfig = {
  authority: "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_GS8W608OW",
  client_id: "168ob3mif0tdfs1055eokgadg4",
  redirect_uri: `${window.location.origin}/callback`,
  response_type: "code",
  scope: "openid email profile aws.cognito.signin.user.admin",
  post_logout_redirect_uri: window.location.origin,
};

createRoot(document.getElementById("root")!).render(
  <AuthProvider {...cognitoAuthConfig}>
    <App />
  </AuthProvider>
);
