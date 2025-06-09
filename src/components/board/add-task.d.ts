import { type ReactNode } from 'react';

interface AddTaskProps {
  columnId: number;
}

export function AddTask(props: AddTaskProps): Promise<ReactNode>; 