"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { assignees } from "@/lib/assignees"

export interface Task {
  id: number
  title: string
  description: string
  assignee: {
    name: string
    avatar: string
  }
}

interface AssigneeSelectProps {
  task: Task
  onAssigneeChange?: (assignee: string) => void
}

export function AssigneeSelect({ task, onAssigneeChange }: AssigneeSelectProps) {
  return (
    <Select
      value={task.assignee.name}
      onValueChange={onAssigneeChange}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Assign to..." />
      </SelectTrigger>
      <SelectContent>
        {assignees.map((assignee) => (
          <SelectItem
            key={assignee.id}
            value={assignee.name}
            className="flex items-center gap-2"
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={assignee.avatar} alt={assignee.name} />
                <AvatarFallback>{assignee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <span>{assignee.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 