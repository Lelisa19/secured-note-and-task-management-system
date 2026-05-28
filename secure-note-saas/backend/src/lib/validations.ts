import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const noteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().default(''),
  tags: z.union([z.array(z.string()), z.string()]).default([]),
  workspaceId: z.string().optional(),
});

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'ARCHIVED']).default('TODO'),
  dueDate: z.string().optional(),
  workspaceId: z.string().optional(),
  projectId: z.string().optional(),
  assigneeId: z.string().optional(),
});

export const workspaceSchema = z.object({
  name: z.string().min(1, 'Workspace name is required'),
  description: z.string().optional(),
});

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
});
