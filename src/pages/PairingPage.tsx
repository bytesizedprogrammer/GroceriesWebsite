import React, { useContext, useState, useEffect } from 'react';
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

// @ts-ignore
import { AuthContext } from "../context/AuthContext.jsx"

import { generateClient } from "aws-amplify/data";
// @ts-ignore
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();


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
  createdAt: string;
  id: string;
  otherUserName: string;
  statusOfRequest: string;
  updatedAt: string;
  userID: string;
  userID2: string;
  userIDOne: any;
  userIDTwo: any;
}


const authContext = useContext(AuthContext);

  const [alignment, setAlignment] = useState<string>('Pair Accounts');

  // @ts-ignore
  const [pairKeyPrivate, setPairKeyPrivate] = useState<string>('');
  const [enterKey, setEnterKey] = useState<string>(""); // 84182438-a0c1-7093-4d36-02724f0160f0   efstathiosplakas@gmail.com

  const [incomingRequests, setIncomingRequests] = useState<AccountStuff[]>([]);
  const [outGoingRequests, setOutGoingRequests] = useState<AccountStuff[]>([]);
  const [accountsSyncedToPartOne, setAccountsSynctedToPartOne] = useState<AccountStuff[]>([]);
  const [accountsSyncedToPartTwo, setAccountsSynctedToPartTwo] = useState<AccountStuff[]>([]);

  const [gotRejectedBy, setGotRejectedBy] = useState<AccountStuff[]>([]); // outgoing
  const [rejectedPeople, setRejectedPeople] = useState<AccountStuff[]>([]); // incoming


  useEffect(() => {
    // @ts-ignore
    setPairKeyPrivate(authContext.userId);
  }, [authContext]);

  

  const [fetchedData, setFetchedData] = useState(false);

  useEffect(() => {
    console.log(client.models.FriendsList);
  }, [client, authContext]);

  useEffect(() => {
    /*
    const fetchUserName = async (id: string) => {
      try {
//        const userRes = await client.models.Users.get({ id });
await client.models.User.get({ id }).then(userRes => {
  console.log("uh")

  // @ts-ignore
  console.log("Copemaxxing: ", userRes.data.name);

    // @ts-ignore
    return userRes.data.name?.trim() ? userRes.data.name : "Unknown User";
});


      
      } catch (err) {
        console.error("Error fetching user name:", err);
        return "Unknown User";
      }
    };
    */

    const fetchUserName = async (id: string) => {
      try {
        const userRes = await client.models.User.get({ id });
        // @ts-ignore
        console.log("Copemaxxing: ", userRes.data.name);
    
        // @ts-ignore
        return userRes.data.name?.trim() ? userRes.data.name : "Unknown User";
      } catch (err) {
        console.error("Error fetching user name:", err);
        return "Unknown User";
      }
    };
    

    const fetchOutgoingRequests = async() => {
      try {
        const res = await client.models.FriendsList.list({
          filter: {
            userID: {
              // @ts-ignore
              eq: authContext.userId
            }
          }
        });

        const enricheda = await Promise.all(
          res.data.map(async (request) => {
            const otherUserId = request.userID2;
            console.log(`PLEASEEEE: ${JSON.stringify(request)}`)
            const name = await fetchUserName(otherUserId);
            console.log("NAME: ", name);
            return { ...request, otherUserName: name };
          })
        );


        //console.log("Test outgoing: ", res.data);
        

        const friendrequests = enricheda.filter(req => req.statusOfRequest === "PENDING");
        const friends = enricheda.filter(req => req.statusOfRequest === "ACCEPTED");
        const rejections = enricheda.filter(req => req.statusOfRequest !== "PENDING" && req.statusOfRequest !== "ACCEPTED");

        console.log("Fetch Outgoing: ", enricheda);

        // @ts-ignore
        setOutGoingRequests(friendrequests); // pending outgoing
        // @ts-ignore
        setAccountsSynctedToPartTwo(friends); // friends
        console.log("Outgoing friends: ", friends);
        // @ts-ignore
        setGotRejectedBy(rejections); // rejected


      } catch (err) {
        console.error("Error with fetchOutgoingRequests: ", err);
      }
    }


    const fetchIncomingRequests = async() => {
      try {
        const res = await client.models.FriendsList.list({
          filter: {
            userID2: {
              // @ts-ignore
              eq: authContext.userId
            }
          }
        });

        
        const enriched = await Promise.all(
          res.data.map(async (request) => {
            const otherUserId = request.userID;
            const name = await fetchUserName(otherUserId);
            console.log(`NAMEEE: ${name}`);
            return { ...request, otherUserName: name };
          })
        );

        const friendrequests = enriched.filter(req => req.statusOfRequest === "PENDING");
        const friends = enriched.filter(req => req.statusOfRequest === "ACCEPTED");
        const rejections = enriched.filter(req => req.statusOfRequest !== "PENDING" && req.statusOfRequest !== "ACCEPTED");

        console.log("Fetch Incoming Requests: ", enriched);

        // @ts-ignore
        setIncomingRequests(friendrequests); // pending incoming
        // @ts-ignore
        setAccountsSynctedToPartOne(friends); // friends
        console.log("Incoming friends: ", friends);
        // @ts-ignore
        setRejectedPeople(rejections); // rejections
        

        /*
        const enriched = Promise.all(
          res.data.map((request) => {
            const otherUserId = request.userID;
            return fetchUserName(otherUserId).then((name) => {
              console.log("NAME: ", name);

              return { ...request, otherUserName: name };
            });
          })
        ).then((enriched) => {
          const friendrequests = enriched.filter(req => req.statusOfRequest === "PENDING");
          const friends = enriched.filter(req => req.statusOfRequest === "ACCEPTED");
          const rejections = enriched.filter(req => req.statusOfRequest !== "PENDING" && req.statusOfRequest !== "ACCEPTED");
        
          console.log("Fetch Incoming Requests: ", enriched);
        
          // @ts-ignore
          setIncomingRequests(friendrequests); // pending incoming
          // @ts-ignore
          setAccountsSynctedToPartOne(friends); // friends
          console.log("Incoming friends: ", friends);
          console.log("Incoming retard test: ", enriched);
          // @ts-ignore
          setRejectedPeople([...rejectedPeople, rejections]); // rejections
        });
        */
      } catch (err) {
        console.error("Error with fetchIncomingRequests: ", err);
      }
    }
    /*
const res = await client.models.Store.list({
          filter: {
            userID: {
              // @ts-ignore
              eq: authContext.userId
            }
          }
        });
    */

  // @ts-ignore
  if (client && authContext?.userId && fetchedData == false) { 
    fetchIncomingRequests();
    fetchOutgoingRequests();
    //setFetchedData(true);
    console.log("get mogged")
  }
  }, [client, authContext])



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


