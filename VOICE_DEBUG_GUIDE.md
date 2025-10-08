# Voice Detection Troubleshooting Guide

## Common Issues & Solutions

### Issue 1: Voice indicators not showing at all

**Solution:**

1. Check browser console for errors (F12 → Console)
2. Ensure microphone permissions are granted
3. Try refreshing the page and re-granting permissions

### Issue 2: Indicators show but don't respond to voice

**Possible Causes:**

- AudioContext not initialized properly
- Microphone input level too low
- Browser compatibility issue

**Debug Steps:**

1. **Check Microphone Access:**

   ```javascript
   // Open browser console (F12) and run:
   navigator.mediaDevices
     .getUserMedia({ audio: true })
     .then((stream) => console.log("Mic working:", stream.getAudioTracks()))
     .catch((err) => console.error("Mic error:", err));
   ```

2. **Test Audio Detection:**

   - Speak loudly and clearly
   - Watch the green audio level bar
   - Should fill up when speaking
   - Threshold is 5% - very sensitive

3. **Check Audio Level in Console:**
   - Add this temporarily to see audio levels:
   ```javascript
   console.log("Local Audio Level:", localAudioLevel);
   console.log("Is Speaking:", isSpeaking);
   ```

### Issue 3: Only local indicator works (not remote)

**Cause:** Remote stream not being analyzed
**Solution:**

- Ensure peer connection is established
- Check that `setupAudioMonitoring(stream, false)` is called for remote stream
- Verify remote stream has audio tracks

### Issue 4: Indicator lags or stutters

**Cause:** Performance issue
**Solution:**

- Close other browser tabs
- Reduce FFT size (currently 1024)
- Increase smoothing constant (currently 0.8)

## Verification Checklist

✅ Microphone permission granted  
✅ Green dot appears when you speak  
✅ Audio level bar fills when speaking  
✅ "Speaking" text shows when talking  
✅ Remote indicator appears when stranger speaks  
✅ Works in both video and audio-only modes

## Browser Console Commands

### Check if Audio Context is active:

```javascript
console.log("Audio Context State:", audioContextRef.current?.state);
```

### Check Analysers:

```javascript
console.log("Local Analyser:", localAnalyserRef.current);
console.log("Remote Analyser:", remoteAnalyserRef.current);
```

### Check Audio Tracks:

```javascript
console.log("Local Audio Tracks:", localStream?.getAudioTracks());
console.log("Remote Audio Tracks:", remoteStream?.getAudioTracks());
```

## Known Limitations

1. **AudioContext** may be suspended until user interaction (Chrome security)
2. **Safari** may require explicit AudioContext.resume()
3. **Firefox** works but may have different sensitivity
4. **Mobile browsers** may have restricted audio API access

## Quick Fix for AudioContext Suspended

If AudioContext is suspended, add this to your code:

```javascript
// Click anywhere to resume
document.addEventListener("click", () => {
  if (audioContextRef.current?.state === "suspended") {
    audioContextRef.current.resume();
  }
});
```

## Expected Behavior

### When Working Correctly:

1. **Load page** → Request mic permission
2. **Grant permission** → See your video/audio indicator
3. **Speak** → Green dot pulses + audio bar fills + "Speaking" shows
4. **Connect to peer** → Their indicator appears
5. **They speak** → Their indicator shows green + "Speaking"
6. **Silence** → Both show gray dots + "Silent"

### Audio Level Scale:

- **0-5%**: Silent (gray dot)
- **5-30%**: Normal speaking (green, small bar)
- **30-70%**: Loud speaking (green, medium bar)
- **70-100%**: Very loud/shouting (green, full bar)

## Testing Locally

To test voice detection with yourself:

1. Open TWO browser tabs
2. Both at `http://localhost:3000`
3. Click "Start" in both tabs
4. They should connect to each other
5. Speak in one tab → see indicator in the other tab
6. Use headphones to avoid echo!

## Still Not Working?

1. **Restart the server:**

   ```bash
   npm run dev
   ```

2. **Clear browser cache** (Ctrl+Shift+Delete)

3. **Try different browser:**

   - Chrome/Edge (best support)
   - Firefox (good support)
   - Safari (may need tweaks)

4. **Check server console** for WebRTC errors

5. **Verify Socket.IO connection:**
   - Should see "User connected" in server logs
   - Should see "Connected to signaling server" in browser console

## Contact for Support

If issues persist, check:

- Browser version (update if old)
- Operating system microphone settings
- Antivirus/firewall blocking WebRTC
- Network blocking UDP (required for WebRTC)
