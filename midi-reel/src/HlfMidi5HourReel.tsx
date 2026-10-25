import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
  Audio,
  staticFile,
  Sequence,
} from "remotion";

// ─── Apple Minimal Design Tokens ───
const THEME = {
  bg: "#000000",
  surfaceCard: "rgba(255, 255, 255, 0.04)",
  surfaceCardBorder: "rgba(255, 255, 255, 0.12)",
  surfacePill: "rgba(18, 18, 20, 0.85)",
  surfacePillBorder: "rgba(255, 255, 255, 0.15)",
  textPrimary: "#f5f5f7",
  textSecondary: "#86868b",
  accentGold: "#f5a623",
  accentAmber: "#ff9500",
  accentGreen: "#30d158",
  accentCyan: "#00f0ff",
};

const FONT_FAMILY =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif";

// ─── Subtitle Timestamps (Exact from Edge-TTS 5h audio) ───
const SUBTITLES = [
  { start: 2, end: 32, text: "Hey everyone!" },
  { start: 32, end: 149, text: "Quick update on HLF-MIDI for Hack Club's Half Life." },
  {
    start: 149,
    end: 279,
    text: "I just wrapped up the first 5 hours of engineering, and here is how it's shaping up.",
  },
  {
    start: 279,
    end: 638,
    text: "I started by ditching bulky mechanical key switches for solid-state capacitive touch pads etched directly onto the PCB, dropping the desk profile to just 1.6 millimeters.",
  },
  {
    start: 638,
    end: 889,
    text: "For the brain, I chose an ESP32-S3 for its hardware touch peripheral and native USB-MIDI support.",
  },
  {
    start: 889,
    end: 1251,
    text: "I modeled the touch physics, keeping the ground plane two millimeters away to preserve sensitivity, and added an EC11 rotary knob for filter cutoff and a slide fader for pitch bend.",
  },
  {
    start: 1251,
    end: 1472,
    text: "Finally, I completed the KiCad power delivery schematic with USB-C and a clean 3.3-volt regulator.",
  },
  {
    start: 1472,
    end: 1606,
    text: "Next up: routing the board and exporting fabrication files.",
  },
  {
    start: 1606,
    end: 1675,
    text: "Thanks for watching, see you in the next one!",
  },
];

// ─── Overhead Studio Lighting ───
const StudioStageLight: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: -200,
        left: "50%",
        transform: "translateX(-50%)",
        width: 1000,
        height: 800,
        background:
          "radial-gradient(circle, rgba(245, 166, 35, 0.08) 0%, rgba(255, 255, 255, 0.02) 45%, transparent 75%)",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
};

// ─── Dynamic Island Top Pill ───
const DynamicIslandHeader: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 120 },
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 64,
        left: "50%",
        transform: `translateX(-50%) translateY(${(1 - enter) * -40}px) scale(${enter})`,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "12px 28px",
        borderRadius: 999,
        backgroundColor: THEME.surfacePill,
        border: `1px solid ${THEME.surfacePillBorder}`,
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
        boxShadow: "0 16px 36px rgba(0, 0, 0, 0.6)",
      }}
    >
      <div
        style={{
          width: 9,
          height: 9,
          borderRadius: "50%",
          backgroundColor: THEME.accentGold,
          boxShadow: `0 0 10px ${THEME.accentGold}`,
        }}
      />
      <span
        style={{
          fontSize: 22,
          fontWeight: 600,
          color: THEME.textPrimary,
          letterSpacing: -0.2,
          fontFamily: FONT_FAMILY,
        }}
      >
        HLF-MIDI
      </span>
      <span style={{ color: THEME.textSecondary, fontSize: 18 }}>•</span>
      <span
        style={{
          fontSize: 20,
          fontWeight: 500,
          color: THEME.textSecondary,
          fontFamily: FONT_FAMILY,
        }}
      >
        First 5 Hours Complete
      </span>
    </div>
  );
};

