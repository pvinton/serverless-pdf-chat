import React, { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import { Hub } from "aws-amplify/utils";
import { signInWithRedirect, getCurrentUser } from "aws-amplify/auth";
import { AuthUser } from "aws-amplify/auth";

Amplify.configure({
  Auth: {
    Cognito: {
      loginWith: {
        oauth: {
          redirectSignIn: [
            "https://main.d29s4hlgft4djr.amplifyapp.com/",
          ],
          ...oauthConfig
        },
      },
     ...userPoolConfig
    },
  },
});

function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [customState, setCustomState] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signInWithRedirect":
          getUser();
          break;
        case "signInWithRedirect_failure":
          setError("An error has ocurred during the Oauth flow.");
          break;
        case "customOAuthState":
          setCustomState(payload.data);
          break;
      }
    });

    getUser();

    return unsubscribe;
  }, []);

  const getUser = async (): Promise<void> => {
    try {
      console.log('getting currentUser')
      const currentUser = await getCurrentUser();
      console.log(currentUser)
      setUser(currentUser);
    } catch (error) {
      console.error(error);
      console.log("Not signed in");
    }
  };

  return (
    <div className="App">
      <button onClick={() => signInWithRedirect()}>Open Hosted UI</button>
      <div>{user?.username}</div>
    </div>
  );
}