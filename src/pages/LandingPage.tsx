// @ts-nocheck
// LandingPage.tsx

import React, { useEffect, useState, useContext } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
//import { Link } from 'react-router-dom';
import { useMediaQuery, useTheme } from "@mui/material";
import DynamicDialog from "../components/popup.tsx";
import "../assets/landingPage.css"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { generateClient } from "aws-amplify/data";
// @ts-ignore
import type { Schema } from "../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react'; //useAuthenticator,

// @ts-ignore
import { AuthContext } from "../context/AuthContext.jsx"

import { getUrl } from 'aws-amplify/storage';

const client = generateClient<Schema>();



const LandingPage: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
  //const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));


  const sxStyles = {
    width: isSmallScreen ? "100%" : isMediumScreen ? "75%" : "50%",
    height: isSmallScreen ? "100%" : isMediumScreen ? "100%" : "100%",
  };

  // @ts-ignore
  const [votes, setVotes] = useState<{ [key: string]: number }>({});
  /*
  {
  'item1': 1,
  'item2': 2,
  'item3': 1,
}
  */

    //const user = useAuthenticator();


const [itemData, setItemData] = useState([]);





const [title, setTitle] = useState([]);
const [clicked, setClicked] = useState([]);


  const handleVote = (key: string, delta: number) => {

    // debugging, ignore
    console.log("as",[key]) 
    console.log('or',votes[key])
   
    if (votes[key] == 1) {
      // make it so, when "vote" count is 1, you cant decrease the quantity
    }

     setVotes((prevVotes) => ({
      ...prevVotes,
      [key]: (prevVotes[key] || 0) + delta, // nvm ignore this on the right, unless you wanna udnerstand the logic behind the code    Defaulting to 2 instead of 0 before doing calculation prevVotes[key] value doesnt already exist, temporary frontend only issue that won't exist upon backend functioning
      // [key]: This updates the specific key (the item being voted on) in the votes object.
      // (prevVotes[key] || 0) + delta: This part retrieves the current vote count for the item (prevVotes[key]). If it doesn't exist (i.e., it's undefined), it uses 0 as the default. Then, delta (either +1 or -1) is added to this value to update the vote.
    }));
  };



  const [open, setOpen] = useState(false);


  const [selectedValue, setSelectedValue] = useState(""); // title + store name combined into one variable name
  const [descriptionSetup, setDescriptionSetup] = useState("");

  const openWindow = (imgUrlAsID: string, productName: string, hardCodedStoreForNowUntilBackendImplemented: string, name: string, timeAndDate: string) => {
    setSelectedValue(`${productName} | ${hardCodedStoreForNowUntilBackendImplemented}`);
    console.log(imgUrlAsID)

    if (timeAndDate === "N/A") {
      setDescriptionSetup("N/A")
    } else {
      const time = timeAndDate.slice(0, 10); // i.e.: 19:07
      const date = timeAndDate.slice(11); // i.e.: 2/1/2025 ORRRR February 1, 2025 ORRRR Saturday, February 1, 2025
      setDescriptionSetup(`Added by ${name} at ${time} on ${date}`);
    }
    setOpen(true);  
  }



  const authContext = useContext(AuthContext);
  useEffect(() => {
    if (authContext) {
      console.log("✅ AuthContext in Landing Page: ", authContext);
    } else {
      console.warn("❌ AuthContext is null or undefined.");
    }
  }, [authContext]);

  return (
    <>
    <div className='mainContainer'>
        <ImageList 
          sx = {sxStyles}        
        >
      <ImageListItem key="Subheader" cols={2}>
        <ListSubheader 

        className='Title' component="div">  {title[0]}      {clicked[0] ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}{/* ACCORDION: Add a little dropdown thingy so you can close the content of that store, add notification number to convey how many unique products are remaining to purchase */} </ListSubheader>
        <DynamicDialog 
      selectedValue={selectedValue} 
      description={descriptionSetup}
      open={open} 
      onOpen={() => setOpen(true)} 
      onClose={() => setOpen(false)}
    />
      </ImageListItem>
    
      
      {/* Map here will be via objects of array */}
      {itemData.map((item) => ( 
        <ImageListItem key={item.img} >
          <img
            srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
            src={`${item.img}?w=248&fit=crop&auto=format`}
            alt={item.title}
            loading="lazy"
            onClick={() => openWindow(item.img, item.title, "Walmart", "N/A", "N/A")}
          />
          <ImageListItemBar
            title={item.title.length > 7 ? `${item.title.slice(0, 5)}...` : item.title}
            actionIcon={
              <div>
<IconButton 
            onClick={() => openWindow(item.img, item.title, "Walmart", item.name, item.timeAndDate)} 
            sx={{ color: 'white' }}
          >
            <InfoIcon />
          </IconButton>
          

              <IconButton onClick={() => handleVote(item.img, 1)} sx={{ color: 'white' }}>
                    <ArrowUpwardIcon />
                  </IconButton>
                  <span style={{ color: 'white', margin: '0 0px' }}>
                    {votes[item.img] || 0}
                  </span>
                  <IconButton onClick={() => handleVote(item.img, -1)} sx={{ color: 'white' }}>
                    <ArrowDownwardIcon />
                  </IconButton>
                </div>
              
            }
          />
        </ImageListItem>
      ))}


    </ImageList>
    </div>
    </>
  );
};




export default LandingPage;