import type { INode } from "analytics/hardware/hardwareFormatter";
import {
  parseKernelParams,
  compareKernel,
  compareBasicHardware,
  compareDisks,
  compareNetworkCards,
  checkHardwareConsistency,
} from "./hardwareConsistency";

describe("parseKernelParams", () => {
  test("should parse kernel params into key-value map", () => {
    const params = "key1=value1 key2=value2 key3=value3";
    const result = parseKernelParams(params);

    expect(result.size).toBe(3);
    expect(result.get("key1")).toBe("value1");
    expect(result.get("key2")).toBe("value2");
    expect(result.get("key3")).toBe("value3");
  });

  test("should ignore values starting with UUID", () => {
    const params = "key1=value1 key2=UUID12345 key3=value3";
    const result = parseKernelParams(params);

    expect(result.size).toBe(2);
    expect(result.get("key1")).toBe("value1");
    expect(result.get("key3")).toBe("value3");
    expect(result.has("key2")).toBe(false);
  });

  test("should handle empty params", () => {
    const result = parseKernelParams("");
    expect(result.size).toBe(0);
  });

  test("should handle params without equals sign", () => {
    const params = "key1=value1 invalidkey key2=value2";
    const result = parseKernelParams(params);

    expect(result.size).toBe(2);
    expect(result.get("key1")).toBe("value1");
    expect(result.get("key2")).toBe("value2");
  });
});

describe("compareKernel", () => {
  test("should return empty array when nodes are consistent", () => {
    const nodes: INode[] = [
      {
        name: "node1",
        role: "director",
        kernel: { version: "5.4.0", params: "key1=value1 key2=value2" },
        hardware: null,
      },
      {
        name: "node2",
        role: "director",
        kernel: { version: "5.4.0", params: "key1=value1 key2=value2" },
        hardware: null,
      },
    ];

    const result = compareKernel(nodes);
    expect(result).toEqual([]);
  });

  test("should detect kernel version differences", () => {
    const nodes: INode[] = [
      {
        name: "node1",
        role: "director",
        kernel: { version: "5.4.0", params: "key1=value1" },
        hardware: null,
      },
      {
        name: "node2",
        role: "director",
        kernel: { version: "5.5.0", params: "key1=value1" },
        hardware: null,
      },
    ];

    const result = compareKernel(nodes);
    expect(result).toContain("Kernel versions differ: 5.4.0, 5.5.0");
  });

  test("should detect kernel param differences", () => {
    const nodes: INode[] = [
      {
        name: "node1",
        role: "director",
        kernel: { version: "5.4.0", params: "key1=value1 key2=value2" },
        hardware: null,
      },
      {
        name: "node2",
        role: "director",
        kernel: { version: "5.4.0", params: "key1=value1 key2=value3" },
        hardware: null,
      },
    ];

    const result = compareKernel(nodes);
    expect(result).toContain(
      'Kernel parameter "key2" differs: value2, value3',
    );
  });

  test("should ignore UUID values in params", () => {
    const nodes: INode[] = [
      {
        name: "node1",
        role: "director",
        kernel: {
          version: "5.4.0",
          params: "key1=value1 uuid=UUID12345",
        },
        hardware: null,
      },
      {
        name: "node2",
        role: "director",
        kernel: {
          version: "5.4.0",
          params: "key1=value1 uuid=UUID67890",
        },
        hardware: null,
      },
    ];

    const result = compareKernel(nodes);
    expect(result).toEqual([]);
  });

  test("should detect missing kernel params", () => {
    const nodes: INode[] = [
      {
        name: "node1",
        role: "director",
        kernel: { version: "5.4.0", params: "key1=value1 key2=value2" },
        hardware: null,
      },
      {
        name: "node2",
        role: "director",
        kernel: { version: "5.4.0", params: "key1=value1" },
        hardware: null,
      },
    ];

    const result = compareKernel(nodes);
    expect(result).toContain('Kernel parameter "key2" is missing in some nodes');
  });

  test("should return empty array for single node", () => {
    const nodes: INode[] = [
      {
        name: "node1",
        role: "director",
        kernel: { version: "5.4.0", params: "key1=value1" },
        hardware: null,
      },
    ];

    const result = compareKernel(nodes);
    expect(result).toEqual([]);
  });

  test("should return empty array when no kernels", () => {
    const nodes: INode[] = [
      {
        name: "node1",
        role: "director",
        kernel: null,
        hardware: null,
      },
      {
        name: "node2",
        role: "director",
        kernel: null,
        hardware: null,
      },
    ];

    const result = compareKernel(nodes);
    expect(result).toEqual([]);
  });
});

