import React, { useState, useEffect, useContext } from "react";
import { styled } from '@mui/material/styles';
import { Typography, Stack, Button, Dialog, Select, MenuItem } from "@mui/material";
//import Box from '@mui/material/Box';
//import { ThemeProvider } from '@mui/material/styles';
import "../assets/landingPage.css"
import ClearIcon from '@mui/icons-material/Clear';
//import { TextField }  from '@mui/material'; // , InputAdornment, IconButton
// @ts-ignore
import { AuthContext } from "../context/AuthContext.jsx"
import { generateClient } from "aws-amplify/data";
// @ts-ignore
import type { Schema } from "../amplify/data/resource";



const client = generateClient<Schema>();

const Div = styled('div')({
  display: "flex",
  flexWrap: "wrap",
  flexDirection: "column", // Ensure vertical stacking
  justifyContent: "center",
  alignItems: "center",
  width: '100%'
})

interface DynamicDialogProps {
  selectedValue: string; // title of product + store it's from
  description: string; // Added by ${name} (Sean) at ${time }(11AM) on ${date} (2/1/2025) OR if N/A, then render 3 buttons insetad
  

  // add here things like `userID`, `productID`, `store`

    

  open: boolean;
  onOpen: () => void;
  onClose: () => void;



  imgUrlAsID: string; // <- add this
  onUpdate?: () => void; // 👈 Add this

}
interface Store {
  id: string;
  storeName: string;
  userName: string;
}


