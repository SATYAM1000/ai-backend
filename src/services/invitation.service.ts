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
    session?: mongoose.ClientSession,
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
    const result = await InvitationModel.create([payload], { session });
    return result[0] || null;
  },
  updateEmailSentStatus: async (invitationId: string) => {
    return await InvitationModel.updateOne(
      { _id: new mongoose.Types.ObjectId(invitationId) },
      {
        $set: { lastSentAt: new Date() },
        $inc: { resentCount: 1 },
      },
    );
  },
};
