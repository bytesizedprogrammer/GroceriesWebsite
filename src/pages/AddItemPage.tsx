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
//import { useAuthenticator } from '@aws-amplify/ui-react'; //useAuthenticator,

// @ts-ignore
import { FileUploader } from '@aws-amplify/ui-react-storage';

//import { ConsoleLogger } from 'aws-amplify/utils';



const client = generateClient<Schema>();

/*
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
*/
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




// TS interface for object strictness
/*
interface Account {
  name: string;
}
*/
// test chars
/*
const accountsToSendTo: Account[] = [
  {
    name: "John Pork"
  },
  {
    name: 'Jonkler'
  }
];
*/
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

  useEffect(() => {
    console.log("as");
  }, [presetOrUploaded]);

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
      console.log("Received from Dialog:", img, title);
    }} else {
      // store creation handling
      console.log(`img: ${img}
        type: ${type}
        title: ${title}  
      `);

        if (img == undefined || img == "" || img.toLowerCase() == "escapekeydown" || img == "backdropClick") {
          console.log("UNDEFINED")
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
    if (client && authContext?.userId) fetchFriends();
  }, [client, authContext]);
  
  useEffect(() => {
    console.log("TS: ", otherUsersStores);
  }, [otherUsersStores])

  





  // Adds an item
  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault(); 

   // const uuid = crypto.randomUUID();

    // time, date
  //  const dataForWhoAddedAndWhen = "2025-04-12T18:48:36.649Z";
    
  /*
  if (!uploadFileName) {
      alert("Please select an image.");
      return;
    }

    const imageUrl = await uploadImageToS3(uploadFileName);
    if (!imageUrl) {
      alert("Image upload failed.");
      return;
    }
    */

    /*
    const createObj = {
      //id: uuid,
      storeID: storeID,
      objectName: productName,
      //objectImage: selectedImage,
      //datetimeObjectWasAdded: ,
      objectImage: "image",
      //datetimeObjectWasAdded: dataForWhoAddedAndWhen,
      quantityOfProduct: quantityOfProduct,
      //addedByWhichUserID: storeID

      /*
      addedByWhichUserID: {
        connect: {
          id: storeID
        }
      }
      
    };
    */
    //console.log("Keys: ", Object.keys(client.models.Object.schema));


    const dataForWhoAddedAndWhen = new Date().toISOString();
    const createObj = {
      //storeID: { id: storeID },  // Wrapping storeID in an object

      storeID: storeID,
      objectName: productName || null,  // Handle optional fields
      objectImage: uploadFileName || null, 
      quantityOfProduct: quantityOfProduct || null,  // Handle optional fields
      datetimeObjectWasAdded: dataForWhoAddedAndWhen || null,
   
      wasImagePresetOrUploaded: presetOrUploaded,

      // @ts-ignore
      userID: authContext.userId
  
  
    /*
      objectName: productName || null,  // Handle optional fields
  objectImage: 'image' || null,     // Handle optional fields
  storeID: storeID || null,         // Handle optional fields
  quantityOfProduct: quantityOfProduct || null,  // Handle optional fields
  datetimeObjectWasAdded: dataForWhoAddedAndWhen || null // Handle optional fields
  */
    }


    console.log('Obj:', createObj);
    console.log("PLEASE GET ME INFO: ", client.models)

// good, js on pause for onw

try {
    client.models.Storeobject.create(createObj).then((res) => { 
      //window.location.reload();
 // Reset the form fields after submission
 setProductName('');
 setQuantityOfProduct(0);
 setStoreName('');
 setSelectedImage('');
 setSelectedImageTitle('');
 console.log("Successfully created object.");
    console.log("✅ Created object successfully:", res);

    }).catch(err => {
      console.error("Error with creating object (in .catch):", err);
    });
  
  } catch (err) {
    console.error("Error with creating object: ", err);
  }


console.log("Created Object we're submitting: ", createObj);
















/*
try {
  const result = await client.models.Object.create(createObj);
  console.log("Created object:", result);

  // Reset the form fields
  setProductName('');
  setQuantityOfProduct(0);
  setStoreName('');
  setSelectedImage('');
  setSelectedImageTitle('');
} catch (err) {
  console.error("Error with creating object (in try/catch):", err);
}
*/

/*
client.models.Object.create({ input: createObj })
  .then((res) => {
    console.log("✅ Created object successfully:", res);
    console.log(client.models.Object);

  })
  .catch((err) => {
    console.error("❌ Error creating object:", err);
  });
*/
  }

  useEffect(() => {
    console.log("Upload File Name Data: ", uploadFileName);
  }, [uploadFileName]);

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
    console.log("InputEL: ", inputEl)
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

 
      <Select displayEmpty sx={{ width: '80%' }}
        value={storeName}

        // @ts-ignore
        onChange={(e: SelectChangeEvent<string>) => {
          const selectedStoreName = e.target.value;
          const selectedStore = storesToSendTo.find(store => store.storeName === selectedStoreName);

    setStoreName(selectedStoreName);
    if (selectedStore) {
      setStoreID(selectedStore.id);
    }
        }}
        >
      <MenuItem value="" disabled>
    Select a store to put this in
  </MenuItem>


  <MenuItem value="myStore"  onClick={() => openWindow("")}>Add new store</MenuItem>
   
  {storesToSendTo.map((store, index) => (
    // @ts-ignore
        <MenuItem key={index} value={store.storeName}>
         {/* // @ts-ignore */}
          {store.storeName} [You]
        </MenuItem>
      ))}


  {otherUsersStores.map((store, index) => (
     // @ts-ignore
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
