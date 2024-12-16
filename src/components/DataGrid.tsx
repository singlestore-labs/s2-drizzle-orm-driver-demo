'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from './ui/Button';

interface DataGridProps {
  data: any[];
  onUpdateCell: (id: number, field: string, value: any) => Promise<void>;
  onDeleteRow: (id: number) => Promise<void>;
  onCreateRow: () => Promise<{ user: any }>;
}

export function DataGrid({ data, onUpdateCell, onDeleteRow, onCreateRow }: DataGridProps) {
  const [localData, setLocalData] = useState(data);
  const [editCell, setEditCell] = useState<{ id: number; field: string } | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const pendingUpdates = useRef(new Set<string>());

  // Update local data when server data changes and no pending updates
  useEffect(() => {
    if (pendingUpdates.current.size === 0) {
      setLocalData(data);
    }
  }, [data]);

  // Only get columns if we have data
  const columns = localData.length > 0 
    ? Object.keys(localData[0]).filter(key => key !== 'id')
    : [];

  const handleDoubleClick = (id: number, field: string, value: any) => {
    setEditCell({ id, field });
    setEditValue(String(value));
  };

  const handleUpdate = useCallback(async () => {
    if (!editCell) return;

    const { id, field } = editCell;
    const value = editValue;
    const updateKey = `${id}-${field}`;

    // Clear edit state immediately
    setEditCell(null);

    // Update local state synchronously
    const newData = localData.map(row =>
      row.id === id ? { ...row, [field]: value } : row
    );
    setLocalData(newData);

    // Track this update as pending
    pendingUpdates.current.add(updateKey);

    try {
      await onUpdateCell(id, field, value);
    } catch (error) {
      // Revert on error
      setLocalData(prev => prev.map(row =>
        row.id === id ? { ...row, [field]: data.find(r => r.id === id)?.[field] } : row
      ));
      alert('Failed to update cell');
    } finally {
      pendingUpdates.current.delete(updateKey);
    }
  }, [editCell, editValue, localData, data, onUpdateCell]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleUpdate();
    }
  };

  const handleDelete = async (id: number) => {
    const deleteKey = `delete-${id}`;

    // Update local state synchronously
    const newData = localData.filter(row => row.id !== id);
    setLocalData(newData);
    
    // Track this delete as pending
    pendingUpdates.current.add(deleteKey);

    try {
      await onDeleteRow(id);
    } catch (error) {
      // Revert on error
      setLocalData(data);
      alert('Failed to delete row');
    } finally {
      pendingUpdates.current.delete(deleteKey);
    }
  };

  const handleCreate = async () => {
    // Create a temporary ID for the new row
    const tempId = -Date.now();
    const timestamp = Date.now();
    const tempRow = {
      id: tempId,
      name: `New User_${timestamp}`,
      age: 25,
      email: 'new@example.com',
    };

    // Update local state immediately
    setLocalData(prev => [...prev, tempRow]);
    
    // Track this create as pending
    const createKey = `create-${tempId}`;
    pendingUpdates.current.add(createKey);

    try {
      const { user: createdUser } = await onCreateRow();
      // Replace temporary row with actual created row
      setLocalData(prev => prev.map(row => 
        row.id === tempId ? createdUser : row
      ));
    } catch (error) {
      // Revert on error
      setLocalData(prev => prev.filter(row => row.id !== tempId));
      alert('Failed to create new row');
    } finally {
      pendingUpdates.current.delete(createKey);
    }
  };

  // Generate a stable unique key for each row
  const getRowKey = (row: any) => {
    if (!row || typeof row.id === 'undefined') {
      return `temp-${Math.random()}`; // Fallback unique key
    }
    return row.id < 0 ? `temp-${Math.abs(row.id)}` : `row-${row.id}`;
  };

  // Don't render the table if there's no data
  if (localData.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button
            onClick={handleCreate}
            variant="primary"
            className="px-6 py-2.5 text-sm font-medium rounded-full shadow-sm transition-all hover:shadow-md"
          >
            Add New User
          </Button>
        </div>
        <div className="text-center p-12 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-gray-500 text-sm">No users available. Click "Add New User" to create one.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={handleCreate}
          variant="primary"
          className="px-6 py-2.5 text-sm font-medium rounded-full shadow-sm transition-all hover:shadow-md"
        >
          Add New User
        </Button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-white">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {columns.map(column => (
                <th key={`header-${column}`} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {column}
                </th>
              ))}
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {localData.map(row => (
              <tr key={getRowKey(row)} className="hover:bg-gray-50/50 transition-colors">
                {columns.map(column => (
                  <td
                    key={`${getRowKey(row)}-${column}`}
                    className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                    onDoubleClick={() => handleDoubleClick(row.id, column, row[column])}
                  >
                    {editCell?.id === row.id && editCell?.field === column ? (
                      <input
                        type={column === 'age' ? 'number' : 'text'}
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        onBlur={handleUpdate}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all"
                      />
                    ) : (
                      row[column]
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 text-sm whitespace-nowrap">
                  <Button
                    onClick={() => handleDelete(row.id)}
                    variant="danger"
                    size="sm"
                    className="px-4 py-1.5 text-xs font-medium rounded-full transition-all hover:bg-red-600"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 