useEffect(() => {
  console.log(`Ts pmo icl sybau: ${JSON.stringify(accountsSyncedToPartOne)}`);
}, [accountsSyncedToPartOne])


// @ts-ignore
const handleFriendRequest = async(status, id) => {
  console.log("Status: ", status);
  console.log("ID in db: ", id);

  client.models.FriendsList.update({ id: id, statusOfRequest: status }).then((res) => { 
    console.log("✅ Updated FRIENDLIST successfully:", res);
  }).catch(err => {
    console.error("Error with handleFriendRequest: ", err)
  })
}

// @ts-ignore
const handleDeleteFriend = async(id) => {
//  console.log("This one is for tren baby: ", id)
    // @ts-ignore
   client.models.FriendsList.delete({ id: id }).then((res) => { console.log("Success"); window.location.reload()  }).catch(err => { console.error("Error with deleting friend moment: ", err) })
}


const sendRequest =  async(/*newRequest: string*/) => {
    //let newAccount = createAccountStuff(newRequest);
    
    const createObj = {
      // @ts-ignore
      userID: authContext.userId,
      userID2: enterKey,
      statusOfRequest: "PENDING"
    }
    // enterKey


    try {
    client.models.FriendsList.create(createObj).then((res) => { 
      console.log("✅ Created FRIENDLIST successfully:", res);
    setEnterKey("");


    // refresh window




    // @ts-ignore
   //setOutGoingRequests((prevRequests) => [...prevRequests, newAccount]);
    }).catch(err => {
      console.error("Error with response for creating friendslist: ", err);
    })  
  } catch (err) {
    console.error("Error calling client.models.FriendsList.create: ", err);
  }
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
      <ToggleButton value="View rejections">Rejections</ToggleButton>
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
        <Grid>
          <Item sx={{ height: '45px' }}>{user.otherUserName}</Item>
        </Grid>
        <Grid >
          <Item><CheckIcon onClick={() => handleFriendRequest("ACCEPTED", user.id)}/></Item>
        </Grid>
        <Grid >
          <Item><ClearIcon onClick={() => handleFriendRequest("REJECTED", user.id)}/></Item>
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
              <Grid >
                <Item>{user.otherUserName}</Item>
              </Grid>
              ))}
              
            </Grid>
            </Div>
      </Div>
)}

{alignment === "View rejections" && (
  <Div>

    {/* Incoming Rejections */}
    <h1>People who rejected you</h1>
    {gotRejectedBy.map((account) => (
       <SpecialDiv key={account.id}>
       {/* left div here, 80% width, contains input */}
       
         <Div>
         <TextField
                 //label="Store"
                 variant="outlined"
                 fullWidth
                 margin="normal"
                 value={account.otherUserName}
                 disabled
                 
                 sx={{ width: '80%' }} // if big screen, make 60% insetad of 80%
                 InputProps={{
                   sx: { input: { textAlign: 'center' } }, // Center the text inside the TextField
               }}
                 //   sx={{ width: { xs: '80%', md: '60%' } }} // 80% on small screens, 60% on big screens
                 
             //onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStoreName(String(e.target.value))}
               />
               

               
               </Div>
       {/* right div here, 20% width, contains trash icon */}
      
     </SpecialDiv>
    ))}

{/* Out going rejections */}
<h1>People you've rejected</h1>
    
    {rejectedPeople.map((account) => (
       <SpecialDiv key={account.id}>
       {/* left div here, 80% width, contains input */}
       <LeftDiv>
         <Div>
         <TextField
                 //label="Store"
                 variant="outlined"
                 fullWidth
                 margin="normal"
                 value={account.otherUserName}
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
                     onClick={() => handleDeleteFriend(account.id)}

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
)} {/* gotRejectedBy */}


{alignment === "View who you're paired with" && (
      <Div>
        {/* Render view-specific content here */}
        

        {accountsSyncedToPartOne.map((account) => (
        <SpecialDiv key={account.id}>
          {/* left div here, 80% width, contains input */}
          <LeftDiv>
            <Div>
            <TextField
                    //label="Store"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={account.otherUserName}
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
            onClick={() => handleDeleteFriend(account.id)}

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









{accountsSyncedToPartTwo.map((account) => (
        <SpecialDiv key={account.id}>
          {/* left div here, 80% width, contains input */}
          <LeftDiv>
            <Div>
            <TextField
                    //label="Store"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={account.otherUserName}
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
            onClick={() => handleDeleteFriend(account.id)}
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



