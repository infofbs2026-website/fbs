import { useLayoutEffect, useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { BackSide, EquirectangularReflectionMapping, Material, Mesh, MeshStandardMaterial, SRGBColorSpace, TextureLoader } from "three";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { AbsoluteFill, Composition, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const FPS = 30;
const FRAMES = 300;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

const Plate: React.FC<{ rear?: boolean }> = ({ rear = false }) => {
  const texture = useLoader(TextureLoader, staticFile("models/plate.svg"));
  texture.colorSpace = SRGBColorSpace;
  return (
    <group position={[0, 0.94, rear ? -2.48 : 2.48]} rotation={[0, rear ? Math.PI : 0, 0]}>
      <mesh>
        <boxGeometry args={[0.76, 0.22, 0.025]} />
        <meshStandardMaterial color="#e8e5db" metalness={0.05} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0, 0.015]}>
        <planeGeometry args={[0.74, 0.2]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </group>
  );
};

const Car: React.FC = () => {
  const gltf = useLoader(GLTFLoader, staticFile("models/car-concept.glb"));
  const scene = useMemo(() => {
    const copy = gltf.scene.clone(true);
    copy.traverse((node) => {
      if (!(node instanceof Mesh)) return;
      node.castShadow = true;
      node.receiveShadow = true;
      const recolor = (source: Material) => {
        const material = source.clone();
        if ((material.name.startsWith("Paint") || material.name === "Panel Sides") && material instanceof MeshStandardMaterial) {
          material.color.set(material.name.includes("Paint 2") ? "#111928" : "#26303d");
          material.map = null;
          material.metalness = 0.18;
          material.roughness = 0.48;
        }
        return material;
      };
      node.material = Array.isArray(node.material)
        ? node.material.map(recolor)
        : recolor(node.material);
    });
    return copy;
  }, [gltf.scene]);

  return (
    <group>
      <primitive object={scene} position={[0, 0.9, 0]} />
      <Plate />
      <Plate rear />
    </group>
  );
};

const CameraRig: React.FC = () => {
  const frame = useCurrentFrame();
  const { camera } = useThree();
  const approach = interpolate(frame, [0, 92], [0, 1], { ...clamp, easing: ease });
  const orbit = interpolate(frame, [92, 258], [0, 1], { ...clamp, easing: ease });
  const settle = interpolate(frame, [258, FRAMES - 1], [0, 1], { ...clamp, easing: ease });
  const theta = -0.65 + 0.65 * approach + (Math.PI + 0.16) * orbit;
  const radius = frame < 92
    ? 6.9 - 3.25 * approach
    : 3.65 + 2.8 * orbit + 0.15 * settle;
  const targetX = interpolate(frame, [225, FRAMES - 1], [0, -1.35], clamp);

  useLayoutEffect(() => {
    camera.position.set(Math.sin(theta) * radius, 2.15 + 0.2 * orbit, Math.cos(theta) * radius);
    camera.lookAt(targetX, 1.25, 0);
    camera.updateProjectionMatrix();
  }, [camera, theta, radius, targetX, orbit]);
  return null;
};

const Studio: React.FC = () => (
  <>
    <StudioEnvironment />
    <color attach="background" args={["#101a31"]} />
    <hemisphereLight args={["#d6e2ff", "#101a31", 1.7]} />
    <directionalLight position={[-5, 8, 6]} intensity={2.8} color="#f5f7ff" castShadow shadow-mapSize={[2048, 2048]} shadow-radius={4} />
    <directionalLight position={[5, 4, -7]} intensity={1.2} color="#d9b87f" />
    <directionalLight position={[1, 3, 8]} intensity={0.9} color="#8ca2ca" />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <meshBasicMaterial color="#0b162c" />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.009, 0]} scale={[1, 0.52, 1]}>
      <circleGeometry args={[2.8, 64]} />
      <meshBasicMaterial color="#02050d" transparent opacity={0.18} depthWrite={false} />
    </mesh>
    <mesh position={[0, 4, 0]}>
      <cylinderGeometry args={[15, 15, 8, 64, 1, true]} />
      <meshStandardMaterial color="#14243e" side={BackSide} roughness={1} />
    </mesh>
    {Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return (
        <mesh key={i} position={[Math.sin(a) * 14.8, 3, Math.cos(a) * 14.8]}>
          <boxGeometry args={[0.055, 6, 0.055]} />
          <meshBasicMaterial color="#d9b87f" />
        </mesh>
      );
    })}
    <Car />
    <CameraRig />
  </>
);

const StudioEnvironment: React.FC = () => {
  const texture = useLoader(RGBELoader, staticFile("models/studio-small-09.hdr"));
  const { scene } = useThree();
  useLayoutEffect(() => {
    texture.mapping = EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.environmentIntensity = 0.38;
    return () => { scene.environment = null; };
  }, [scene, texture]);
  return null;
};

export const CarHero3D: React.FC = () => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#101a31" }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 38, near: 0.1, far: 80, position: [-4, 1.55, 6] }} shadows gl={{ antialias: true, preserveDrawingBuffer: true }}>
        <Studio />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

export const CarHero3DComposition = () => (
  <Composition id="FBSHero3D" component={CarHero3D} durationInFrames={FRAMES} fps={FPS} width={1280} height={720} />
);
