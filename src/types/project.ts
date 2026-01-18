/**
 * Project Types (Future)
 * 
 * Architecture placeholder for project-based time tracking.
 * Not implemented in v1, but types are ready for later integration.
 */

export interface Project {
    id: string;
    name: string;
    color: string;
    createdAt: number;
    updatedAt: number;
    archived: boolean;
}

export interface ProjectStats {
    projectId: string;
    totalWorkMs: number;
    totalSessions: number;
    lastSessionAt: number | null;
}
