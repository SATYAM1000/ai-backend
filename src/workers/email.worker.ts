import { Worker } from 'bullmq';
import { redisClient } from '@/config';
import { emailServices } from '@/services/email.service';
import { utils } from '@/utils';

let emailWorker: Worker | null = null;

export const initEmailWorker = () => {
  if (!emailWorker) {
    try {
      emailWorker = new Worker(
        'email-queue',
        async (job) => {
          if (job.name === 'send-workspace-invite') {
            utils.logger('info', `📧 Sending workspace invite email for job ${job?.id}`);
            const { to, workspaceName, variables } = job.data;
            utils.logger('info', `📧 Sending workspace invite email for job ${job?.id} to ${to}`);
            await emailServices.sendWorkspaceInvitationEmail(to, workspaceName, variables);
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
