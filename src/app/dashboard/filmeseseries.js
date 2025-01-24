'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const FilmesESeries = () => {
  const [movies, setMovies] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMovies = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('Token não encontrado. Redirecionando para login.');
        router.push('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/api/movies', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMovies(response.data);
      } catch (err) {
        console.log('Erro ao buscar filmes:', err);
        localStorage.removeItem('authToken');
        router.push('/login');
      }
    };

    fetchMovies();
  }, [router]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Filmes e Séries</h1>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default FilmesESeries;