// ─── Animated Capacitive MIDI Keypad Visualizer ───
const MinimalistMidiKeypad: React.FC<{ size?: number }> = ({ size = 700 }) => {
  const frame = useCurrentFrame();
  const knobAngle = (frame * 1.5) % 360;
  // Fader moves smoothly between 110 and 180
  const faderY = 145 + Math.sin(frame * 0.05) * 35;
  const activePad = Math.floor((frame / 16) % 8);

  const pads = [
    { note: "C4", x: 45 },
    { note: "D4", x: 130 },
    { note: "E4", x: 215 },
    { note: "F4", x: 300 },
    { note: "G4", x: 385 },
    { note: "A4", x: 470 },
    { note: "B4", x: 555 },
    { note: "C5", x: 640 },
  ];

  return (
    <div
      style={{
        width: size,
        height: 420,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <svg
        width={size}
        height={420}
        viewBox="0 0 760 420"
        style={{
          overflow: "visible",
          filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.85))",
        }}
      >
        {/* PCB Board Outline */}
        <rect
          x="20"
          y="20"
          width="720"
          height="380"
          rx="20"
          fill="#0c0d12"
          stroke="rgba(245, 166, 35, 0.4)"
          strokeWidth="2"
        />

        {/* Board Mounting Holes with ENIG gold rings */}
        <circle cx="45" cy="45" r="8" fill="none" stroke="#f5a623" strokeWidth="1.5" />
        <circle cx="715" cy="45" r="8" fill="none" stroke="#f5a623" strokeWidth="1.5" />
        <circle cx="45" cy="375" r="8" fill="none" stroke="#f5a623" strokeWidth="1.5" />
        <circle cx="715" cy="375" r="8" fill="none" stroke="#f5a623" strokeWidth="1.5" />

        {/* Top Header Labels */}
        <text
          x="45"
          y="62"
          fill="#86868b"
          fontSize="13"
          fontFamily={FONT_FAMILY}
          fontWeight="600"
          letterSpacing="2"
        >
          HLF-MIDI KEYPAD CONTROLLER
        </text>
        <text
          x="715"
          y="62"
          fill="#f5a623"
          fontSize="13"
          fontFamily={FONT_FAMILY}
          fontWeight="600"
          letterSpacing="1.5"
          textAnchor="end"
        >
          ESP32-S3 • USB-MIDI CORE
        </text>

        {/* ─── Control Section (Rotary Knob, Fader, MCU, USB-C) ─── */}

        {/* 1. EC11 Rotary Encoder */}
        <g transform="translate(120, 140)">
          <circle cx="0" cy="0" r="38" fill="#14151b" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="30" fill="#1d1e26" stroke="#f5a623" strokeWidth="2" />
          <g transform={`rotate(${knobAngle})`}>
            <circle cx="0" cy="-18" r="4.5" fill="#ffffff" />
          </g>
          <text
            x="0"
            y="56"
            fill="#86868b"
            fontSize="12"
            fontFamily={FONT_FAMILY}
            fontWeight="600"
            textAnchor="middle"
          >
            FILTER CUTOFF
          </text>
        </g>

        {/* 2. Slide Fader */}
        <g transform="translate(260, 0)">
          <text
            x="0"
            y="92"
            fill="#86868b"
            fontSize="12"
            fontFamily={FONT_FAMILY}
            fontWeight="600"
            textAnchor="middle"
          >
            PITCH BEND
          </text>
          {/* Fader Slot */}
          <rect
            x="-4"
            y="104"
            width="8"
            height="86"
            rx="4"
            fill="#14151b"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
          />
          {/* Fader Knob */}
          <rect
            x="-18"
            y={faderY - 9}
            width="36"
            height="18"
            rx="4"
            fill="#27272a"
            stroke="#f5a623"
            strokeWidth="1.5"
          />
          <line
            x1="-10"
            y1={faderY}
            x2="10"
            y2={faderY}
            stroke="#ffffff"
            strokeWidth="1.5"
          />
        </g>

        {/* 3. ESP32-S3 IC Chip */}
        <g transform="translate(420, 140)">
          <rect
            x="-40"
            y="-35"
            width="80"
            height="70"
            rx="6"
            fill="#18181e"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.5"
          />
          {/* Chip Orientation Dot */}
          <circle cx="-28" cy="-23" r="3" fill="#f5a623" />
          <text
            x="0"
            y="-3"
            fill="#f5a623"
            fontSize="12"
            fontFamily={FONT_FAMILY}
            fontWeight="700"
            textAnchor="middle"
          >
            ESP32-S3
          </text>
          <text
            x="0"
            y="14"
            fill="#86868b"
            fontSize="10"
            fontFamily={FONT_FAMILY}
            fontWeight="500"
            textAnchor="middle"
          >
            NATIVE USB
          </text>
          <text
            x="0"
            y="56"
            fill="#86868b"
            fontSize="12"
            fontFamily={FONT_FAMILY}
            fontWeight="600"
            textAnchor="middle"
          >
            MCU ENGINE
          </text>
        </g>

        {/* 4. USB-C Port */}
        <g transform="translate(620, 140)">
          <rect
            x="-35"
            y="-20"
            width="70"
            height="40"
            rx="6"
            fill="#1b1c22"
            stroke="#4b5563"
            strokeWidth="1.5"
          />
          <rect
            x="-22"
            y="-8"
            width="44"
            height="16"
            rx="4"
            fill="#090a0f"
            stroke="#374151"
            strokeWidth="1"
          />
          <text
            x="0"
            y="56"
            fill="#86868b"
            fontSize="12"
            fontFamily={FONT_FAMILY}
            fontWeight="600"
            textAnchor="middle"
          >
            USB-C 5V / MIDI
          </text>
        </g>

        {/* ─── Capacitive Touch Keybed (8 Diatonic Keys) ─── */}
        <g>
          {pads.map((pad, idx) => {
            const isPressed = idx === activePad;
            return (
              <g key={pad.note} transform={`translate(${pad.x}, 225)`}>
                {/* Pad Outline */}
                <rect
                  x="0"
                  y="0"
                  width="75"
                  height="135"
                  rx="10"
                  fill={isPressed ? "rgba(245, 166, 35, 0.28)" : "#15161c"}
                  stroke={isPressed ? "#f5a623" : "rgba(255, 255, 255, 0.15)"}
                  strokeWidth={isPressed ? "2.5" : "1.5"}
                />
                {/* Touch Sensor Indicator Dot */}
                <circle
                  cx="37.5"
                  cy="26"
                  r={isPressed ? "7" : "4.5"}
                  fill={isPressed ? "#f5a623" : "rgba(255,255,255,0.22)"}
                  style={{
                    filter: isPressed ? "drop-shadow(0 0 10px #f5a623)" : "none",
                  }}
                />
                {/* Touch Field Crosshair / Detail */}
                <circle
                  cx="37.5"
                  cy="26"
                  r="14"
                  fill="none"
                  stroke={isPressed ? "rgba(245, 166, 35, 0.6)" : "rgba(255, 255, 255, 0.08)"}
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                {/* Note Label */}
                <text
                  x="37.5"
                  y="105"
                  fill={isPressed ? "#ffffff" : "#86868b"}
                  fontSize="17"
                  fontWeight={isPressed ? "800" : "600"}
                  fontFamily={FONT_FAMILY}
                  textAnchor="middle"
                >
                  {pad.note}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

// ─── Reusable Frosted Glass Showcase Card ───
const FrostedSketchCard: React.FC<{
  imageSrc: string;
  badge: string;
  title: string;
  description: string;
  tagNumber: string;
}> = ({ imageSrc, badge, title, description, tagNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  // Gentle subtle zoom on the diagram
  const imageScale = interpolate(frame, [0, 200], [1.0, 1.05], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 220,
        left: "50%",
        transform: `translateX(-50%) translateY(${(1 - enter) * 50}px) scale(${enter})`,
        width: 960,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Category Pill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "8px 24px",
          borderRadius: 999,
          background: "rgba(255, 255, 255, 0.06)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          marginBottom: 20,
        }}
      >
        <span
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: THEME.accentGold,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            fontFamily: FONT_FAMILY,
          }}
        >
          {badge}
        </span>
        <span style={{ color: THEME.textSecondary, fontSize: 14 }}>•</span>
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: THEME.textSecondary,
            fontFamily: FONT_FAMILY,
          }}
        >
          {tagNumber}
        </span>
      </div>

      {/* Main Glassmorphic Photo Frame */}
      <div
        style={{
          width: 940,
          borderRadius: 32,
          backgroundColor: THEME.surfaceCard,
          border: `1px solid ${THEME.surfaceCardBorder}`,
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.8)",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* The Technical Diagram Card */}
        <div
          style={{
            width: "100%",
            height: 580,
            borderRadius: 22,
            backgroundColor: "#ffffff",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "inset 0 0 20px rgba(0,0,0,0.06)",
          }}
        >
          <Img
            src={staticFile(imageSrc)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              transform: `scale(${imageScale})`,
            }}
          />
        </div>

        {/* Caption Info */}
        <div
          style={{
            width: "100%",
            marginTop: 24,
            padding: "0 12px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontSize: 34,
              fontWeight: 700,
              color: THEME.textPrimary,
              letterSpacing: -0.5,
              fontFamily: FONT_FAMILY,
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 6,
              fontSize: 22,
              fontWeight: 400,
              color: THEME.textSecondary,
              fontFamily: FONT_FAMILY,
              lineHeight: 1.35,
            }}
          >
            {description}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Scene 1: Intro (0 - 279 frames = 0 - 9.3s) ───
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 90 },
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: enter,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 26px",
          borderRadius: 999,
          background: "rgba(255, 255, 255, 0.06)",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          marginBottom: 28,
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: THEME.accentGold,
            letterSpacing: 2,
            textTransform: "uppercase",
            fontFamily: FONT_FAMILY,
          }}
        >
          5-Hour Engineering Log
        </span>
      </div>

      <div
        style={{
          fontSize: 88,
          fontWeight: 800,
          color: THEME.textPrimary,
          letterSpacing: -3,
          lineHeight: 1.05,
          textAlign: "center",
          fontFamily: FONT_FAMILY,
        }}
      >
        HLF-<span style={{ color: THEME.accentGold }}>MIDI</span>
      </div>

      <div
        style={{
          marginTop: 18,
          fontSize: 32,
          fontWeight: 500,
          color: THEME.textSecondary,
          letterSpacing: -0.5,
          textAlign: "center",
          fontFamily: FONT_FAMILY,
        }}
      >
        Capacitive Touch Keypad • ESP32-S3 USB-MIDI
      </div>

      <div style={{ marginTop: 40 }}>
        <MinimalistMidiKeypad size={640} />
      </div>
    </div>
  );
};

