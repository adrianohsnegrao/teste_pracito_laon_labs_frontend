'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Planos = () => {
  const [plans, setPlans] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPlans = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/api/plans', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlans(response.data);
      } catch (err) {
        localStorage.removeItem('authToken');
        router.push('/login');
      }
    };

    fetchPlans();
  }, [router]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Planos</h1>
      <ul>
        {plans.map((plan) => (
          <li key={plan.id}>{plan.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Planos;
