import prisma from '../lib/prisma.js';

export const getAdminStats = async () => {
  const [totalUsers, totalWorkspaces, totalNotes, totalTasks, activeSubscriptions] = await Promise.all([
    prisma.user.count(),
    prisma.workspace.count(),
    prisma.note.count(),
    prisma.task.count(),
    prisma.subscription.count({ where: { isActive: true } }),
  ]);

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { id: true, fullName: true, email: true, role: true, createdAt: true },
  });

  return {
    stats: {
      totalUsers,
      totalWorkspaces,
      totalNotes,
      totalTasks,
      activeSubscriptions,
    },
    recentUsers,
  };
};

export const getUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      fullName: true,
      avatar: true,
      role: true,
      isVerified: true,
      twoFactorEnabled: true,
      createdAt: true,
      updatedAt: true,
      subscription: true,
      _count: { select: { notes: true, createdTasks: true, ownedWorkspaces: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const updateUserRole = async (userId: string, role: 'USER' | 'ADMIN') => {
  return await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
};

export const getAllWorkspaces = async () => {
  return await prisma.workspace.findMany({
    include: {
      owner: { select: { id: true, fullName: true, email: true } },
      _count: { select: { members: true, notes: true, tasks: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getSubscriptions = async () => {
  return await prisma.subscription.findMany({
    include: {
      user: { select: { id: true, fullName: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getAnnouncements = async () => {
  return await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const createAnnouncement = async (data: { title: string; content: string; type: string }) => {
  return await prisma.announcement.create({
    data: {
      title: data.title,
      content: data.content,
      type: data.type || 'INFO',
      isActive: true,
    },
  });
};

export const getSupportTickets = async () => {
  return await prisma.supportTicket.findMany({
    include: {
      user: { select: { id: true, fullName: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getSecurityLogs = async () => {
  return await prisma.securityLog.findMany({
    include: {
      user: { select: { id: true, fullName: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
};

export const getPayments = async () => {
  return await prisma.payment.findMany({
    include: {
      user: { select: { id: true, fullName: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
};
