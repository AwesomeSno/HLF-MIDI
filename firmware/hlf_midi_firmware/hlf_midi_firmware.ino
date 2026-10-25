/*
 * HLF-MIDI - ESP32-S3 Solid-State Capacitive Touch MIDI Controller
 * Built for Hack Club's Half Life Hardware Grant
 * 
 * Hardware Pinout:
 * - Touch Keys 1-8: GPIO 1 to 8 (C4 through C5)
 * - EC11 Rotary Encoder: GPIO 9 (A), GPIO 10 (B), GPIO 11 (Switch)
 * - Slide Fader: GPIO 12 (ADC1 Channel 1)
 * - Octave Switches: GPIO 13 (Down), GPIO 14 (Up)
 * - SK6812 NeoPixels: GPIO 21 (8x reverse-mount addressable RGB)
 * - Native USB: GPIO 19 (D-), GPIO 20 (D+)
 */

#include <Arduino.h>
#include "USB.h"
#include "USBMIDI.h"
#include <Adafruit_NeoPixel.h>

USBMIDI MIDI;

// Hardware Pin Definitions
const int TOUCH_PINS[8] = {1, 2, 3, 4, 5, 6, 7, 8};
const int ENC_PIN_A = 9;
const int ENC_PIN_B = 10;
const int ENC_SW_PIN = 11;
const int FADER_ADC_PIN = 12;
const int OCT_DOWN_PIN = 13;
const int OCT_UP_PIN = 14;
const int NEOPIXEL_PIN = 21;
const int NUM_KEYS = 8;

Adafruit_NeoPixel leds(NUM_KEYS, NEOPIXEL_PIN, NEO_GRB + NEO_KHZ800);

// Capacitive Touch State & Calibration
uint32_t touchBaseline[8] = {0};
bool keyActive[8] = {false};
const uint32_t TOUCH_HYSTERESIS_DROP = 4500; // Calibrated drop threshold

// Musical Scale Configuration
int currentOctave = 4; // Default C4 octave
const uint8_t SCALE_INTERVALS[8] = {0, 2, 4, 5, 7, 9, 11, 12}; // Major scale C to C

// Rotary Encoder State
volatile int encoderPos = 64; // CC 0-127 centered
int lastEncoderPos = 64;
int lastEncAState = HIGH;

// Fader / Modulation State
int lastFaderMidiVal = -1;
uint32_t faderSmoothEMA = 0;

// LED Color Palettes per Octave
const uint32_t OCTAVE_COLORS[7] = {
  0x00FF88, // C2 - Mint
  0x00D4FF, // C3 - Cyan
  0x7000FF, // C4 - Violet
  0xFF007F, // C5 - Magenta
  0xFF5500, // C6 - Amber
  0xFAFF00, // C7 - Gold
  0xFFFFFF  // C8 - Diamond White
};

void IRAM_ATTR readEncoderISR() {
  int aState = digitalRead(ENC_PIN_A);
  int bState = digitalRead(ENC_PIN_B);
  if (aState != lastEncAState && aState == LOW) {
    if (bState != aState) {
      if (encoderPos < 127) encoderPos++;
    } else {
      if (encoderPos > 0) encoderPos--;
    }
  }
  lastEncAState = aState;
}

void calibrateTouchSensors() {
  // Collect 64 baseline samples while untouched
  for (int sample = 0; sample < 64; sample++) {
    for (int i = 0; i < NUM_KEYS; i++) {
      touchBaseline[i] += touchRead(TOUCH_PINS[i]);
    }
    delay(5);
  }
  for (int i = 0; i < NUM_KEYS; i++) {
    touchBaseline[i] /= 64;
  }
}

