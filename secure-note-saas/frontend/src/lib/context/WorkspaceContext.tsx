import { createContext, useContext, type ReactNode } from 'react';

export interface WorkspaceDetails {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  ownerId: string;
  members: Array<{
    id: string;
    userId: string;
    role: string;
    user?: { fullName: string; email: string };
  }>;
}

interface WorkspaceContextType {
  workspace: WorkspaceDetails;
  workspaceId: string;
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export const WorkspaceProvider = ({
  workspace,
  workspaceId,
  children,
}: {
  workspace: WorkspaceDetails;
  workspaceId: string;
  children: ReactNode;
}) => (
  <WorkspaceContext.Provider value={{ workspace, workspaceId }}>
    {children}
  </WorkspaceContext.Provider>
);

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within WorkspaceProvider');
  }
  return context;
};
