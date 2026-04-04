# CineStream - Modern OTT Mobile App

A Netflix-style movie streaming app built with Expo (React Native), Supabase, and IMDb API.

## Features

- Browse movies in a beautiful grid layout
- View detailed movie information fetched from IMDb API
- Watch trailers via YouTube integration
- Add new movies to your collection
- Pull-to-refresh functionality
- Smooth animations and transitions
- Dark theme with premium UI

## Tech Stack

- **Expo (React Native)** - Mobile framework
- **Supabase** - Database and backend
- **IMDb API** - Movie data (posters, ratings, plots, etc.)
- **React Navigation** - Navigation system
- **React Native Reanimated** - Smooth animations
- **Expo Linear Gradient** - Beautiful gradients

## Prerequisites

- Node.js 16+
- npm or yarn
- Expo Go app (for mobile testing)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

The project is already configured with Supabase credentials in the `.env` file:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

The Supabase database is already set up with the `movies` table:

- `id` (uuid) - Primary key
- `name` (text) - Movie name
- `imdb_id` (text) - IMDb ID in tt format
- `youtube_url` (text) - YouTube trailer URL
- `created_at` (timestamp) - Creation timestamp

### 4. Run the App

```bash
npm run dev
```

This will start the Expo development server. You can then:

- Press `w` to open in web browser
- Scan the QR code with Expo Go app (iOS/Android)
- Press `i` for iOS simulator (Mac only)
- Press `a` for Android emulator

## How to Use

### Adding a Movie

1. Tap the "+" button or go to the "Add Movie" tab
2. Enter the movie name
3. Enter the IMDb ID (find it on imdb.com, e.g., tt0111161 for Shawshank Redemption)
4. Enter the YouTube trailer URL
5. Tap "Add Movie"

The app will automatically fetch:
- Poster image
- IMDb rating
- Release year
- Genres
- Plot/description

### Viewing Movie Details

1. Tap any movie card on the home screen
2. View full details including poster, rating, genres, and plot
3. Watch the trailer by tapping the "Play" button

## Project Structure

```
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Tabs navigation
│   │   ├── index.tsx        # Home screen
│   │   └── add.tsx          # Add movie screen
│   ├── movie/
│   │   └── [id].tsx         # Movie details screen
│   └── _layout.tsx          # Root layout
├── components/
│   ├── MovieCard.tsx        # Movie card component
│   ├── Header.tsx           # Header component
│   ├── FloatingButton.tsx   # Floating action button
│   ├── Loader.tsx           # Loading component
│   └── InputField.tsx       # Input field component
├── lib/
│   └── supabase.ts          # Supabase client
├── services/
│   └── imdb.ts              # IMDb API service
└── types/
    └── movie.ts             # TypeScript types
```

## API Integration

### IMDb API

Endpoint: `https://api.imdbapi.dev/titles/{titleId}`

The app fetches:
- Primary poster image
- Title and release year
- IMDb rating
- Genres
- Plot description

### YouTube Integration

- Extracts video ID from YouTube URLs
- Displays thumbnail in movie details
- Opens YouTube app when "Play" button is tapped

## Customization

### Colors

The app uses a Netflix-inspired color scheme:

- Primary: `#E50914` (Red)
- Background: `#000000` (Black)
- Secondary Background: `#1a1a1a` (Dark Gray)
- Text: `#ffffff` (White)
- Secondary Text: `#999999` (Light Gray)

### Animations

All animations are built with `react-native-reanimated` for smooth 60fps performance:

- Card press animations
- Floating button animations
- Loading skeletons
- Navigation transitions

## Troubleshooting

### Movies not loading

- Check your internet connection
- Verify the IMDb API is accessible
- Check Supabase connection in the `.env` file

### YouTube not opening

- Ensure you have the YouTube app installed
- Verify the YouTube URL format is correct

## Future Enhancements

- Search functionality
- Categories/Genres filtering
- Watchlist/Favorites
- User authentication
- Reviews and comments
- Share movies with friends

## License

MIT
