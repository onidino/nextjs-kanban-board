import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function AddColumn() {
  return (
    <Button variant="outline" className="h-full w-[350px]">
      <Plus className="mr-2 h-4 w-4" />
      Add Column
    </Button>
  );
} 