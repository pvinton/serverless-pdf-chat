import "./index.css";
import { Amplify, Auth } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Layout from "./routes/layout";
// import Documents from "./routes/documents";
// import Chat from "./routes/chat";

Amplify.configure({
  Auth: {
    userPoolId: import.meta.env.VITE_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
    region: import.meta.env.VITE_API_REGION,
    oauth: {
      domain: "pvinton-sandbox.auth.us-east-1.amazoncognito.com",
      scope: ["email", "openid", "aws.cognito.signin.user.admin", "profile"],
      redirectSignIn: "https://main.d29s4hlgft4djr.amplifyapp.com/",
      redirectSignOut: "https://main.d29s4hlgft4djr.amplifyapp.com/",
      responseType: "code"
    }
  },
  API: {
    endpoints: [
      {
        name: "serverless-pdf-chat",
        endpoint: import.meta.env.VITE_API_ENDPOINT,
        region: import.meta.env.VITE_API_REGION,
        custom_header: async () => {
          return {
            Authorization: `Bearer ${(await Auth.currentSession())
              .getIdToken()
              .getJwtToken()}`,
          };
        },
      },
    ],
  },
});

// let router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Layout />,
//     children: [
//       {
//         index: true,
//         Component: Documents,
//       },
//       {
//         path: "/doc/:documentid/:conversationid",
//         Component: Chat,
//       },
//     ],
//   },
// ]);

function checkUser() {
  Auth.currentAuthenticatedUser()
    .then(user => console.log({ user }))
    .catch(err => console.log(err))
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={checkUser}>Check User</button>
        <button onClick={() => Auth.federatedSignIn()}>Sign In</button>
      </header>
    </div>
    // <RouterProvider router={router} />;
  )
}

export default withAuthenticator(App, { 
  hideSignUp: true,
  socialProviders: ['apple']
});
//export default App
