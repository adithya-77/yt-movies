# CineStream - Quick Start Guide

## Adding Your First Movie

### Option 1: Using the App

1. Open the app and tap the **"Add Movie"** tab at the bottom
2. Fill in the required fields:
   - **Movie Name**: The title of the movie
   - **IMDb ID**: Find this on IMDb.com (format: tt followed by numbers)
   - **YouTube URL**: Link to the movie's trailer on YouTube
3. Tap **"Add Movie"**
4. The movie will appear on your home screen with all IMDb data loaded

### Option 2: Using SQL (Bulk Insert)

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy the contents of `scripts/sample-movies.sql`
4. Execute the query to add 10 popular movies at once

## Finding IMDb IDs

1. Go to [IMDb.com](https://www.imdb.com)
2. Search for your movie
3. Look at the URL: `https://www.imdb.com/title/tt0111161/`
4. The IMDb ID is `tt0111161`

## Finding YouTube Trailer URLs

1. Go to [YouTube.com](https://www.youtube.com)
2. Search for "[Movie Name] official trailer"
3. Copy the full URL from your browser
4. Accepted formats:
   - `https://www.youtube.com/watch?v=VIDEO_ID`
   - `https://youtu.be/VIDEO_ID`

## App Features Explained

### Home Screen

- **Grid View**: Browse all movies in a beautiful 2-column grid
- **Movie Cards**: Display poster, title, and IMDb rating
- **Pull to Refresh**: Swipe down to reload the movie list
- **Floating + Button**: Quick access to add a new movie

### Movie Details Screen

- **Hero Poster**: Full-screen movie poster with gradient overlay
- **Rating & Year**: See IMDb rating and release year at a glance
- **Genres**: View all movie genres
- **Plot**: Read the full movie description
- **Trailer Thumbnail**: Preview of the YouTube trailer
- **Play Button**: Opens the trailer in the YouTube app

### Add Movie Screen

- **Form Validation**: Real-time validation of all inputs
- **Error Messages**: Clear feedback if something goes wrong
- **Tips Section**: Helpful hints for finding IMDb IDs and URLs
- **Auto-redirect**: Returns to home screen after successful add

## Tips & Tricks

### Performance

- **Caching**: IMDb data is cached automatically to reduce API calls
- **Offline Support**: Previously loaded movies will display even without internet
- **Optimized Images**: Posters are loaded efficiently with proper caching

### Navigation

- **Back Button**: Tap the back arrow or swipe from the left edge (iOS)
- **Tab Bar**: Switch between Movies and Add Movie screens
- **Deep Linking**: Movie detail screens can be bookmarked or shared

### Troubleshooting

**Movie won't load IMDb data:**
- Verify the IMDb ID is correct (must start with "tt")
- Check your internet connection
- Try pulling to refresh on the home screen

**YouTube trailer won't open:**
- Make sure you have the YouTube app installed
- Verify the YouTube URL format is correct
- Check that the video is not region-restricted

**Movie already exists error:**
- Each IMDb ID can only be added once
- Check if the movie is already in your collection
- Try refreshing the home screen

## Advanced Usage

### Customizing the UI

All colors and styling are defined in `constants/theme.ts`. You can:

- Change the primary color from Netflix red to your brand color
- Adjust spacing and border radius values
- Modify font sizes and weights

### Adding More Data

You can extend the `movies` table in Supabase to include:

- Personal ratings
- Watch status (watched/unwatched)
- Custom notes
- Favorite flag
- Watch date

Then update the TypeScript types in `types/movie.ts` to match.

### API Rate Limiting

The IMDb API is free and doesn't require authentication. However:

- Results are cached in memory to reduce API calls
- If you experience issues, consider adding a rate limiter
- For production, consider using the official IMDb API with authentication

## Sample Movies Included

The `scripts/sample-movies.sql` file includes these popular movies:

1. The Shawshank Redemption (tt0111161)
2. The Godfather (tt0068646)
3. The Dark Knight (tt0468569)
4. Inception (tt1375666)
5. Pulp Fiction (tt0110912)
6. Forrest Gump (tt0109830)
7. The Matrix (tt0133093)
8. Interstellar (tt0816692)
9. The Lion King (tt0110357)
10. Avengers: Endgame (tt4154796)

## Next Steps

1. **Add your favorite movies** using the Add Movie screen
2. **Explore movie details** by tapping on any movie card
3. **Watch trailers** using the YouTube integration
4. **Customize the theme** to match your style
5. **Share with friends** and build your movie collection together

Enjoy your personal movie streaming app!
