import prisma from '../lib/prisma.js';
import { workspaceSchema, projectSchema } from '../lib/validations.js';

export const getWorkspaces = async (userId: string) => {
  return await prisma.workspace.findMany({
    where: {
      OR: [
        { ownerId: userId },
        {
          members: {
            some: {
              userId,
              isActive: true,
            },
          },
        },
      ],
    },
    include: {
      owner: {
        select: { id: true, fullName: true, email: true },
      },
      members: {
        include: {
          user: {
            select: { id: true, fullName: true, email: true },
          },
        },
      },
      _count: {
        select: { notes: true, tasks: true, projects: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getWorkspaceById = async (workspaceId: string, userId: string) => {
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      OR: [
        { ownerId: userId },
        {
          members: {
            some: {
              userId,
              isActive: true,
            },
          },
        },
      ],
    },
    include: {
      owner: {
        select: { id: true, fullName: true, email: true },
      },
      members: {
        include: {
          user: {
            select: { id: true, fullName: true, email: true },
          },
        },
      },
      projects: true,
      _count: {
        select: { notes: true, tasks: true, projects: true },
      },
    },
  });

  if (!workspace) {
    throw new Error('Workspace not found');
  }

  return workspace;
};

export const createWorkspace = async (data: any, userId: string) => {
  const validated = workspaceSchema.parse(data);

  const workspace = await prisma.workspace.create({
    data: {
      ...validated,
      ownerId: userId,
      members: {
        create: {
          userId,
        },
      },
    },
    include: {
      owner: {
        select: { id: true, fullName: true, email: true },
      },
      members: {
        include: {
          user: {
            select: { id: true, fullName: true, email: true },
          },
        },
      },
    },
  });

  await prisma.activity.create({
    data: {
      userId,
      workspaceId: workspace.id,
      action: 'CREATE_WORKSPACE',
      itemType: 'WORKSPACE',
      itemId: workspace.id,
    },
  });

  return workspace;
};

export const createProject = async (workspaceId: string, data: any, userId: string) => {
  const validated = projectSchema.parse(data);

  const project = await prisma.project.create({
    data: {
      ...validated,
      workspaceId,
    },
  });

  await prisma.activity.create({
    data: {
      userId,
      workspaceId,
      action: 'CREATE_PROJECT',
      itemType: 'PROJECT',
      itemId: project.id,
    },
  });

  return project;
};
