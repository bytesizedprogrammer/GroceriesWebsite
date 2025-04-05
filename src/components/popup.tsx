import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import { Typography, Stack, Button, Dialog } from "@mui/material";
//import Box from '@mui/material/Box';
//import { ThemeProvider } from '@mui/material/styles';
import "../assets/landingPage.css"
import ClearIcon from '@mui/icons-material/Clear';
import { TextField }  from '@mui/material'; // , InputAdornment, IconButton



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
}

const DynamicDialog: React.FC<DynamicDialogProps> = ({ selectedValue, description, open, onOpen, onClose }) => {
  const [storeName, setStoreName] = useState<string>("");
  const [pageIndex, setPageIndex] = useState<number>(0);

    console.log(`
        Selected Value: ${selectedValue},
        Description: ${description},
        open: ${open},
        onOpen: ${onOpen},
        onClose: ${onClose}    
    `);



    const handleBoughtFinished = async () => {
        try {
            // activates another component of another pop up pretty much, "confirmaton.jsx"






            handleClose();
        } catch (err) {

        }
    }

    const handleChangeStore = async () => {
        try {
            // activates another component of another pop up pretty much, "transferStore.jsx"



            handleClose();
        } catch (err) {
            
        }
    }

    const handleClose = () => {
      setPageIndex(0);
      onClose();  
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
            <Button onClick={() => setPageIndex(2)} variant="contained">Change Store</Button>
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
            <TextField
                    label="Store"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                
                sx={{ width: '80%' }} // if big screen, make 60% insetad of 80%
                value={storeName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStoreName(String(e.target.value))}
                  />
              </Div>  
              <Div>
            <Button 
              onClick={() => handleChangeStore()} 
              variant="contained"
              sx={{ width: '50%' }} 
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