// ─── Scene 2: Concept Teardown (279 - 638 frames = 9.3 - 21.3s) ───
const ConceptTeardownScene: React.FC = () => {
  return (
    <FrostedSketchCard
      imageSrc="images/hour_01_midi_concept_teardown.png"
      badge="Form Factor & Concept"
      tagNumber="Hour 01"
      title="Solid-State Touch vs Mechanical Switches"
      description="Replaced 15mm mechanical switches with 1.6mm PCB etched copper pads for an ultra-flat desk footprint."
    />
  );
};

// ─── Scene 3: MCU Architecture (638 - 889 frames = 21.3 - 29.6s) ───
const McuArchitectureScene: React.FC = () => {
  return (
    <FrostedSketchCard
      imageSrc="images/hour_02_esp32s3_mcu_architecture.png"
      badge="Hardware Architecture"
      tagNumber="Hour 02"
      title="ESP32-S3 Core & USB-MIDI Pipeline"
      description="Dedicated hardware capacitive sensing lines with native Full-Speed USB OTG for driverless plug-and-play MIDI."
    />
  );
};

// ─── Scene 4: Touch Physics & Expressive Controls (889 - 1251 frames = 29.6 - 41.7s) ───
const TouchAndControlsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const isSecondPart = frame > 180; // ~6.0s transition

  return isSecondPart ? (
    <FrostedSketchCard
      imageSrc="images/hour_04_controls_encoder_fader.png"
      badge="Expressive Controls"
      tagNumber="Hour 04"
      title="EC11 Encoder & Slide Fader"
      description="Dual-channel quadrature knob for smooth filter cutoff sweeps and analog slide fader for expressive pitch modulation."
    />
  ) : (
    <FrostedSketchCard
      imageSrc="images/hour_03_capacitive_touch_pads.png"
      badge="Capacitive Physics"
      tagNumber="Hour 03"
      title="Touch Pad Geometry & Ground Pullback"
      description="2mm ground pullback prevents parasitic capacitance; RC low-pass filter eliminates electrical noise."
    />
  );
};

