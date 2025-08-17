import { AllWorkspacePermission, WorkspaceRolePermissions } from '@/constants';
import { IWorkspaceMemberRole } from '@/models';

function hasPermissionInWorkspace(
  permission: AllWorkspacePermission,
  workspaceMemberRole: IWorkspaceMemberRole,
): boolean {
  return WorkspaceRolePermissions[workspaceMemberRole]?.includes(permission) ?? false;
}

export const permissionsUtil = {
  hasPermissionInWorkspace,
};
