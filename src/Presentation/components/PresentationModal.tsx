"use client";

import { Dialog, IconButton, Slide, Typography } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import State from "../../stateInterface";
import { toggleModal } from "../actions";
import { TransitionProps } from "@mui/material/transitions";
import PresentationContainer from "./PresentationContainer";
import CloseIcon from "@mui/icons-material/Close";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PresentationModal = () => {
  const open = useSelector((state: State) => state.presentations.isModalOpen);
  const dispatch = useDispatch();

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={() => dispatch(toggleModal(false))}
      slots={{ transition: Transition }}
      sx={{
        "& .MuiPaper-root": {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
        mt: 6,
      }}
    >
      <div
        style={{
          padding: "10px 50px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        }}
      >
        <Typography variant="h6">Presentation Preview</Typography>
        <IconButton
          style={{ padding: 6 }}
          onClick={() => dispatch(toggleModal(false))}
          size="large"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
      <PresentationContainer />
    </Dialog>
  );
};

export default PresentationModal;
