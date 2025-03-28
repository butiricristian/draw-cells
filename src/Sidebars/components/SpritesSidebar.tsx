import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SidebarSprite from "../../Sprites/SidebarSprite";
import State from "../../stateInterface";
import { loadBackgrounds, toggleSprites } from "../actions";
import BaseSidebar from "./BaseSidebar";
import { SPRITE_TO_SVG_ELEMENT_MAP } from "../../constants";
import {
  Accordion,
  AccordionSummary,
  Box,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { setCurrentFrameBackground } from "../../Frames/actions";
import { getDownloadURL, ref as storageRef, list } from "firebase/storage";
import { storage } from "../../firebase-config";
import InfiniteScroll from "react-infinite-scroll-component";

const SPRITES_LIST = Object.keys(SPRITE_TO_SVG_ELEMENT_MAP);

export default function SpritesSidebar() {
  const dispatch = useDispatch();
  const isSpritesSidebarOpen = useSelector(
    (state: State) => state.sidebars.isSpritesOpen
  );
  const backgrounds = useSelector((state: State) => state.sidebars.backgrounds);

  const pageTokens = useRef<(string | undefined)[]>([]);
  const [page, setPage] = useState<number>(0);

  const handleFrameBackground = (background: string) => {
    dispatch(setCurrentFrameBackground(background));
  };

  useEffect(() => {
    if (!isSpritesSidebarOpen || backgrounds.hasEnded) return;

    const getBg = async () => {
      const currentToken = pageTokens.current?.shift();
      const imageRefs = await list(storageRef(storage, "backgrounds"), {
        maxResults: 10,
        pageToken: currentToken,
      });
      pageTokens.current?.push(imageRefs.nextPageToken);
      const images = await Promise.all<any>(
        imageRefs.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return url;
        })
      );
      dispatch(
        loadBackgrounds({
          backgrounds: images,
          hasEnded: !pageTokens.current[0],
        })
      );
    };

    getBg();
  }, [isSpritesSidebarOpen, dispatch, page]);

  const handleNext = () => {
    setPage(page + 1);
  };

  return (
    <>
      <BaseSidebar
        isOpen={isSpritesSidebarOpen}
        toggleOpen={() => dispatch(toggleSprites())}
        iconRenderer={() =>
          isSpritesSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />
        }
        anchor="left"
      >
        <Accordion
          elevation={0}
          sx={{
            width: "100%",
            boxShadow: "none",
            "&.MuiPaper-rounded": { borderRadius: 0 },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Sprites
          </AccordionSummary>
          <Box
            sx={{
              height: "100%",
              width: "100%",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              alignItems: "center",
              maxHeight: "calc(80vh)",
              overflowY: "auto",
            }}
          >
            {SPRITES_LIST.map((s, i) => (
              <SidebarSprite key={`sprite-${i}`} backgroundUrl={s} name={s} />
            ))}
          </Box>
        </Accordion>
        <Accordion
          elevation={0}
          sx={{
            width: "100%",
            boxShadow: "none",
            "&.MuiPaper-rounded": { borderRadius: 0 },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Background Images
          </AccordionSummary>
          <InfiniteScroll
            dataLength={backgrounds.list.length} //This is important field to render the next data
            next={handleNext}
            hasMore={!backgrounds?.hasEnded}
            loader={<CircularProgress />}
            height={500}
          >
            <Box
              sx={{
                height: "100%",
                width: "100%",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              {backgrounds?.list?.map((bg: any, index: number) => (
                <div
                  key={`bg-image-${index}`}
                  onClick={() => handleFrameBackground(bg)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <img src={bg} alt={bg} style={{ width: "90%" }} />
                </div>
              ))}
            </Box>
          </InfiniteScroll>
        </Accordion>
      </BaseSidebar>
    </>
  );
}
