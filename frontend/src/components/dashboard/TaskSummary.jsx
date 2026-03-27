import Card from '@/components/ui/Card';

export default function TaskSummary({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = total - completed;

  return (
    <Card className="col-span-1 border-primary relative overflow-hidden bg-white shadow-sm p-6">
      <div className="absolute top-0 right-0 w-16 h-16 bg-primary opacity-10 rounded-bl-full"></div>
      <h2 className="text-xl font-semibold mb-6 text-foreground">Task Summary</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <span className="text-muted font-medium">Total Tasks</span>
          <span className="font-bold text-foreground text-lg">{total}</span>
        </div>
        
        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
            <span className="text-muted font-medium">Completed</span>
          </div>
          <span className="font-bold text-emerald-600 text-lg">{completed}</span>
        </div>
        
        <div className="flex justify-between items-center pb-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-amber-400 rounded-full"></span>
            <span className="text-muted font-medium">Pending</span>
          </div>
          <span className="font-bold text-amber-500 text-lg">{pending}</span>
        </div>
      </div>
    </Card>
  );
}
