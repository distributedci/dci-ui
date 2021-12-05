import { useEffect, useState } from "react";
import * as React from "react";
import { IEnhancedJob, ITest } from "types";
import { useParams } from "react-router";
import jobsActions from "jobs/jobsActions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store";
import { getResults } from "jobs/job/tests/testsActions";
import { getJobStatesWithFiles } from "jobs/job/jobStates/jobStatesActions";
import { sortByName } from "services/sort";
import { LoadingPage } from "layout";

export type JobContextProps = {
  job: IEnhancedJob;
};

const JobContext = React.createContext({} as JobContextProps);

type JobProviderProps = {
  children: React.ReactNode;
};

function JobProvider({ children }: JobProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [job, setJob] = React.useState<IEnhancedJob | null>(null);
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      dispatch(
        jobsActions.one(id, {
          embed: "results,team,remoteci,components,topic,files",
        })
      )
        .then(async (response) => {
          const job = response.data.job;
          const q1 = await getResults(job);
          const q2 = await getJobStatesWithFiles(job);
          let previous_job = null;
          if (job.previous_job_id) {
            const q3 = await dispatch(jobsActions.one(job.previous_job_id));
            previous_job = q3.data.job;
          }
          const enhancedJob = {
            ...job,
            tests: sortByName<ITest>(q1.data.results),
            jobstates: q2.data.jobstates,
            previous_job,
          };
          setJob(enhancedJob);
          return response;
        })
        .catch(console.log)
        .then(() => setIsLoading(false));
    }
  }, [id, dispatch]);

  if (isLoading || job === null) {
    return <LoadingPage title="Job Details" />;
  }
  return <JobContext.Provider value={{ job }}>{children}</JobContext.Provider>;
}

const useJob = () => React.useContext(JobContext);

export { JobProvider, useJob };
