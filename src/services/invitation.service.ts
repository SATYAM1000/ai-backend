import { EInvitationStatus, InvitationModel } from '@/models';
import mongoose from 'mongoose';
import { generateRandomToken } from '@/utils';

export const invitationServices = {
  getInvitationByEmail: async (email: string, workspaceId: string) => {
    const invitation = await InvitationModel.findOne({
      email,
      workspaceId,
      status: EInvitationStatus.PENDING,
    });
    return invitation;
  },
  createNewInvitation: async (
    email: string,
    workspaceId: string,
    role: string,
    invitedBy: mongoose.Types.ObjectId,
  ) => {
    const payload = {
      email,
      workspaceId,
      invitedBy,
      role,
      token: generateRandomToken(),
      status: EInvitationStatus.PENDING,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
    return await InvitationModel.create(payload);
  },
};
