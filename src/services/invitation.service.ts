import crypto from 'crypto';
import { EInvitationStatus, InvitationModel } from '@/models';
import mongoose from 'mongoose';
import { env } from '@/config';

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
    const token = crypto.randomBytes(32).toString('hex');

    const payload = {
      email,
      workspaceId,
      invitedBy,
      role,
      token,
      status: EInvitationStatus.PENDING,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    const newInvitation = await InvitationModel.create(payload);
    return newInvitation;
  },
};
