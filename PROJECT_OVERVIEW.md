# CineStream - Project Overview

## Architecture

### Tech Stack

- **Framework**: Expo (React Native) SDK 54
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Database**: Supabase (PostgreSQL)
- **External API**: IMDb API (https://api.imdbapi.dev)
- **Animations**: React Native Reanimated 4
- **UI Components**: Custom components with React Native core

### Project Structure

```
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── _layout.tsx           # Tab bar configuration
│   │   ├── index.tsx             # Home screen (movie grid)
│   │   └── add.tsx               # Add movie screen
│   ├── movie/
│   │   └── [id].tsx              # Movie details screen (dynamic route)
│   ├── _layout.tsx               # Root layout
│   └── +not-found.tsx            # 404 screen
│
├── components/                   # Reusable UI components
│   ├── MovieCard.tsx             # Movie card with poster & rating
│   ├── MovieCardSkeleton.tsx     # Loading skeleton
│   ├── Header.tsx                # Screen header
│   ├── FloatingButton.tsx        # Floating action button
│   ├── InputField.tsx            # Form input field
│   └── Loader.tsx                # Full-screen loader
│
├── lib/
│   └── supabase.ts               # Supabase client initialization
│
├── services/
│   └── imdb.ts                   # IMDb API service with caching
│
├── types/
│   └── movie.ts                  # TypeScript interfaces
│
├── utils/
│   ├── validation.ts             # Input validation functions
│   └── format.ts                 # Data formatting functions
│
├── constants/
│   └── theme.ts                  # App colors, spacing, fonts
│
├── hooks/
│   └── useFrameworkReady.ts      # Framework initialization hook
│
└── scripts/
    └── sample-movies.sql         # Sample data for testing
```

## Database Schema

### Movies Table

```sql
CREATE TABLE movies (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  imdb_id       text NOT NULL UNIQUE,
  youtube_url   text NOT NULL,
  created_at    timestamptz DEFAULT now()
);
```

### Row Level Security (RLS)

- **SELECT**: Public access (anyone can view movies)
- **INSERT**: Authenticated users only (can add movies)
- **UPDATE**: Not implemented (add if needed)
- **DELETE**: Not implemented (add if needed)

## Data Flow

### Home Screen Flow

1. App loads → Fetch movies from Supabase
2. For each movie → Fetch IMDb data using `imdb_id`
3. Cache IMDb responses to avoid repeated API calls
4. Display movies in a 2-column grid with posters and ratings
5. Pull-to-refresh reloads all data

### Movie Details Flow

1. User taps movie card → Navigate with movie data as params
2. Display full IMDb details (poster, rating, plot, genres, year)
3. Show YouTube thumbnail extracted from URL
4. Play button → Open YouTube app via Linking API

### Add Movie Flow

1. User fills form (name, IMDb ID, YouTube URL)
2. Validate inputs using utility functions
3. Insert into Supabase movies table
4. Navigate back to home screen
5. Home screen auto-refreshes with new movie

## Key Features

### Performance Optimizations

- **IMDb API Caching**: In-memory Map cache prevents duplicate API calls
- **Skeleton Loading**: Show loading state without blocking UI
- **Image Caching**: React Native's Image component handles caching
- **Pull-to-Refresh**: Manual refresh without full app reload

### Animations

- **Card Press**: Spring animation scales card down on press
- **Floating Button**: Spring animation on press
- **Skeleton Loader**: Pulse animation while loading
- **Page Transitions**: Native navigation animations

### Error Handling

- **Inline Error Messages**: Display errors in UI (no alerts)
- **Fallback Posters**: Show placeholder if poster URL fails
- **Validation Feedback**: Real-time form validation
- **API Error Recovery**: Graceful degradation if IMDb API fails

## API Integration

### IMDb API

**Endpoint**: `GET https://api.imdbapi.dev/titles/{imdbId}`

**Response Shape**:
```typescript
{
  id: string;
  primaryImage?: {
    url: string;
  };
  titleText: {
    text: string;
  };
  releaseYear?: {
    year: number;
  };
  ratingsSummary?: {
    aggregateRating?: number;
  };
  genres?: {
    genres: Array<{ text: string }>;
  };
  plot?: {
    plotText?: {
      plainText: string;
    };
  };
}
```

**Caching Strategy**:
- In-memory Map cache
- Cache key: IMDb ID
- No expiration (session-based)
- Consider adding TTL for production

### YouTube Integration

**Thumbnail URL Pattern**:
```
https://img.youtube.com/vi/{VIDEO_ID}/maxresdefault.jpg
```

**Deep Link Pattern**:
```typescript
Linking.openURL(youtubeUrl)
```

Opens YouTube app if installed, falls back to browser.

## Design System

### Color Palette

```typescript
Primary: #E50914 (Netflix Red)
Background: #000000 (Pure Black)
Cards: #1a1a1a (Dark Gray)
Text: #ffffff (White)
Secondary Text: #999999 (Light Gray)
Accent: #FFD700 (Gold - for ratings)
```

### Typography

- **Titles**: 32px, Bold (-0.5 letter spacing)
- **Headings**: 20px, Bold
- **Body**: 16px, Regular
- **Captions**: 14px, Regular

### Spacing System

- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 20px
- **xxl**: 24px
- **xxxl**: 32px

### Border Radius

- **Cards**: 12px
- **Buttons**: 12px
- **Inputs**: 12px
- **Floating Button**: 30px (circle)

## Environment Variables

```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Access in code:
```typescript
process.env.EXPO_PUBLIC_SUPABASE_URL
```

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for web
npm run build:web

# Type checking
npm run typecheck

# Linting
npm run lint
```

## Future Enhancements

### Recommended Features

1. **Search & Filter**
   - Search by title
   - Filter by genre, year, rating
   - Sort options (date added, rating, year)

2. **User Features**
   - Authentication (sign up/login)
   - Personal watchlist
   - Favorite movies
   - Custom ratings & reviews

3. **Enhanced Details**
   - Cast & crew information
   - Similar movies
   - Where to watch (streaming platforms)
   - Awards & nominations

4. **Social Features**
   - Share movies with friends
   - Comments & discussions
   - Follow other users
   - Activity feed

5. **Performance**
   - Infinite scroll/pagination
   - Image lazy loading
   - Offline mode with local storage
   - Background sync

6. **UI Improvements**
   - Dark/light theme toggle
   - Customizable card sizes
   - List view option
   - Genre-based categories

## Testing

### Manual Testing Checklist

- [ ] Add a movie with valid data
- [ ] Try adding duplicate movie (should fail)
- [ ] Add movie with invalid IMDb ID
- [ ] Add movie with invalid YouTube URL
- [ ] View movie details
- [ ] Play YouTube trailer
- [ ] Pull to refresh on home screen
- [ ] Navigate between tabs
- [ ] Test with no movies (empty state)
- [ ] Test with slow network
- [ ] Test skeleton loading states

### Recommended Test Coverage

1. **Unit Tests**
   - Validation functions
   - Format functions
   - YouTube thumbnail extraction

2. **Integration Tests**
   - Supabase queries
   - IMDb API calls
   - Navigation flow

3. **E2E Tests**
   - Complete user flow (add → view → play)
   - Error scenarios
   - Network failure recovery

## Deployment

### Web Deployment

1. Build: `npm run build:web`
2. Output: `dist/` folder
3. Deploy to: Vercel, Netlify, or any static host

### Mobile Deployment

1. **Development Build**:
   ```bash
   eas build --profile development --platform ios
   eas build --profile development --platform android
   ```

2. **Production Build**:
   ```bash
   eas build --profile production --platform all
   ```

3. **Submit to Stores**:
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```

## Troubleshooting

### Common Issues

**IMDb API returns null:**
- Verify IMDb ID format (must be tt + 7-8 digits)
- Check if movie exists on IMDb
- Verify internet connection

**YouTube won't open:**
- Ensure YouTube app is installed
- Check URL format
- Verify Linking permission in app.json

**Supabase connection fails:**
- Verify environment variables
- Check Supabase project status
- Verify RLS policies

**Build errors:**
- Clear cache: `expo start -c`
- Delete node_modules and reinstall
- Check TypeScript errors: `npm run typecheck`

## Contributing Guidelines

1. Follow existing code style (Prettier config included)
2. Use TypeScript strictly (no `any` types)
3. Add proper error handling
4. Test on both iOS and Android
5. Update documentation for new features
6. Follow component structure conventions

## License

MIT License - Feel free to use this project as a template for your own apps.

---

**Built with ❤️ using Expo and Supabase**
