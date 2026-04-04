/*
  # Create movies table for OTT app

  1. New Tables
    - `movies`
      - `id` (uuid, primary key) - Unique identifier for each movie
      - `name` (text) - Movie name/title
      - `imdb_id` (text) - IMDb ID in tt format (e.g., tt1234567)
      - `youtube_url` (text) - YouTube URL for the movie trailer
      - `created_at` (timestamptz) - Timestamp when movie was added
  
  2. Security
    - Enable RLS on `movies` table
    - Add policy for anyone to read movies (public access)
    - Add policy for authenticated users to insert movies
*/

CREATE TABLE IF NOT EXISTS movies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  imdb_id text NOT NULL UNIQUE,
  youtube_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE movies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view movies"
  ON movies
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add movies"
  ON movies
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
