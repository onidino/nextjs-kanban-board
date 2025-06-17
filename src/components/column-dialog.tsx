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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createColumn, updateColumn } from "@/lib/actions/board"
import { toast } from "sonner"
import { type Column } from "@/lib/db/schema"

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
})

type ColumnFormValues = z.infer<typeof formSchema>

interface ColumnDialogProps {
  column?: Column
  onColumnUpdate?: (column: Column) => void
  trigger?: React.ReactNode
}

export function ColumnDialog({ column, onColumnUpdate, trigger }: ColumnDialogProps) {
  const [open, setOpen] = React.useState(false)

  const form = useForm<ColumnFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: column?.title || "",
    },
  })

  // Reset form when dialog opens/closes or column changes
  React.useEffect(() => {
    if (open) {
      form.reset({
        title: column?.title || "",
      });
    } else {
      form.reset({
        title: "",
      });
    }
  }, [open, column, form]);

  const handleSubmit = async (values: ColumnFormValues) => {
    try {
      if (column) {
        const updatedColumn = await updateColumn(column.id, values);

        if (updatedColumn.error) {
          throw new Error(updatedColumn.error);
        }

        if (updatedColumn.data && onColumnUpdate) {
          onColumnUpdate(updatedColumn.data);
        }

        toast.success("Column updated successfully");
      } else {
        const newColumn = await createColumn(values);

        if (newColumn.error) {
          throw new Error(newColumn.error);
        }

        if (newColumn.data && onColumnUpdate) {
          onColumnUpdate(newColumn.data);
        }

        toast.success("Column created successfully");
      }

      setOpen(false);
    } catch (error) {
      console.error("Error saving column:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save column");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Add Column</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{column ? "Edit Column" : "Add Column"}</DialogTitle>
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
                    <Input placeholder="Enter column title" {...field} />
                  </FormControl>
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
                {column ? "Save Changes" : "Create Column"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 