import CancelIcon from "@mui/icons-material/Cancel";
import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import State from "../../stateInterface";
import { removeFrameById, setCurrentFrame } from "../actions";

interface FrameProps {
  title: string;
  id: string | number | null;
  preview?: any;
}

const Frame = ({ title, id, preview }: FrameProps) => {
  const dispatch = useDispatch();
  const currentFrame = useSelector((state: State) => state.frames.currentFrame);

  const removeFrame = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeFrameById({ id }));
  };

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: id === currentFrame.id ? "primary.main" : "grey.300",
        height: "100%",
        width: "233px",
      }}
      onClick={() => dispatch(setCurrentFrame(id))}
    >
      <Typography variant="body2" color="textSecondary">
        {" "}
        {title}{" "}
      </Typography>
      <div
        style={{
          width: "100%",
          height: "calc(100% - 20px)",
          overflow: "hidden",
          backgroundImage: `url(${preview})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {/* {preview && <img src={ preview } alt="Frame Preview" style={{width: '100%'}}/>} */}
      </div>
      <IconButton
        onClick={removeFrame}
        sx={{
          position: "absolute",
          top: -8,
          right: 0,
          color: "error.main",
          bgcolor: "white",
          padding: 0.5,
        }}
        size="large"
      >
        <CancelIcon />
      </IconButton>
    </Box>
  );
};

export default Frame;
