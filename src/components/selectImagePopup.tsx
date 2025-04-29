import React, { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import { Typography, Dialog } from "@mui/material"; 
import "../assets/landingPage.css"
import ClearIcon from '@mui/icons-material/Clear';
import { TextField }  from '@mui/material'; 
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useMediaQuery, useTheme } from "@mui/material";



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

      {value === "img" ? (
      <div className="mainContainer">
        <Typography variant="h3" sx={{ padding: 2 }}>
          Select an Image
        </Typography>
      </div>
      ) : (
        <div className="mainContainer">
        <Typography variant="h3" sx={{ padding: 2 }}>
          Add a store
        </Typography>
      </div>
      )}

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

          <button onClick={() => handleStoreSelection()}> Submit </button>
        </div>
      )}
    </Dialog>
  </div>
);

};


const itemData: ImageItem[] = [
    {
      img: "https://1000logos.net/wp-content/uploads/2024/04/Question-Mark-Emojis.png",
      title: "Unknown"
    },
    {
      img: "https://chicagosteakguy.com/cdn/shop/products/AdobeStock_83103702_530x@2x.jpg?v=1595704519",
      title: "Chicken Breast"
    },
    {
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkLjKE7xkwFc1a22-lyLr25AdLM2rB_DiyGA&s',
      title: 'Chicken Thighs'    
    },
    {
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUxoCwJAxHiSwUyYd_a2oWBJkmTerZl3Wh5w&s",
      title: "Chicken Drumsticks"
    },
    {
      img: "https://kochfoods.com/wp-content/uploads/2023/01/GCP-5583173719162880.jpg",
      title: "Chicken Leg Quarters"
    },
    {
      img: "https://mbnz-off-media.s3.ap-southeast-2.amazonaws.com/wp-content/uploads/sites/12/2022/01/16174635/iStock-618209540_SML-scaled-1.jpg",
      title: "Chicken Nuggets"
    },
    //{
    //  img: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQssMrd3rLXTUYAx81lfGh7nbPVnRGYskXd9bbVmJu5i07oAQ7Jx6VaJF_0en0qlSWCYzhmJ4dXIjLhSh_5RUGPRg",
    //  title: "Broccoli"
    //},
    //{
    //  img: "data:image/webp;base64,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",
    //  title: "Carrots"
    //},
    //{
    //  img: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS7jZfyY9HwBG8jcFY9r6V2ujM4sjmHLQglhx3SJeqtsX7DahvywCuHyKGTl-B4mMWUa4nZUD4ELdiBjOfe_X7Fur5KIMdvDlkepD_l2UA",
    //  title: "Baby Carrots"
    //},
    //{
    //  img: "https://www.taylorfarms.com/wp-content/uploads/2023/10/Romaine-Leaves.jpg",
    //  title: "Romaine Lettuce"
    //},
    {
      img: "https://cdn11.bigcommerce.com/s-kc25pb94dz/images/stencil/1280x1280/products/178/590/Grape_Tomatoes__36197.1587762647.jpg?c=2",
      title: "Grape Tomatoes"
    },
    //{
    //  img: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ7UH64K2_JbWj--JEDbWcTUfrwSvo7Xuk1tm4NYExO2VhZTWm8Qs1YdW1IctLimuJqONWxfLEUk3IIrtluNW1nDg",
    //  title: "Tomatoes"
    //},
    {
      img: "https://images.immediate.co.uk/production/volatile/sites/30/2019/08/Onion-72ea178.jpg",
      title: "Onions"
    }
];

export default DynamicDialog;