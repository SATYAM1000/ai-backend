import { Worker } from 'bullmq';
import { redisClient } from '@/config';
import { emailServices, invitationServices } from '@/services';
import { utils } from '@/utils';
import { BullMQJobsName } from '@/@types';

let emailWorker: Worker | null = null;

export const initEmailWorker = () => {
  if (!emailWorker) {
    try {
      emailWorker = new Worker(
        BullMQJobsName.SEND_WORKSPACE_INVITATION_EMAIL,
        async (job) => {
          if (job.name === BullMQJobsName.SEND_WORKSPACE_INVITATION_EMAIL) {
            const { to, templateVariables, invitationId } = job.data;
            try {
              await emailServices.sendWorkspaceInvitationEmail(
                to,
                templateVariables.workspaceName,
                templateVariables,
              );

              await invitationServices.updateEmailSentStatus(invitationId);
              utils.logger('info', `✅ Successfully sent invitation email to ${to}`);
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Unknown error';
              utils.logger('error', `❌ Failed to send invitation email to ${to}: ${errorMessage}`);
              throw error;
            }
          }
        },
        { connection: redisClient },
      );

      emailWorker.on('completed', (job) => {
        utils.logger('info', `✅ Completed job ${job?.id}`);
      });

      emailWorker.on('failed', (job, err) => {
        utils.logger('error', `❌ Failed job ${job?.id}: ${err.message}`);
      });
    } catch (workerError) {
      console.error('Worker creation error:', workerError);
      throw workerError;
    }
  }
  return emailWorker;
};

export const getEmailWorker = () => {
  if (!emailWorker) {
    throw new Error('Email worker not initialized. Call initEmailWorker() first.');
  }
  return emailWorker;
};
