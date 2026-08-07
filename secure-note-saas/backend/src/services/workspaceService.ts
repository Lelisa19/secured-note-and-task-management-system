import prisma from '../lib/prisma.js';
import { workspaceSchema, projectSchema } from '../lib/validations.js';

const stringTagsToArray = (tagString: string) => {
  if (!tagString) return [];
  return tagString.split(',').map((t) => t.trim()).filter(Boolean);
};

const DEFAULT_ROLES = [
  {
    name: 'Owner',
    permissions: JSON.stringify({
      createNotes: true,
      editNotes: true,
      deleteNotes: true,
      manageTasks: true,
      manageMembers: true,
      manageSettings: true,
    }),
  },
  {
    name: 'Member',
    permissions: JSON.stringify({
      createNotes: true,
      editNotes: true,
      deleteNotes: false,
      manageTasks: true,
      manageMembers: false,
      manageSettings: false,
    }),
  },
  {
    name: 'Guest',
    permissions: JSON.stringify({
      createNotes: false,
      editNotes: false,
      deleteNotes: false,
      manageTasks: false,
      manageMembers: false,
      manageSettings: false,
    }),
  },
];

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
        select: { id: true, fullName: true, email: true, avatar: true },
      },
      members: {
        include: {
          user: {
            select: { id: true, fullName: true, email: true, avatar: true },
          },
        },
      },
      _count: {
        select: { notes: true, tasks: true, projects: true, members: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getInvitations = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return [];

  // Find workspace memberships where isActive is false
  return await prisma.workspaceMember.findMany({
    where: {
      userId,
      isActive: false,
    },
    include: {
      workspace: {
        include: {
          owner: {
            select: { id: true, fullName: true, email: true },
          },
        },
      },
    },
  });
};

export const acceptInvitation = async (membershipId: string, userId: string) => {
  const membership = await prisma.workspaceMember.findFirst({
    where: { id: membershipId, userId },
  });

  if (!membership) {
    throw new Error('Invitation not found');
  }

  const updated = await prisma.workspaceMember.update({
    where: { id: membershipId },
    data: { isActive: true },
    include: { workspace: true },
  });

  await prisma.activity.create({
    data: {
      userId,
      workspaceId: membership.workspaceId,
      action: 'JOIN_WORKSPACE',
      itemType: 'WORKSPACE',
      itemId: membership.workspaceId,
    },
  });

  return updated;
};

export const rejectInvitation = async (membershipId: string, userId: string) => {
  const membership = await prisma.workspaceMember.findFirst({
    where: { id: membershipId, userId },
  });

  if (!membership) {
    throw new Error('Invitation not found');
  }

  await prisma.workspaceMember.delete({
    where: { id: membershipId },
  });

  return { message: 'Invitation rejected' };
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
        select: { id: true, fullName: true, email: true, avatar: true },
      },
      members: {
        include: {
          user: {
            select: { id: true, fullName: true, email: true, avatar: true },
          },
        },
      },
      projects: true,
      _count: {
        select: { notes: true, tasks: true, projects: true, members: true, files: true },
      },
    },
  });

  if (!workspace) {
    throw new Error('Workspace not found or access denied');
  }

  return workspace;
};

