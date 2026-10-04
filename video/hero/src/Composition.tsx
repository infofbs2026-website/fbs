import { AbsoluteFill, Composition, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";

const DURATION = 360;
const eased = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const shots = [
  { file: "opening.png", enter: [0, 1], exit: [83, 101], motion: [0, 101], zoom: [1, 1.075], pan: [0, -38] },
  { file: "front-plate.png", enter: [83, 101], exit: [152, 170], motion: [83, 170], zoom: [1.02, 1.09], pan: [0, 0] },
  { file: "side.png", enter: [152, 170], exit: [218, 236], motion: [152, 236], zoom: [1.075, 1.025], pan: [-34, 0] },
  { file: "rear.png", enter: [218, 236], exit: null, motion: [218, DURATION], zoom: [1.045, 1], pan: [15, 0] },
] as const;

const Shot: React.FC<{ shot: (typeof shots)[number]; frame: number }> = ({ shot, frame }) => {
  const opacity = interpolate(frame, shot.enter, [0, 1], clamp) *
    (shot.exit ? interpolate(frame, shot.exit, [1, 0], clamp) : 1);

  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity }}>
      <Img
        src={staticFile(`frames/${shot.file}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: interpolate(frame, shot.motion, shot.zoom, { ...clamp, easing: eased }),
          translate: `${interpolate(frame, shot.motion, shot.pan, { ...clamp, easing: eased })}px 0px`,
          filter: "brightness(1.06) contrast(1.02) saturate(0.92)",
        }}
      />
    </AbsoluteFill>
  );
};

const Copy: React.FC<{ frame: number }> = ({ frame }) => {
  const reveal = (start: number, length: number) => interpolate(frame, [start, start + length], [0, 1], { ...clamp, easing: eased });
  const title = reveal(255, 26);
  const description = reveal(270, 27);
  const buttons = reveal(290, 29);

  return (
    <AbsoluteFill dir="rtl">
      <AbsoluteFill style={{
        background: "linear-gradient(270deg, rgba(13,24,47,.9) 0%, rgba(13,24,47,.55) 32%, transparent 64%)",
        opacity: title,
      }} />
      <div style={{ position: "absolute", right: 126, top: 284, width: 660, color: "#fff", textAlign: "right", fontFamily: "Noto Arabic, Arial, sans-serif" }}>
        <div style={{ color: "#D9B87F", fontSize: 25, fontWeight: 700, opacity: title }}>فارس بن سعود للوحات المميزة</div>
        <h1 style={{ fontSize: 78, lineHeight: 1.2, fontWeight: 750, margin: "22px 0 20px", opacity: title, translate: `0 ${interpolate(frame, [255, 281], [28, 0], { ...clamp, easing: eased })}px` }}>
          لوحتك المميزة<br />تبدأ من هنا
        </h1>
        <p style={{ fontSize: 31, lineHeight: 1.7, fontWeight: 500, color: "#e4e7ee", margin: "0 0 42px", opacity: description }}>
          اكتشف اللوحات المميزة ومزاداتها في مكان واحد.
        </p>
        <div style={{ display: "flex", gap: 18, opacity: buttons, translate: `0 ${interpolate(frame, [290, 319], [20, 0], { ...clamp, easing: eased })}px` }}>
          <div style={{ background: "#D9B87F", color: "#1A2541", borderRadius: 12, padding: "17px 33px", fontSize: 28, fontWeight: 750 }}>استكشف المزادات</div>
          <div style={{ border: "2px solid #D9B87F", borderRadius: 12, padding: "15px 31px", fontSize: 28, fontWeight: 700 }}>اعرض لوحتك</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const HeroVideo: React.FC<{ showCopy: boolean }> = ({ showCopy }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#1A2541" }}>
      {shots.map((shot) => <Shot key={shot.file} shot={shot} frame={frame} />)}
      {showCopy && <Copy frame={frame} />}
    </AbsoluteFill>
  );
};

export const MyComposition = () => (
  <>
    <Composition id="FBSHeroPreview" component={HeroVideo} defaultProps={{ showCopy: true }} durationInFrames={DURATION} fps={30} width={1920} height={1080} />
    <Composition id="FBSHeroBackground" component={HeroVideo} defaultProps={{ showCopy: false }} durationInFrames={DURATION} fps={30} width={1920} height={1080} />
  </>
);