// ─── Scene 5: Power Schematic (1251 - 1472 frames = 41.7 - 49.1s) ───
const PowerSchematicScene: React.FC = () => {
  return (
    <FrostedSketchCard
      imageSrc="images/hour_05_schematic_mcu_power.png"
      badge="KiCad Schematic"
      tagNumber="Hour 05"
      title="USB-C & Low-Noise 3.3V Power Delivery"
      description="5.1k CC pull-downs for 5V power negotiation, USBLC6-2SC6 ESD clamping, and 600mA low-dropout linear regulation."
    />
  );
};

// ─── Scene 6: Outro (1472 - 1740 frames = 49.1 - 58.0s) ───
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: enter,
      }}
    >
      {/* Monogram Badge */}
      <div
        style={{
          width: 130,
          height: 130,
          borderRadius: 36,
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(40px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.7)",
          marginBottom: 36,
        }}
      >
        <span
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: THEME.textPrimary,
            fontFamily: FONT_FAMILY,
            letterSpacing: -1,
          }}
        >
          HLF<span style={{ color: THEME.accentGold }}>•M</span>
        </span>
      </div>

      <div
        style={{
          fontSize: 68,
          fontWeight: 800,
          color: THEME.textPrimary,
          fontFamily: FONT_FAMILY,
          letterSpacing: -2,
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        5 Hours Complete.
      </div>

      <div
        style={{
          marginTop: 16,
          fontSize: 32,
          fontWeight: 500,
          color: THEME.textSecondary,
          fontFamily: FONT_FAMILY,
          letterSpacing: -0.5,
          textAlign: "center",
        }}
      >
        Next: Component Layout, Trace Routing & Fab Files
      </div>

      <div
        style={{
          marginTop: 50,
          padding: "14px 32px",
          borderRadius: 999,
          background: "rgba(255, 255, 255, 0.05)",
          border: `1px solid ${THEME.surfaceCardBorder}`,
          color: THEME.textSecondary,
          fontSize: 22,
          fontWeight: 500,
          fontFamily: FONT_FAMILY,
          letterSpacing: -0.2,
        }}
      >
        HLF-MIDI • Hack Club Half Life
      </div>
    </div>
  );
};

