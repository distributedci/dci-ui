import { Alert } from "@patternfly/react-core";
import type { INode } from "analytics/hardware/hardwareFormatter";
import {
  getHardwareDifferences,
  type INodeDifferences,
} from "./hardwareDifference";

function NodeDifferences({
  title,
  description,
  differences,
}: {
  title: string;
  description: string;
  differences: INodeDifferences;
}) {
  return (
    <Alert variant="warning" title={title} isInline className="pf-v6-u-mb-md">
      <div>
        <p className="pf-v6-u-mb-sm">{description}</p>
        <ul className="pf-v6-u-ml-md">
          {differences.map((diff, index) => (
            <li key={index}>{diff}</li>
          ))}
        </ul>
      </div>
    </Alert>
  );
}

export default function JobHardwareDifferences({ nodes }: { nodes: INode[] }) {
  const directorDifferences = getHardwareDifferences(
    nodes.filter((n) => n.role === "director"),
  );
  const workerDifferences = getHardwareDifferences(
    nodes.filter((n) => n.role === "worker"),
  );

  if (directorDifferences.length === 0 && workerDifferences.length === 0) {
    return null;
  }

  return (
    <>
      {directorDifferences.length > 0 && (
        <NodeDifferences
          title={`Directors are inconsistent`}
          description="The following differences were found between directors:"
          differences={directorDifferences}
        />
      )}
      {workerDifferences.length > 0 && (
        <NodeDifferences
          title={`Workers are inconsistent`}
          description="The following differences were found between workers:"
          differences={workerDifferences}
        />
      )}
    </>
  );
}
