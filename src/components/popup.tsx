import React, { useState, useEffect, useContext } from "react";
import { styled } from '@mui/material/styles';
import { Typography, Stack, Button, Dialog, Select, MenuItem } from "@mui/material";
import "../assets/landingPage.css"
import ClearIcon from '@mui/icons-material/Clear';
// @ts-ignore
import { AuthContext } from "../context/AuthContext.jsx"
import { generateClient } from "aws-amplify/data";
// @ts-ignore
import type { Schema } from "../amplify/data/resource";



const client = generateClient<Schema>();

const Div = styled('div')({
  display: "flex",
  flexWrap: "wrap",
  flexDirection: "column", 
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





  const authContext = useContext(AuthContext);

useEffect(() => {
    const fetchStore = async () => {  
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
        
        // @ts-ignore
        setStoresToSendTo(res.data);
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

       // step 1: filter out non-friends (aka only accept status of accepted)
       const acceptedFriends = idkhomie.filter(
        (friend: any) => friend.statusOfRequest === "ACCEPTED"
      );
    
    

       // take userIDs and filter out yours:
       // @ts-ignore
       const filteredDataPtOne = acceptedFriends.filter(item => item.userID !== authContext.userId);
       const idListPartOne = filteredDataPtOne.map(item => item.userID);


       // take userID2s and filter out yours:
       // @ts-ignore
       const filteredDataPtTwo = acceptedFriends.filter(item => item.userID2 !== authContext.userId); // filter to remove all instances in res.data in js where userID2 == authContext.userId
       const idListPartTwo = filteredDataPtTwo.map(item => item.userID2);


       // COMBO 2 arrays of friends into one
       const tempData = idListPartOne.concat(idListPartTwo); // gives you a single array with all objects from both arrays
       const combinedData = [...new Set(tempData)];

        // @ts-ignore
        let arr = []; 

       // now take friendIDs specifically and fetch all "store" objects that are theirs and SET to setOtherUsersStores
        for (let i = 0; i < combinedData.length; i++) {        
          // Fetch the user's store
          const res = await client.models.Store.list({
            filter: {
              userID: {
                // @ts-ignore
                eq: combinedData[i]
              }
            }
          });
        
        
        
          // Fetch the user's name from the Users model
          const user = await client.models.User.get({
            // @ts-ignore
            id: combinedData[i]
          });
        

          // @ts-ignore
          const userName = user?.data.name && user.data.name.trim() !== "" ? user.data.name : "Unknown User";
        
          // Add the username to each store item
          const storesWithNames = res.data.map((store: any) => ({
            ...store,
            userName: userName
          }));
          
          
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
            // activates another component of another pop up pretty much, "confirmaton.jsx"


      // DELETE
      const deleteObj = {
        id: imgUrlAsID
      }
      await client.models.Storeobject.delete(deleteObj).then(() => {
        handleUpdateClose();
      })
        
    }

    const handleChangeStore = async () => {
          const updateObj = {
            storeID: newStoreID,
            id: imgUrlAsID
          }

      // UPDATE
      await client.models.Storeobject.update(updateObj).then(() => {
        handleUpdateClose();
      })
    }

    const handleClose = () => {
      setPageIndex(0);
      setIsReadyToFetchStores(false);
      setNewStoreID('');
      console.log('', onOpen);
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
