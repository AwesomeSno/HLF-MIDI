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
  accentPurple: "#bf5af2",
};

const FONT_FAMILY =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif";

// ─── Subtitle Timestamps (Exact from Edge-TTS 15h audio) ───
const SUBTITLES = [
  { start: 2, end: 28, text: "Hey guys!" },
  {
    start: 28,
    end: 224,
    text: "Here's the second progress update on HLF-MIDI for Hack Club's Half Life, covering the next 15 hours of the build!",
  },
  {
    start: 224,
    end: 436,
    text: "After finishing the schematics, I routed the 2-layer board in KiCad, keeping clean ground keepouts around all eight touch pads.",
  },
  {
    start: 436,
    end: 706,
    text: "Then I prepped it for manufacturing—added note labels to the silkscreen, exported Gerbers, and verified automated SMT assembly for JLCPCB.",
  },
  {
    start: 706,
    end: 996,
    text: "Next, I modeled a slim 9.5-millimeter 3D printed case in CAD with brass inserts, plus a frosted diffuser for a smooth LED underglow.",
  },
  {
    start: 996,
    end: 1301,
    text: "For firmware, I set up the ESP32-S3 with TinyUSB, added auto-baseline filtering to stop touch drift, and tuned velocity sensitivity.",
  },
  {
    start: 1301,
    end: 1399,
    text: "Finally, I tested it in Ableton Live and Logic Pro.",
  },
  {
    start: 1399,
    end: 1604,
    text: "Latency is under 1 millisecond, power draw stays under 115 milliamps, and it feels super responsive.",
  },
  {
    start: 1604,
    end: 1718,
    text: "HLF-MIDI is completely finished and ready for fabrication.",
  },
  {
    start: 1718,
    end: 1765,
    text: "Thanks for watching!",
  },
];

// ─── Overhead Studio Lighting ───
const StudioStageLight: React.FC<{ accentColor?: string }> = ({
  accentColor = "rgba(245, 166, 35, 0.08)",
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: -200,
        left: "50%",
        transform: "translateX(-50%)",
        width: 1000,
        height: 800,
        background: `radial-gradient(circle, ${accentColor} 0%, rgba(255, 255, 255, 0.02) 45%, transparent 75%)`,
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
};

// ─── Dynamic Island Top Pill ───
const DynamicIslandHeader: React.FC<{ phaseLabel: string; dotColor?: string }> = ({
  phaseLabel,
  dotColor = THEME.accentGold,
}) => {
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
          backgroundColor: dotColor,
          boxShadow: `0 0 10px ${dotColor}`,
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
        {phaseLabel}
      </span>
    </div>
  );
};