describe("compareBasicHardware", () => {
  test("should return empty array when hardware is consistent", () => {
    const nodes: INode[] = [
      {
        name: "node1",
        role: "director",
        kernel: null,
        hardware: {
          product: "Product1",
          vendor: "Vendor1",
          motherboard: "MB1",
          bios: "BIOS1",
          cpu: "CPU1",
          nbCore: 4,
          nbThread: 8,
          cpuFrequency: 2000000000,
          cpuCapacity: 3000000000,
          memory: 8589934592,
          disks: [],
          networkCards: [],
        },
      },
      {
        name: "node2",
        role: "director",
        kernel: null,
        hardware: {
          product: "Product1",
          vendor: "Vendor1",
          motherboard: "MB1",
          bios: "BIOS1",
          cpu: "CPU1",
          nbCore: 4,
          nbThread: 8,
          cpuFrequency: 2000000000,
          cpuCapacity: 3000000000,
          memory: 8589934592,
          disks: [],
          networkCards: [],
        },
      },
    ];

    const result = compareBasicHardware(nodes);
    expect(result).toEqual([]);
  });

  test("should detect product differences", () => {
    const nodes: INode[] = [
      {
        name: "node1",
        role: "director",
        kernel: null,
        hardware: {
          product: "Product1",
          vendor: "Vendor1",
          motherboard: "MB1",
          bios: "BIOS1",
          cpu: "CPU1",
          nbCore: 4,
          nbThread: 8,
          cpuFrequency: 2000000000,
          cpuCapacity: 3000000000,
          memory: 8589934592,
          disks: [],
          networkCards: [],
        },
      },
      {
        name: "node2",
        role: "director",
        kernel: null,
        hardware: {
          product: "Product2",
          vendor: "Vendor1",
          motherboard: "MB1",
          bios: "BIOS1",
          cpu: "CPU1",
          nbCore: 4,
          nbThread: 8,
          cpuFrequency: 2000000000,
          cpuCapacity: 3000000000,
          memory: 8589934592,
          disks: [],
          networkCards: [],
        },
      },
    ];

    const result = compareBasicHardware(nodes);
    expect(result).toContain("Product differs: Product1, Product2");
  });

  test("should detect memory differences", () => {
    const nodes: INode[] = [
      {
        name: "node1",
        role: "director",
        kernel: null,
        hardware: {
          product: "Product1",
          vendor: "Vendor1",
          motherboard: "MB1",
          bios: "BIOS1",
          cpu: "CPU1",
          nbCore: 4,
          nbThread: 8,
          cpuFrequency: 2000000000,
          cpuCapacity: 3000000000,
          memory: 8589934592,
          disks: [],
          networkCards: [],
        },
      },
      {
        name: "node2",
        role: "director",
        kernel: null,
        hardware: {
          product: "Product1",
          vendor: "Vendor1",
          motherboard: "MB1",
          bios: "BIOS1",
          cpu: "CPU1",
          nbCore: 4,
          nbThread: 8,
          cpuFrequency: 2000000000,
          cpuCapacity: 3000000000,
          memory: 17179869184,
          disks: [],
          networkCards: [],
        },
      },
    ];

    const result = compareBasicHardware(nodes);
    expect(result.some((d) => d.includes("Memory differs"))).toBe(true);
  });

  test("should return empty array for single node", () => {
    const nodes: INode[] = [
      {
        name: "node1",
        role: "director",
        kernel: null,
        hardware: {
          product: "Product1",
          vendor: "Vendor1",
          motherboard: "MB1",
          bios: "BIOS1",
          cpu: "CPU1",
          nbCore: 4,
          nbThread: 8,
          cpuFrequency: 2000000000,
          cpuCapacity: 3000000000,
          memory: 8589934592,
          disks: [],
          networkCards: [],
        },
      },
    ];

    const result = compareBasicHardware(nodes);
    expect(result).toEqual([]);
  });
});

