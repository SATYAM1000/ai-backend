function createUserKey(userId: string) {
  return `user:${userId}`;
}

function createWorkspaceKey(workspaceId: string) {
  return `workspace:${workspaceId}`;
}

function createProjectKey(projectId: string) {
  return `project:${projectId}`;
}

export const redisUtils = { createUserKey, createWorkspaceKey, createProjectKey };