// ─── Animated Capacitive MIDI Keypad Visualizer ───
const MinimalistMidiKeypad: React.FC<{ size?: number }> = ({ size = 700 }) => {
  const frame = useCurrentFrame();
  const knobAngle = (frame * 1.8) % 360;
  const faderY = 145 + Math.sin(frame * 0.06) * 35;
  const activePad = Math.floor((frame / 14) % 8);

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
          HLF-MIDI CONTROLLER • V2.0
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
          ESP32-S3 • 21H COMPLETE
        </text>

        {/* Control Section */}
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
            fontSize="11"
            fontFamily={FONT_FAMILY}
            fontWeight="500"
            textAnchor="middle"
          >
            CUTOFF CC74
          </text>
        </g>

        {/* Slide Fader */}
        <g transform="translate(260, 95)">
          <rect x="-6" y="0" width="12" height="90" rx="6" fill="#14151b" stroke="rgba(255,255,255,0.1)" />
          <line x1="0" y1="5" x2="0" y2="85" stroke="#f5a623" strokeWidth="2" opacity="0.6" />
          <rect
            x="-18"
            y={faderY - 110}
            width="36"
            height="18"
            rx="4"
            fill="#f5a623"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
          <text
            x="0"
            y="108"
            fill="#86868b"
            fontSize="11"
            fontFamily={FONT_FAMILY}
            fontWeight="500"
            textAnchor="middle"
          >
            PITCH BEND
          </text>
        </g>

        {/* ESP32-S3 Module Representation */}
        <g transform="translate(420, 95)">
          <rect x="0" y="0" width="130" height="90" rx="8" fill="#161822" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          <rect x="15" y="15" width="100" height="50" rx="4" fill="#0f1016" stroke="#f5a623" strokeWidth="1" />
          <text
            x="65"
            y="44"
            fill="#f5f5f7"
            fontSize="12"
            fontFamily={FONT_FAMILY}
            fontWeight="700"
            textAnchor="middle"
            letterSpacing="1"
          >
            ESP32-S3
          </text>
          <text
            x="65"
            y="80"
            fill="#86868b"
            fontSize="10"
            fontFamily={FONT_FAMILY}
            fontWeight="500"
            textAnchor="middle"
          >
            TINYUSB MIDI
          </text>
        </g>

        {/* USB-C Port Representation */}
        <g transform="translate(620, 115)">
          <rect x="0" y="0" width="60" height="30" rx="8" fill="#161822" stroke="#30d158" strokeWidth="1.5" />
          <rect x="12" y="8" width="36" height="14" rx="4" fill="#0c0d12" stroke="#ffffff" strokeWidth="1" />
          <text
            x="30"
            y="48"
            fill="#30d158"
            fontSize="10"
            fontFamily={FONT_FAMILY}
            fontWeight="600"
            textAnchor="middle"
          >
            USB-C
          </text>
        </g>

        {/* ─── 8 Capacitive Touch Keys ─── */}
        <g transform="translate(0, 205)">
          {pads.map((pad, idx) => {
            const isActive = idx === activePad;
            return (
              <g key={pad.note} transform={`translate(${pad.x}, 0)`}>
                <rect
                  x="-2"
                  y="-2"
                  width="74"
                  height="164"
                  rx="10"
                  fill="none"
                  stroke={isActive ? "rgba(245, 166, 35, 0.4)" : "rgba(255,255,255,0.05)"}
                  strokeWidth="1.5"
                />
                <rect
                  x="0"
                  y="0"
                  width="70"
                  height="160"
                  rx="8"
                  fill={isActive ? "#f5a623" : "#1a1610"}
                  stroke={isActive ? "#ffffff" : "#c48821"}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  style={{
                    filter: isActive ? "drop-shadow(0 0 16px rgba(245,166,35,0.8))" : "none",
                    transition: "all 0.1s ease",
                  }}
                />
                <circle
                  cx="35"
                  cy="40"
                  r="6"
                  fill={isActive ? "#ffffff" : "rgba(245, 166, 35, 0.3)"}
                  style={{
                    filter: isActive ? "drop-shadow(0 0 8px #ffffff)" : "none",
                  }}
                />
                <text
                  x="35"
                  y="105"
                  fill={isActive ? "#000000" : "#ffffff"}
                  fontSize="22"
                  fontFamily={FONT_FAMILY}
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {pad.note}
                </text>
                <text
                  x="35"
                  y="140"
                  fill={isActive ? "#000000" : "#86868b"}
                  fontSize="14"
                  fontFamily={FONT_FAMILY}
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {idx + 1}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

// ─── Frosted Bento Card Showcase Frame ───
const BentoShowcaseCard: React.FC<{
  imageSrc: string;
  badge: string;
  title: string;
  subBullets: string[];
  accentColor?: string;
}> = ({ imageSrc, badge, title, subBullets, accentColor = THEME.accentGold }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 100 },
  });

  const floatY = Math.sin(frame * 0.04) * 6;

  return (
    <div
      style={{
        width: 940,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `scale(${scale}) translateY(${floatY}px)`,
        borderRadius: 36,
        backgroundColor: THEME.surfaceCard,
        border: `1px solid ${THEME.surfaceCardBorder}`,
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        padding: "36px 36px 32px 36px",
        boxShadow: "0 32px 80px rgba(0, 0, 0, 0.8)",
      }}
    >
      {/* Top Header Row */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 18px",
            borderRadius: 999,
            backgroundColor: "rgba(255, 255, 255, 0.06)",
            border: `1px solid ${accentColor}`,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: accentColor,
              boxShadow: `0 0 8px ${accentColor}`,
            }}
          />
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: accentColor,
              fontFamily: FONT_FAMILY,
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            {badge}
          </span>
        </div>

        <span
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: THEME.textPrimary,
            fontFamily: FONT_FAMILY,
            letterSpacing: -0.4,
          }}
        >
          {title}
        </span>
      </div>

      {/* Hand-drawn Technical Sketch Card */}
      <div
        style={{
          width: "100%",
          height: 600,
          borderRadius: 24,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)",
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
        }}
      >
        <Img
          src={staticFile(imageSrc)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Highlights Strip */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          marginTop: 22,
        }}
      >
        {subBullets.map((bullet, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: 16,
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              fontSize: 15,
              fontWeight: 500,
              color: "#d1d5db",
              fontFamily: FONT_FAMILY,
              textAlign: "center",
              lineHeight: 1.3,
            }}
          >
            {bullet}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Apple Subtitle Pill ───
const ModernSubtitlePill: React.FC = () => {
  const frame = useCurrentFrame();

  const currentSub = SUBTITLES.find((sub) => frame >= sub.start && frame < sub.end);
  if (!currentSub) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 96,
        left: "50%",
        transform: "translateX(-50%)",
        maxWidth: 900,
        padding: "16px 36px",
        borderRadius: 999,
        backgroundColor: THEME.surfacePill,
        border: `1px solid ${THEME.surfacePillBorder}`,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: "0 20px 48px rgba(0, 0, 0, 0.7)",
        zIndex: 60,
        textAlign: "center",
      }}
    >
      <span
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: "#ffffff",
          fontFamily: FONT_FAMILY,
          letterSpacing: -0.3,
          lineHeight: 1.3,
        }}
      >
        {currentSub.text}
      </span>
    </div>
  );
};

