# ⚡ Quick Start Guide

## 🎯 Start the App (3 Easy Steps)

### 1️⃣ Open Terminal

Press `` Ctrl + ` `` in VS Code

### 2️⃣ Run Command

```bash
npm run dev
```

### 3️⃣ Open Browser

Go to: **http://localhost:3000**

---

## ✅ You're Ready When You See:

### In Terminal:

```
> Ready on http://localhost:3000
```

### In Browser:

- VicoChat interface appears
- Camera permission popup appears (click "Allow")

---

## 🎮 Test It Works

### Option A: Two Browser Tabs

1. Open Tab 1: http://localhost:3000
2. Open Tab 2: http://localhost:3000
3. Click **"Random Chat"** in BOTH tabs
4. They will connect to each other! 🎉

### Option B: Create & Join Room

1. **Tab 1:** Click "Create Room" → Copy the Room ID
2. **Tab 2:** Click "Join Room" → Paste Room ID → Join
3. You're connected! 🎊

---

## 🚨 If It's Not Working

### Check These:

1. ✅ Is terminal showing "Ready on http://localhost:3000"?
2. ✅ Did you allow camera/mic permissions?
3. ✅ Are you testing with TWO tabs/devices?
4. ✅ Press F12 → Console tab → Any errors?

### Common Fix:

**Stop and restart the server:**

```bash
# Press Ctrl+C in terminal to stop
# Then run again:
npm run dev
```

---

## 📱 Mobile Testing

### On Your Phone:

1. Find your computer's IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Edit line 43 in `src/hooks/useVideoChat.ts`:
   ```typescript
   const newSocket = io('http://YOUR_IP:3000', {
   ```
   Example: `http://192.168.1.100:3000`
3. On phone browser: `http://YOUR_IP:3000`

---

## 🎉 That's It!

**Server Running → Browser Open → Allow Camera → Click Button → Chat!**

Need detailed help? See **HOW_TO_USE.md**
