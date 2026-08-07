import prisma from '../lib/prisma.js';
import { noteSchema } from '../lib/validations.js';

const parseTags = (tags: any) => {
  if (Array.isArray(tags)) {
    return tags.join(',');
  }
  return String(tags || '');
};

const stringTagsToArray = (tagString: string) => {
  if (!tagString) return [];
  return tagString.split(',').map(t => t.trim()).filter(Boolean);
};

export const getNotes = async (userId: string, status?: string, workspaceId?: string, type?: string) => {
  const where: any = { userId };

  if (status) {
    where.status = status;
  }

  // Strict Personal vs Workspace separation
  if (type === 'personal' || (!workspaceId && type !== 'all')) {
    where.workspaceId = null;
  } else if (workspaceId) {
    where.workspaceId = workspaceId;
  }

  const notes = await prisma.note.findMany({
    where,
    include: {
      favorites: {
        where: { userId },
      },
      user: {
        select: { id: true, fullName: true, email: true, avatar: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return notes.map(note => ({
    ...note,
    tags: stringTagsToArray(note.tags),
  }));
};

export const getNoteById = async (noteId: string, userId: string) => {
  const note = await prisma.note.findFirst({
    where: { id: noteId, userId },
    include: {
      favorites: {
        where: { userId },
      },
      user: {
        select: { id: true, fullName: true, email: true, avatar: true },
      },
      shares: true,
    },
  });

  if (!note) {
    throw new Error('Note not found');
  }

  return {
    ...note,
    tags: stringTagsToArray(note.tags),
  };
};

export const createNote = async (data: any, userId: string) => {
  const validated = noteSchema.parse(data);

  const noteData = {
    ...validated,
    tags: parseTags(validated.tags),
    userId,
    workspaceId: validated.workspaceId || null,
  };

  const note = await prisma.note.create({
    data: noteData,
    include: {
      user: {
        select: { id: true, fullName: true, email: true, avatar: true },
      },
    },
  });

  await prisma.activity.create({
    data: {
      userId,
      workspaceId: validated.workspaceId || null,
      action: 'CREATE_NOTE',
      itemType: 'NOTE',
      itemId: note.id,
    },
  });

  return {
    ...note,
    tags: stringTagsToArray(note.tags),
  };
};

export const updateNote = async (noteId: string, data: any, userId: string) => {
  const note = await prisma.note.findFirst({
    where: { id: noteId, userId },
  });

  if (!note) {
    throw new Error('Note not found');
  }

  const updateData: any = { ...data };
  if (data.tags !== undefined) {
    updateData.tags = parseTags(data.tags);
  }

  const updatedNote = await prisma.note.update({
    where: { id: noteId },
    data: updateData,
    include: {
      user: {
        select: { id: true, fullName: true, email: true, avatar: true },
      },
    },
  });

  await prisma.activity.create({
    data: {
      userId,
      workspaceId: updatedNote.workspaceId || null,
      action: 'UPDATE_NOTE',
      itemType: 'NOTE',
      itemId: noteId,
    },
  });

  return {
    ...updatedNote,
    tags: stringTagsToArray(updatedNote.tags),
  };
};

export const deleteNote = async (noteId: string, userId: string) => {
  const note = await prisma.note.findFirst({
    where: { id: noteId, userId },
  });

  if (!note) {
    throw new Error('Note not found');
  }

  await prisma.note.delete({
    where: { id: noteId },
  });

  await prisma.activity.create({
    data: {
      userId,
      action: 'DELETE_NOTE',
      itemType: 'NOTE',
      itemId: noteId,
    },
  });

  return { message: 'Note deleted successfully' };
};

export const archiveNote = async (noteId: string, userId: string) => {
  return await updateNote(noteId, { status: 'ARCHIVED' }, userId);
};

export const trashNote = async (noteId: string, userId: string) => {
  return await updateNote(noteId, { status: 'TRASHED' }, userId);
};

export const restoreNote = async (noteId: string, userId: string) => {
  return await updateNote(noteId, { status: 'ACTIVE' }, userId);
};

export const toggleFavorite = async (noteId: string, userId: string) => {
  const existing = await prisma.favorite.findUnique({
    where: {
      userId_noteId: {
        userId,
        noteId,
      },
    },
  });

  if (existing) {
    await prisma.favorite.delete({
      where: {
        id: existing.id,
      },
    });
    return { isFavorite: false };
  } else {
    await prisma.favorite.create({
      data: {
        userId,
        noteId,
      },
    });
    return { isFavorite: true };
  }
};
