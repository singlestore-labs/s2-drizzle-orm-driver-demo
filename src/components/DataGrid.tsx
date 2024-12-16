'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

interface DataGridProps {
  data: any[];
  onUpdateCell: (id: number, field: string, value: any) => Promise<void>;
  onDeleteRow: (id: number) => Promise<void>;
}

export function DataGrid({ data, onUpdateCell, onDeleteRow }: DataGridProps) {
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

  const columns = Object.keys(localData[0] || {}).filter(key => key !== 'id');

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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column} className="border p-2 bg-gray-50">
                {column}
              </th>
            ))}
            <th className="border p-2 bg-gray-50">Actions</th>
          </tr>
        </thead>
        <tbody>
          {localData.map(row => (
            <tr key={row.id}>
              {columns.map(column => (
                <td
                  key={`${row.id}-${column}`}
                  className="border p-2"
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
                      className="w-full p-1 border rounded"
                    />
                  ) : (
                    row[column]
                  )}
                </td>
              ))}
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(row.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 