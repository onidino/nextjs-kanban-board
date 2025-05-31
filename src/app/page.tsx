"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TaskDialog } from "@/components/task-dialog"
import { Button } from "@/components/ui/button"
import { PlusIcon, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Task, AssigneeSelect } from "@/components/assignee-select"

type Column = {
  title: string
  tasks: Task[]
}

const columns: Column[] = [
  {
    title: "Todo",
    tasks: [
      { 
        id: 1, 
        title: "Design system", 
        description: "Create a consistent design system for the app",
        assignee: {
          name: "Alice Johnson",
          avatar: "AJ"
        }
      },
      { 
        id: 2, 
        title: "User authentication", 
        description: "Implement login and registration",
        assignee: {
          name: "Bob Smith",
          avatar: "BS"
        }
      }
    ]
  },
  {
    title: "In Progress",
    tasks: [
      { 
        id: 3, 
        title: "API Integration", 
        description: "Connect frontend with backend services",
        assignee: {
          name: "Charlie Brown",
          avatar: "CB"
        }
      },
      { 
        id: 4, 
        title: "Testing", 
        description: "Write unit tests for components",
        assignee: {
          name: "Diana Prince",
          avatar: "DP"
        }
      }
    ]
  },
  {
    title: "Done",
    tasks: [
      { 
        id: 5, 
        title: "Project Setup", 
        description: "Initialize Next.js project",
        assignee: {
          name: "Eve Anderson",
          avatar: "EA"
        }
      },
      { 
        id: 6, 
        title: "Database Design", 
        description: "Create database schema",
        assignee: {
          name: "Frank Miller",
          avatar: "FM"
        }
      }
    ]
  }
]

export default function Home() {
  const handleCreateTask = (values: { title: string; description: string; assignee: string }) => {
    // In a real app, you would add the task to your backend
    console.log("Creating task:", values)
  }

  const handleEditTask = (taskId: number, values: { title: string; description: string; assignee: string }) => {
    // In a real app, you would update the task in your backend
    console.log("Editing task:", taskId, values)
  }

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Kanban Board</h1>
        <div className="flex items-center gap-4">
          <TaskDialog
            onSubmit={handleCreateTask}
            trigger={
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            }
          />
          <ThemeToggle />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column.title} className="flex flex-col">
            {/* Column Header */}
            <Card className="mb-4 border-t-4 border-t-primary">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{column.title}</CardTitle>
                  <Badge variant="secondary" className="bg-primary/10">
                    {column.tasks.length}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Tasks Container */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg min-h-[500px]">
              {column.tasks.map((task) => (
                <Card 
                  key={task.id} 
                  className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{task.title}</h3>
                      <div className="flex items-center gap-2">
                        <AssigneeSelect task={task} />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <TaskDialog
                              task={task}
                              onSubmit={(values) => handleEditTask(task.id, values)}
                              trigger={
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  Edit
                                </DropdownMenuItem>
                              }
                            />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {task.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{task.assignee.avatar}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{task.assignee.name}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
