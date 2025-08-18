/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import config from '../../config/config';
import bcrypt from 'bcrypt';
import { TTask } from './task.interface';
import { string } from 'zod';

const taskSchema = new Schema<TTask>(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    task_created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    dueDate: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const Task = model<TTask>('Task', taskSchema);
