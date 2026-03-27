import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function TaskForm({ onTaskAdded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    await onTaskAdded({ title, description, status });
    setTitle('');
    setDescription('');
    setStatus('pending');
    setLoading(false);
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Add New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Task Title</label>
          <input 
            type="text" 
            required 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md focus:ring-primary focus:border-primary outline-none"
            placeholder="e.g. Update user documentation"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Description</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md focus:ring-primary focus:border-primary outline-none"
            placeholder="Details about this task..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Status</label>
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md focus:ring-primary focus:border-primary outline-none bg-white"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Adding Task...' : 'Add Task'}
        </Button>
      </form>
    </Card>
  );
}
