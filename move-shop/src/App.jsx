import React, { useState, useEffect, } from 'react';
import Search from './Components/Search.jsx';
import './App.css';
import Spinner from './Components/Spinner.jsx';
import MovieCard from './Components/MovieCard.jsx';
import { useDebounce } from 'react-use'
import Appwrite from './appwrite.jsx';
import { getTopSearches } from './appwrite.jsx';

function App() {

  //application sates hooks
  const [movies, setMovies] = useState([]);
  const [searchItem, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isloading, setLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [topSearches, setTopSearches] = useState([]);

  useDebounce(() => setDebouncedSearchTerm(searchItem), 500, [searchItem]);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const API_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
  const API_OPTIONS = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: API_KEY,
    },
  }



  const fetchMovies = async (query = '') => {
    setLoading(true);
    setErrorMessage('');
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURI(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // console.log(response)

      const data = await response.json();
      // console.log(data)
      if (!data.response === false) {
        setErrorMessage('Failed to fetch movies: ' + data.Error);
        setMovies([]);
        return;
      }
      setMovies(data.results || []);

      if (query && data.results.length > 0) {
        await Appwrite(query, data.results[0]);
      }

    } catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTopSearches();
      setTopSearches(movies);
    } catch (error) {
      console.error('Error fetching top searches:', error);
    }
  };

  useEffect(() => {
    console.log(debouncedSearchTerm)
    console.log(searchItem)
    fetchMovies(debouncedSearchTerm);
  }, [searchItem]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main className="App">
      {/* Blur Background */}
      <div className="blur-background">
        <div className="blur-overlay"></div>
      </div>

      <div className='container relative z-10'>
        <div className='content-wrapper'>
          <header className='flex flex-col items-center gap-4'>
            <div className='image-container'>
              {/* <img
                src='/src/assets/poster.png'
                alt='poster'
                className='w-90 max-w-full h-auto rounded-lg shadow-lg'
              /> */}
            </div>
            <div className='text-container backdrop-blur-sm bg-white/30 dark:bg-black/30 p-6 rounded-xl'>
              <h1 className='text-5xl font-bold text-center text-amber-600'>Movie Shop</h1>
            </div>
            <Search searchItem={searchItem} setSearchTerm={setSearchTerm} />
          </header>


          {topSearches.length > 0 && (
            <section className='top-searches mx-0 my-auto p-4'>
              <h2 className='text-xl md:text-2xl mb-4 font-bold text-center text-white'>Top Searches</h2>

              <ul className='flex flex-wrap gap-2 justify-center md:gap-4 lg:flex-nowrap'>
                {topSearches.map((movie, index) => (
                  <li key={movie.id} className='flex flex-row gap-1 items-center'>
                    {/* Styled Number Index */}
                    <span className='text-2xl md:text-4xl font-extrabold text-amber-600'>{index + 1}</span>

                    {/* Movie Poster */}
                    <img
                      className='w-full max-w-[100px] md:max-w-[150px] h-auto rounded-lg shadow-lg'
                      src={movie.poster_url ? `https://image.tmdb.org/t/p/w500${movie.poster_url}` : './src/assets/poster.png'}
                      alt={movie.title}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className='all-movies'>
            <h2 className='mt-5 p-5 text-3xl font-bold text-center text-amber-50'>All Movies</h2>
            {isloading ? (
              <>
                <Spinner />
              </>
            ) : errorMessage ? (
              <p className='text-red-500 text-center'>Error {errorMessage}</p>
            ) : (
              <ul className='bg-dark-100 text-black grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                {movies.map((movie) => (

                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}

          </section>
        </div>
      </div>
    </main>
  );
}

export default App;