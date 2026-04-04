# Quick Start - Get Running in 5 Minutes

## Step 1: Install Dependencies (30 seconds)

```bash
npm install
```

## Step 2: Start the App (30 seconds)

```bash
npm run dev
```

The Expo development server will start. You'll see a QR code in your terminal.

## Step 3: View the App (Choose One)

### Option A: Web Browser (Fastest)
Press `w` in the terminal to open in your web browser.

### Option B: Mobile Device
1. Install **Expo Go** app from App Store (iOS) or Google Play (Android)
2. Scan the QR code with your phone's camera
3. The app will open in Expo Go

### Option C: Simulator/Emulator
- **iOS**: Press `i` (requires Xcode on Mac)
- **Android**: Press `a` (requires Android Studio)

## Step 4: Add Sample Movies (1 minute)

### Option 1: Use the App
1. Tap the **"Add Movie"** tab
2. Add your first movie:
   - **Name**: The Shawshank Redemption
   - **IMDb ID**: tt0111161
   - **YouTube URL**: https://www.youtube.com/watch?v=6hB3S9bIaco
3. Tap **"Add Movie"**

### Option 2: Bulk Import (Recommended)
1. Open your [Supabase Dashboard](https://app.supabase.com)
2. Go to **SQL Editor**
3. Copy and paste the contents of `scripts/sample-movies.sql`
4. Click **Run**
5. Pull down to refresh in the app

## Step 5: Explore the App (3 minutes)

1. **Browse Movies**: See the grid of movies on the home screen
2. **View Details**: Tap any movie to see full details
3. **Watch Trailer**: Tap the "Play" button to open the YouTube trailer
4. **Add More**: Use the + button or Add Movie tab to expand your collection

---

## That's It!

You now have a fully functional OTT-style movie app running.

## Next Steps

- Read [USAGE.md](./USAGE.md) for detailed feature explanations
- Check [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) for architecture details
- Read [README.md](./README.md) for complete documentation

## Need Help?

### App is not loading movies?
- Check your internet connection
- Verify Supabase is running (check .env file)
- Pull down to refresh

### Can't find IMDb ID?
1. Go to https://www.imdb.com
2. Search for your movie
3. Look at the URL: The ID is the part that looks like `tt1234567`

### YouTube trailer not working?
- Make sure you have the YouTube app installed
- Use the full YouTube URL (not shortened youtu.be)
- Verify the video is not region-restricted

---

**Happy movie browsing!** 🎬
