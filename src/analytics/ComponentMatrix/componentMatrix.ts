import { IComponentMatrixESData } from "types";

interface ComponentMatrix {
  [productId: string]: {
    [componentId: string]: {
      id: string;
      name: string;
      nbOfSuccessfulJobs: number;
      nbOfJobs: number;
    };
  };
}

export function buildComponentMatrix(data: IComponentMatrixESData[]) {
  return data.reduce((acc, d) => {
    const componentId = d._source.component_id;
    const product = acc[d._source.product_id] || {};
    const componentStats = product[componentId] || {
      id: componentId,
      name: d._source.component_name,
      nbOfSuccessfulJobs: 0,
      nbOfJobs: 0,
    };
    componentStats.nbOfSuccessfulJobs += d._source.success_jobs.length;
    componentStats.nbOfJobs +=
      d._source.success_jobs.length + d._source.failed_jobs.length;
    product[componentId] = componentStats;
    acc[d._source.product_id] = product;
    return acc;
  }, {} as ComponentMatrix);
}

export function getComponentMatrixDomain(matrix: ComponentMatrix) {
  return Object.values(matrix).reduce(
    (acc, components) => {
      for (const component of Object.values(components)) {
        if (component.nbOfJobs > acc.max) {
          acc.max = component.nbOfJobs;
        }
      }
      return acc;
    },
    { min: 0, max: 0 } as {
      min: number;
      max: number;
    }
  );
}
