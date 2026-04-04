-- Sample movies to populate your database
-- You can run this in the Supabase SQL Editor or use the Add Movie screen in the app

INSERT INTO movies (name, imdb_id, youtube_url) VALUES
('The Shawshank Redemption', 'tt0111161', 'https://www.youtube.com/watch?v=6hB3S9bIaco'),
('The Godfather', 'tt0068646', 'https://www.youtube.com/watch?v=sY1S34973zA'),
('The Dark Knight', 'tt0468569', 'https://www.youtube.com/watch?v=EXeTwQWrcwY'),
('Inception', 'tt1375666', 'https://www.youtube.com/watch?v=YoHD9XEInc0'),
('Pulp Fiction', 'tt0110912', 'https://www.youtube.com/watch?v=s7EdQ4FqbhY'),
('Forrest Gump', 'tt0109830', 'https://www.youtube.com/watch?v=bLvqoHBptjg'),
('The Matrix', 'tt0133093', 'https://www.youtube.com/watch?v=vKQi3bBA1y8'),
('Interstellar', 'tt0816692', 'https://www.youtube.com/watch?v=zSWdZVtXT7E'),
('The Lion King', 'tt0110357', 'https://www.youtube.com/watch?v=lFzVJEksoDY'),
('Avengers: Endgame', 'tt4154796', 'https://www.youtube.com/watch?v=TcMBFSGVi1c')
ON CONFLICT (imdb_id) DO NOTHING;
