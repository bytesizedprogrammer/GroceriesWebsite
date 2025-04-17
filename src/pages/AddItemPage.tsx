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





const client = generateClient<Schema>();


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
  // Add any other fields your store object might have
}


const AddItemPage: React.FC = () => {
  const [productName, setProductName] = useState<string>("");
  const [quantityOfProduct, setQuantityOfProduct] = useState<number>(1);
  const [storeName, setStoreName] = useState<string>(""); // add to this
  const [open, setOpen] = useState(false);

    const [selectedImage, setSelectedImage] = useState<string>("");
    const [selectedImageTitle, setSelectedImageTitle] = useState<string>("");

    const [storesToSendTo, setStoresToSendTo] = useState<Store[]>([]);


    const [storeID, setStoreID] = useState<string>("");

 // const navigate = useNavigate();
  const authContext = useContext(AuthContext);




 // const user = useAuthenticator();



  const [popupType, setPopupType] = useState<string>("");

  const openWindow = (type: string) => {
    setPopupType(type); // set what the popup is for
    setOpen(true); // open the popup
  };
  

  const handleClose = (type: string, img: string, title: string) => {
    setOpen(false);
    
    if (type == "img") {
    if (img) {
      setSelectedImage(img); // Store received data
      setSelectedImageTitle(title);
      console.log("Received from Dialog:", img, title);
    }} else {
      // store handling
      console.log(`img: ${img}
        type: ${type}
        title: ${title}  
      `);

        if (img == undefined || img == "" || img == "backdropClick") {
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
  }, [client, authContext]);
  

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the first selected file
    if (file) {
      setSelectedImageTitle(file.name); // Set the file name
  
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string); // Set the file content as Base64
      };
      reader.readAsDataURL(file);
    }
  };


  useEffect(() => {
  }, [client])

  // Adds an item
  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault(); 

   // const uuid = crypto.randomUUID();
  
    
    // time, date
  //  const dataForWhoAddedAndWhen = "2025-04-12T18:48:36.649Z";

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

    const createObj = {
      //storeID: { id: storeID },  // Wrapping storeID in an object

      storeID: storeID,

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
          {store.storeName}
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
      onClick={() => openWindow("img")}
      >
       SELECT
    
       
        </Button>

        <Button 
        component="label"
        role={undefined}
        variant="outlined"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
 
        //variant="outlined" 
        //size="medium" 
        sx={{ marginLeft: '20px', marginBottom: '20px', marginTop: '-10px' }}
        
        >
          UPLOAD

          <VisuallyHiddenInput
    type="file"
    //accept="image/*"
    accept=".jpg,.jpeg,.png,.webp" // .gif
    onChange={handleImageChange}
    //multiple
          />
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
