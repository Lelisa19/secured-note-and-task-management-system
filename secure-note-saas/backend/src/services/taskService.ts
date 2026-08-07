import prisma from '../lib/prisma.js';
import { taskSchema } from '../lib/validations.js';

export const getTasks = async (userId: string, status?: string, workspaceId?: string, projectId?: string, type?: string) => {
  const where: any = {
    OR: [
      { userId },
      { assigneeId: userId },
    ],
  };

  if (status) {
    where.status = status;
  }

  // Strict separation for Personal tasks vs Workspace tasks
  if (type === 'personal' || (!workspaceId && type !== 'all')) {
    where.workspaceId = null;
  } else if (workspaceId) {
    where.workspaceId = workspaceId;
  }

  if (projectId) {
    where.projectId = projectId;
  }

  return await prisma.task.findMany({
    where,
    include: {
      user: {
        select: { id: true, fullName: true, email: true, avatar: true },
      },
      assignee: {
        select: { id: true, fullName: true, email: true, avatar: true },
      },
      project: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getTaskById = async (taskId: string, userId: string) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      OR: [
        { userId },
        { assigneeId: userId },
      ],
    },
    include: {
      user: {
        select: { id: true, fullName: true, email: true, avatar: true },
      },
      assignee: {
        select: { id: true, fullName: true, email: true, avatar: true },
      },
      project: true,
    },
  });

  if (!task) {
    throw new Error('Task not found');
  }

  return task;
};

export const createTask = async (data: any, userId: string) => {
  const validated = taskSchema.parse(data);

  const taskData: any = {
    ...validated,
    userId,
    workspaceId: validated.workspaceId || null,
  };

  if (validated.dueDate) {
    taskData.dueDate = new Date(validated.dueDate);
  }

  const task = await prisma.task.create({
    data: taskData,
    include: {
      user: {
        select: { id: true, fullName: true, email: true, avatar: true },
      },
      assignee: {
        select: { id: true, fullName: true, email: true, avatar: true },
      },
      project: true,
    },
  });

  await prisma.activity.create({
    data: {
      userId,
      workspaceId: validated.workspaceId || null,
      action: 'CREATE_TASK',
      itemType: 'TASK',
      itemId: task.id,
    },
  });

  return task;
};

export const updateTask = async (taskId: string, data: any, userId: string) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      OR: [
        { userId },
        { assigneeId: userId },
      ],
    },
  });

  if (!task) {
    throw new Error('Task not found');
  }

  const updateData: any = { ...data };
  if (data.dueDate) {
    updateData.dueDate = new Date(data.dueDate);
  }
  if (data.status === 'DONE' && task.status !== 'DONE') {
    updateData.completedAt = new Date();
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: updateData,
    include: {
      user: {
        select: { id: true, fullName: true, email: true, avatar: true },
      },
      assignee: {
        select: { id: true, fullName: true, email: true, avatar: true },
      },
      project: true,
    },
  });

  await prisma.activity.create({
    data: {
      userId,
      workspaceId: updatedTask.workspaceId || null,
      action: 'UPDATE_TASK',
      itemType: 'TASK',
      itemId: taskId,
    },
  });

  return updatedTask;
};

export const deleteTask = async (taskId: string, userId: string) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!task) {
    throw new Error('Task not found');
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  await prisma.activity.create({
    data: {
      userId,
      action: 'DELETE_TASK',
      itemType: 'TASK',
      itemId: taskId,
    },
  });

  return { message: 'Task deleted successfully' };
};
