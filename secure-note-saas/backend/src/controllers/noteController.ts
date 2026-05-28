import { Response } from 'express';
import * as noteService from '../services/noteService.js';
import type { AuthRequest } from '../middleware/auth.js';
import { getSingleQueryParam } from '../lib/utils.js';

export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const { status, workspaceId } = req.query;
    const notes = await noteService.getNotes(
      req.user!.id,
      getSingleQueryParam(status),
      getSingleQueryParam(workspaceId)
    );
    res.json(notes);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getNoteById = async (req: AuthRequest, res: Response) => {
  try {
    const noteId = getSingleQueryParam(req.params.id)!;
    const note = await noteService.getNoteById(noteId, req.user!.id);
    res.json(note);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const note = await noteService.createNote(req.body, req.user!.id);
    res.status(201).json(note);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateNote = async (req: AuthRequest, res: Response) => {
  try {
    const noteId = getSingleQueryParam(req.params.id)!;
    const note = await noteService.updateNote(noteId, req.body, req.user!.id);
    res.json(note);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const noteId = getSingleQueryParam(req.params.id)!;
    await noteService.deleteNote(noteId, req.user!.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const archiveNote = async (req: AuthRequest, res: Response) => {
  try {
    const noteId = getSingleQueryParam(req.params.id)!;
    const note = await noteService.archiveNote(noteId, req.user!.id);
    res.json(note);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const trashNote = async (req: AuthRequest, res: Response) => {
  try {
    const noteId = getSingleQueryParam(req.params.id)!;
    const note = await noteService.trashNote(noteId, req.user!.id);
    res.json(note);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const restoreNote = async (req: AuthRequest, res: Response) => {
  try {
    const noteId = getSingleQueryParam(req.params.id)!;
    const note = await noteService.restoreNote(noteId, req.user!.id);
    res.json(note);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
