import prisma from '../lib/prisma.js';

export const getDashboardStats = async (userId: string) => {
  const [totalNotes, completedTasks, upcomingTasks, totalWorkspaces] = await Promise.all([
    prisma.note.count({
      where: { userId, workspaceId: null, status: 'ACTIVE' },
    }),
    prisma.task.count({
      where: {
        userId,
        workspaceId: null,
        status: 'DONE',
      },
    }),
    prisma.task.findMany({
      where: {
        userId,
        workspaceId: null,
        status: { not: 'DONE' },
      },
      take: 5,
      orderBy: { dueDate: 'asc' },
    }),
    prisma.workspaceMember.count({
      where: { userId, isActive: true },
    }),
  ]);

  const recentNotes = await prisma.note.findMany({
    where: { userId, workspaceId: null, status: 'ACTIVE' },
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  const recentActivity = await prisma.activity.findMany({
    where: { userId },
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { id: true, fullName: true, email: true, avatar: true },
      },
    },
  });

  return {
    stats: {
      totalNotes,
      completedTasks,
      upcomingTasks: upcomingTasks.length,
      totalWorkspaces,
    },
    recentNotes,
    upcomingTasks,
    recentActivity,
  };
};

export const getReminders = async (userId: string) => {
  return await prisma.reminder.findMany({
    where: { userId },
    include: { task: true },
    orderBy: { remindAt: 'asc' },
  });
};

export const createReminder = async (data: { title: string; message?: string; remindAt: string; taskId?: string }, userId: string) => {
  return await prisma.reminder.create({
    data: {
      title: data.title,
      message: data.message || '',
      remindAt: new Date(data.remindAt),
      taskId: data.taskId || null,
      userId,
    },
  });
};

export const deleteReminder = async (reminderId: string, userId: string) => {
  return await prisma.reminder.deleteMany({
    where: { id: reminderId, userId },
  });
};

export const getFavorites = async (userId: string) => {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: {
      note: true,
      task: true,
    },
  });
  return favorites;
};

export const getNotifications = async (userId: string) => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
};

export const markNotificationRead = async (notificationId: string, userId: string) => {
  return await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true },
  });
};

export const getSecurityLogs = async (userId: string) => {
  return await prisma.securityLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 30,
  });
};

export const updateProfile = async (userId: string, data: { fullName?: string; avatar?: string }) => {
  return await prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, fullName: true, email: true, role: true, avatar: true, createdAt: true },
  });
};
