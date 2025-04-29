import React, { useEffect, useContext, useState } from 'react';
import { styled } from '@mui/material/styles';
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions }  from '@mui/material'; // ,InputAdornment, IconButton
import Button from '@mui/material/Button';
import { generateClient } from "aws-amplify/data";
//@ts-ignore
import type { Schema } from "../amplify/data/resource";

// @ts-ignore
import { AuthContext } from "../context/AuthContext.jsx"



const client = generateClient<Schema>();


  const Div = styled('div')({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  })
  
  const MainText = styled('h1')({
  
  })
  
  
const UserSettings: React.FC = () => {

    const [email, setEmail] = useState<string>("");
    const [name, setName] = useState<string>("");


    const [openDialog, setOpenDialog] = useState(false);
    const authContext = useContext(AuthContext);


      useEffect(() => {
        // @ts-ignore
        setName(authContext.name);
        // @ts-ignore
        setEmail(authContext.email)
      }, [authContext]);


      const submitForm = async(e: React.FormEvent) => {
        e.preventDefault();
          // @ts-ignore
          await client.models.User.update({ id: authContext.userId, name }).then((userData) => {
            window.location.reload();
          })
        
      }
 
    return (
    <>
    <Div>
    <MainText>Change your details</MainText>
    </Div>

      <Div>
    <form onSubmit={(e) => submitForm(e)}>
      <Div>
      <TextField
  label="User's Email"
  variant="outlined"
  fullWidth
  margin="normal"
  value={email}
  sx={{
    width: '100%',
    pointerEvents: 'auto',
    cursor: 'not-allowed',
    backgroundColor: '#f5f5f5',
  }}
  InputProps={{
    readOnly: true,
  }}
  onClick={() => setOpenDialog(true)}
/>

          </Div>

      <Div>
            <TextField
              label="User's Name"
              variant="outlined"
              fullWidth
              margin="normal"
            
          value={name}
          sx={{ width: '100%' }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(String(e.target.value))}
            />
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
    </Div>


    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
  <DialogTitle>Heads up!</DialogTitle>
  <DialogContent>
    This field is not moddable yet. It'll be editable in a future update.
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenDialog(false)} color="primary" autoFocus>
      OK
    </Button>
  </DialogActions>
</Dialog>

    </>
    )
}

export default UserSettings;