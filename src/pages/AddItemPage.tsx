import React, { useEffect, useContext, useState } from 'react';
//import { useNavigate } from 'react-router-dom';
// @ts-ignore
import { AuthContext } from "../context/AuthContext.jsx"
import { styled } from '@mui/material/styles';
import { TextField }  from '@mui/material'; // ,InputAdornment, IconButton
import Button from '@mui/material/Button';
//import { ArrowDropUp, ArrowDropDown } from "@mui/icons-material";
import { Select, MenuItem } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { TbHandFinger } from "react-icons/tb";

import Popup from "../components/selectImagePopup.tsx";

import { generateClient } from "aws-amplify/data";
// @ts-ignore
import type { Schema } from "../amplify/data/resource";

// @ts-ignore
import { FileUploader } from '@aws-amplify/ui-react-storage';




const client = generateClient<Schema>();


const Div = styled('div')({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
})

const MainText = styled('h1')({

})

const SubText = styled('h3')({
  fontWeight: '300', // or do 400
  fontStyle: 'italic'
})





interface Store {
  id: string;
  storeName: string;
  userName: string;
}


const AddItemPage: React.FC = () => {
  const [uploadFileName, setUploadFilename] = useState(null);


  const [productName, setProductName] = useState<string>("");
  const [quantityOfProduct, setQuantityOfProduct] = useState<number>(1);
  const [storeName, setStoreName] = useState<string>(""); // add to this
  const [open, setOpen] = useState(false);

    const [selectedImage, setSelectedImage] = useState<string>("");
    const [selectedImageTitle, setSelectedImageTitle] = useState<string>("");

    const [storesToSendTo, setStoresToSendTo] = useState<Store[]>([]);
    const [otherUsersStores, setOtherUsersStores] = useState<Store[]>([]);


    const [storeID, setStoreID] = useState<string>("");

 // const navigate = useNavigate();
  const authContext = useContext(AuthContext);




 // const user = useAuthenticator();


  const [popupType, setPopupType] = useState<string>("");

  const openWindow = (type: string) => {
    setPopupType(type); // set what the popup is for
    setOpen(true); // open the popup
  };
  
  const [presetOrUploaded, setPresetOrUploaded] = useState("");



  const [refreshIfNeeded, setRefreshIfNeeded] = useState(false);

  const handleClose = (type: string, img: string, title: string) => {
    setOpen(false);
    
    if (type == "img") {
    if (img) {
      setSelectedImage(img); // Store received data
      setSelectedImageTitle(title);

      // @ts-ignore
      setUploadFilename(img);
      setRefreshIfNeeded(true);
      setPresetOrUploaded("preset");
    }} else {
      // store creation handling

        if (img == undefined || img == "" || img.toLowerCase() == "escapekeydown" || img == "backdropClick") {
          console.log("")
        } else {
          const uuid = crypto.randomUUID();

      const createObj = { 
        id: uuid,
        storeName: img,
        // @ts-ignore
        userID: authContext.userId
      }

     
      // have API create store
      client.models.Store.create(createObj).then(() => {
      // @ts-ignore
      setStoresToSendTo([...storesToSendTo, createObj]);
      setStoreName(img);
      });         
    }

      
      
      
    }
  }


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
    if (client && authContext?.userId) fetchStore();




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
    if (client && authContext?.userId) fetchFriends();
  }, [client, authContext]);
  


  





  // Adds an item
  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault(); 

   

    const dataForWhoAddedAndWhen = new Date().toISOString();
    const createObj = {

      storeID: storeID,
      objectName: productName || null,  // Handle optional fields
      objectImage: uploadFileName || null, 
      quantityOfProduct: quantityOfProduct || null,  // Handle optional fields
      datetimeObjectWasAdded: dataForWhoAddedAndWhen || null,
   
      wasImagePresetOrUploaded: presetOrUploaded,

      // @ts-ignore
      userID: authContext.userId
  
    }


    client.models.Storeobject.create(createObj).then(() => { 
      //window.location.reload();
 // Reset the form fields after submission
 setProductName('');
 setQuantityOfProduct(0);
 setStoreName('');
 setSelectedImage('');
 setSelectedImageTitle('');
    })
  }

  

  const processFile = (file: File) => {
  const reader = new FileReader();
  reader.onload = () => {
    setSelectedImage(reader.result as string); // Set the file content as Base64
  };
  reader.readAsDataURL(file);
  setPresetOrUploaded("uploaded")
  };
 
  
  const [inputEl, setInputEl] = useState(null);
  
  useEffect(() => {
    
  }, [inputEl]);

  return (
    <>
    <Div>
    <MainText>Add New Item</MainText>
    </Div>

    <Popup 
      //selectedValue={selectedValue} 
      //description={descriptionSetup}
      open={open} 
      onOpen={() => setOpen(true)} 
      //onClose={() => setOpen(false)}

      // @ts-ignore
      onClose={handleClose}
      value={popupType}
    />

    <form onSubmit={submitForm}>
	<Div>
      <TextField
        label="Product Name"
        variant="outlined"
        fullWidth
        margin="normal"
      
		value={productName}
		sx={{ width: '80%' }}
		onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProductName(String(e.target.value))}
    
      />
	  </Div>
	  <Div>

     
      <TextField
      label="Quantity"
      type="number"
      variant="outlined"
      fullWidth
      margin="normal"
      sx={{ width: "80%" }}
      value={quantityOfProduct}
      inputProps={{ min: 1 }}  // Correct way to set min value in MUI's Textfield, like normal input with min={1}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantityOfProduct(Number(e.target.value))} 
      />
	  </Div>


    {/* Make conditional to do either new store or dropdown of stores you've already done */}
	  <Div>

 
    <Select
  displayEmpty
  sx={{ width: '80%' }}
  value={storeName}
  // @ts-ignore
  onChange={(e: SelectChangeEvent<string>) => {
    const selectedStoreName = e.target.value;
    
    // Find the selected store in storesToSendTo first
    const selectedStore = storesToSendTo.find(store => store.storeName === selectedStoreName) ||
                          otherUsersStores.find(store => store.storeName === selectedStoreName);

    console.log("POLS: ", selectedStoreName, selectedStore, selectedStore?.id);
    
    setStoreName(selectedStoreName);
    
    if (selectedStore) {
      // Use selectedStore.id if it exists
      setStoreID(selectedStore.id);
    } else {
      // Handle case where store is not found
      console.error("Store not found");
    }
  }}
