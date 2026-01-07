import { Card, CardBody, Skeleton } from "@patternfly/react-core";

export default function JobDetailsSkeleton() {
  return (
    <Card>
      <CardBody>
        <div
          style={{ height: "260px", display: "flex", alignItems: "flex-end" }}
        >
          <Skeleton height="100%" width="100%" />
        </div>
      </CardBody>
    </Card>
  );
}
