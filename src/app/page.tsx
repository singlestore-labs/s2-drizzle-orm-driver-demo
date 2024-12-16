'use client';

import { DataGrid } from '@/components/DataGrid';
import { useEffect, useState } from 'react';

export default function Home() {
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateCell = async (id: number, field: string, value: any) => {
    const response = await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, [field]: value }),
    });
    
    if (!response.ok) throw new Error('Failed to update');
    await fetchUsers();
  };

  const handleDeleteRow = async (id: number) => {
    const response = await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    
    if (!response.ok) throw new Error('Failed to delete');
    await fetchUsers();
  };

  const handleCreateRow = async () => {
    const timestamp = Date.now();
    const newUser = {
      name: `New User_${timestamp}`,
      age: 25,
      email: 'new@example.com',
    };

    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) throw new Error('Failed to create');
    
    const createdUser = await response.json();
    
    setUsers(prev => [...prev, createdUser.user]);
    
    return createdUser;
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#360061] mb-2">User Management</h1>
            <p className="text-[#525252]">Powered by SingleStore + Drizzle ORM</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <DataGrid
            data={users}
            onUpdateCell={handleUpdateCell}
            onDeleteRow={handleDeleteRow}
            onCreateRow={handleCreateRow}
          />
        </div>
      </div>
    </main>
  );
} 