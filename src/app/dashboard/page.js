'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Navbar = ({ onSearch, user }) => {
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

  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between items-center">
      <div>
        <a href="/dashboard" className="text-2xl font-bold">Dashboard</a>
        <ul className="flex space-x-4 ml-6">
          <li className="relative group">
            <a href="#" className="hover:underline">Menu 1</a>
            <ul className="absolute left-0 hidden group-hover:block bg-blue-600 p-2 mt-1 rounded shadow-md">
              <li><a href="#" className="block px-4 py-2 hover:underline">Submenu 1</a></li>
              <li><a href="#" className="block px-4 py-2 hover:underline">Submenu 2</a></li>
              <li><a href="#" className="block px-4 py-2 hover:underline">Submenu 3</a></li>
            </ul>
          </li>
          <li className="relative group">
            <a href="#" className="hover:underline">Menu 2</a>
            <ul className="absolute left-0 hidden group-hover:block bg-blue-600 p-2 mt-1 rounded shadow-md">
              <li><a href="#" className="block px-4 py-2 hover:underline">Submenu 1</a></li>
              <li><a href="#" className="block px-4 py-2 hover:underline">Submenu 2</a></li>
            </ul>
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

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
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
    setSearchResults([`Resultado para "${query}"`]);
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
      <Navbar onSearch={handleSearch} user={user} />
      <div className="p-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>Welcome, {user.name}!</p>
        <div className="mt-8">
          {searchResults.length > 0 && (
            <div>
              <h2 className="text-xl font-bold">Search Results</h2>
              <ul>
                {searchResults.map((result, index) => (
                  <li key={index} className="mt-2">{result}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* Adicione mais conteúdo do dashboard aqui */}
      </div>
    </div>
  );
};

export default Dashboard;
