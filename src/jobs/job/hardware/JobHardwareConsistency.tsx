import {
  Alert,
  Card,
  CardBody,
  Content,
  ContentVariants,
} from "@patternfly/react-core";
import type { INode } from "analytics/hardware/hardwareFormatter";
import {
  checkHardwareConsistency,
  type RoleConsistency,
} from "./hardwareConsistency";

function ConsistencyAlert({
  roleType,
  result,
}: {
  roleType: "directors" | "workers";
  result: RoleConsistency[typeof roleType];
}) {
  const roleLabel = roleType === "directors" ? "Directors" : "Workers";

  if (result.isConsistent) {
    return (
      <Alert
        variant="success"
        title={`${roleLabel} are consistent`}
        className="pf-v6-u-mb-md"
      >
        All {roleLabel.toLowerCase()} have matching hardware configurations.
      </Alert>
    );
  }

  return (
    <Alert
      variant="warning"
      title={`${roleLabel} are inconsistent`}
      className="pf-v6-u-mb-md"
    >
      <div>
        <p className="pf-v6-u-mb-sm">
          The following differences were found between {roleLabel.toLowerCase()}:
        </p>
        <ul className="pf-v6-u-ml-md">
          {result.differences.map((diff, index) => (
            <li key={index}>{diff}</li>
          ))}
        </ul>
      </div>
    </Alert>
  );
}

export default function JobHardwareConsistency({
  nodes,
}: {
  nodes: INode[];
}) {
  const consistency = checkHardwareConsistency(nodes);

  const hasDirectors = nodes.some((node) => node.role === "director");
  const hasWorkers = nodes.some((node) => node.role === "worker");

  // Don't show anything if there are no directors or workers
  if (!hasDirectors && !hasWorkers) {
    return null;
  }

  return (
    <Card className="pf-v6-u-mb-md">
      <CardBody>
        <Content
          component={ContentVariants.h3}
          className="pf-v6-u-mb-md"
        >
          Hardware Consistency
        </Content>
        {hasDirectors && (
          <ConsistencyAlert roleType="directors" result={consistency.directors} />
        )}
        {hasWorkers && (
          <ConsistencyAlert roleType="workers" result={consistency.workers} />
        )}
      </CardBody>
    </Card>
  );
}
