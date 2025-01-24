'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Navbar from './Navbar';
import Usuarios from './usuarios';
import Planos from './planos';
import FilmesESeries from './filmeseseries';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [content, setContent] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('authToken');
      const savedUser = JSON.parse(localStorage.getItem('user'));

      if (!token) {
        router.push('/login');
        return;
      }

      if (savedUser) {
        setUser(savedUser);
      } else {
        try {
          const response = await axios.get('http://localhost:8000/api/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        } catch (err) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          router.push('/login');
        }
      }
    };

    fetchUser();
  }, [router]);

  const handleSearch = (query) => {
    // Implementar a lógica de busca conforme necessário
    setContent('searchResults');
  };

  useEffect(() => {
    if (content) {
      setLoading(false);
    }
  }, [content]);

  const renderContent = () => {
    switch (content) {
      case 'usuarios':
        return <Usuarios />;
      case 'planos':
        return <Planos />;
      case 'filmes-e-series':
        return <FilmesESeries />;
      case 'searchResults':
        return <div>Search results for "{query}"</div>;
      default:
        return <div>Welcome to the Dashboard!</div>;
    }
  };

  const handleMenuClick = async (menu) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simular tempo de carregamento
    setContent(menu); // Definir o novo conteúdo
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="text-white text-2xl font-bold">
          Validando suas informações...
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar onSearch={handleSearch} user={user} setContent={handleMenuClick} />
      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white text-2xl font-bold">Carregando...</div>
        </div>
      ) : (
        <div className="p-8">
          {renderContent()}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