describe("compareDisks", () => {
  test("should return empty array when disks are consistent", () => {
    const nodes: INode[] = [
      {
        name: "node1",
        role: "director",
        kernel: null,
        hardware: {
          product: "Product1",
          vendor: "Vendor1",
          motherboard: "MB1",
          bios: "BIOS1",
          cpu: "CPU1",
          nbCore: 4,
          nbThread: 8,
          cpuFrequency: 2000000000,
          cpuCapacity: 3000000000,
          memory: 8589934592,
          disks: [
            {
              device: "/dev/sda",
              product: "Disk1",
              vendor: "Vendor1",
              size: 107374182400,
            },
          ],
          networkCards: [],
        },
      },
      {
        name: "node2",
        role: "director",
        kernel: null,
        hardware: {
          product: "Product1",
          vendor: "Vendor1",
          motherboard: "MB1",
          bios: "BIOS1",
          cpu: "CPU1",
          nbCore: 4,
          nbThread: 8,
          cpuFrequency: 2000000000,
          cpuCapacity: 3000000000,
          memory: 8589934592,
          disks: [
            {
              device: "/dev/sda",
              product: "Disk1",
              vendor: "Vendor1",
              size: 107374182400,
            },
          ],
          networkCards: [],
        },
      },
    ];

    const result = compareDisks(nodes);
    expect(result).toEqual([]);
  });

  test("should detect disk differences by device name", () => {
    const nodes: INode[] = [
      {
        name: "node1",
        role: "director",
        kernel: null,
        hardware: {
          product: "Product1",
          vendor: "Vendor1",
          motherboard: "MB1",
          bios: "BIOS1",
          cpu: "CPU1",
          nbCore: 4,
          nbThread: 8,
          cpuFrequency: 2000000000,
          cpuCapacity: 3000000000,
          memory: 8589934592,
          disks: [
            {
              device: "/dev/sda",
              product: "Disk1",
              vendor: "Vendor1",
              size: 107374182400,
            },
          ],
          networkCards: [],
        },
      },
      {
        name: "node2",
        role: "director",
        kernel: null,
        hardware: {
          product: "Product1",
          vendor: "Vendor1",
          motherboard: "MB1",
          bios: "BIOS1",
          cpu: "CPU1",
          nbCore: 4,
          nbThread: 8,
          cpuFrequency: 2000000000,
          cpuCapacity: 3000000000,
          memory: 8589934592,
          disks: [
            {
              device: "/dev/sda",
              product: "Disk2",
              vendor: "Vendor1",
              size: 107374182400,
            },
          ],
          networkCards: [],
        },
      },
    ];

    const result = compareDisks(nodes);
    expect(
      result.some((d) =>
        d.includes('Disk device "/dev/sda" differs in'),
      ),
    ).toBe(true);
  });
});

