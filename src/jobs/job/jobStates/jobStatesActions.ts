import { DateTime } from "luxon";
import { FinalJobStatuses } from "types";
import type {
  IJobState,
  IFileWithDuration,
  IJobStatus,
  IPipelineStatus,
  IEnhancedJobState,
} from "types";
import { sortByOldestFirst } from "services/sort";

function _addDuration(jobStates: IJobState[]) {
  let currentDate: DateTime | null = null;

  const newJobStates: {
    duration: number;
    files: IFileWithDuration[];
  }[] = sortByOldestFirst(jobStates).map((job) => {
    let jobDuration = 0;

    const newFiles: IFileWithDuration[] = sortByOldestFirst(job.files).map(
      (file) => {
        const fileCreated = DateTime.fromISO(file.created_at);
        const fileUpdated = DateTime.fromISO(file.updated_at);

        const duration = currentDate
          ? fileCreated.diff(currentDate).as("seconds")
          : 0;
        jobDuration += duration;

        currentDate = fileUpdated;

        return { ...file, duration };
      },
    );

    return {
      ...job,
      files: newFiles,
      duration: jobDuration,
    };
  });

  return newJobStates;
}

function getFinalPipelineStatus(status: IJobStatus): IPipelineStatus {
  switch (status) {
    case "running":
      return "info";
    case "failure":
    case "error":
      return "danger";
    case "killed":
      return "warning";
    default:
      return "success";
  }
}

function _addPipelineStatus(jobStates: IJobState[]) {
  return sortByOldestFirst(jobStates).map((jobState, i, arr) => {
    const isTheLastOne = arr.length - 1 === i;
    const isThePenultimate = arr.length > 1 && arr.length - 2 === i;
    let pipelineStatus: IPipelineStatus = "success";
    if (isTheLastOne) {
      pipelineStatus = getFinalPipelineStatus(jobState.status);
    } else {
      const nextStatus = arr[i + 1].status;
      const nextStatusIsFinalJobStatus =
        (FinalJobStatuses as readonly string[]).indexOf(nextStatus) !== -1;
      if (isThePenultimate && nextStatusIsFinalJobStatus) {
        pipelineStatus = getFinalPipelineStatus(nextStatus);
      }
    }
    return {
      ...jobState,
      pipelineStatus,
    };
  });
}

export function addDurationAndPipelineStatus(
  jobStates: IJobState[],
): IEnhancedJobState[] {
  return _addDuration(_addPipelineStatus(jobStates)) as IEnhancedJobState[];
}

export function getLongerTaskFirst(jobStates: IEnhancedJobState[]) {
  const tasks: IFileWithDuration[] = [];
  for (let index = 0; index < jobStates.length; index++) {
    const jobState = jobStates[index];
    for (let j = 0; j < jobState.files.length; j++) {
      const task = jobState.files[j];
      tasks.push(task);
    }
  }
  return tasks.sort((t1, t2) => t2.duration - t1.duration);
}
