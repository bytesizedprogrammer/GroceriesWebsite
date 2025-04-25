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

import JohnPork from '../assets/jp.jpeg'

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
    console.log(`Key: ${key}, Delta: ${delta}`);
    
    const fetchObj = { id: key }

    client.models.Storeobject.get(fetchObj).then(async (res) => {
      console.log(res.data);

      let newQuantityOfProduct = Number(res.data.quantityOfProduct) + delta
      console.log("newQuantityOfProduct: ", newQuantityOfProduct);

      if (!(newQuantityOfProduct == 0)) {
      const updateObj = {
        id: key,
        quantityOfProduct: newQuantityOfProduct
      }

      // 1. Update the backend:
      await client.models.Storeobject.update(updateObj).then(res => {
        // 2. Update the UI (myStoreItems state):
        setMyStoreItems((prevItems) => {
        return prevItems.map(storeArray => {
          return storeArray.map((item) => {
          if (item?.id === key) {
            return { ...item, quantityOfProduct: newQuantityOfProduct };
          }
          return item;
          });
        });
       });
      });
    } else {
      // alert you can't reduce further please click on the img and hit complete/finished to delete
    }
    });
  

      /*
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
    */
  };



  const [open, setOpen] = useState(false);


  const [selectedValue, setSelectedValue] = useState(""); // title + store name combined into one variable name
  const [descriptionSetup, setDescriptionSetup] = useState("");


  const [imgUrlAsID, setImgUrlAsID] = useState<string>("");

  const openWindow = (imgUrlAsID: string, productName: string, hardCodedStoreForNowUntilBackendImplemented: string, name: string, timeAndDate: string) => {
    setImgUrlAsID(imgUrlAsID); // <-- this line

    setSelectedValue(`${productName} | ${hardCodedStoreForNowUntilBackendImplemented}`);
    console.log(imgUrlAsID)

    if (timeAndDate === "N/A") {
      setDescriptionSetup("N/A")
    } else {
      const date = timeAndDate.split("T")[0]; // "2025-04-25"
const time24 = timeAndDate.split("T")[1].split("Z")[0]; // "00:08:19.792"

// Convert to 12-hour format
const [hour, minute, second] = time24.split(":");
let hour12 = ((+hour % 12) || 12); // Convert hour to 12-hour format
const ampm = +hour < 12 ? "AM" : "PM";
const time12 = `${hour12}:${minute} ${ampm}`;

console.log("Date:", date);     // "2025-04-25"
console.log("Time:", time12);   // "12:08 AM"
      setDescriptionSetup(`Added by ${name} at ${time12} on ${date}`);
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



  const [myStoreItems, setMyStoreItems] = useState([]);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    // myStoreItems: Part 1, this fetches the stores
    const retrieveYourStores = async() => {
      try {
        const res = await client.models.Store.list({
          filter: {
            userID: {
              // @ts-ignore
              eq: authContext.userId
            }
          }
        })
        
       // console.log("(We're Retrieving your stores) Retrieve Your Groceries Result: ", res);

        // res.data
        retrieveYourStoreObjects(res.data);

      } catch (err) {
        console.error("Error with retrieveYourStores: ", err);
      }
    } 

    // myStoreItems: Part 2, this fetches the objects per store
    const retrieveYourStoreObjects = async(data) => {
      try {
        console.log("retrieveYourStoreObjects: ", data);
        const result = [];
        const storeIDsList = [];

        for (const store of data) {
          const res = await client.models.Storeobject.list({
            filter: {
              storeID: {
                // @ts-ignore
                eq: store.id
              }
            }
          })

          storeIDsList.push(store.id);

          console.log("I hope you fart naked tn: ", store/*, res.data*/);

          console.log(`Res.data: ${res.data.length}`);



          const user = await client.models.User.get({id: store.userID});
          console.log("EDP445: ", user)

          const personsName = user?.data.name || "Unknown vrk";

          const urlPromises = res.data.map(obj =>
            obj.objectImage ? getUrl({ path: obj.objectImage }) : null
            //console.log("For Ringler: ", obj.objectImage)
          )

          const urls = await Promise.all(urlPromises);
          const itemsWithUrls = res.data.map((obj, index) => ({
            ...obj,
            imageUrl: urls[index] ? urls[index].url.toString() : null,
            personsName: personsName
          }))

          console.log(`Items with URLs: ${JSON.stringify(itemsWithUrls)}`)

          if (!(res.data.length == 0)){ 
            //result.push([store.storeName, ...res.data]);
            result.push([store.storeName, ...itemsWithUrls]);
          }


        }

        setMyStoreItems(result);
        setStoreIDs(storeIDsList)

      } catch (err) {
        console.error("Error with retrieveYourStoreObjects: ", err);
      }
    }


    if (client && authContext?.userId) { 
      retrieveYourStores();
      //retrieveYourFriendsGroceries();
    }
  }, [client, authContext, version]);

  useEffect(() => {
    console.log(`Version: ${version}`);
  }, [version]);

  const handleDialogUpdate = () => {
    setVersion(prev => prev + 1); // force refresh
  };


  const [storeIDs, setStoreIDs] = useState([]);

  useEffect(() => {
    console.log(`Test Data: ${storeIDs}`)

    console.log("storeIDs:", storeIDs);
console.log("Type of storeIDs:", typeof storeIDs);
console.log("Is Array?", Array.isArray(storeIDs));
  }, [storeIDs])

  useEffect(() => {
    console.log(`TS PMO: ${storeIDs}`)
    if (storeIDs.length > 0) {

      const handleVersionUpdate = (data: any) => {
        console.log(`Data: ${JSON.stringify(data)}`)
  
        console.log("Tester Data: ", data.storeID)

        console.log(storeIDs.includes(data.storeID))
        // @ts-ignore
        if (storeIDs.includes(data.storeID)) { // instead have an array of all your storeIDs called storeIDs and have this check if the data.storeID is in storeIDs
          // Only update version if the userID matches
          // @ts-ignore
          setVersion((prevVersion) => prevVersion + 1);
        }
      }; // storeIDs
  
      // Subscribe to store object creation events
      // @ts-ignore
      const createSub = client.models.Storeobject.onCreate().subscribe({
        next: handleVersionUpdate,
        // @ts-ignore
        error: (error) => console.warn(error),
      });
  
      // Subscribe to store object update events
      // @ts-ignore
      const updateSub = client.models.Storeobject.onUpdate().subscribe({
        next: handleVersionUpdate,
        // @ts-ignore
        error: (error) => console.warn(error),
      });
  
      // Subscribe to store object deletion events
      // @ts-ignore
      const deleteSub = client.models.Storeobject.onDelete().subscribe({
        next: handleVersionUpdate,
        // @ts-ignore
        error: (error) => console.warn(error),
      });
  
      // Cleanup on unmount
      return () => {
        createSub.unsubscribe();
        updateSub.unsubscribe();
        deleteSub.unsubscribe();
      };
    }
    }, [storeIDs, authContext]);
  
  
  return (
    <>
    <div className='mainContainer'>
        <ImageList 
          sx = {sxStyles}        
        >


{myStoreItems.map((storeArray, idx) => (
  <>
      <ImageListItem key="Subheader" cols={2} 
        sx={{ marginTop: idx > 0 ? '50px' : '0px' }}
      >
        
        <ListSubheader 
        className='Title' component="div">  {storeArray[0]} 
         {/*{clicked[0] ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />} */} 
 
        {/* ACCORDION: Add a little dropdown thingy so you can close the content of that store, add notification number to convey how many unique products are remaining to purchase */} 
        </ListSubheader>
        
        <DynamicDialog 
      selectedValue={selectedValue} 
      description={descriptionSetup}
      open={open} 
      onOpen={() => setOpen(true)} 
      onClose={(asd) => {setOpen(false)
        if (asd == "as") {
          handleDialogUpdate()
        }
      }}
      imgUrlAsID={imgUrlAsID}
    />
      </ImageListItem>
    
      


      {/* Map here will be via objects of array */}
      {storeArray.slice(1).map((item, i) => (
      <ImageListItem key={i}> {/* key={} */}
          <img
            //srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
            //src={`${item.img}?w=248&fit=crop&auto=format`}
            src={item.imageUrl}
            // src={item.objectImage}
            alt={item.objectName}
            loading="lazy"
            onClick={() => openWindow(item.id, item.objectName, storeArray[0], "N/A", "N/A")}
          />
          <ImageListItemBar
            //title={item.title.length > 7 ? `${item.title.slice(0, 5)}...` : item.title}
            title={item.objectName.length > 7 ? `${item.objectName.slice(0, 5)}...` : item.objectName}

            actionIcon={
              <div>
          <IconButton 
            //onClick={() => openWindow(item.img, item.title, "Walmart", item.name, item.timeAndDate)} 
            onClick={() => openWindow(item.id, item.objectName, storeArray[0], item.personsName, item.createdAt)} 
            sx={{ color: 'white' }}
          >
            <InfoIcon />
          </IconButton>
          

              <IconButton 
              onClick={() => handleVote(item.id, 1)} 
              sx={{ color: 'white' }}
              >
                    <ArrowUpwardIcon />
                  </IconButton>
                  <span 
                  style={{ color: 'white', margin: '0 0px' }}
                  >
                   {item.quantityOfProduct}
                  </span>
                  <IconButton 
                  onClick={() => handleVote(item.id, -1)} 
                  sx={{ color: 'white' }}
                  >
                    <ArrowDownwardIcon />
                  </IconButton>
                </div>
              
            }
          />
        </ImageListItem>
         ))}

        </>
      ))}








    </ImageList>
    </div>
    </>
  );
};




export default LandingPage;