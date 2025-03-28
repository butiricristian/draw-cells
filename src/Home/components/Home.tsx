"use client";

import { useDispatch, useSelector } from "react-redux";
import HomeHeader from "../../Header/components/HomeHeader";
import State from "../../stateInterface";
import Landing from "./Landing";
import LoginModal from "./LoginModal";
import PresentationsList from "./PresentationsList";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase-config";
import { setUser } from "../reducers";

export default function Home() {
  const dispatch = useDispatch();

  onAuthStateChanged(auth, (userParam) => {
    if (!userParam) {
      dispatch(setUser(null));
      return;
    }

    dispatch(
      setUser({
        uid: userParam?.uid,
        displayName: userParam?.displayName,
        email: userParam?.email,
      })
    );
  });

  return (
    <>
      <HomeHeader />
      <LoginModal />
      <PresentationsList />
      <Landing />
    </>
  );
}
