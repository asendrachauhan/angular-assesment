export interface Notifications {
  id?: string;
  userId: string;
  type: string;
  message: string;
  projectId?: string;
  taskId?: string;
  read: boolean;
  createdAt: string;
}