describe("compareNetworkCards", () => {
  test("should return empty array when network cards are consistent", () => {
    const nodes: INode[] = [
      {
        name: "node1",
        role: "director",
        kernel: null,
        hardware: {
          product: "Product1",
          vendor: "Vendor1",
          motherboard: "MB1",
          bios: "BIOS1",
          cpu: "CPU1",
          nbCore: 4,
          nbThread: 8,
          cpuFrequency: 2000000000,
          cpuCapacity: 3000000000,
          memory: 8589934592,
          disks: [],
          networkCards: [
            {
              vendor: "Vendor1",
              product: "Card1",
              interfaceName: "eth0",
              linkStatus: "up",
              speed: "1Gbit/s",
              firmwareVersion: "1.0",
            },
          ],
        },
      },
      {
        name: "node2",
        role: "director",
        kernel: null,
        hardware: {
          product: "Product1",
          vendor: "Vendor1",
          motherboard: "MB1",
          bios: "BIOS1",
          cpu: "CPU1",
          nbCore: 4,
          nbThread: 8,
          cpuFrequency: 2000000000,
          cpuCapacity: 3000000000,
          memory: 8589934592,
          disks: [],
          networkCards: [
            {
              vendor: "Vendor1",
              product: "Card1",
              interfaceName: "eth0",
              linkStatus: "up",
              speed: "1Gbit/s",
              firmwareVersion: "1.0",
            },
          ],
        },
      },
    ];

    const result = compareNetworkCards(nodes);
    expect(result).toEqual([]);
  });

  test("should detect network card count differences", () => {
    const nodes: INode[] = [
      {
        name: "node1",
        role: "director",
        kernel: null,
        hardware: {
          product: "Product1",
          vendor: "Vendor1",
          motherboard: "MB1",
          bios: "BIOS1",
          cpu: "CPU1",
          nbCore: 4,
          nbThread: 8,
          cpuFrequency: 2000000000,
          cpuCapacity: 3000000000,
          memory: 8589934592,
          disks: [],
          networkCards: [
            {
              vendor: "Vendor1",
              product: "Card1",
              interfaceName: "eth0",
              linkStatus: "up",
              speed: "1Gbit/s",
              firmwareVersion: "1.0",
            },
          ],
        },
      },
      {
        name: "node2",
        role: "director",
        kernel: null,
        hardware: {
          product: "Product1",
          vendor: "Vendor1",
          motherboard: "MB1",
          bios: "BIOS1",
          cpu: "CPU1",
          nbCore: 4,
          nbThread: 8,
          cpuFrequency: 2000000000,
          cpuCapacity: 3000000000,
          memory: 8589934592,
          disks: [],
          networkCards: [
            {
              vendor: "Vendor1",
              product: "Card1",
              interfaceName: "eth0",
              linkStatus: "up",
              speed: "1Gbit/s",
              firmwareVersion: "1.0",
            },
            {
              vendor: "Vendor1",
              product: "Card2",
              interfaceName: "eth1",
              linkStatus: "up",
              speed: "1Gbit/s",
              firmwareVersion: "1.0",
            },
          ],
        },
      },
    ];

    const result = compareNetworkCards(nodes);
    expect(
      result.some((d) => d.includes("Number of network cards differs")),
    ).toBe(true);
  });

  test("should detect network interface differences", () => {
    const nodes: INode[] = [
      {
        name: "node1",
        role: "director",
        kernel: null,
        hardware: {
          product: "Product1",
          vendor: "Vendor1",
          motherboard: "MB1",
          bios: "BIOS1",
          cpu: "CPU1",
          nbCore: 4,
          nbThread: 8,
          cpuFrequency: 2000000000,
          cpuCapacity: 3000000000,
          memory: 8589934592,
          disks: [],
          networkCards: [
            {
              vendor: "Vendor1",
              product: "Card1",
              interfaceName: "eth0",
              linkStatus: "up",
              speed: "1Gbit/s",
              firmwareVersion: "1.0",
            },
          ],
        },
      },
      {
        name: "node2",
        role: "director",
        kernel: null,
        hardware: {
          product: "Product1",
          vendor: "Vendor1",
          motherboard: "MB1",
          bios: "BIOS1",
          cpu: "CPU1",
          nbCore: 4,
          nbThread: 8,
          cpuFrequency: 2000000000,
          cpuCapacity: 3000000000,
          memory: 8589934592,
          disks: [],
          networkCards: [
            {
              vendor: "Vendor2",
              product: "Card1",
              interfaceName: "eth0",
              linkStatus: "up",
              speed: "1Gbit/s",
              firmwareVersion: "1.0",
            },
          ],
        },
      },
    ];

    const result = compareNetworkCards(nodes);
    expect(
      result.some((d) => d.includes('Network interface "eth0" differs in')),
    ).toBe(true);
  });
});

