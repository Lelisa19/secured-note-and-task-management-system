export const getInitials = (name: string) => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name[0].toUpperCase();
};

export const formatRelativeTime = (date: string | Date) => {
  const d = new Date(date);
  const diffMs = Date.now() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;

  return d.toLocaleDateString();
};

export const formatDateTime = (date: string | Date) => {
  return new Date(date).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const parseNoteTags = (tags: string | string[] | undefined) => {
  if (Array.isArray(tags)) return tags;
  if (!tags) return [];
  return tags.split(',').map((t) => t.trim()).filter(Boolean);
};

export const formatActivityAction = (action: string) => {
  const labels: Record<string, string> = {
    CREATE_NOTE: 'created a note',
    UPDATE_NOTE: 'updated a note',
    DELETE_NOTE: 'deleted a note',
    CREATE_TASK: 'created a task',
    UPDATE_TASK: 'updated a task',
    DELETE_TASK: 'deleted a task',
    CREATE_WORKSPACE: 'created a workspace',
    JOIN_WORKSPACE: 'joined the workspace',
    CREATE_PROJECT: 'created a project',
    LOGIN: 'logged in',
  };
  return labels[action] || action.toLowerCase().replace(/_/g, ' ');
};
