// @ts-nocheck
// REACT
import { useEffect, useState, useContext } from "react";

// REACT-ROUTER-DOM
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import { AuthProvider, AuthDispatchContext } from "./context/AuthContext.jsx"

// AWS
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react'; //useAuthenticator,
import { CognitoUser } from "amazon-cognito-identity-js"; // Type for user
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { fetchUserAttributes } from '@aws-amplify/auth';




// tsx fake errors over here
import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import PairingPage from "./pages/PairingPage.tsx"
import AddItemPage from "./pages/AddItemPage.tsx";

import UserSettings from "./pages/UserSettings.tsx"




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
      
      {
        path: "/usersettings",
        element: <UserSettings/>
      }
 
    ]    
  }])


  const InnerApp: React.FC = () => {

    const dispatch = useContext(AuthDispatchContext);
    const user = useAuthenticator();  
      useEffect(() => {
        if (!dispatch) return;

      
      
      const createObj = {
        id: user.user.userId,
        email: user.user.signInDetails.loginId,
        
        name: "",
        sentFriendRequests: [],
        receivedFriendRequests: [],
        stores: []
        //name: user.user.username
      }
      
      
      client.models.User.get({ id: user.user.userId }).then((userData) => {
        if (!(userData.data)) {
          client.models.User.create(createObj).then(() => { window.location.reload();});         
        } else {
          // set AuthContext stuff here
          
      
          dispatch({
            type: "login",
            auth: {
              status: 1,
              email: user.user.signInDetails.loginId,
              userId: user.user.userId,
              name: userData.data.name ?? "",
              sentFriendRequests: userData.data.sentFriendRequests ?? [],
              receivedFriendRequests: userData.data.receivedFriendRequests ?? [],
              stores: userData.data.stores ?? [],
            },
          });
        }
      })
    }, [client, user, dispatch]);
  
    return (
      <div>
        <RouterProvider router={router} />
      </div>
    );
  };
  

  const App: React.FC = () => {

  

    return (
     <AuthProvider>
       <Authenticator>
        <InnerApp/>
        </Authenticator>
    </AuthProvider>
    );
  };
  
  export default App;


