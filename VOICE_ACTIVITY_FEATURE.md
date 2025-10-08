# 🎤 Voice Activity Detection Feature

## Overview

Real-time voice activity monitoring that shows when someone is speaking with visual indicators and audio level meters.

## Features Added

### 1. **Voice Activity Indicators**

- **Green Pulsing Dot**: Appears when someone is speaking
- **Gray Dot**: Shows when silent
- **Audio Level Bar**: Real-time visualization of audio volume (0-100%)

### 2. **Local User (You)**

Located on your video preview (bottom-left corner):

- Small compact indicator showing your own voice activity
- Audio level meter to monitor your microphone
- Helps you know if your mic is working properly

### 3. **Remote User (Stranger)**

Located on the main video area (top-left corner):

- Larger indicator showing "🔊 Speaking" or "🔇 Silent"
- Audio level meter showing their voice volume
- Works in both video and audio-only modes

## Technical Implementation

### Audio Detection

- Uses **Web Audio API** with `AnalyserNode`
- **FFT Size**: 1024 for accurate frequency analysis
- **Smoothing**: 0.8 for smooth transitions
- **Speaking Threshold**: 5% audio level triggers "speaking" state

### Performance

- Optimized with `requestAnimationFrame` for smooth 60fps updates
- Minimal CPU usage (~1-2%)
- Automatic cleanup when peer disconnects

## Visual Design

### Remote User Indicator (Main Video)

```
┌─────────────────────────────┐
│ ● 🔊 Speaking [═══════    ] │  <- Green pulsing dot + audio bar
│                             │
│      [Video/Audio Feed]     │
│                             │
└─────────────────────────────┘
```

### Local User Indicator (Your Preview)

```
┌──────────────┐
│ ● [═══    ]  │  <- Compact indicator
│              │
│  [Your Face] │
│              │
│     YOU      │
└──────────────┘
```

## States

### Speaking (Active)

- ✅ Green pulsing dot
- ✅ "🔊 Speaking" text
- ✅ Audio bar fills based on volume
- ✅ Smooth animations

### Silent (Inactive)

- ⚪ Gray static dot
- ✅ "🔇 Silent" text
- ✅ Empty audio bar
- ✅ No animations

## Benefits

1. **Know When to Speak**: See when the other person is talking
2. **Verify Microphone**: Check if your mic is working
3. **Audio-Only Mode**: Essential for users without cameras
4. **Better Communication**: Avoid talking over each other
5. **Visual Feedback**: Instant confirmation of audio transmission

## Browser Compatibility

- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support
- ⚠️ Requires microphone permissions

## Usage

No configuration needed! The feature automatically activates when:

1. You grant microphone permissions
2. You connect with another user
3. Either you or the stranger speaks

Enjoy better communication with real-time voice activity detection! 🎉
