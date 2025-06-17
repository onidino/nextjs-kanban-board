"use client"

import * as React from "react"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createTask, updateTask } from "@/lib/actions/task"
import { toast } from "sonner"

// Import assignees and types
import { type Task } from "./assignee-select"
import { assignees, type Assignee } from "@/lib/assignees"

const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  description: z.string().min(1, "Description is required").max(500, "Description is too long"),
  assignee: z.string().min(1, "Assignee is required"),
  columnId: z.number().min(1, "Column ID is required"),
})

type TaskFormValues = z.infer<typeof taskFormSchema>

interface TaskDialogProps {
  task?: Task
  trigger?: React.ReactNode
  columnId: number
  onTaskUpdate?: (updatedTask: Task) => void
}

export function TaskDialog({ task, trigger, columnId, onTaskUpdate }: TaskDialogProps) {
  const [open, setOpen] = React.useState(false)

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      assignee: task?.assignee.name || "",
      columnId: columnId,
    },
  })

  // Reset form when task changes or dialog opens
  React.useEffect(() => {
    if (task && open) {
      form.reset({
        title: task.title,
        description: task.description || "",
        assignee: task.assignee.name,
        columnId: columnId,
      });
    }
  }, [task, columnId, form, open]);

  const handleSubmit = async (values: TaskFormValues) => {
    try {
      if (task) {
        const { error, data } = await updateTask(task.id, values)
        if (error) {
          toast.error(error)
          return
        }
        if (data && onTaskUpdate) {
          const updatedTask = {
            ...task,
            title: data.title,
            description: data.description || '',
            assignee: {
              name: data.assignee || '',
              avatar: data.assignee ? data.assignee.split(' ').map(n => n[0]).join('') : ''
            }
          }
          onTaskUpdate(updatedTask)
        }
        toast.success("Task updated successfully")
      } else {
        const { error } = await createTask(values)
        if (error) {
          toast.error(error)
          return
        }
        toast.success("Task created successfully")
      }
      
      setOpen(false)
      form.reset()
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Create Task</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create Task"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter task description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assignee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignee</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                    </FormControl>
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
                              <AvatarFallback>
                                {assignee.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span>{assignee.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {task ? "Save Changes" : "Create Task"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 