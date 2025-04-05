import React, { useState } from 'react';
//import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Stack } from "@mui/material"; // Typography, Button, Dialog
import { TextField, InputAdornment, IconButton }  from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
//import InputAdornment from '@mui/material/InputAdornment';
//import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';
//import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Paper from '@mui/material/Paper';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

const Div = styled('div')({
  display: "flex",
  flexWrap: "wrap",
  flexDirection: "column", // Ensure vertical stacking
  justifyContent: "center",
  alignItems: "center",
  width: '100%'
})

const SpecialDiv = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center', /* Aligns items vertically */
  width: '90%', /* Ensures full width */
  padding: '8px',
  //border: '1px solid #ccc' 
})

const LeftDiv = styled('div')({
  display: "flex",
  width: '80%'
})

const RightDiv = styled('div')({
  display: "flex",
  width: '20%',
})

const MainText = styled('h1')({
  textAlign: 'center'
})

const SubText = styled('h3')({
  textAlign: 'center'
})

const PairingPage: React.FC = () => {
// TS garbage for object strictness
interface AccountStuff {
  email: string;
}

// sample data in place of API
const accountsSyncedTo: AccountStuff[] = [
{
  email: 'email@email.com'
},
{
  email: 'test@test.com'
},
{
  email: 'other@other.com'
},
]


const outGoingRequestsA: AccountStuff[] = [
{
  email: 'email@email.com'
},
{
  email: 'test@test.com'
},
{
  email: 'other@other.com'
},
]

const incomingRequests: AccountStuff[] = [
{
  email: 'email@email.com'
},
{
  email: 'test@test.com'
},
{
  email: 'other@other.com'
},
]


  const [alignment, setAlignment] = useState<string>('Pair Accounts');

  // @ts-ignore
  const [pairKeyPrivate, setPairKeyPrivate] = useState<string>('fakePairKey');
  const [enterKey, setEnterKey] = useState<string>("");

  const handleChange = (
    // @ts-ignore
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null, // handle null case
  ) => {
    if (newAlignment !== null) { // Prevent deselection
      setAlignment(newAlignment);
    }
  };


  
const [showPassword, setShowPassword] = React.useState(false);

const handleClickShowPassword = () => setShowPassword((show) => !show);
const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
};

const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
};



//const [userEmail, setUserEmail] = useState<string>("email@email.com");

const [outGoingRequests, setOutGoingRequests] = useState<AccountStuff[]>(outGoingRequestsA);

// to convert a string into AccountStuff since
function createAccountStuff(email: string): AccountStuff { // : AccountStuff This specifies that the function must return an AccountStuff object.
  return { email }; // essentially equivalent to JSON.stringify body of "email": email
}


const sendRequest =  (/*newRequest: string*/) => {
    //let newAccount = createAccountStuff(newRequest);
    let newAccount = createAccountStuff(enterKey);
    setEnterKey("");
    setOutGoingRequests((prevRequests) => [...prevRequests, newAccount]);  
}  

  return (
    <div style={{ marginTop: '25px' }} className="mainContainer">
      
      <Div>
      <MainText> {alignment} </MainText>
      <ToggleButtonGroup
      sx={{ marginBottom: '40px' }}
      color="primary"
      value={alignment}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
    >
      <ToggleButton value="Pair Accounts">Pair</ToggleButton>
      <ToggleButton value="Pending Requests">Requests</ToggleButton>
      <ToggleButton value="View who you're paired with">View</ToggleButton>
    </ToggleButtonGroup>

    {/*
    </Div>
    <Div>
    */}

{alignment === 'Pair Accounts' && (
      <Stack direction="column" spacing={2} sx={{ marginBottom: "20px" }}>
            <SubText>Your Private Key</SubText>
            <FormControl 
            //sx={{ m: 1, width: '25ch' }} 
            variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            disabled
            value={pairKeyPrivate}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>


        <SubText>Enter Private Key to get access to another User's objects:</SubText>
        <FormControl 
            //sx={{ m: 1, width: '25ch' }} 
            variant="outlined">
          <InputLabel htmlFor="outlined-adornment-passwordTwo">Enter Key:</InputLabel>
          <OutlinedInput
            id="outlined-adornment-passwordTwo"
            //type={showPassword ? 'text' : 'password'}
            //disabled
            value={enterKey}
            onChange={(e) => setEnterKey(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton 
                onClick={() => sendRequest()}
                edge="end">
                  <ArrowForwardIosIcon />
                </IconButton>
              </InputAdornment>
            }
            /*
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
              */
            label="Password"
          />

</FormControl>



            {/*<Button onClick={() => } variant="contained">Change Store</Button>*/}
        </Stack>
        
  )}





{alignment === 'Pending Requests' && (
      <Div>
        <SubText> Incoming Requests </SubText>
          {/* MAP ME: Grid of 3 things per row regardless of screen size */}
          

          {incomingRequests.map((user) => (
          <Div sx={{ width: '90%' }}>
          <Grid container spacing={3} sx={{ p: 2 }}>
        <Grid item xs={8}>
          <Item sx={{ height: '45px' }}>{user.email}</Item>
        </Grid>
        <Grid item xs>
          <Item><CheckIcon/></Item>
        </Grid>
        <Grid item xs>
          <Item><ClearIcon/></Item>
        </Grid>
      </Grid>
          </Div>
              ))}



        <SubText> Outgoing Requests </SubText>
          {/* Grid of 2-4 things per row dependeng on screen size */}
            {/* MAP Grid Content */}
            <Div sx={{ width: '90%' }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>

              
              {outGoingRequests.map((user) => (
              <Grid item xs={6}>
                <Item>{user.email}</Item>
              </Grid>
              ))}
              
            </Grid>
            </Div>
      </Div>
)}




{alignment === "View who you're paired with" && (
      <Div>
        {/* Render view-specific content here */}
        

        {accountsSyncedTo.map((account) => (
        <SpecialDiv>
          {/* left div here, 80% width, contains input */}
          <LeftDiv>
            <Div>
            <TextField
                    //label="Store"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={account.email}
                    disabled
                    
                    sx={{ width: '80%' }} // if big screen, make 60% insetad of 80%
                    InputProps={{
                      sx: { input: { textAlign: 'center' } }, // Center the text inside the TextField
                  }}
                    //   sx={{ width: { xs: '80%', md: '60%' } }} // 80% on small screens, 60% on big screens
                    
                //onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStoreName(String(e.target.value))}
                  />
                  
                  </Div>
          </LeftDiv>
          {/* right div here, 20% width, contains trash icon */}
          <RightDiv>
            <DeleteIcon 
            // for hover affect 
            /*
            function updateClassById(id, newClass) {
    items.forEach(item => {
        if (item.id === id) {
            item.class = newClass;
        }
    });
          }
            */


            //sx={{ fontSize: 'large' }} // make me bigger pls
            />
          </RightDiv>
        </SpecialDiv>
    ))}

        

      </Div>
)}

</Div>
    </div>
  );
};

export default PairingPage;



