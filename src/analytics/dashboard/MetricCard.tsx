import {
  Card,
  CardBody,
  Skeleton,
} from "@patternfly/react-core";

interface MetricCardProps {
  value: number;
  label: string;
  loading?: boolean;
}

export default function MetricCard({ value, label, loading = false }: MetricCardProps) {
  return (
    <Card>
      <CardBody>
        {loading ? (
          <Skeleton fontSize="4xl" />
        ) : (
          <div className="pf-v6-u-font-size-4xl pf-v6-u-text-align-center">
            {value.toLocaleString()}
          </div>
        )}
        <p className="pf-v6-u-text-align-center pf-v6-u-mt-sm pf-v6-u-mb-0">
          {label}
        </p>
      </CardBody>
    </Card>
  );
}
