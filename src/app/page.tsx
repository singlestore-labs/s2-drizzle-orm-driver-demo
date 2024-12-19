'use client';

import { DataGrid } from '@/components/DataGrid';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import SingleStoreLogo from './singlestore_logo.svg';

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
    <main className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center max-w-3xl mx-auto mb-12">
          <Image
            src={SingleStoreLogo}
            alt="SingleStore Logo"
            className="h-12 w-auto mb-8"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-3">User Management</h1>
          <p className="text-lg text-gray-600">Powered by SingleStore + Drizzle ORM</p>
        </div>
        <div className="max-w-6xl mx-auto">
          <DataGrid
            data={users}
            onUpdateCell={handleUpdateCell}
            onDeleteRow={handleDeleteRow}
            onCreateRow={handleCreateRow}
          />
        </div>
        <footer className="mt-12 text-center text-gray-600">
          <div className="space-x-4">
            <a 
              href="https://github.com/singlestore-labs/s2-drizzle-orm-driver-demo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-900 underline"
            >
              GitHub Repository
            </a>
            <span>•</span>
            <a 
              href="https://orm.drizzle.team/docs/get-started-singlestore" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-900 underline"
            >
              Drizzle ORM
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
} 
