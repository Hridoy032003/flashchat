# 🎥 VicoChat - How to Use

## 🚨 IMPORTANT: The Problem Was...

**Your video chat wasn't working because THE SERVER WASN'T RUNNING!**

The app needs **TWO things** to work:

1. ✅ The Next.js frontend (the website)
2. ✅ The Socket.IO server (handles video connections)

When you run `npm run dev`, it starts **BOTH** at the same time.

---

## 🚀 How to Start the App

### Step 1: Open Terminal in VS Code

- Press `` Ctrl + ` `` (backtick key)

### Step 2: Run the Server

```bash
npm run dev
```

### Step 3: Wait for This Message

```
> Ready on http://localhost:3000
```

### Step 4: Open Browser

- Go to: **http://localhost:3000**
- Allow camera/microphone permissions when prompted

---

## 📱 How to Use the Features

### 🎲 Random Chat

1. Click **"Random Chat"** button
2. Wait for the app to find someone (you'll see "Searching..." toast)
3. When matched, video will appear automatically
4. Start chatting!

**Note:** You need **TWO browser tabs** or **TWO devices** to test this feature:

- Open http://localhost:3000 in Tab 1
- Open http://localhost:3000 in Tab 2
- Click "Random Chat" in both tabs
- They will connect to each other!

### 🚪 Create Room

1. Click **"Create Room"** button
2. A Room ID will appear (e.g., "U3U740")
3. **Copy the Room ID** and share it
4. Have your friend enter this Room ID on their device

### 🔗 Join Room

1. Get a Room ID from your friend
2. Click **"Join Room"** button
3. Enter the Room ID
4. Click "Join" or press Enter
5. You'll connect to your friend's room!

---

## 🔧 Troubleshooting

### Problem: "Random Chat" Not Working

**Solution:**

- Make sure the server is running (`npm run dev`)
- Open **TWO browser tabs/windows** to test
- Check browser console for errors (F12)

### Problem: Video Not Appearing

**Possible causes:**

1. **Camera/Mic blocked** - Click the 🔒 lock icon in browser address bar and allow permissions
2. **Server not running** - Make sure you see "Ready on http://localhost:3000" in terminal
3. **Browser not supported** - Use Chrome, Firefox, or Edge (not Internet Explorer)

### Problem: Can't Join Room

**Solutions:**

1. Make sure Room ID is typed correctly (case-sensitive)
2. The room creator must be waiting (they clicked "Create Room")
3. Server must be running

### Problem: Mobile Not Working

**New Fix Applied! ✅**

- All buttons are now full-width on mobile
- Buttons stack vertically on iPhone SE and small screens
- Minimum 50px tap target height for easy clicking
- All responsive fixes are already applied in the latest code

---

## 📊 Server Logs Explained

When the server is running, you'll see logs like:

```
User connected: jETekPS_m6i8oHkTAAAB
```

✅ A user opened the website

```
User looking for peer: vKy-H6fYdq_LexVGAAAD
```

✅ Someone clicked "Random Chat"

```
Room matched: ABC123 with XYZ789 in room U3U740
```

✅ Two users successfully connected in a room

```
User disconnected: jETekPS_m6i8oHkTAAAB
```

❌ A user left or closed the browser

---

## 🌐 Testing on Your Phone

### Same WiFi Network (Easiest):

1. Find your computer's local IP address:

   - Windows: Open Command Prompt, type `ipconfig`
   - Look for "IPv4 Address" (e.g., 192.168.1.100)

2. Edit `useVideoChat.ts` line 43:

   ```typescript
   // Change from:
   const newSocket = io('http://localhost:3000', {

   // To:
   const newSocket = io('http://192.168.1.100:3000', {
   ```

3. On your phone's browser, go to: `http://192.168.1.100:3000`

### Over Internet (Advanced):

- You need to deploy to a hosting service like Vercel, Render, or Railway
- Or use ngrok for temporary public URL

---

## 🆘 Still Not Working?

### Check Browser Console

1. Press **F12** in your browser
2. Click **Console** tab
3. Look for errors in red
4. You should see green checkmark emoji (✅) when things work

### Enhanced Logging (Already Added!)

The app now shows helpful emojis in console:

- 🔍 Finding peer
- 🚪 Joining room
- 🔗 Creating peer connection
- 📡 Sending/receiving signals
- 🎥 Video stream received
- ✅ Connection successful
- ❌ Errors

---

## 💡 Pro Tips

1. **Always keep the terminal open** - You can see real-time connection logs
2. **Test with two tabs first** before trying with another device
3. **Check your WiFi** - Weak WiFi can cause connection issues
4. **Close other video calling apps** - They might block camera access
5. **Use Chrome/Firefox** - Best browser support for WebRTC

---

## ✅ Quick Checklist

Before reporting issues, verify:

- [ ] Server is running (`npm run dev` executed)
- [ ] Browser shows "http://localhost:3000"
- [ ] Camera/microphone permissions granted
- [ ] Using two separate tabs/devices to test
- [ ] No errors in browser console (F12)
- [ ] Terminal shows "Ready on http://localhost:3000"

---

## 🎯 Summary

**The main issue was:** You were trying to use the app without the server running!

**The fix:** Always run `npm run dev` before opening the app in browser.

**Now it should work perfectly!** 🎉

All mobile responsive fixes are already applied:

- ✅ Vertical button layout on mobile
- ✅ Full-width buttons on screens < 640px
- ✅ Proper tap targets (50px height)
- ✅ Touch-friendly active states
- ✅ iPhone SE (320px) compatible

Enjoy your video chat app! 🚀
