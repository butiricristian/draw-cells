import HomeHeader from "../../Header/components/HomeHeader";
import LoginModal from "./LoginModal";
import PresentationsList from "./PresentationsList";

export default function Home(){
  return (
    <>
      <HomeHeader />
      <LoginModal />
      <PresentationsList />
    </>
  )
}