const DynamicDialog: React.FC<DynamicDialogProps> = ({ selectedValue, description, open, onOpen, onClose, imgUrlAsID }) => {
  const [newStoreID, setNewStoreID] = useState<string>("");
  const [pageIndex, setPageIndex] = useState<number>(0);

  const [isReadyToFetchStores, setIsReadyToFetchStores] = useState(false);

    const [storesToSendTo, setStoresToSendTo] = useState<Store[]>([]);
    const [otherUsersStores, setOtherUsersStores] = useState<Store[]>([]);


  /*
    console.log(`
        Selected Value: ${selectedValue},
        Description: ${description},
        open: ${open},
        onOpen: ${onOpen},
        onClose: ${onClose},
        imgUrlAsID: ${imgUrlAsID}    
    `);
  */


  const authContext = useContext(AuthContext);

useEffect(() => {
    const fetchStore = async () => {
      // @ts-ignore
      console.log("AUTH: ", authContext.userId);
  
      try {
        // @ts-ignore
        const res = await client.models.Store.list({
          filter: {
            userID: {
              // @ts-ignore
              eq: authContext.userId
            }
          }
        });
  
        // @ts-ignore
        const storeData = res?.[0] ?? null;
        console.log("Store Data:", storeData);
        console.log("Res: ", res);




        // add on: 
          //setStoresToSendTo(prev => [...prev, ...res.data]);

        // replaces

        
        // @ts-ignore
        setStoresToSendTo(res.data);
      
      } catch (err) {
        console.error("Error fetching store:", err);
      }
    };
  

    // @ts-ignore
    if (client && authContext?.userId && isReadyToFetchStores == true) fetchStore();




    // Fetch friends, then fetch their stores:
    const fetchFriends = async () => {
      const res = await client.models.FriendsList.list({
        filter: {
          or: [
            {
              userID: {
                // @ts-ignore
                eq: authContext.userId
              }
            },
            {
              userID2: {
                // @ts-ignore
                eq: authContext.userId
              }
            }
          ]
        }
      });

       // @ts-ignore
       const idkhomie = res.data
       console.log("Fetch Amigos: ", idkhomie);

       // step 1: filter out non-friends (aka only accept status of accepted)
       const acceptedFriends = idkhomie.filter(
        (friend: any) => friend.statusOfRequest === "ACCEPTED"
      );
    
      console.log("Accepted Amigos: ", acceptedFriends);
    

       // take userIDs and filter out yours:
       // @ts-ignore
       const filteredDataPtOne = acceptedFriends.filter(item => item.userID !== authContext.userId);
       const idListPartOne = filteredDataPtOne.map(item => item.userID);


       // take userID2s and filter out yours:
       // @ts-ignore
       const filteredDataPtTwo = acceptedFriends.filter(item => item.userID2 !== authContext.userId); // filter to remove all instances in res.data in js where userID2 == authContext.userId
       const idListPartTwo = filteredDataPtTwo.map(item => item.userID2);

       console.log("ID LIST PART ONE: ", idListPartOne);
       console.log("ID LIST PART TWO: ", idListPartTwo);

      //console.log("Filtered Data Part One: ", filteredDataPtOne);
      //console.log("Filtered Data Part Two: ", filteredDataPtTwo);


       // COMBO 2 arrays of friends into one
       const tempData = idListPartOne.concat(idListPartTwo); // gives you a single array with all objects from both arrays
       const combinedData = [...new Set(tempData)];
       console.log("Combined Data: ", combinedData);

        // @ts-ignore
        let arr = []; 

       // now take friendIDs specifically and fetch all "store" objects that are theirs and SET to setOtherUsersStores
        
       /* OLD CODE, good but lacks names
        for (let i = 0; i < combinedData.length; i++) {
          console.log("Dont Test Me! ", combinedData[i])


          // take the store content here below, but WE NEED TO ADD name from "acceptedAmigos" that matches the correct ID so that when we render everything we can have the name of the profile's owner to indicate whose store you'd put it in.

          const res = await client.models.Store.list({
            filter: {
              userID: {
                // @ts-ignore
                eq: combinedData[i]
              }
            }
          });
          console.log("PLS WORK ASASSDADSAD: ", res);

          // res is the data back
          // @ts-ignore
          arr = arr.concat(res.data); 
        }
        */
        for (let i = 0; i < combinedData.length; i++) {
          console.log("Dont Test Me! ", combinedData[i]);
        
          // Fetch the user's store
          const res = await client.models.Store.list({
            filter: {
              userID: {
                // @ts-ignore
                eq: combinedData[i]
              }
            }
          });
        
          console.log("PLS WORK ASASSDADSAD: ", res);
        
        
          // Fetch the user's name from the Users model
          const user = await client.models.User.get({
            // @ts-ignore
            id: combinedData[i]
          });
        
          // @ts-ignore
          console.log("CHECK USER DATA: ", user.data.name);

          // @ts-ignore
          const userName = user?.data.name && user.data.name.trim() !== "" ? user.data.name : "Unknown User";
        
          // Add the username to each store item
          const storesWithNames = res.data.map((store: any) => ({
            ...store,
            userName: userName
          }));
          
          console.log(`Stores With Names: ${JSON.stringify(storesWithNames)}`);
          
          // Add to the final array
          // @ts-ignore
          arr = arr.concat(storesWithNames);
        
        }

        // @ts-ignore
        setOtherUsersStores(arr);
    }



    // @ts-ignore
    if (client && authContext?.userId && isReadyToFetchStores == true) fetchFriends();
  }, [client, authContext, isReadyToFetchStores]);



    const handleBoughtFinished = async () => {
        try {
            // activates another component of another pop up pretty much, "confirmaton.jsx"
      console.log(`Image URL ID: ${imgUrlAsID}`); // objID


      // DELETE
      const deleteObj = {
        id: imgUrlAsID
      }
      await client.models.Storeobject.delete(deleteObj).then(res => {
        console.log(`✅ Deleted Storeobject: ${res.data}`)
        handleUpdateClose();
      })
        } catch (err) {
          console.error("Error with handleBoughtFinished: ", err);
        }
    }

    const handleChangeStore = async () => {
        try {

          console.log(`Transaction Finished for Store: ${newStoreID}`); // newStoreID
          console.log(`Image URL ID: ${imgUrlAsID}`); // objID

          const updateObj = {
            storeID: newStoreID,
            id: imgUrlAsID
          }

      // UPDATE
      await client.models.Storeobject.update(updateObj).then(res => {
        console.log(`✅ Updated Storeobject: ${res.data}`)
        handleUpdateClose();
      })

        } catch (err) {
          console.error("Error with handleChangeStore: ", err);

        }
    }

    const handleClose = () => {
      setPageIndex(0);
      setIsReadyToFetchStores(false);
      setNewStoreID('');
      console.log('on open: ', onOpen);
      onClose();  
    }

    const handleUpdateClose = () => {
      setPageIndex(0);
      setIsReadyToFetchStores(false);
      setNewStoreID('');
      // @ts-ignore
      onClose('as');  
    }

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <div className="toprightCorner">
            <ClearIcon className="madeInvisible" />
            <ClearIcon onClick={() => handleClose()} />
        </div>
        <div className="mainContainer">
        <Typography variant="h3" sx={{ padding: 2 }}>
         {selectedValue}
        </Typography>
        </div>

        
  

<div className="mainContainer">
  {description === "N/A" ? (
    <>

      {pageIndex === 0 ? (
        <div className="mainContainer">
        <Stack direction="column" spacing={2} sx={{ marginBottom: "20px" }}>
            <Button onClick={() => setPageIndex(1)} variant="contained">Bought/Finished</Button>
            <Button onClick={() => {setPageIndex(2) 
              setIsReadyToFetchStores(true) }} variant="contained">Change Store</Button>
            <Button onClick={() => handleClose()} variant="outlined" >Cancel</Button>
        </Stack>
        </div>
        ) : pageIndex === 1 ? (
          <> 
          <div className="mainContainer">
          <Stack direction="column" spacing={2} sx={{ marginBottom: "20px" }}>
          <Div>
            <h1>Are you sure you want to go through?  Once done, this cannot be undone</h1>
            </Div> 
            <Div>
            <Button 
              onClick={() => handleBoughtFinished()} 
              variant="contained"
              sx={{ width: '50%' }}
              >Confirm</Button>
              </Div>  
              <Div>
            <Button 
              onClick={() => handleClose()} 
              variant="outlined"
              sx={{ width: '50%' }} 
              >Cancel</Button>
            </Div>
          </Stack>
          </div>
          </>
      ) : (
        <>
        <div className="mainContainer">
          <Stack direction="column" spacing={2} sx={{ marginBottom: "20px" }}>
          <Div>
            <h1>Input which store you'd like to transfer this over to</h1>
            </Div> 
            <Div>

            {/*
            <TextField
                    label="Store"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                
                sx={{ width: '80%' }} // if big screen, make 60% insetad of 80%
                value={newStoreID}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewStoreID(String(e.target.value))}
                  />
              */} 
 <Select displayEmpty sx={{ width: '80%' }}
value={newStoreID}

// @ts-ignore
onChange={(e: SelectChangeEvent<string>) => {
  const selectedStoreName = e.target.value;
  console.log(`Selected Store Name: ${selectedStoreName}`)
  setNewStoreID(selectedStoreName)
}}
>
<MenuItem value="" disabled>
    Select a store to put this in
  </MenuItem>


   
  {storesToSendTo.map((store, index) => (
    // @ts-ignore
        <MenuItem key={index} value={store.id}>
         {/* // @ts-ignore */}
          {store.storeName} [You]
        </MenuItem>
      ))}


  {otherUsersStores.map((store, index) => (
     // @ts-ignore
     <MenuItem key={index} value={store.id}>
      {store.storeName} [{store.userName}]
    </MenuItem>
  ))}

</Select>

              </Div>  
              <Div>
            <Button 
              onClick={() => handleChangeStore()} 
              variant="contained"
              sx={{ width: '50%',
                    opacity: newStoreID === "" ? 0.5 : 1,
                    cursor: newStoreID === "" ? "not-allowed" : "pointer"
               }} 
              disabled={newStoreID === ""}
              >DONE</Button>
            </Div>
          </Stack>
          </div>
        </>
      )}
    </>
  ) : (
    <>
    <div className="mainContainerTwo">
     <Typography variant="h6" sx={{ padding: 2 }}> {description} </Typography>


    <Button 
                variant="outlined"
                //color="secondary"
                onClick={() => handleClose()}
                sx={{ marginTop: 1, marginBottom: 2 }}
            >
                Cancel
            </Button>
    </div>
    </>
  )}
</div>
      </Dialog>
    </div>
  );
};

export default DynamicDialog;