export const createWorkspace = async (data: { name: string; description?: string; logo?: string }, userId: string) => {
  const validated = workspaceSchema.parse(data);

  const workspace = await prisma.workspace.create({
    data: {
      name: validated.name,
      description: validated.description || '',
      logo: data.logo || null,
      ownerId: userId,
      roles: {
        create: DEFAULT_ROLES,
      },
      members: {
        create: {
          userId,
          isActive: true,
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

export const inviteMember = async (workspaceId: string, email: string, userId: string) => {
  const workspace = await prisma.workspace.findFirst({
    where: { id: workspaceId, ownerId: userId },
  });

  if (!workspace) {
    throw new Error('Only workspace owner can invite members');
  }

  const targetUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!targetUser) {
    throw new Error('User with this email not found');
  }

  const existing = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: targetUser.id,
      },
    },
  });

  if (existing) {
    if (existing.isActive) {
      throw new Error('User is already a member of this workspace');
    } else {
      throw new Error('Invitation is already pending for this user');
    }
  }

  const membership = await prisma.workspaceMember.create({
    data: {
      workspaceId,
      userId: targetUser.id,
      isActive: false, // Pending
    },
    include: {
      user: {
        select: { id: true, fullName: true, email: true },
      },
    },
  });

  await prisma.notification.create({
    data: {
      userId: targetUser.id,
      title: 'Workspace Invitation',
      message: `You have been invited to join ${workspace.name}`,
      type: 'WORKSPACE_INVITE',
    },
  });

  return membership;
};

export const removeMember = async (workspaceId: string, memberUserId: string, currentUserId: string) => {
  const workspace = await prisma.workspace.findFirst({
    where: { id: workspaceId, ownerId: currentUserId },
  });

  if (!workspace) {
    throw new Error('Only workspace owner can remove members');
  }

  if (memberUserId === currentUserId) {
    throw new Error('Owner cannot remove self from workspace');
  }

  await prisma.workspaceMember.deleteMany({
    where: {
      workspaceId,
      userId: memberUserId,
    },
  });

  return { message: 'Member removed successfully' };
};

export const createProject = async (workspaceId: string, data: any, userId: string) => {
  const validated = projectSchema.parse(data);

  const project = await prisma.project.create({
    data: {
      name: validated.name,
      description: validated.description || '',
      workspaceId,
      status: 'ACTIVE',
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

export const getWorkspaceNotes = async (workspaceId: string, userId: string) => {
  await getWorkspaceById(workspaceId, userId); // verify permission

  const notes = await prisma.note.findMany({
    where: { workspaceId, status: 'ACTIVE' },
    include: {
      user: {
        select: { id: true, fullName: true, email: true, avatar: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return notes.map((note) => ({
    ...note,
    tags: stringTagsToArray(note.tags),
  }));
};

export const getWorkspaceTasks = async (workspaceId: string, userId: string) => {
  await getWorkspaceById(workspaceId, userId); // verify permission

  return await prisma.task.findMany({
    where: { workspaceId },
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

export const getWorkspaceProjects = async (workspaceId: string, userId: string) => {
  await getWorkspaceById(workspaceId, userId);

  return await prisma.project.findMany({
    where: { workspaceId },
    include: {
      _count: { select: { tasks: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getWorkspaceActivity = async (workspaceId: string, userId: string) => {
  await getWorkspaceById(workspaceId, userId);

  return await prisma.activity.findMany({
    where: { workspaceId },
    include: {
      user: {
        select: { id: true, fullName: true, email: true, avatar: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
};

export const updateWorkspace = async (workspaceId: string, data: any, userId: string) => {
  const workspace = await prisma.workspace.findFirst({
    where: { id: workspaceId, ownerId: userId },
  });

  if (!workspace) {
    throw new Error('Only workspace owner can update workspace settings');
  }

  return await prisma.workspace.update({
    where: { id: workspaceId },
    data,
  });
};

export const getWorkspaceRoles = async (workspaceId: string, userId: string) => {
  await getWorkspaceById(workspaceId, userId);

  const roles = await prisma.role.findMany({
    where: { workspaceId },
    include: {
      _count: { select: { members: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  return roles.map((role) => ({
    id: role.id,
    name: role.name,
    permissions: JSON.parse(role.permissions),
    memberCount: role._count.members,
    createdAt: role.createdAt,
  }));
};

export const createWorkspaceRole = async (
  workspaceId: string,
  data: { name: string; permissions: Record<string, boolean> },
  userId: string
) => {
  const workspace = await prisma.workspace.findFirst({
    where: { id: workspaceId, ownerId: userId },
  });

  if (!workspace) {
    throw new Error('Only workspace owner can create roles');
  }

  return await prisma.role.create({
    data: {
      name: data.name,
      permissions: JSON.stringify(data.permissions),
      workspaceId,
    },
  });
};

export const getWorkspaceFiles = async (workspaceId: string, userId: string) => {
  await getWorkspaceById(workspaceId, userId);

  return await prisma.file.findMany({
    where: { workspaceId },
    include: {
      uploader: {
        select: { id: true, fullName: true, email: true, avatar: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const createWorkspaceFile = async (
  workspaceId: string,
  data: { name: string; path: string; size: number; mimeType: string },
  userId: string
) => {
  await getWorkspaceById(workspaceId, userId);

  const file = await prisma.file.create({
    data: {
      name: data.name,
      path: data.path,
      size: data.size,
      mimeType: data.mimeType,
      workspaceId,
      uploadedBy: userId,
    },
    include: {
      uploader: {
        select: { id: true, fullName: true, email: true, avatar: true },
      },
    },
  });

  await prisma.activity.create({
    data: {
      userId,
      workspaceId,
      action: 'UPLOAD_FILE',
      itemType: 'FILE',
      itemId: file.id,
    },
  });

  return file;
};

export const deleteWorkspaceFile = async (workspaceId: string, fileId: string, userId: string) => {
  await getWorkspaceById(workspaceId, userId);

  const file = await prisma.file.findFirst({
    where: { id: fileId, workspaceId },
  });

  if (!file) {
    throw new Error('File not found');
  }

  await prisma.file.delete({ where: { id: fileId } });

  return { message: 'File deleted successfully' };
};