// ─── Apple Subtitle Bar (Synced to Voiceover) ───
const AppleSubtitleBar: React.FC = () => {
  const frame = useCurrentFrame();
  const currentSub = SUBTITLES.find((s) => frame >= s.start && frame < s.end);

  if (!currentSub) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 110,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 50,
        maxWidth: 920,
        padding: "16px 36px",
        borderRadius: 999,
        backgroundColor: "rgba(18, 18, 20, 0.88)",
        border: "1px solid rgba(255, 255, 255, 0.14)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8)",
        textAlign: "center",
      }}
    >
      <span
        style={{
          fontSize: 27,
          fontWeight: 600,
          color: THEME.textPrimary,
          fontFamily: FONT_FAMILY,
          letterSpacing: -0.4,
          lineHeight: 1.3,
        }}
      >
        {currentSub.text}
      </span>
    </div>
  );
};

// ─── Root Composition ───
export const HlfMidi5HourReel: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        position: "relative",
        width: 1080,
        height: 1920,
        backgroundColor: THEME.bg,
        overflow: "hidden",
        fontFamily: FONT_FAMILY,
      }}
    >
      {/* Studio Lighting */}
      <StudioStageLight />

      {/* Dynamic Island Header */}
      <DynamicIslandHeader />

      {/* Scene 1: Intro (0 - 279 frames) */}
      <Sequence from={0} durationInFrames={279} name="Intro">
        <IntroScene />
      </Sequence>

      {/* Scene 2: Concept Teardown (279 - 638 frames) */}
      <Sequence from={279} durationInFrames={359} name="Concept Teardown">
        <ConceptTeardownScene />
      </Sequence>

      {/* Scene 3: MCU Architecture (638 - 889 frames) */}
      <Sequence from={638} durationInFrames={251} name="MCU Architecture">
        <McuArchitectureScene />
      </Sequence>

      {/* Scene 4: Touch Physics & Controls (889 - 1251 frames) */}
      <Sequence from={889} durationInFrames={362} name="Touch Physics & Controls">
        <TouchAndControlsScene />
      </Sequence>

      {/* Scene 5: Power Delivery Schematic (1251 - 1472 frames) */}
      <Sequence from={1251} durationInFrames={221} name="Power Schematic">
        <PowerSchematicScene />
      </Sequence>

      {/* Scene 6: Outro (1472 - 1740 frames) */}
      <Sequence from={1472} durationInFrames={268} name="Outro">
        <OutroScene />
      </Sequence>

      {/* Apple Subtitles Bar */}
      <AppleSubtitleBar />

      {/* Voiceover Track */}
      <Audio src={staticFile("hlf_midi_5h_voice.mp3")} volume={1.0} premountFor={fps} />

      {/* Lo-Fi Background Music */}
      <Audio src={staticFile("bg-music.mp3")} volume={0.10} premountFor={fps} />
    </div>
  );
};
