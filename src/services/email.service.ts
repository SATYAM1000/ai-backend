import path from 'path';
import fs from 'fs';
import { env, resend } from '@/config';

export const emailServices = {
  sendWorkspaceInvitationEmail: async (
    to: string,
    workspaceName: string,
    variables: Record<string, string>,
  ) => {
    try {
      const templatePath = path.join(
        __dirname,
        'src',
        'templates',
        'invitation-email.template.html',
      );
      let html = fs.readFileSync(templatePath, 'utf-8');

      for (const [key, value] of Object.entries(variables)) {
        html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
      }

      await resend.emails.send({
        from: env.FROM_EMAIL_ADDRESS,
        to,
        subject: `Invitation to join ${workspaceName}`,
        html,
      });
    } catch {
      throw new Error('Failed to send invitation email');
    }
  },
};
