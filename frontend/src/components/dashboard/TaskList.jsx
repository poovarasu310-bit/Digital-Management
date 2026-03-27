import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function TaskList({ tasks, onUpdateTask, onDeleteTask }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', status: '' });

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditForm({ title: task.title, description: task.description, status: task.status });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: '', description: '', status: '' });
  };

  const handleSave = async (id) => {
    await onUpdateTask(id, editForm);
    setEditingId(null);
  };

  if (!tasks || tasks.length === 0) {
    return (
      <Card className="p-12 text-center bg-gray-50 border-dashed border-2 border-gray-200">
        <div className="flex flex-col items-center justify-center">
          <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <h3 className="text-lg font-medium text-foreground">No tasks yet</h3>
          <p className="text-muted mt-1">Get started by adding a new task from the form.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <Card key={task.id} className="p-4 transition-all hover:shadow-md border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          {editingId === task.id ? (
            <div className="w-full space-y-3">
              <input
                className="w-full px-3 py-2 border rounded"
                value={editForm.title}
                onChange={e => setEditForm({...editForm, title: e.target.value})}
                placeholder="Task title"
              />
              <textarea
                className="w-full px-3 py-2 border rounded"
                value={editForm.description}
                onChange={e => setEditForm({...editForm, description: e.target.value})}
                placeholder="Task description"
              />
              <select
                className="w-full px-3 py-2 border rounded bg-white"
                value={editForm.status}
                onChange={e => setEditForm({...editForm, status: e.target.value})}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={cancelEdit}>Cancel</Button>
                <Button size="sm" onClick={() => handleSave(task.id)}>Save</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className={`font-semibold text-lg ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-foreground'}`}>
                    {task.title}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    task.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                </div>
                {task.description && (
                  <p className="text-muted text-sm mt-1">{task.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => startEdit(task)}>
                  Edit
                </Button>
                <Button variant="danger" className="border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700" onClick={() => onDeleteTask(task.id)}>
                  Delete
                </Button>
              </div>
            </>
          )}
        </Card>
      ))}
    </div>
  );
}
