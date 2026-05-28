import prisma from '../lib/prisma.js';

export const getDashboardStats = async (userId: string) => {
  const [totalNotes, completedTasks, upcomingTasks, totalWorkspaces] = await Promise.all([
    prisma.note.count({
      where: { userId, status: 'ACTIVE' },
    }),
    prisma.task.count({
      where: {
        OR: [{ userId }, { assigneeId: userId }],
        status: 'DONE',
      },
    }),
    prisma.task.findMany({
      where: {
        OR: [{ userId }, { assigneeId: userId }],
        status: { not: 'DONE' },
      },
      take: 5,
      orderBy: { dueDate: 'asc' },
      include: {
        user: {
          select: { id: true, fullName: true, email: true },
        },
      },
    }),
    prisma.workspaceMember.count({
      where: { userId, isActive: true },
    }),
  ]);

  const recentNotes = await prisma.note.findMany({
    where: { userId, status: 'ACTIVE' },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { id: true, fullName: true, email: true },
      },
    },
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
