// AWS Configuration - Centralized sensitive information
export const AWS_CONFIG = {
  // API Gateway Base URL
  API_BASE_URL: "https://1wbzcinbp1.execute-api.ap-south-1.amazonaws.com/prod",
  
  // Cognito Configuration
  COGNITO: {
    REGION: "ap-south-1",
    USER_POOL_ID: "ap-south-1_GS8W608OW",
    AUTHORITY: "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_GS8W608OW",
    CLIENT_ID: "168ob3mif0tdfs1055eokgadg4",
    DOMAIN: "https://ap-south-1gs8w608ow.auth.ap-south-1.amazoncognito.com",
    REDIRECT_URI: window.location.origin + "/callback",
    POST_LOGOUT_REDIRECT_URI: window.location.origin + "/",
    SCOPES: "openid email profile aws.cognito.signin.user.admin",
  }
};
