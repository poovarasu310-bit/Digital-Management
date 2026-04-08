import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function TaskList({ tasks, onUpdateTask, onDeleteTask }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', status: '', githubLink: '' });

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditForm({ title: task.title, description: task.description, status: task.status, githubLink: task.githubLink || '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: '', description: '', status: '', githubLink: '' });
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
              <input
                className="w-full px-3 py-2 border rounded"
                type="url"
                value={editForm.githubLink}
                onChange={e => setEditForm({...editForm, githubLink: e.target.value})}
                placeholder="GitHub Link (optional)"
              />
              <select
                className="w-full px-3 py-2 border rounded bg-white text-slate-900"
                value={editForm.status}
                onChange={e => setEditForm({...editForm, status: e.target.value})}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
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
                    task.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : 
                    task.status === 'in-progress' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }`}>
                    {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                </div>
                {task.description && (
                  <p className="text-muted text-sm mt-1">{task.description}</p>
                )}
                {task.githubLink && (
                  <a href={task.githubLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    View Code
                  </a>
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
