import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { EWorkspacePermissions } from '@/@types';
import { IWorkspaceMemberRole } from '@/models';
import { workspaceServices } from '@/services';
import { HttpError, utils } from '@/utils';

const ownerPerms: EWorkspacePermissions[] = [
  EWorkspacePermissions.TRANSFER_OWNERSHIP,
  EWorkspacePermissions.MANAGE_WORKSPACE,
  EWorkspacePermissions.INVITE_MEMBERS,
  EWorkspacePermissions.CHANGE_ROLES,
  EWorkspacePermissions.DELETE_WORKSPACE,
  EWorkspacePermissions.MANAGE_API_KEYS,
  EWorkspacePermissions.CREATE_PROJECT,
  EWorkspacePermissions.EDIT_PROJECT,
  EWorkspacePermissions.VIEW_PROJECT,
  EWorkspacePermissions.DELETE_PROJECT,
  EWorkspacePermissions.SHARE_PROJECT,
  EWorkspacePermissions.ACCESS_BILLING,
  EWorkspacePermissions.UPDATE_PROJECT_INFO,
];

const adminPerms: EWorkspacePermissions[] = ownerPerms.filter(
  (p) =>
    p !== EWorkspacePermissions.TRANSFER_OWNERSHIP && p !== EWorkspacePermissions.DELETE_WORKSPACE,
);

const editorPerms: EWorkspacePermissions[] = [
  EWorkspacePermissions.CREATE_PROJECT,
  EWorkspacePermissions.EDIT_PROJECT,
  EWorkspacePermissions.VIEW_PROJECT,
  EWorkspacePermissions.SHARE_PROJECT,
];

const viewerPerms: EWorkspacePermissions[] = [EWorkspacePermissions.VIEW_PROJECT];
const guestPerms: EWorkspacePermissions[] = [EWorkspacePermissions.VIEW_PROJECT];

export const WorkspaceRolePermissions: Record<IWorkspaceMemberRole, EWorkspacePermissions[]> = {
  owner: ownerPerms,
  admin: adminPerms,
  editor: editorPerms,
  viewer: viewerPerms,
  guest: guestPerms,
  project_only: [],
};

export const workspacePermissionHandler = (
  permissions: EWorkspacePermissions | EWorkspacePermissions[],
) => {
  const required = Array.isArray(permissions) ? permissions : [permissions];

  return utils.asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    const userId = req.user!._id;
    const workspaceId = req.params.id;

    if (!workspaceId || !mongoose.Types.ObjectId.isValid(workspaceId)) {
      throw new HttpError('Invalid workspace ID', 400);
    }

    const workspace = await workspaceServices.getWorkspaceInfoById(workspaceId, userId);
    if (!workspace) {
      throw new HttpError('Workspace not found', 404);
    }

    let role: IWorkspaceMemberRole | null = null;
    if (workspace.ownerId.toString() === userId.toString()) {
      role = IWorkspaceMemberRole.OWNER;
    } else {
      const member = workspace.members.find((m) => m.userId.toString() === userId.toString());
      role = member?.role || null;
    }

    if (!role) {
      throw new HttpError('You are not a member of this workspace', 403);
    }

    const hasPermission = required.some((p) => WorkspaceRolePermissions[role].includes(p));

    if (!hasPermission) {
      throw new HttpError('You do not have permission to perform this action', 403);
    }

    next();
  });
};