void setup() {
  Serial.begin(115200);

  // Initialize USB-MIDI stack
  MIDI.begin();
  USB.begin();

  // Pin Modes
  pinMode(ENC_PIN_A, INPUT_PULLUP);
  pinMode(ENC_PIN_B, INPUT_PULLUP);
  pinMode(ENC_SW_PIN, INPUT_PULLUP);
  pinMode(OCT_DOWN_PIN, INPUT_PULLUP);
  pinMode(OCT_UP_PIN, INPUT_PULLUP);
  analogReadResolution(12);

  attachInterrupt(digitalPinToInterrupt(ENC_PIN_A), readEncoderISR, CHANGE);

  // Initialize LEDs
  leds.begin();
  leds.setBrightness(40); // 15% brightness for slim thermal budget
  for (int i = 0; i < NUM_KEYS; i++) {
    leds.setPixelColor(i, OCTAVE_COLORS[currentOctave - 2]);
  }
  leds.show();

  // Calibrate touch sensors
  calibrateTouchSensors();
}

void loop() {
  // 1. Scan Capacitive Touch Keys
  for (int i = 0; i < NUM_KEYS; i++) {
    uint32_t val = touchRead(TOUCH_PINS[i]);
    bool isTouched = (val < (touchBaseline[i] - TOUCH_HYSTERESIS_DROP));
    uint8_t midiNote = (currentOctave * 12) + SCALE_INTERVALS[i];

    if (isTouched && !keyActive[i]) {
      keyActive[i] = true;
      MIDI.noteOn(midiNote, 100, 1); // Note on, velocity 100, channel 1
      leds.setPixelColor(i, 0xFFFFFF); // Glow white on strike
      leds.show();
    } else if (!isTouched && keyActive[i]) {
      keyActive[i] = false;
      MIDI.noteOff(midiNote, 0, 1);
      leds.setPixelColor(i, OCTAVE_COLORS[currentOctave - 2]); // Return to octave accent
      leds.show();
    }
  }

  // 2. Rotary Encoder -> MIDI CC #74 (Brightness / Filter Cutoff)
  if (encoderPos != lastEncoderPos) {
    lastEncoderPos = encoderPos;
    MIDI.controlChange(74, encoderPos, 1);
  }

  // 3. Encoder Push Switch -> MIDI CC #64 (Sustain Pedal)
  static bool lastSwState = HIGH;
  bool swState = digitalRead(ENC_SW_PIN);
  if (swState != lastSwState) {
    lastSwState = swState;
    if (swState == LOW) {
      MIDI.controlChange(64, 127, 1); // Sustain on
    } else {
      MIDI.controlChange(64, 0, 1);   // Sustain off
    }
  }

  // 4. Slide Potentiometer -> MIDI Pitch Bend
  uint32_t rawAdc = analogRead(FADER_ADC_PIN);
  faderSmoothEMA = (faderSmoothEMA * 7 + rawAdc) >> 3; // 8-point EMA jitter filter
  int faderVal = map(faderSmoothEMA, 0, 4095, -8192, 8191);
  static int lastPitchBend = 0;
  if (abs(faderVal - lastPitchBend) > 64) {
    lastPitchBend = faderVal;
    MIDI.pitchBend(faderVal, 1);
  }

  // 5. Octave Buttons
  static unsigned long lastBtnTime = 0;
  if (millis() - lastBtnTime > 180) {
    if (digitalRead(OCT_DOWN_PIN) == LOW && currentOctave > 2) {
      currentOctave--;
      lastBtnTime = millis();
      for (int i = 0; i < NUM_KEYS; i++) {
        leds.setPixelColor(i, OCTAVE_COLORS[currentOctave - 2]);
      }
      leds.show();
    } else if (digitalRead(OCT_UP_PIN) == LOW && currentOctave < 8) {
      currentOctave++;
      lastBtnTime = millis();
      for (int i = 0; i < NUM_KEYS; i++) {
        leds.setPixelColor(i, OCTAVE_COLORS[currentOctave - 2]);
      }
      leds.show();
    }
  }

  delay(2); // ~500Hz loop rate
}