describe("checkHardwareConsistency", () => {
  test("should return consistent result for consistent directors", () => {
    const nodes: INode[] = [
      {
        name: "director1",
        role: "director",
        kernel: { version: "5.4.0", params: "key1=value1" },
        hardware: {
          product: "Product1",
          vendor: "Vendor1",
          motherboard: "MB1",
          bios: "BIOS1",
          cpu: "CPU1",
          nbCore: 4,
          nbThread: 8,
          cpuFrequency: 2000000000,
          cpuCapacity: 3000000000,
          memory: 8589934592,
          disks: [],
          networkCards: [],
        },
      },
      {
        name: "director2",
        role: "director",
        kernel: { version: "5.4.0", params: "key1=value1" },
        hardware: {
          product: "Product1",
          vendor: "Vendor1",
          motherboard: "MB1",
          bios: "BIOS1",
          cpu: "CPU1",
          nbCore: 4,
          nbThread: 8,
          cpuFrequency: 2000000000,
          cpuCapacity: 3000000000,
          memory: 8589934592,
          disks: [],
          networkCards: [],
        },
      },
    ];

    const result = checkHardwareConsistency(nodes);
    expect(result.directors.isConsistent).toBe(true);
    expect(result.directors.differences).toEqual([]);
  });

  test("should return inconsistent result for inconsistent directors", () => {
    const nodes: INode[] = [
      {
        name: "director1",
        role: "director",
        kernel: { version: "5.4.0", params: "key1=value1" },
        hardware: {
          product: "Product1",
          vendor: "Vendor1",
          motherboard: "MB1",
          bios: "BIOS1",
          cpu: "CPU1",
          nbCore: 4,
          nbThread: 8,
          cpuFrequency: 2000000000,
          cpuCapacity: 3000000000,
          memory: 8589934592,
          disks: [],
          networkCards: [],
        },
      },
      {
        name: "director2",
        role: "director",
        kernel: { version: "5.5.0", params: "key1=value1" },
        hardware: {
          product: "Product1",
          vendor: "Vendor1",
          motherboard: "MB1",
          bios: "BIOS1",
          cpu: "CPU1",
          nbCore: 4,
          nbThread: 8,
          cpuFrequency: 2000000000,
          cpuCapacity: 3000000000,
          memory: 8589934592,
          disks: [],
          networkCards: [],
        },
      },
    ];

    const result = checkHardwareConsistency(nodes);
    expect(result.directors.isConsistent).toBe(false);
    expect(result.directors.differences.length).toBeGreaterThan(0);
  });

  test("should separate directors and workers", () => {
    const nodes: INode[] = [
      {
        name: "director1",
        role: "director",
        kernel: { version: "5.4.0", params: "key1=value1" },
        hardware: {
          product: "Product1",
          vendor: "Vendor1",
          motherboard: "MB1",
          bios: "BIOS1",
          cpu: "CPU1",
          nbCore: 4,
          nbThread: 8,
          cpuFrequency: 2000000000,
          cpuCapacity: 3000000000,
          memory: 8589934592,
          disks: [],
          networkCards: [],
        },
      },
      {
        name: "worker1",
        role: "worker",
        kernel: { version: "5.4.0", params: "key1=value1" },
        hardware: {
          product: "Product2",
          vendor: "Vendor1",
          motherboard: "MB1",
          bios: "BIOS1",
          cpu: "CPU1",
          nbCore: 4,
          nbThread: 8,
          cpuFrequency: 2000000000,
          cpuCapacity: 3000000000,
          memory: 8589934592,
          disks: [],
          networkCards: [],
        },
      },
    ];

    const result = checkHardwareConsistency(nodes);
    expect(result.directors.isConsistent).toBe(true);
    expect(result.workers.isConsistent).toBe(true);
  });
});
