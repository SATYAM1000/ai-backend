import { env } from '@/config';

export const emailServices = {
  sendWorkspaceInvitationEmail: async (
    token: string,
    workspaceName: string,
    inviterName: string,
    inviterEmail: string,
    role: string,
    existingInvitationId: string,
  ) => {
    const invitationLink = `${env.FRONTEND_URL}/invites/accept/${token}`;

    const templateVariables = {
      workspaceName: workspaceName,
      inviterName: inviterName,
      inviterEmail: inviterEmail,
      role,
      inviteLink: invitationLink,
      expiresIn: '7 days',
      appName: 'ProtoAI',
      nowDate: new Date().toLocaleDateString(),
      mirrorLink: `${env.FRONTEND_URL}/invites/view/${existingInvitationId}`,
    };

    return invitationLink;
  },
};
