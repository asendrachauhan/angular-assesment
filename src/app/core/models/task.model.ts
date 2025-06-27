export interface Tasks {
  id: string;
  name: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'To Do' | 'In Progress' | 'Done';
  description: string;
  projectId: string;
}