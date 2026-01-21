import * as React from "react";
import { InfoCircleIcon } from "@patternfly/react-icons";
import { Grid, GridItem, Tooltip } from "@patternfly/react-core";

interface CardLineProps
  extends Omit<React.ComponentProps<typeof Grid>, "value"> {
  field: string;
  help?: string;
  value: React.ReactNode;
}

export default function CardLine({
  field,
  help,
  value,
  ...props
}: CardLineProps) {
  return (
    <Grid hasGutter {...props}>
      <GridItem span={4} style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            color: "#72767b",
            fontWeight: "bold",
          }}
        >
          {field}
          {help && (
            <Tooltip position="right" content={<div>{help}</div>}>
              <span className="pf-v6-u-ml-xs">
                <InfoCircleIcon />
              </span>
            </Tooltip>
          )}
        </div>
      </GridItem>
      <GridItem span={8}>{value}</GridItem>
    </Grid>
  );
}
