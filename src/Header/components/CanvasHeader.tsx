import Close from "@mui/icons-material/Close";
import Edit from "@mui/icons-material/Edit";
import Save from "@mui/icons-material/Save";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { ref, update } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../firebase-config";
import { recomputeFrames, updatePresentationTitle } from "../../Frames/actions";
import { toggleModal } from "../../Presentation/actions";
import State from "../../stateInterface";

// interface HeaderProps {
// }

const CanvasHeader = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const presentationTitle = useSelector((state: State) => state.frames.title);
  const isFramesSaving = useSelector(
    (state: State) => state.frames.isFramesSaving
  );
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(presentationTitle);
  const user = useSelector((state: State) => state.home.user);
  const { id: presentationId } = useParams();

  useEffect(() => {
    setCurrentTitle(presentationTitle);
  }, [presentationTitle]);

  const handleSave = async () => {
    await update(ref(db), {
      [`presentations/${presentationId}/title`]: currentTitle,
      [`/user-presentations/${user.uid}/${presentationId}/title`]: currentTitle,
    });
    dispatch(updatePresentationTitle(currentTitle));
    setIsTitleEditing(false);
  };

  return (
    <AppBar position="static" style={{ zIndex: 25 }}>
      <Toolbar
        style={{
          paddingLeft: theme.spacing(7),
          paddingRight: theme.spacing(7),
        }}
      >
        <Box style={{ flexGrow: 1, display: "flex" }} alignItems="center">
          {isTitleEditing && (
            <>
              <TextField
                value={currentTitle}
                size="small"
                InputProps={{ sx: { bgcolor: "white" } }}
                onChange={(e) => setCurrentTitle(e.target.value)}
              />
              <IconButton
                component="span"
                size="small"
                sx={{ color: "white" }}
                onClick={handleSave}
              >
                <Save sx={{ fontSize: "1.5rem" }} />
              </IconButton>
              <IconButton
                component="span"
                size="small"
                sx={{ color: "white" }}
                onClick={() => setIsTitleEditing(false)}
              >
                <Close sx={{ fontSize: "1.5rem" }} />
              </IconButton>
            </>
          )}
          {!isTitleEditing && (
            <>
              <Typography variant="h6">{presentationTitle}</Typography>
              <IconButton
                component="span"
                size="small"
                sx={{ color: "white" }}
                onClick={() => setIsTitleEditing(true)}
              >
                <Edit sx={{ fontSize: "1rem" }} />
              </IconButton>
            </>
          )}
          <Typography variant="body2" sx={{ ml: 3 }}>
            {isFramesSaving ? "Saving..." : "Up to date"}
          </Typography>
        </Box>
        <Button color="inherit" onClick={() => router.push("/")}>
          HOME
        </Button>
        <Button color="inherit" onClick={() => dispatch(toggleModal(true))}>
          PREVIEW
        </Button>
        <Button color="inherit" onClick={() => dispatch(recomputeFrames())}>
          {" "}
          Recompute Frames{" "}
        </Button>
        <Button
          color="inherit"
          onClick={() => {
            navigator.clipboard.writeText(
              `${window.location.origin}/presentations/${presentationId}/present`
            );
          }}
        >
          Get presentation link
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default CanvasHeader;
