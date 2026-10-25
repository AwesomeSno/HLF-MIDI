import { Composition } from "remotion";
import { HlfMidi5HourReel } from "./HlfMidi5HourReel";
import { HlfMidi15HourReel } from "./HlfMidi15HourReel";
import { HlfMidiFinalSubmissionReel } from "./HlfMidiFinalSubmissionReel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HlfMidi5HourReel"
        component={HlfMidi5HourReel}
        durationInFrames={1740}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HlfMidi15HourReel"
        component={HlfMidi15HourReel}
        durationInFrames={1770}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HlfMidiFinalSubmissionReel"
        component={HlfMidiFinalSubmissionReel}
        durationInFrames={1740}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
