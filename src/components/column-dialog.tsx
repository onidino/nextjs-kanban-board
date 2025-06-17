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
import { createColumn } from "@/lib/actions/board"
import { toast } from "sonner"

const columnFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
})

type ColumnFormValues = z.infer<typeof columnFormSchema>

interface ColumnDialogProps {
  trigger?: React.ReactNode
}

export function ColumnDialog({ trigger }: ColumnDialogProps) {
  const [open, setOpen] = React.useState(false)

  const form = useForm<ColumnFormValues>({
    resolver: zodResolver(columnFormSchema),
    defaultValues: {
      title: "",
    },
  })

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      form.reset({
        title: "",
      });
    }
  }, [open, form]);

  const handleSubmit = async (values: ColumnFormValues) => {
    try {
      const { error } = await createColumn(values)
      if (error) {
        toast.error(error)
        return
      }
      toast.success("Column created successfully")
      setOpen(false)
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Create Column</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Column</DialogTitle>
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
                Create Column
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 