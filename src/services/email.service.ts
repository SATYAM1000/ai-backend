import path from 'path';
import fs from 'fs';
import { BullMQJobsName } from '@/@types';
import { env, resend } from '@/config';
import { getEmailQueue } from '@/queues';

export const emailServices = {
  addEmailToQueue: async (
    email: string,
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
      companyAddress: 'ProtoAI Inc.',
      supportUrl: `${env.FRONTEND_URL}/support`,
    };

    await getEmailQueue().add(BullMQJobsName.SEND_WORKSPACE_INVITATION_EMAIL, {
      template: 'workspace-invitation',
      to: email,
      subject: 'Workspace Invitation',
      templateVariables,
      invitationId: existingInvitationId,
    });

    return invitationLink;
  },
  sendWorkspaceInvitationEmail: async (
    to: string,
    workspaceName: string,
    variables: Record<string, string>,
  ) => {
    try {
      const templatePath = path.join(
        process.cwd(),
        'src',
        'templates',
        'invitation-email.template.html',
      );

      if (!fs.existsSync(templatePath)) {
        throw new Error(`Email template not found at: ${templatePath}`);
      }

      let html = fs.readFileSync(templatePath, 'utf-8');

      for (const [key, value] of Object.entries(variables)) {
        html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
      }

      const result = await resend.emails.send({
        from: env.FROM_EMAIL_ADDRESS,
        to,
        subject: `Invitation to join ${workspaceName}`,
        html,
      });

      if (result.error) {
        throw new Error(`Resend API error: ${result.error.message}`);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to send invitation email: ${errorMessage}`);
    }
  },
};
