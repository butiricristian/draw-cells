"use client";

import { AccountCircle, ArrowDropDown } from "@mui/icons-material";
import {
  AppBar,
  Button,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { signOut } from "firebase/auth";
import React, { useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../firebase-config";
import { toggleLoginModalOpen } from "../../Home/reducers";
import State from "../../stateInterface";
import { createNewPresentation } from "../actions";
import { useRouter } from "next/navigation";

const HomeHeader = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state: State) => state.home.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const openLoginModal = () => {
    dispatch(toggleLoginModalOpen(true));
  };

  const handleLogOut = () => {
    signOut(auth);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNewPresentation = () => {
    startTransition(async () => {
      const res = await createNewPresentation({ user });
      if (res) {
        console.log("handleNewPresentation", res);
        router.push(`/presentations/${res.key}`);
      } else {
        console.error("Failed to create new presentation");
      }
    });
  };

  if (!hasMounted) return null;

  return (
    <AppBar position="static" style={{ zIndex: 25 }}>
      <Toolbar
        style={{
          paddingLeft: theme.spacing(7),
          paddingRight: theme.spacing(7),
        }}
      >
        <Stack direction="row" style={{ flexGrow: 1 }} alignItems="center">
          <Typography variant="h6">Draw Cells</Typography>
          {user && (
            <Button color="inherit" onClick={handleNewPresentation}>
              New Presentation
            </Button>
          )}
        </Stack>
        {!user && (
          <Button color="inherit" onClick={openLoginModal}>
            Log in
          </Button>
        )}
        {user && (
          <>
            <Button
              onClick={(e: any) => setAnchorEl(e.currentTarget)}
              sx={{ color: "white" }}
              startIcon={<AccountCircle />}
              endIcon={<ArrowDropDown />}
            >
              {user.displayName}
            </Button>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleLogOut}>Log out</MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default HomeHeader;
