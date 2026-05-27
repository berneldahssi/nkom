import { Amplify } from "aws-amplify";

const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!;
const userPoolClientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

Amplify.configure(
  {
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId,
        loginWith: {
          oauth: {
            domain: cognitoDomain,
            scopes: ["email", "openid", "profile"],
            redirectSignIn: [`${appUrl}/auth/callback`],
            redirectSignOut: [`${appUrl}/`],
            responseType: "code",
          },
        },
      },
    },
  },
  { ssr: false }
);
