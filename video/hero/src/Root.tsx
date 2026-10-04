import "./index.css";
import { MyComposition } from "./Composition";
import { CarHero3DComposition } from "./CarHero3D";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <CarHero3DComposition />
    </>
  );
};
