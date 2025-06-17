import { getColumns, getTasks } from '@/lib/actions/board';
import { Column, AddColumn } from '.';

export async function Board() {
  try {
    const [{ data: columns, error: columnsError }, { data: tasks, error: tasksError }] = await Promise.all([
      getColumns(),
      getTasks()
    ]);

    if (columnsError || tasksError) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-red-500">Error loading board data</p>
        </div>
      );
    }

    // If no columns exist, show a message
    if (!columns || columns.length === 0) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-gray-500">No columns found. Add your first column!</p>
        </div>
      );
    }

    return (
      <div className="flex h-full w-full gap-3 p-12">
        <div className="flex gap-4">
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={tasks?.filter((task) => task.columnId === column.id) || []}
            />
          ))}
        </div>
        <AddColumn />
      </div>
    );
  } catch (error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-red-500">Error loading board data</p>
      </div>
    );
  }
} 