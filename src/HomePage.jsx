import React, { useState } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import {CssBaseline,Toolbar,Divider, Typography,List, Box, TextField, ListItem, IconButton, ListItemButton, CircularProgress, ListItemText, Grid, Alert } from '@mui/material';
import { Add, Drafts, Menu, ChevronLeft, ChevronRight } from '@mui/icons-material';
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import { Link } from 'react-router-dom';
import { styled, useTheme } from "@mui/material/styles";
const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: "hidden"
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open"
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open"
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme)
  })
}));

const HomePage1 = () => {
  const apiHost = 'https://www.alphavantage.co/query'
  const apikey = 'GBG51R2OD1EAMI8V'
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState(false)
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState('');

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSearch = debounce(async (searchTerm) => {
    setLoad(true)
    const data = await axios.get(apiHost + '?function=SYMBOL_SEARCH' + '&keywords=' + searchTerm + '&apikey=' + apikey)
    setSearchResults(data?.data?.bestMatches);
    setLoad(false)
  }, 500);

  const addToWatchlist = async (stock) => {
    setLoad(true)
    const res = await axios.get(apiHost + '?function=GLOBAL_QUOTE' + '&symbol=' + stock['1. symbol'] + '&apikey=' + apikey)
    setLoad(false)
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    let newStock = { ...stock, price: res?.data['Global Quote']['05. price'] }
    watchlist.push(newStock)

    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    setAlert(true)
    setAlertContent('Successfully Added')
    setTimeout(() => {
      console.log(alert)
      setAlert(false);
    }, 2000)
  };


  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" })
              }}
            >
              <Menu />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRight />
              ) : (
                <ChevronLeft />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List sx={{ textAlign: 'center' }}>
            <Link to={'/watchlist'} style={{ textDecoration: 'none' }}>
              <Drafts />
              <Typography component={'p'} sx={{ textAlign: 'center', fontSize: '12px' }}>WatchList</Typography>
            </Link>
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <Grid container spacing={2}>
            <Grid item xs={3}></Grid>
            <Grid item xs={3}>
              {alert && <Alert severity='success'>{alertContent}</Alert>}
              <Box >
                <TextField
                  type="text"
                  placeholder="Search for a company"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleSearch(e.target.value);
                  }}
                />
                {load && <CircularProgress sx={{ marginLeft: '1rem' }} color="secondary" />}
                <List sx={{ width: '100%', maxWidth: 220, bgcolor: 'background.paper' }}>
                  {!load && searchResults?.length > 0 && searchResults?.map((result, i) => (
                    <ListItem
                      key={i}
                      disablePadding
                      secondaryAction={
                        <IconButton edge="end" onClick={() => addToWatchlist(result)}>
                          <Add />
                        </IconButton>
                      }
                    >
                      <ListItemButton role={undefined} dense>
                        <ListItemText primary={result['1. symbol']} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default HomePage1;
