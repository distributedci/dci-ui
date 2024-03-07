import * as React from "react";
import { IEnhancedJob } from "types";
import { useParams } from "react-router";
import { useGetEnhancedJobQuery } from "jobs/jobsApi";
import { skipToken } from "@reduxjs/toolkit/query";
import JobPageSkeleton from "./JobPageSkeleton";
import JobDetailsSummarySkeleton from "./JobDetailsSummarySkeleton";

export type JobContextProps = {
  job: IEnhancedJob;
};

const JobContext = React.createContext({} as JobContextProps);

type JobProviderProps = {
  children: React.ReactNode;
};

function JobProvider({ children }: JobProviderProps) {
  const { job_id = "" } = useParams();
  const { data: job, isLoading } = useGetEnhancedJobQuery(
    job_id ? job_id : skipToken,
  );

  if (isLoading) {
    return (
      <JobPageSkeleton job_id={job_id}>
        <JobDetailsSummarySkeleton />
      </JobPageSkeleton>
    );
  }
  if (!job) {
    return <JobPageSkeleton job_id={job_id} />;
  }

  return <JobContext.Provider value={{ job }}>{children}</JobContext.Provider>;
}

const useJob = () => React.useContext(JobContext);

export { JobProvider, useJob };
