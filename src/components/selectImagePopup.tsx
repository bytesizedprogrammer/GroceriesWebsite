import React, { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import { Typography, Dialog } from "@mui/material"; //  Stack, Button,
//import Box from '@mui/material/Box';
//import { ThemeProvider } from '@mui/material/styles';
import "../assets/landingPage.css"
import ClearIcon from '@mui/icons-material/Clear';
import { TextField }  from '@mui/material'; // , InputAdornment, IconButton
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useMediaQuery, useTheme } from "@mui/material";
//import Autocomplete from '@mui/material/Autocomplete';



const Div = styled('div')({
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column", 
    justifyContent: "center",
    alignItems: "center",
    width: '100%'
})



interface DynamicDialogPropsTwo {
    value: string;

    open: boolean;
    onOpen: () => void;
    onClose: () => void;
    onImageSelect: (image: string) => void;  // New prop to handle image selection
  }

type ImageItem = {
    img: string;
    title: string;
}

type StoreType = {
    title: string;
}


const DynamicDialog: React.FC<DynamicDialogPropsTwo> = ({ value, open, onClose }) => {
    const [imageList, setImageList] = useState<ImageItem[]>(itemData);

    const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
  //const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  const handleSave = (selectedImage: string, selectedImageTitle: string) => {
    // @ts-ignore
    onClose("img", selectedImage, selectedImageTitle); // Send data back, MUI components are weird so "open" can send parent to component, and "close" can send component to parent
  };

  const [storeName, setStoreName] = useState<StoreType[]>();
  const handleStoreSelection = () => {
    // if storeName == a17514d0-089f-48a3-bcb2-03ed82da2e10
    // @ts-ignore
    onClose("store", storeName);
  }

  
  const [searchVal, setSearchVal] = useState<string>("");


  const actuallySearch = () => {
    const filterBySearch = itemData.filter((item) => 
        item.title.toLowerCase().includes(searchVal.toLowerCase())
    );
    
    setImageList(filterBySearch);
  }

  useEffect(() => {
    actuallySearch()
  }, [searchVal])

  


  const sxStyles = {
    width: isSmallScreen ? "100%" : isMediumScreen ? "75%" : "50%",
    height: isSmallScreen ? "100%" : isMediumScreen ? "100%" : "100%",
  };


  

    return (
  <div>
    <Dialog open={open} onClose={onClose}>
      <div className="toprightCorner">
        <ClearIcon className="madeInvisible" />
        <ClearIcon onClick={() => onClose()} />
      </div>

      <div className="mainContainer">
        <Typography variant="h3" sx={{ padding: 2 }}>
          Select an Image
        </Typography>
      </div>

      {value === "img" ? (
        <div className="mainContainer">
          <Typography variant="h3" sx={{ padding: 2 }}>
            <Div>
              <TextField
                label="Search Value"
                variant="outlined"
                fullWidth
                margin="normal"
                sx={{ width: '80%' }}
                value={searchVal}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchVal(e.target.value)}
              />
            </Div>
            <Div>
              <ImageList sx={sxStyles}>
                {imageList.map((item, index) => (
                  <ImageListItem key={`${item.img}${index}`}>
                    <img
                      style={{ cursor: 'pointer' }}
                      srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                      src={`${item.img}?w=248&fit=crop&auto=format`}
                      alt={item.title}
                      loading="lazy"
                      onClick={() => {
                        handleSave(item.img, item.title);
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Div>
          </Typography>
        </div>
      ) : (
        <div className="mainContainer">
         <input 
  type="text" 
  // @ts-ignore
  value={storeName}
  // @ts-ignore 
  onChange={(e) => setStoreName(e.target.value)} 
/>

          <button onClick={() => handleStoreSelection()}> ASD </button>
        </div>
      )}
    </Dialog>
  </div>
);

};


const itemData: ImageItem[] = [
    {
        img: "https://pkbnews.in/wp-content/uploads/2023/03/John-Pork-3-1024x576.jpg",
        title: "John Pork"
    },
    {
        img: "https://images.genius.com/04ba40d8d0dd062d1563cb4d7dda52d6.640x640x1.jpg",
        title: "Skibidi John Pork"
    },
    {
        img: "https://i.kym-cdn.com/editorials/icons/mobile/000/009/963/evil_jonkler.jpg",
        title: "Jonkler"
    },
    {
        img: "https://th.bing.com/th/id/OIP.41jrdBtE0V4_LvI-GIPyZgHaIQ?rs=1&pid=ImgDetMain",
        title: "Yap Dollar"
    },
    {
        img: "https://i.kym-cdn.com/entries/icons/mobile/000/046/965/rizzler.jpg",
        title: "Rizzler"
    }
];

export default DynamicDialog;