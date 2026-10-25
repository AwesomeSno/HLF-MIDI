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

// ─── Theme & Design Tokens ───
const THEME = {
  bg: "#040407",
  surfaceCard: "rgba(255, 255, 255, 0.045)",
  surfaceCardBorder: "rgba(255, 255, 255, 0.12)",
  surfacePill: "rgba(18, 18, 22, 0.88)",
  surfacePillBorder: "rgba(255, 255, 255, 0.16)",
  textPrimary: "#f5f5f7",
  textSecondary: "#8e8e93",
  accentGold: "#f5a623",
  accentAmber: "#ff9500",
  accentGreen: "#30d158",
  accentCyan: "#00f0ff",
  accentPurple: "#bf5af2",
};

const FONT_FAMILY =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif";

// ─── Subtitles (Exact cues from Edge-TTS Andrew voice) ───
const SUBTITLES = [
  { start: 2, end: 25, text: "Hey everyone!" },
  {
    start: 25,
    end: 240,
    text: "The 21-hour sprint for HLF-MIDI is officially complete for Hack Club's Half Life, and here is how the finished instrument came together.",
  },
  {
    start: 240,
    end: 386,
    text: "Traditional MIDI keyboards are bulky plastic bricks with mechanical switches that wear out.",
  },
  {
    start: 386,
    end: 546,
    text: "I wanted something completely flat: a solid-state keyboard where the circuit board itself is the instrument.",
  },
  {
    start: 546,
    end: 827,
    text: "We designed an ultra-slim 2-layer PCB in KiCad around the ESP32-S3, etching 8 capacitive touch keys directly into gold.",
  },
  {
    start: 827,
    end: 924,
    text: "Underneath, reverse-mount NeoPixels shine right through the board.",
  },
  {
    start: 924,
    end: 1178,
    text: "We added an EC11 rotary knob for filter cutoff, a smooth 45mm slide fader for pitch bend, and full USB ESD protection.",
  },
  {
    start: 1178,
    end: 1417,
    text: "Our custom firmware runs at 500 hertz with jitter filtering and native USB-MIDI, plugging straight into any DAW with sub-millisecond response.",
  },
  {
    start: 1417,
    end: 1549,
    text: "All KiCad files, Gerbers, BOM, and firmware are pushed to GitHub.",
  },
  {
    start: 1549,
    end: 1656,
    text: "21 hours logged, and HLF-MIDI is ready to rock.",
  },
  {
    start: 1656,
    end: 1740,
    text: "Thanks for watching!",
  },
];

// ─── Ambient Stage Glow ───
const StudioStageLight: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame * 0.05) * 0.08 + 0.92;

  return (
    <div
      style={{
        position: "absolute",
        top: -120,
        left: "50%",
        transform: `translateX(-50%) scale(${pulse})`,
        width: 1200,
        height: 900,
        background:
          "radial-gradient(circle, rgba(245, 166, 35, 0.12) 0%, rgba(0, 240, 255, 0.06) 40%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
};

// ─── Dynamic Subtitle Display ───
const SubtitleOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const activeSub = SUBTITLES.find(
    (sub) => frame >= sub.start && frame < sub.end
  );

  if (!activeSub) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: 48,
        right: 48,
        display: "flex",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: "rgba(10, 10, 14, 0.88)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: `1px solid ${THEME.surfaceCardBorder}`,
          borderRadius: 24,
          padding: "20px 32px",
          maxWidth: 960,
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.6)",
        }}
      >
        <p
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 34,
            fontWeight: 600,
            lineHeight: 1.35,
            color: THEME.textPrimary,
            margin: 0,
            textAlign: "center",
            letterSpacing: "-0.015em",
          }}
        >
          {activeSub.text}
        </p>
      </div>
    </div>
  );
};

