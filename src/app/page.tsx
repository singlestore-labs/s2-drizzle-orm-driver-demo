'use client';

import { useState, useEffect } from 'react';
import { DataGrid } from '@/components/DataGrid';
import { Button } from '@/components/ui/Button';

interface User {
  id: number;
  name: string;
  age: number;
  email: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    setUsers(data);
    setLoading(false);
  };

  const handleAddRow = async () => {
    const newUser = {
      name: '',
      age: 0,
      email: '',
    };
    
    await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(newUser),
    });
    
    fetchUsers();
  };

  const handleUpdateCell = async (id: number, field: string, value: any) => {
    await fetch('/api/users', {
      method: 'PUT',
      body: JSON.stringify({ id, [field]: value }),
    });
    
    fetchUsers();
  };

  const handleDeleteRow = async (id: number) => {
    await fetch('/api/users', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
    
    fetchUsers();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users Database</h1>
      </div>
      <DataGrid
        data={users}
        onUpdateCell={handleUpdateCell}
        onDeleteRow={handleDeleteRow}
      />
    </div>
  );
} 