import { Job, JobNode, QueueEvents } from 'bullmq';

function getFlowJobs(jobNode: JobNode): Job[] {
  let jobs: Job[] = [jobNode.job]; // Start with the current job

  if (jobNode.children && jobNode.children.length > 0) {
    for (const childNode of jobNode.children) {
      jobs = jobs.concat(getFlowJobs(childNode)); // Recursively add child jobs
    }
  }

  return jobs;
}

export async function flowWaitUntilFinished(
  jobNode: JobNode,
  ttl: number,
  queueEvents: QueueEvents,
): Promise<any> {
  const jobs = getFlowJobs(jobNode);
  const topJob = jobs[0];
  const completedStatus = await Promise.all(
    jobs.map((job) => job.isCompleted()),
  );

  const unFinishedJobIds = jobs
    .filter((_job, idx) => !completedStatus[idx])
    .map((job) => job.id);

  let pointer = unFinishedJobIds.length;

  return new Promise<any>((resolve, reject) => {
    // eslint-disable-next-line no-var
    var clearCurrentTimeout = startTimeout(onFailure);

    function startTimeout(
      callback: (args: { jobId: string; failedReason: string }) => void,
    ) {
      if (typeof clearCurrentTimeout === 'function') {
        clearCurrentTimeout();
      }
      pointer--;

      const timeoutId = setTimeout(() => {
        callback({
          jobId: unFinishedJobIds[pointer] ?? 'unknown-job-id',
          failedReason: `Flow Job wait timed out before finishing, no finish notification arrived after ${ttl}ms `,
        });
      }, ttl);

      return () => clearTimeout(timeoutId);
    }

    function onComplete({ jobId, returnvalue }): void {
      if (unFinishedJobIds.includes(jobId) && jobId !== topJob.id) {
        clearCurrentTimeout = startTimeout(onFailure);
      } else if (jobId === topJob.id) {
        removeListeners();
        resolve(returnvalue);
      }
    }

    function onFailure({ jobId, failedReason }): void {
      if (unFinishedJobIds.includes(jobId)) {
        const error: any = new Error(failedReason);
        error.failedJobId = `${topJob.id}:${jobId}`;

        removeListeners();
        reject(error);
      }
    }

    function removeListeners(): void {
      queueEvents.off('completed', onComplete);
      queueEvents.off('failed', onFailure);

      clearCurrentTimeout();
    }

    queueEvents.on('completed', onComplete);
    queueEvents.on('failed', onFailure);
  });
}