// ─── Top Header Badge ───
const TopBadge: React.FC<{ title: string; subtitle: string; icon?: string }> = ({
  title,
  subtitle,
  icon = "⚡",
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        left: 48,
        right: 48,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 40,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          background: THEME.surfacePill,
          border: `1px solid ${THEME.surfacePillBorder}`,
          borderRadius: 999,
          padding: "12px 24px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
        }}
      >
        <span style={{ fontSize: 22 }}>{icon}</span>
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 22,
            fontWeight: 700,
            color: THEME.textPrimary,
            letterSpacing: "0.02em",
          }}
        >
          {title}
        </span>
      </div>

      <div
        style={{
          background: "rgba(245, 166, 35, 0.15)",
          border: "1px solid rgba(245, 166, 35, 0.4)",
          borderRadius: 999,
          padding: "12px 22px",
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 20,
            fontWeight: 700,
            color: THEME.accentGold,
            letterSpacing: "0.04em",
          }}
        >
          {subtitle}
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 1: Hero Cover & Sprint Complete (Frames 0 - 240)
// ═══════════════════════════════════════════════════════════════════════════════
const Scene1Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 16, mass: 0.9, stiffness: 100 },
  });

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 160,
      }}
    >
      <TopBadge title="HLF-MIDI" subtitle="21h SPRINT COMPLETE" icon="🎹" />

      {/* Main Title Card */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 36,
          transform: `scale(${scale})`,
        }}
      >
        <h1
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: THEME.textPrimary,
            margin: "0 0 10px 0",
          }}
        >
          HLF-MIDI
        </h1>
        <p
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 28,
            fontWeight: 500,
            color: THEME.accentGold,
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          Solid-State Capacitive Touch MIDI Instrument
        </p>
      </div>

      {/* 3D Raytraced Board Showcase */}
      <div
        style={{
          width: 980,
          height: 550,
          borderRadius: 32,
          overflow: "hidden",
          border: `1px solid ${THEME.surfaceCardBorder}`,
          boxShadow: "0 32px 96px rgba(0, 0, 0, 0.8)",
          background: "rgba(0, 0, 0, 0.6)",
          position: "relative",
          marginBottom: 36,
        }}
      >
        <Img
          src={staticFile("images/cover_hero.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 24,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(12px)",
            padding: "8px 18px",
            borderRadius: 999,
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: THEME.accentCyan,
            fontSize: 18,
            fontWeight: 700,
            fontFamily: FONT_FAMILY,
          }}
        >
          KiCad 3D Raytraced Hardware
        </div>
      </div>

      {/* Spec Grid Pills */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 16,
          width: 980,
        }}
      >
        {[
          { label: "Architecture", val: "ESP32-S3 Dual-Core 240MHz", color: THEME.accentGold },
          { label: "Keys Profile", val: "Zero Moving Parts (1.6mm)", color: THEME.accentCyan },
          { label: "Touch Sensor", val: "8x ENIG Gold Capacitive Pads", color: THEME.accentGreen },
          { label: "USB Stack", val: "Class-Compliant USB-MIDI (500Hz)", color: THEME.accentPurple },
        ].map((item, idx) => (
          <div
            key={idx}
            style={{
              background: THEME.surfaceCard,
              border: `1px solid ${THEME.surfaceCardBorder}`,
              borderRadius: 20,
              padding: "16px 22px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 18,
                color: THEME.textSecondary,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {item.label}
            </span>
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 24,
                color: item.color,
                fontWeight: 700,
              }}
            >
              {item.val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 2: The Problem & The Solid-State PCB Concept (Frames 240 - 546)
// ═══════════════════════════════════════════════════════════════════════════════
const Scene2Concept: React.FC = () => {
  const frame = useCurrentFrame();
  const relFrame = frame - 240;

  const opacity = interpolate(relFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 160,
      }}
    >
      <TopBadge title="THE CONCEPT" subtitle="SOLID-STATE DESIGN" icon="💡" />

      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h2
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 54,
            fontWeight: 800,
            color: THEME.textPrimary,
            margin: "0 0 10px 0",
          }}
        >
          No Plastic Switches. No Bulk.
        </h2>
        <p
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 26,
            color: THEME.textSecondary,
            margin: 0,
          }}
        >
          Turning the circuit board copper itself into the instrument
        </p>
      </div>

      {/* 2D PCB Layout Artwork */}
      <div
        style={{
          width: 980,
          height: 520,
          borderRadius: 28,
          overflow: "hidden",
          border: `1px solid ${THEME.surfaceCardBorder}`,
          boxShadow: "0 24px 72px rgba(0, 0, 0, 0.7)",
          background: "#0d0e14",
          position: "relative",
          marginBottom: 32,
        }}
      >
        <Img
          src={staticFile("images/pcb_layout_2d.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 24,
            background: "rgba(0, 0, 0, 0.8)",
            padding: "8px 18px",
            borderRadius: 999,
            border: `1px solid ${THEME.accentGold}`,
            color: THEME.accentGold,
            fontSize: 18,
            fontWeight: 700,
            fontFamily: FONT_FAMILY,
          }}
        >
          KiCad 2D Copper & Silkscreen
        </div>
      </div>

      {/* Comparison Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          width: 980,
        }}
      >
        <div
          style={{
            background: "rgba(255, 69, 58, 0.08)",
            border: "1px solid rgba(255, 69, 58, 0.3)",
            borderRadius: 24,
            padding: "24px 28px",
          }}
        >
          <span style={{ fontSize: 28 }}>❌</span>
          <h3
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 28,
              fontWeight: 700,
              color: "#ff453a",
              margin: "8px 0",
            }}
          >
            Traditional Keybeds
          </h3>
          <p
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 20,
              color: THEME.textSecondary,
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            25mm–35mm thick, mechanical switch wear, physical bounce delays, clunky hand-soldering.
          </p>
        </div>

        <div
          style={{
            background: "rgba(48, 209, 88, 0.08)",
            border: "1px solid rgba(48, 209, 88, 0.3)",
            borderRadius: 24,
            padding: "24px 28px",
          }}
        >
          <span style={{ fontSize: 28 }}>✅</span>
          <h3
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 28,
              fontWeight: 700,
              color: THEME.accentGreen,
              margin: "8px 0",
            }}
          >
            HLF-MIDI Solid-State
          </h3>
          <p
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 20,
              color: THEME.textSecondary,
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            1.6mm ultra-flat, infinite contact lifecycle, sub-millisecond hardware touch oscillators.
          </p>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 3: KiCad PCB & Touch Pads (Frames 546 - 827)
// ═══════════════════════════════════════════════════════════════════════════════
const Scene3KiCadPCB: React.FC = () => {
  const frame = useCurrentFrame();
  const relFrame = frame - 546;

  const opacity = interpolate(relFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 160,
      }}
    >
      <TopBadge title="HARDWARE DESIGN" subtitle="KICAD 9/10 ARCHITECTURE" icon="🛠️" />

      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <h2
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 54,
            fontWeight: 800,
            color: THEME.textPrimary,
            margin: "0 0 8px 0",
          }}
        >
          8 Gold ENIG Touch Keys
        </h2>
        <p
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 24,
            color: THEME.accentGold,
            margin: 0,
            fontWeight: 600,
          }}
        >
          15mm × 45mm Octave Keybed (C4 to C5) Directly on Top Copper
        </p>
      </div>

      {/* Top 3D Render */}
      <div
        style={{
          width: 980,
          height: 520,
          borderRadius: 28,
          overflow: "hidden",
          border: `1px solid ${THEME.surfaceCardBorder}`,
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.7)",
          background: "#08080c",
          position: "relative",
          marginBottom: 32,
        }}
      >
        <Img
          src={staticFile("images/board_top_3d.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Technical Metric Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          width: 980,
        }}
      >
        {[
          { label: "Board Size", val: "180 × 75 mm", sub: "4mm Corner Radii" },
          { label: "Surface Finish", val: "ENIG Gold", sub: "Anti-oxidation" },
          { label: "Power Rail", val: "3.3V / 500mA", sub: "TLV75533 LDO" },
        ].map((item, idx) => (
          <div
            key={idx}
            style={{
              background: THEME.surfaceCard,
              border: `1px solid ${THEME.surfaceCardBorder}`,
              borderRadius: 20,
              padding: "20px 24px",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 16,
                color: THEME.textSecondary,
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              {item.label}
            </span>
            <h4
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 28,
                color: THEME.accentCyan,
                fontWeight: 800,
                margin: "6px 0 2px 0",
              }}
            >
              {item.val}
            </h4>
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 16,
                color: THEME.accentGold,
                fontWeight: 500,
              }}
            >
              {item.sub}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 4: Controls, Reverse NeoPixels & Schematics (Frames 827 - 1178)
// ═══════════════════════════════════════════════════════════════════════════════
const Scene4ControlsOptics: React.FC = () => {
  const frame = useCurrentFrame();
  const relFrame = frame - 827;

  const opacity = interpolate(relFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 160,
      }}
    >
      <TopBadge title="OPTICS & CONTROLS" subtitle="REVERSE NEOPIXELS & FADER" icon="✨" />

      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h2
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 52,
            fontWeight: 800,
            color: THEME.textPrimary,
            margin: "0 0 8px 0",
          }}
        >
          Reverse-Mount Optical Glow
        </h2>
        <p
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 24,
            color: THEME.accentCyan,
            margin: 0,
          }}
        >
          SK6812 RGBs shine upward through precision FR4 cutouts
        </p>
      </div>

      {/* Split Cards: Bottom PCB & Schematic */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          width: 980,
          marginBottom: 28,
        }}
      >
        <div
          style={{
            height: 380,
            borderRadius: 24,
            overflow: "hidden",
            border: `1px solid ${THEME.surfaceCardBorder}`,
            background: "#08080c",
            position: "relative",
          }}
        >
          <Img
            src={staticFile("images/board_bottom_3d.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: 16,
              background: "rgba(0, 0, 0, 0.8)",
              padding: "6px 14px",
              borderRadius: 999,
              color: THEME.accentCyan,
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            Bottom Layer: 8x SK6812 MINI-E
          </div>
        </div>

        <div
          style={{
            height: 380,
            borderRadius: 24,
            overflow: "hidden",
            border: `1px solid ${THEME.surfaceCardBorder}`,
            background: "#ffffff",
            position: "relative",
          }}
        >
          <Img
            src={staticFile("images/schematic_kicad.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: 16,
              background: "rgba(0, 0, 0, 0.8)",
              padding: "6px 14px",
              borderRadius: 999,
              color: THEME.accentGold,
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            Electrical Schematic
          </div>
        </div>
      </div>

      {/* Feature Breakdown Bento */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          width: 980,
        }}
      >
        <div
          style={{
            background: THEME.surfaceCard,
            border: `1px solid ${THEME.surfaceCardBorder}`,
            borderRadius: 20,
            padding: "18px 22px",
          }}
        >
          <span style={{ fontSize: 24 }}>🎛️</span>
          <h4 style={{ color: THEME.textPrimary, margin: "6px 0 2px 0", fontSize: 20 }}>
            Bourns 45mm Fader
          </h4>
          <span style={{ color: THEME.textSecondary, fontSize: 16 }}>
            Pitch Bend & Modulation
          </span>
        </div>

        <div
          style={{
            background: THEME.surfaceCard,
            border: `1px solid ${THEME.surfaceCardBorder}`,
            borderRadius: 20,
            padding: "18px 22px",
          }}
        >
          <span style={{ fontSize: 24 }}>🔘</span>
          <h4 style={{ color: THEME.textPrimary, margin: "6px 0 2px 0", fontSize: 20 }}>
            EC11 Rotary Encoder
          </h4>
          <span style={{ color: THEME.textSecondary, fontSize: 16 }}>
            Filter Cutoff + Sustain Push
          </span>
        </div>

        <div
          style={{
            background: THEME.surfaceCard,
            border: `1px solid ${THEME.surfaceCardBorder}`,
            borderRadius: 20,
            padding: "18px 22px",
          }}
        >
          <span style={{ fontSize: 24 }}>🛡️</span>
          <h4 style={{ color: THEME.textPrimary, margin: "6px 0 2px 0", fontSize: 20 }}>
            USBLC6-2SC6 ESD
          </h4>
          <span style={{ color: THEME.textSecondary, fontSize: 16 }}>
            TVS Diode Protection
          </span>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 5: Firmware DSP & Live DAW Integration (Frames 1178 - 1417)
// ═══════════════════════════════════════════════════════════════════════════════
const Scene5FirmwareDAW: React.FC = () => {
  const frame = useCurrentFrame();
  const relFrame = frame - 1178;

  const opacity = interpolate(relFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 160,
      }}
    >
      <TopBadge title="FIRMWARE & PERFORMANCE" subtitle="500HZ USB-MIDI STACK" icon="⚡" />

      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h2
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 54,
            fontWeight: 800,
            color: THEME.textPrimary,
            margin: "0 0 8px 0",
          }}
        >
          Sub-Millisecond Response
        </h2>
        <p
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 24,
            color: THEME.accentGreen,
            margin: 0,
            fontWeight: 600,
          }}
        >
          Class-Compliant USB-MIDI • Zero Latency in Any DAW
        </p>
      </div>

      {/* Live MIDI Telemetry Card */}
      <div
        style={{
          width: 980,
          background: "rgba(10, 10, 16, 0.9)",
          border: `1px solid ${THEME.surfaceCardBorder}`,
          borderRadius: 28,
          padding: "36px 44px",
          boxShadow: "0 32px 80px rgba(0, 0, 0, 0.7)",
          marginBottom: 32,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <span style={{ fontSize: 16, color: THEME.textSecondary, textTransform: "uppercase" }}>
              Active MIDI Output
            </span>
            <h3 style={{ fontSize: 36, color: THEME.textPrimary, margin: "4px 0 0 0" }}>
              Ableton Live / Logic Pro / FL Studio
            </h3>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: 16, color: THEME.textSecondary, textTransform: "uppercase" }}>
              Poll Rate
            </span>
            <h3 style={{ fontSize: 36, color: THEME.accentGreen, margin: "4px 0 0 0" }}>
              500 Hz (~2ms)
            </h3>
          </div>
        </div>

        {/* Animated Touch Velocity Waves */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            height: 120,
            gap: 12,
            background: "rgba(255, 255, 255, 0.02)",
            borderRadius: 16,
            padding: "16px 20px",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          {[65, 80, 95, 110, 127, 88, 72, 105, 92, 118, 127, 85, 99, 115, 127, 102].map(
            (val, i) => {
              const h = Math.abs(Math.sin(frame * 0.15 + i * 0.4)) * 80 + 15;
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${h}%`,
                    background:
                      i % 2 === 0
                        ? "linear-gradient(to top, #f5a623, #ff9500)"
                        : "linear-gradient(to top, #00f0ff, #0070ba)",
                    borderRadius: 6,
                  }}
                />
              );
            }
          )}
        </div>
      </div>

      {/* DSP Pipeline Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 20,
          width: 980,
        }}
      >
        <div
          style={{
            background: THEME.surfaceCard,
            border: `1px solid ${THEME.surfaceCardBorder}`,
            borderRadius: 22,
            padding: "22px 28px",
          }}
        >
          <span style={{ color: THEME.accentGold, fontSize: 20, fontWeight: 700 }}>
            Adaptive Baseline Calibration
          </span>
          <p style={{ color: THEME.textSecondary, fontSize: 18, margin: "6px 0 0 0", lineHeight: 1.4 }}>
            64 baseline samples on boot reject temperature drift and humidity shifts.
          </p>
        </div>

        <div
          style={{
            background: THEME.surfaceCard,
            border: `1px solid ${THEME.surfaceCardBorder}`,
            borderRadius: 22,
            padding: "22px 28px",
          }}
        >
          <span style={{ color: THEME.accentCyan, fontSize: 20, fontWeight: 700 }}>
            8-Point EMA Analog Filter
          </span>
          <p style={{ color: THEME.textSecondary, fontSize: 18, margin: "6px 0 0 0", lineHeight: 1.4 }}>
            Eliminates wiper jitter on slide potentiometer for smooth 14-bit pitch bend.
          </p>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 6: Outro & GitHub Open Source (Frames 1417 - 1740)
// ═══════════════════════════════════════════════════════════════════════════════
const Scene6Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const relFrame = frame - 1417;

  const opacity = interpolate(relFrame, [0, 15, 300, 323], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 48px",
      }}
    >
      <div
        style={{
          width: 140,
          height: 140,
          borderRadius: 36,
          background: "linear-gradient(135deg, #f5a623 0%, #ff5500 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 64,
          boxShadow: "0 24px 72px rgba(245, 166, 35, 0.4)",
          marginBottom: 36,
        }}
      >
        🎹
      </div>

      <h1
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 76,
          fontWeight: 800,
          color: THEME.textPrimary,
          margin: "0 0 12px 0",
          letterSpacing: "-0.03em",
          textAlign: "center",
        }}
      >
        HLF-MIDI
      </h1>

      <p
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 32,
          fontWeight: 600,
          color: THEME.accentGold,
          margin: "0 0 40px 0",
          textAlign: "center",
        }}
      >
        21 Hours Logged • Ready for Fabrication
      </p>

      {/* Summary Bento Card */}
      <div
        style={{
          width: 900,
          background: THEME.surfaceCard,
          border: `1px solid ${THEME.surfaceCardBorder}`,
          borderRadius: 28,
          padding: "36px 44px",
          textAlign: "center",
          boxShadow: "0 32px 80px rgba(0, 0, 0, 0.6)",
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 20,
            color: THEME.textSecondary,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontWeight: 700,
          }}
        >
          Hack Club Half Life Hardware Grant
        </span>
        <h3
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 38,
            fontWeight: 800,
            color: THEME.textPrimary,
            margin: "12px 0 16px 0",
          }}
        >
          github.com/AwesomeSno/HLF-MIDI
        </h3>
        <p
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 22,
            color: THEME.accentCyan,
            margin: 0,
            fontWeight: 600,
          }}
        >
          KiCad Project • Gerbers • SMT CPL • BOM • ESP32 Firmware
        </p>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ROOT COMPOSITION
// ═══════════════════════════════════════════════════════════════════════════════
export const HlfMidiFinalSubmissionReel: React.FC = () => {
  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: THEME.bg,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Ambience */}
      <StudioStageLight />

      {/* Audio Stems */}
      <Audio
        src={staticFile("hlf_midi_final_submission_voice.mp3")}
        volume={1.0}
      />
      <Audio
        src={staticFile("bg-music.mp3")}
        volume={(f) =>
          interpolate(f, [0, 30, 1680, 1740], [0, 0.12, 0.12, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />

      {/* Visual Scenes */}
      <Sequence from={0} durationInFrames={240}>
        <Scene1Hero />
      </Sequence>

      <Sequence from={240} durationInFrames={306}>
        <Scene2Concept />
      </Sequence>

      <Sequence from={546} durationInFrames={281}>
        <Scene3KiCadPCB />
      </Sequence>

      <Sequence from={827} durationInFrames={351}>
        <Scene4ControlsOptics />
      </Sequence>

      <Sequence from={1178} durationInFrames={239}>
        <Scene5FirmwareDAW />
      </Sequence>

      <Sequence from={1417} durationInFrames={323}>
        <Scene6Outro />
      </Sequence>

      {/* Subtitles Overlay */}
      <SubtitleOverlay />
    </div>
  );
};