// ─── Main 15-Hour Progress Reel Composition ───
export const HlfMidi15HourReel: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: THEME.bg,
        overflow: "hidden",
        position: "relative",
        fontFamily: FONT_FAMILY,
      }}
    >
      {/* Background Audio */}
      <Audio src={staticFile("hlf_midi_15h_voice.mp3")} volume={1.0} />
      <Audio src={staticFile("bg-music.mp3")} volume={0.12} />

      {/* Overhead Studio Stage Light */}
      <StudioStageLight accentColor="rgba(245, 166, 35, 0.09)" />

      {/* ─── SCENE 1: Intro Hero (Frames 0 - 224) ─── */}
      <Sequence from={0} durationInFrames={224}>
        <DynamicIslandHeader phaseLabel="Hours 6–21 Sprint" />
        <div
          style={{
            position: "absolute",
            top: 240,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "0 60px",
          }}
        >
          {/* Top Title Card */}
          <div
            style={{
              padding: "8px 24px",
              borderRadius: 999,
              backgroundColor: "rgba(245, 166, 35, 0.12)",
              border: "1px solid rgba(245, 166, 35, 0.4)",
              color: THEME.accentGold,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 1.2,
              marginBottom: 20,
            }}
          >
            HACK CLUB HALF LIFE • 15H REEL
          </div>

          <h1
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: THEME.textPrimary,
              textAlign: "center",
              letterSpacing: -1.5,
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            HLF-MIDI
          </h1>
          <p
            style={{
              fontSize: 28,
              fontWeight: 500,
              color: THEME.textSecondary,
              marginTop: 12,
              marginBottom: 44,
              textAlign: "center",
            }}
          >
            Solid-State Capacitive Touch Keypad
          </p>

          {/* Keypad Interactive SVG Visualizer */}
          <MinimalistMidiKeypad size={880} />

          {/* Quick Metrics Bar */}
          <div
            style={{
              display: "flex",
              gap: 20,
              marginTop: 50,
              width: 880,
            }}
          >
            <div
              style={{
                flex: 1,
                padding: "20px 24px",
                borderRadius: 24,
                backgroundColor: THEME.surfaceCard,
                border: `1px solid ${THEME.surfaceCardBorder}`,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 32, fontWeight: 800, color: THEME.accentGold }}>
                21 Hours
              </div>
              <div style={{ fontSize: 16, color: THEME.textSecondary, marginTop: 4 }}>
                Total Logged Time
              </div>
            </div>

            <div
              style={{
                flex: 1,
                padding: "20px 24px",
                borderRadius: 24,
                backgroundColor: THEME.surfaceCard,
                border: `1px solid ${THEME.surfaceCardBorder}`,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 32, fontWeight: 800, color: THEME.accentGreen }}>
                &lt; 1 ms
              </div>
              <div style={{ fontSize: 16, color: THEME.textSecondary, marginTop: 4 }}>
                Touch Latency
              </div>
            </div>

            <div
              style={{
                flex: 1,
                padding: "20px 24px",
                borderRadius: 24,
                backgroundColor: THEME.surfaceCard,
                border: `1px solid ${THEME.surfaceCardBorder}`,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 32, fontWeight: 800, color: THEME.accentCyan }}>
                112 mA
              </div>
              <div style={{ fontSize: 16, color: THEME.textSecondary, marginTop: 4 }}>
                Peak Power
              </div>
            </div>
          </div>
        </div>
      </Sequence>

      {/* ─── SCENE 2: PCB Routing & Layout (Frames 224 - 436) ─── */}
      <Sequence from={224} durationInFrames={212}>
        <DynamicIslandHeader
          phaseLabel="Hours 6–9: PCB Layout & 2-Layer Routing"
          dotColor={THEME.accentAmber}
        />
        <div
          style={{
            position: "absolute",
            top: 240,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <BentoShowcaseCard
            imageSrc="images/hour_09_pcb_routing_layers.png"
            badge="KiCad 8 Routing"
            title="2-Layer Solid-State PCB"
            accentColor={THEME.accentAmber}
            subBullets={[
              "2.0mm Ground Keepout on Keys",
              "180mm x 75mm Slim Footprint",
              "Zero DRC Clearance Errors",
            ]}
          />
        </div>
      </Sequence>

      {/* ─── SCENE 3: Manufacturing & SMT Assembly (Frames 436 - 706) ─── */}
      <Sequence from={436} durationInFrames={270}>
        <DynamicIslandHeader
          phaseLabel="Hours 10–12: Silkscreen & SMT Files"
          dotColor={THEME.accentGold}
        />
        <div
          style={{
            position: "absolute",
            top: 240,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <BentoShowcaseCard
            imageSrc="images/hour_11_gerbers_and_dfm.png"
            badge="JLCPCB DFM Verified"
            title="Gerber & SMT Package"
            accentColor={THEME.accentGold}
            subBullets={[
              "ENIG Flat Gold Surface Finish",
              "RS-274X Fabrication Gerbers",
              "Automated Pick-and-Place CPL",
            ]}
          />
        </div>
      </Sequence>

      {/* ─── SCENE 4: 3D Enclosure CAD & Diffuser (Frames 706 - 996) ─── */}
      <Sequence from={706} durationInFrames={290}>
        <DynamicIslandHeader
          phaseLabel="Hours 13–14: 9.5mm 3D Enclosure"
          dotColor={THEME.accentCyan}
        />
        <div
          style={{
            position: "absolute",
            top: 240,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <BentoShowcaseCard
            imageSrc="images/hour_13_enclosure_baseplate_cad.png"
            badge="Mechanical CAD"
            title="Slim 3D Printable Cradle"
            accentColor={THEME.accentCyan}
            subBullets={[
              "Ultra-slim 9.5mm PETG Shell",
              "M3 Heat-Set Brass Inserts",
              "Frosted Silicone Light Diffuser",
            ]}
          />
        </div>
      </Sequence>

      {/* ─── SCENE 5: Firmware, TinyUSB & Touch DSP (Frames 996 - 1301) ─── */}
      <Sequence from={996} durationInFrames={305}>
        <DynamicIslandHeader
          phaseLabel="Hours 15–18: ESP-IDF & Touch DSP"
          dotColor={THEME.accentPurple}
        />
        <div
          style={{
            position: "absolute",
            top: 240,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <BentoShowcaseCard
            imageSrc="images/hour_16_touch_dsp_baseline_drift.png"
            badge="ESP32-S3 Firmware"
            title="Drift DSP & Velocity Engine"
            accentColor={THEME.accentPurple}
            subBullets={[
              "TinyUSB Native Class-Compliant",
              "Adaptive Baseline Drift Filter",
              "dC/dt Capacitive Velocity Sensing",
            ]}
          />
        </div>
      </Sequence>

      {/* ─── SCENE 6: DAW Testing & Bench Setup (Frames 1301 - 1604) ─── */}
      <Sequence from={1301} durationInFrames={303}>
        <DynamicIslandHeader
          phaseLabel="Hours 19–21: Ableton & Bench Testing"
          dotColor={THEME.accentGreen}
        />
        <div
          style={{
            position: "absolute",
            top: 240,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <BentoShowcaseCard
            imageSrc="images/hour_21_system_bench_integration.png"
            badge="Hardware Bench Tested"
            title="DAW Integration & Power"
            accentColor={THEME.accentGreen}
            subBullets={[
              "0.85 ms Touch-to-Packet Latency",
              "Verified in Ableton Live & Logic",
              "112 mA Peak Draw • Runs Cool",
            ]}
          />
        </div>
      </Sequence>

      {/* ─── SCENE 7: Outro & Final Milestone (Frames 1604 - 1770) ─── */}
      <Sequence from={1604} durationInFrames={166}>
        <DynamicIslandHeader
          phaseLabel="Complete • 21h Total Logged"
          dotColor={THEME.accentGreen}
        />
        <div
          style={{
            position: "absolute",
            top: 280,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "0 60px",
          }}
        >
          {/* Big Green/Gold Milestone Checkmark */}
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              backgroundColor: "rgba(48, 209, 88, 0.15)",
              border: "3px solid #30d158",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 40px rgba(48, 209, 88, 0.4)",
              marginBottom: 32,
            }}
          >
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13L9 17L19 7"
                stroke="#30d158"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h2
            style={{
              fontSize: 54,
              fontWeight: 800,
              color: THEME.textPrimary,
              textAlign: "center",
              letterSpacing: -1,
              margin: 0,
            }}
          >
            HLF-MIDI Complete
          </h2>
          <p
            style={{
              fontSize: 24,
              fontWeight: 500,
              color: THEME.textSecondary,
              marginTop: 12,
              marginBottom: 48,
              textAlign: "center",
            }}
          >
            Ready for JLCPCB Fabrication & 3D Printing
          </p>

          {/* Summary Bento Stats */}
          <div
            style={{
              width: 880,
              padding: "36px",
              borderRadius: 32,
              backgroundColor: THEME.surfaceCard,
              border: `1px solid ${THEME.surfaceCardBorder}`,
              backdropFilter: "blur(30px)",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                paddingBottom: 16,
              }}
            >
              <span style={{ fontSize: 20, color: THEME.textSecondary }}>Sprint Time</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: THEME.accentGold }}>
                15 Hours Logged (Hours 6–21)
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                paddingBottom: 16,
              }}
            >
              <span style={{ fontSize: 20, color: THEME.textSecondary }}>Total Project</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: "#ffffff" }}>
                21 Hours Cumulative
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                paddingBottom: 16,
              }}
            >
              <span style={{ fontSize: 20, color: THEME.textSecondary }}>Hardware Status</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: THEME.accentGreen }}>
                Gerbers, BOM & CPL Ready
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 20, color: THEME.textSecondary }}>Firmware & Test</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: THEME.accentCyan }}>
                Sub-1ms Latency in Ableton
              </span>
            </div>
          </div>

          <div
            style={{
              marginTop: 40,
              fontSize: 22,
              fontWeight: 600,
              color: THEME.textSecondary,
              letterSpacing: 0.5,
            }}
          >
            HACK CLUB HALF LIFE GRANT
          </div>
        </div>
      </Sequence>

      {/* Synchronized Apple Subtitle Pill */}
      <ModernSubtitlePill />
    </div>
  );
};
