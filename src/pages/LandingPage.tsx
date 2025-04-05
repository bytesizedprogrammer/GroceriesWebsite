// LandingPage.tsx

import React, { useState } from 'react';
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
  const [title, setTitle] = useState<string>("Walmart");
  const [votes, setVotes] = useState<{ [key: string]: number }>({});
  /*
  {
  'item1': 1,
  'item2': 2,
  'item3': 1,
}
  */



const [hover, setHover] = useState(false);


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



  return (
    <>
    <div className='mainContainer'>

    {/**
     Final Structure will be when returned from backend:
     - Everything []
      - Stores []
       - Object per store {}

    [ [{}, {}, {}], [{}, {}], [{}], [] ]      ...etc.
     */}

    {/* Map here by store*/}
    
    
    
    
    {/* cols={isSmallScreen ? 2 : isMediumScreen ? 3 : 4} // Adjust columns dynamically */}


        <ImageList 
          sx = {sxStyles}        
        >
      <ImageListItem key="Subheader" cols={2}>
        <ListSubheader 
         onMouseEnter={() => setHover(true)}
         onMouseLeave={() => setHover(false)}
        className='Title' component="div">{title}      {hover ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}{/* ACCORDION: Add a little dropdown thingy so you can close the content of that store, add notification number to convey how many unique products are remaining to purchase */} </ListSubheader>
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




{/*
<ImageListItem sx={{ marginTop: '150px' }} key="Subheader" cols={2}>
        <ListSubheader className='Title' component="div">ACME</ListSubheader>
</ImageListItem>

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
*/}

    </ImageList>
    </div>
    </>
  );
};




const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
    author: '@bkristastucchio',
    name: "Jonkler",
    timeAndDate: "2025-02-04 16:02:15",
    /*
    rows: 2,
    cols: 2,
    featured: true,
    */
    quantityToBuy: 0,
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
    author: '@rollelflex_graphy726',
    name: "Jonkler",
    timeAndDate: "2025-02-04 16:02:15",
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
    author: '@helloimnik',
    name: "Jonkler",
    timeAndDate: "2025-02-04 16:02:15",
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
    author: '@nolanissac',
    name: "Jonkler",
    timeAndDate: "2025-02-04 16:02:15",
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
    author: '@hjrc33',
    name: "Jonkler",
    timeAndDate: "2025-02-04 16:02:15",
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
    author: '@arwinneil',
    rows: 2,
    cols: 2,
    name: "Jonkler",
    timeAndDate: "2025-02-04 16:02:15",
    featured: true,
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    title: 'Basketball',
    author: '@tjdragotta',
    name: "Jonkler",
    timeAndDate: "2025-02-04 16:02:15",
  },
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Fern',
    author: '@katie_wasserman',
    name: "Jonkler",
    timeAndDate: "2025-02-04 16:02:15",
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    title: 'Mushrooms',
    author: '@silverdalex',
    name: "Jonkler",
    timeAndDate: "2025-02-04 16:02:15",
    rows: 2,
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    title: 'Tomato basil',
    author: '@shelleypauls',
    name: "Jonkler",
    timeAndDate: "2025-02-04 16:02:15",
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    title: 'Sea star',
    author: '@peterlaster',
    name: "Jonkler",
    timeAndDate: "2025-02-04 16:02:15",
  },
  {
    img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
    title: 'Bike',
    author: '@southside_customs',
    cols: 2,
    name: "Jonkler",
    timeAndDate: "2025-02-04 16:02:15",
  },  
];




export default LandingPage;