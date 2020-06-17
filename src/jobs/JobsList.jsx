import React from "react";
import {
  global_Color_light_200
} from "@patternfly/react-tokens";
import styled from "styled-components";
import { isEmpty } from "lodash";
import JobSummary from "./JobSummary";


const JobUl = styled.ul`
  border: 1px solid ${global_Color_light_200.value};
  padding: 0;
  margin: 0;
`;

const JobLi = styled.li`
  border-top: 1px solid ${global_Color_light_200.value};
  &:first-child {
    border-top: none;
  }

  padding: 0;
  margin: 0;
`;

const JobsList = ({ jobs }) => {
  if (isEmpty(jobs)) return null;
  return (
    <JobUl aria-label="job list">
      {jobs.map((job, i) => (
        <JobLi key={job.id}>
          <JobSummary job={job} />
        </JobLi>
      ))}
    </JobUl>
  );
};

export default JobsList;
