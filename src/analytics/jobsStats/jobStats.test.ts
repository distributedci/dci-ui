import { groupByKeys, groupByKeysWithLabel } from './jobStats';

describe('jobStats groupByKeys config', () => {
  it('does not include the results key', () => {
    expect(groupByKeys).not.toContain('results');
  });
});

describe('jobStats groupByKeysWithLabel config', () => {
  it('does not have a results label', () => {
    expect(groupByKeysWithLabel).not.toHaveProperty('results');
  });
});