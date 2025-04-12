import React, { useState } from 'react';
import { AppBar, Box, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { useNavigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';


const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  let navigate = useNavigate();
  const { signOut } = useAuthenticator(); // Get signOut function from Amplify

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (param: string) => {
    setAnchorEl(null);

    console.log(param)


    if (param == 'goHome') {
      navigate('/')
    } else if (!(param == '')) {
    navigate(`/${param}`);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ height: '10vh' }}>
        <Toolbar sx={{ height: '100%' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {/* Logo or Title Here */}
          </Typography>
          <IconButton onClick={handleClick} color="inherit">
            <SettingsOutlinedIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => handleClose('')}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={() => handleClose("goHome")}>Go Home</MenuItem>
            <MenuItem onClick={() => handleClose("addItem")}>Add Item to List</MenuItem>
            <MenuItem onClick={() => handleClose("pairing")}>Pair Another User</MenuItem>

            <MenuItem onClick={() => handleClose("usersettings")}>User Settings</MenuItem>
            <MenuItem onClick={signOut}>Sign Out</MenuItem> {/* Added Sign Out */}
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;