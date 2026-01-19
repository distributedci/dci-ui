import { ThumbsUpIcon } from "@patternfly/react-icons";

interface SuccessfixesIconProps extends React.ComponentProps<"span"> {
  successfixes: number;
}

export default function SuccessfixesIcon({
  successfixes,
  ...props
}: SuccessfixesIconProps) {
  if (successfixes === 0) {
    return null;
  }
  return (
    <span {...props}>
      <ThumbsUpIcon style={{ fontSize: "0.8em", marginRight: "1px" }} />
      {`+${successfixes}`}
    </span>
  );
}