>
  <MenuItem value="" disabled>
    Select a store to put this in
  </MenuItem>

  <MenuItem value="myStore" onClick={() => openWindow("")}>
    Add new store
  </MenuItem>

  {storesToSendTo.map((store, index) => (
    <MenuItem key={index} value={store.storeName}>
      {store.storeName} [You]
    </MenuItem>
  ))}

  {otherUsersStores.map((store, index) => (
    <MenuItem key={index} value={store.storeName}>
      {store.storeName} [{store.userName}]
    </MenuItem>
  ))}
</Select>

	  </Div>



    <Div>
        <SubText sx={{ marginTop: '10px' }}>Select an image from our preset choices or upload your own!</SubText>
      </Div>
    <Div>
      {/* Select Image */}
      
      <Button variant="outlined" size="medium" sx={{ marginRight: '20px', marginBottom: '20px', marginTop: '-10px'  }} startIcon={<TbHandFinger />}
      //onClick={() => openWindow("img")}
      
      onClick={() => {
        if (refreshIfNeeded === true) {
          // add localstorage stuff to hold data so it gets auto filled upon refresh

          window.location.reload();
        } else {
          // Do something else or nothing
          openWindow("img");
        }
      }}
      >
       SELECT
    
       
        </Button>



      {/** here.bak was here originally */}

<Button 
  component="label"
  role={undefined}
  variant="outlined"
  tabIndex={-1}
  startIcon={<CloudUploadIcon />}
  sx={{ marginLeft: '20px', marginBottom: '20px', marginTop: '-10px' }}
>
  UPLOAD
  
  {/* Use a wrapper with visibility:hidden instead of display:none */}
  <div style={{ visibility: 'hidden', position: 'absolute', width: '1px', height: '1px', overflow: 'hidden' }}>
    <FileUploader
      acceptedFileTypes={['image/*']}
      path="pictures/"
      maxFileCount={1}
      isResumable
      ref={(ref) => {
        // Access internal <input type="file" /> and trigger it
        
        // @ts-ignore
        if (ref?.inputElement) setInputEl(ref.inputElement);
      }}
      processFile={({ key, file }) => { 
        console.log("Processing file with key:", key);
        setRefreshIfNeeded(true);
        setSelectedImageTitle(file.name);
        processFile(file)
        // Return the processed file data
        // @ts-ignore
        return {
          // @ts-ignore
          key: `${authContext.userId}-${key}`,
          file,
        };
      }}
      onUploadSuccess={({ key }) => {
        console.log("Upload success with key:", key);
        if (key) {
          // @ts-ignore
          setUploadFilename(key);
          // You might want to create and set a URL for the image here
          // to display the uploaded image in your UI
        }
      }}
      onUploadError={(error) => {
        console.error("Upload error:", error);
      }}
      // @ts-ignore
      variation="drop" // hides default UI
    />
  </div>
</Button>
       
	  </Div>

    {(selectedImageTitle != '' && selectedImageTitle != 'backdropClick' && selectedImageTitle != 'escapeKeyDown') && ( // prevents bug that makes it so when you press these keys/do these actions it makes the img become the key/action
<>
    <Div sx={{ marginBottom: '-10px' }}>
      <h3>Selected Image: {selectedImageTitle}</h3>
    </Div>
    <Div sx={{ marginBottom: '20px' }}>
     <img style={{ width: '50%' }} src={selectedImage} alt={selectedImageTitle} />
    </Div>
    </>
    )}
   
      
	  <Div>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        sx={{ marginTop: '15px' }}
      >
        Submit
      </Button>
	  </Div>
    </form>    
    </>
  );
};

export default AddItemPage;
