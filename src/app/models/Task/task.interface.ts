import { Types } from 'mongoose';

export type TTask = {
  title: string;
  task_created_by: Types.ObjectId;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
};
