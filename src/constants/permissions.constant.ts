import { IWorkspaceMemberRole } from '@/models';

export enum AllWorkspacePermission {
  MANAGE_WORKSPACE = 'manage_workspace',
  INVITE_MEMBERS = 'invite_members',
  CHANGE_ROLES = 'change_roles',
  DELETE_WORKSPACE = 'delete_workspace',

  CREATE_PROJECT = 'create_project',
  EDIT_PROJECT = 'edit_project',
  VIEW_PROJECT = 'view_project',
  DELETE_PROJECT = 'delete_project',

  ACCESS_BILLING = 'access_billing',
}

export const WorkspaceRolePermissions: Record<IWorkspaceMemberRole, AllWorkspacePermission[]> = {
  owner: [
    AllWorkspacePermission.MANAGE_WORKSPACE,
    AllWorkspacePermission.INVITE_MEMBERS,
    AllWorkspacePermission.CHANGE_ROLES,
    AllWorkspacePermission.DELETE_WORKSPACE,
    AllWorkspacePermission.CREATE_PROJECT,
    AllWorkspacePermission.EDIT_PROJECT,
    AllWorkspacePermission.VIEW_PROJECT,
    AllWorkspacePermission.DELETE_PROJECT,
    AllWorkspacePermission.ACCESS_BILLING,
  ],
  admin: [
    AllWorkspacePermission.MANAGE_WORKSPACE,
    AllWorkspacePermission.INVITE_MEMBERS,
    AllWorkspacePermission.CHANGE_ROLES,
    AllWorkspacePermission.CREATE_PROJECT,
    AllWorkspacePermission.EDIT_PROJECT,
    AllWorkspacePermission.VIEW_PROJECT,
    AllWorkspacePermission.DELETE_PROJECT,
    AllWorkspacePermission.ACCESS_BILLING,
  ],
  editor: [
    AllWorkspacePermission.CREATE_PROJECT,
    AllWorkspacePermission.EDIT_PROJECT,
    AllWorkspacePermission.VIEW_PROJECT,
  ],
  viewer: [AllWorkspacePermission.VIEW_PROJECT],
  guest: [AllWorkspacePermission.VIEW_PROJECT],
};

export function hasPermission(
  role: IWorkspaceMemberRole,
  permission: AllWorkspacePermission,
): boolean {
  return WorkspaceRolePermissions[role]?.includes(permission) ?? false;
}
