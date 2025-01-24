'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Navbar = ({ onSearch, user, setContent }) => {
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleMenuClick = async (menu) => {
    setContent(null); // Definir o conteúdo como null para mostrar o indicador de carregamento
    await new Promise(resolve => setTimeout(resolve, 500)); // Simular tempo de carregamento
    setContent(menu); // Definir o novo conteúdo
  };

  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between items-center">
      <div>
        <a href="/dashboard" className="text-2xl font-bold">Dashboard</a>
        <ul className="flex space-x-4 ml-6">
          <li>
            <button onClick={() => handleMenuClick('usuarios')} className="hover:underline">Usuários</button>
          </li>
          <li>
            <button onClick={() => handleMenuClick('planos')} className="hover:underline">Planos</button>
          </li>
          <li>
            <button onClick={() => handleMenuClick('filmes-e-series')} className="hover:underline">Filmes e Séries</button>
          </li>
        </ul>
      </div>
      <div className="flex items-center">
        <form onSubmit={handleSearch} className="flex items-center">
          <input
            type="text"
            className="p-2 rounded text-black"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="ml-2 p-2 bg-green-500 rounded hover:bg-green-600">Search</button>
        </form>
        <div className="relative ml-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="hover:underline">
            {user?.name}
          </button>
          {menuOpen && (
            <ul className="absolute right-0 bg-blue-600 p-2 mt-1 rounded shadow-md">
              <li><button onClick={handleLogout} className="block px-4 py-2 hover:underline">Logout</button></li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
