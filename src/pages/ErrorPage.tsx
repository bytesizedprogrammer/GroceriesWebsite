// @ts-nocheck

import React from 'react';
import { useRouteError } from 'react-router-dom'; //  Link,
//import { styled } from '@mui/material/styles';

const LandingPage: React.FC = () => {
  const error = useRouteError();
  console.log(error);
  return (
    <>
      <div>
        <h1>{error.statusText}</h1> {/* This error is def caused by type strictness but idk exactly what it is, look into later */}
        <h3>{error.data}</h3>
      </div>
    </>
  );
};

export default LandingPage;
