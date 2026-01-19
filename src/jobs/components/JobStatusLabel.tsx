import { Label } from "@patternfly/react-core";
import {
  CheckCircleIcon,
  BugIcon,
  ExclamationCircleIcon,
  StopCircleIcon,
  InProgressIcon,
} from "@patternfly/react-icons";
import type { IJobStatus } from "types";

interface JobStatusLabelProps
  extends Omit<React.ComponentProps<typeof Label>, "status"> {
  status: IJobStatus;
}

export default function JobStatusLabel({
  status,
  ...props
}: JobStatusLabelProps) {
  switch (status) {
    case "success":
      return (
        <Label isCompact color="green" icon={<CheckCircleIcon />} {...props}>
          {status}
        </Label>
      );
    case "failure":
      return (
        <Label isCompact color="red" icon={<BugIcon />} {...props}>
          {status}
        </Label>
      );
    case "error":
      return (
        <Label
          isCompact
          color="red"
          icon={<ExclamationCircleIcon />}
          {...props}
        >
          {status}
        </Label>
      );
    case "killed":
      return (
        <Label isCompact color="orange" icon={<StopCircleIcon />} {...props}>
          {status}
        </Label>
      );
    default:
      return (
        <Label isCompact color="blue" icon={<InProgressIcon />} {...props}>
          {status}
        </Label>
      );
  }
}
