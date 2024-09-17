export default {
  isSuperAdmin: "isSuperAdmin",
  meEndpoint: "/auth/me",
  loginEndpoint: "/jwt/login",
  registerEndpoint: "/jwt/register",
  storageTokenKeyName: "accessToken",
  onTokenExpiration: "refreshToken", // logout | refreshToken
};
