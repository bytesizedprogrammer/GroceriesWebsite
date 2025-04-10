// @ts-nocheck
// REACT
import { useEffect, useState } from "react";

// REACT-ROUTER-DOM
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";


// AWS
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react'; //useAuthenticator,
import { CognitoUser } from "amazon-cognito-identity-js"; // Type for user
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { fetchUserAttributes } from '@aws-amplify/auth';
//import { getUrl } fr \om 'aws-amplify/storage';



// tsx fake errors over here
import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import PairingPage from "./pages/PairingPage.tsx"
import AddItemPage from "./pages/AddItemPage.tsx";




//import TestPage from "./pages/testAPIPage.tsx";


const client = generateClient<Schema>();


const Layout: React.FC = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Layout page for every part of the site
    errorElement: <ErrorPage />, // error page
    children: [
      {
        index: true, // if it's the "/"" page
        element: <LandingPage />, // page to load
      },
      {
        path: '/addItem',
        element: <AddItemPage />
      },
      {
        path: "/pairing",
        element: <PairingPage />, 
      },
      //{
      //  path: '/test',
      //  element: <TestPage/>
      //}
    ]    
  }])

  const App: React.FC = () => {

    //const { user, authStatus } = useAuthenticator((context) => [context.user, context.authStatus]);
    //const [authData, setAuthData] = useState<CognitoUser | null>(null);

    //const [appUser, setAppUser] = useState<Schema["User"]["type"] | null>(null);
    //const { user: cognitoUser, signOut } = useAuthenticator();
    const user = useAuthenticator();

useEffect(() => {
  console.log("User: ", user.user);
 // console.log("App User: ", appUser);

 console.log("CLIENT!", client)  // uncomment to see how it works


const createObj = {
  id: user.user.userId,
  email: user.user.signInDetails.loginId,
  name: user.user.username
}

console.log("OBJECTTTTTT: ", createObj);

client.models.User.get({ id: user.user.userId }).then((userData) => {
  //console.log("Word", userData)
  console.log('test: ', userData.data);
  if (!(userData.data)) {
    client.models.User.create(createObj).then(() => {});
  }
})





  /*
  if (cognitoUser) {
    
    if (client && client.models && client.models.User) {
      client.models.User.get({ id: cognitoUser.userId })
        .then(({ data: appUser }) => {
          if (appUser === null) {
            fetchUserAttributes()
              .then(userAttributes => {
                const createObj = {
                  id: cognitoUser.userId, 
                  email: userAttributes.email,
                  givenName: userAttributes.given_name,
                  familyName: userAttributes.family_name,
                };
                client.models.User.create(createObj)
                  .then(({ data: newUser }) => {
                    setAppUser(newUser);
                  });
              });
          } else {
            setAppUser(appUser);
          }
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
        });
    } else {
      console.error('Client or User model is undefined');
    }
  } else {
    console.error('Cognito user is undefined');
  }
    */
}, [user, client]);

  
    /*
    useEffect(() => {
      for (const key in user) {
        if (user.hasOwnProperty(key)) {
          console.log(`${key}: ${user[key]}`);
        }
      }
      

      console.log(`Data:
        User: ${user}
        AuthStatus: ${authStatus}
        AuthData: ${authData}  
      `)
    }, [user, authStatus, authData]);
    */

    /*
    // Just for debugging, ignore for now
    useEffect(() => {
      console.log(authData);
      if (authStatus === "authenticated" && user) {
        console.log("User authenticated:", user);

        // @ts-ignore
        setAuthData(user); //as CognitoUser
      }
    }, [authStatus, user]);



    useEffect(() => {
      if (authStatus === "authenticated" && user) {
        console.log("User authenticated:", user);
    
        /*)
        if (!client.models?.User) {
          console.error("User model is undefined. Check Amplify setup.");
          return;
        }
        /
        const userID = user.userId;
        console.log("Obtain value pls: ", userID);
        client.models.User.get({ id: userID })
          .then(({ data }) => console.log(data))
          .catch((error) => console.error("Error fetching user:", error));
      }
    }, [authStatus, user]);
    */
    /*
    useEffect(() => {

      const userID = user.userId; // Cognito ID
      console.log("RIZZ ALERT", userID);

      //client.models.User.get({ id: userID })

      client.models.User.get({ id: userID })
        .then(({ data }) => {


          console.log(data);
          /*
          if (!data) {
            console.log("User not found, creating new user...");

            // Create the user in your DB
            client.models.User.create({
              id: userID,
              //email: user.attributes?.email,
              //name: user.attributes?.name || "Unnamed User",
            }).then(({ data: newUser }) => {
              console.log("User created:", newUser);

              // @ts-ignore
              setAuthData(newUser);
            });

          } else {
            console.log("User found:", data);
            // @ts-ignore
            setAuthData(data);
          }
            *
        })
        .catch((error) => console.error("Error fetching user:", error));
      
    }, [authStatus, user]);
*/


    /* Munson example, the id works the same way on yours too here, goofy, but dont think about it too hard
    useEffect(() => {
      // look up user, and create if they don't exist in my database
      client.models.User.get({ id: cognitoUser.userId })
      .then(({ data:appUser }) => {
        if (appUser === null) {
          fetchUserAttributes()
          .then(userAttributes => {
            const createObj = {
              id: cognitoUser.userId, 
              email: userAttributes.email,
              givenName: userAttributes.given_name, 
              familyName: userAttributes.family_mame,
            };
            client.models.User.create(createObj)
            .then(({data:newUser}) => {
              setAppUser(newUser);
            });  
          })
        } else {
          setAppUser(appUser);
        }
      });
    }, [cognitoUser])
    */

    return (
      
      <Authenticator>
        {/*
        {({})
        
        }
        */}
        <div>
          <RouterProvider router={router} />
        </div>
    </Authenticator>
    );
  };
  
  export default App;


  // https://chatgpt.com/c/67e87fa7-9998-8008-9fb7-fcb8c52a5ef8