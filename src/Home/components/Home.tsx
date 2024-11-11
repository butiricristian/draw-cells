"use client"

import { useSelector } from "react-redux";
import HomeHeader from "../../Header/components/HomeHeader";
import State from "../../stateInterface";
import Landing from "./Landing";
import LoginModal from "./LoginModal";
import PresentationsList from "./PresentationsList";

export default function Home(){
  const user = useSelector((state: State) => state.home.user)

  return (
    <>
      <HomeHeader />
      <LoginModal />
      {user && <PresentationsList />}
      {!user && <Landing />}
    </>
  )
}
