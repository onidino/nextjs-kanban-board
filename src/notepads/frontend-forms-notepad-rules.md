# FRONTEND & FORMS
## Forms
- Use react Hook Form always. Suggest install it if not installed yet.
- Always create a function that handles the form submission. Like the example:
```ts
const handleSubmit = async (values: TaskFormValues) => {
    try {
      const { error } = await createTask(values)
      
      if (error) {
        toast.error(error)
        return
      }

      toast.success("Task created successfully")
      setOpen(false)
      form.reset()
    } catch (error) {
      toast.error("Something went wrong")
    }
  }
```
- The form data should be typed, you can infer the type from the schema, for example:
```ts
const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  description: z.string().min(1, "Description is required").max(500, "Description is too long"),
  assignee: z.string().min(1, "Assignee is required"),
  columnId: z.number().min(1, "Column ID is required"),
})

type TaskFormValues = z.infer<typeof taskFormSchema>
```
- Try to reuse existing fomrs for edit form, when a form for resource creation exists.

## Validation
- Always validate the data on the client.
- Always use Zod.
- Suggest installing ZOD if not installed yet.
- Always create schema inside @schema.ts
- Try to use existing schemas when possible.

## UI Components
- Always use Shadcn/UI.
- Suggest installing missing components if needed.
- Always use Shadcn/UI forms.

## Component examples
- When needing a dialog, model after @task-dialog.tsx