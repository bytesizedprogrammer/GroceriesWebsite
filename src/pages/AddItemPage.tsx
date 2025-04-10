import React, { useEffect, useState } from 'react';
//import { Link } from 'react-router-dom';
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
import { useAuthenticator } from '@aws-amplify/ui-react'; //useAuthenticator,


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




// TS garbage for object strictness
interface Account {
  name: string;
}

const accountsToSendTo: Account[] = [
  {
    name: "John Pork"
  },
  {
    name: 'Jonkler'
  }
];



const AddItemPage: React.FC = () => {
  const [productName, setProductName] = useState<string>("");
  const [quantityOfProduct, setQuantityOfProduct] = useState<number>(1);
  const [storeName, setStoreName] = useState<string>("");
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [open, setOpen] = useState(false);

    const [selectedImage, setSelectedImage] = useState<string>("");
    const [selectedImageTitle, setSelectedImageTitle] = useState<string>("");

    const [storesToSendTo, setStoresToSendTo] = useState([]);

  useEffect(() => {
    console.log(`
      VALUES:
       - productName: ${productName}
       - quantityOfProduct: ${quantityOfProduct} 
       - storeName: ${storeName}
       - selectedAccount: ${selectedAccount}
    `);
  }, [productName, quantityOfProduct, storeName, selectedAccount]);



  const user = useAuthenticator();

  useEffect(() => {  
    /*
    client.models.User.get({ id: user.user.userId }).then((userData) => {
      //console.log("Word", userData)
      console.log('test: ', userData.data);
      if (!(userData.data)) {
        client.models.User.create(createObj).then(() => {});
      }
    })
    */
  }, []);
  

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
      console.log(`img: ${img}`);

      const obj = { storeName: img }


      // have API create store
        //client.models.Store


      /* 
      fetch newest object created assuming create worked

      this sets it to list of store names 
      and setsstorename to new one
      
      // @ts-ignore
      setStoresToSendTo([...storesToSendTo, obj]);
      setStoreName(img);
      */
    }
  }

  
  const authContext = { userID: "54182438-10a1-70ec-b8c7-4b7ddd628241" }
  // first needs auth context before i can do this actually
  useEffect(() => {
    client.models.User.get({ id: authContext.userID }).then((userData) => {
      console.log("USERDATA FETCHED FOR SAKE OF ADD NEW ITEM: ", userData)
    });
  }, []);

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


  // Adds an item
  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault(); 

    const uuid = crypto.randomUUID();


    console.log("Ts pmo icl sybau: ", client.models.Object)
  

    const createObj = {
      id: uuid,
    };

    /*
    console.log('Product Name:', productName);
    console.log('Quantity:', quantityOfProduct);
    console.log('Store Name: ', storeName);

    // Reset the form fields after submission
    setProductName('');
    setQuantityOfProduct(0);
    setStoreName('');
    setSelectedAccount('');
    setSelectedImage('');
    setSelectedImageTitle('');
    */
  }

/*
  useEffect(async() => {
    const { data: items } = await client.models.Item.list({
      select: ["productName", "quantity", "store"],
    });
    console.log(items); // Returns only requested fields
  }, [])
  */
  
  
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

      {/*
      <TextField
        label="Store"
        variant="outlined"
        fullWidth
        margin="normal"
		
    sx={{ width: '80%' }} // if big screen, make 60% insetad of 80%
		value={storeName}
		onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStoreName(String(e.target.value))}
      />
      */}

      <Select displayEmpty sx={{ width: '80%' }}
        value={storeName}

        // @ts-ignore
        onChange={(e: SelectChangeEvent<string>) => setStoreName(e.target.value)}
        >
      <MenuItem value="" disabled>
    Select a store to put this in
  </MenuItem>


  <MenuItem value="myStore"  onClick={() => openWindow("")}>Add new store</MenuItem>
   
  {storesToSendTo.map((store, index) => (
        <MenuItem key={index} value={store.storeName}>
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
      {/* Which Account to send to? */}
      <Select displayEmpty sx={{ width: '80%' }}
        value={selectedAccount}

        // @ts-ignore
        onChange={(e: SelectChangeEvent<string>) => setSelectedAccount(e.target.value)}
        >
      <MenuItem value="" disabled>
    Select an account to send this to
  </MenuItem>
  
  {accountsToSendTo.map((account, index) => (
        <MenuItem key={index} value={account.name}>
          {account.name}
        </MenuItem>
      ))}

<MenuItem value="myAccount">My account</MenuItem>


</Select>
	  </Div>
      
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
