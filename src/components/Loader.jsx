import { Player } from "@lottiefiles/react-lottie-player";
import loaderAnimation from "../assets/loading.json";

export default function Loader() {
  return (
    <div className="h-[100dvh] w-[100dvw] bg-secondary flex justify-center items-center flex-col">
      <Player
        autoplay
        loop
        src={loaderAnimation}
      />
    </div>
  );
}