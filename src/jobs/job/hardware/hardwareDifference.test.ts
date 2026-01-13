import type { INode } from "analytics/hardware/hardwareFormatter";
import { getHardwareDifferences } from "./hardwareDifference";

describe("getHardwareDifferences", () => {
  test("should be empty with consistent directors", () => {
    const nodes: INode[] = [
      {
        name: "director1",
        role: "director",
        kernel: {
          version: "5.4.0",
          params: { key1: "value1" },
        },
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
        name: "director2",
        role: "director",
        kernel: {
          version: "5.4.0",
          params: { key1: "value1" },
        },
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

    expect(getHardwareDifferences(nodes)).toEqual([]);
  });
  test("should be empty with one node", () => {
    const nodes: INode[] = [
      {
        name: "director1",
        role: "director",
        kernel: {
          version: "5.4.0",
          params: { key1: "value1" },
        },
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

    expect(getHardwareDifferences(nodes)).toEqual([]);
  });
  test("should return differences for inconsistent directors", () => {
    const nodes: INode[] = [
      {
        name: "director1",
        role: "director",
        kernel: {
          version: "5.4.0",
          params: { key1: "value1" },
        },
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
        kernel: {
          version: "5.5.0",
          params: { key1: "value1" },
        },
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

    expect(getHardwareDifferences(nodes)).toEqual([
      "Kernel versions differ: 5.4.0, 5.5.0",
    ]);
  });
  test("should return differences for network cards", () => {
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

    expect(getHardwareDifferences(nodes)).toEqual([
      'Network interface "eth0" differs in: vendor (Vendor1, Vendor2)',
    ]);
  });
  test("should return differences for different network cards numbers", () => {
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

    expect(getHardwareDifferences(nodes)).toEqual([
      "Number of network cards differs: 1, 2 cards",
    ]);
  });
  test("should return differences for different devices names", () => {
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

    expect(getHardwareDifferences(nodes)).toEqual([
      'Disk device "/dev/sda" differs in: product (Disk1, Disk2)',
    ]);
  });
  test("should return differences for different memory sticks", () => {
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

    expect(getHardwareDifferences(nodes)).toEqual([
      "Memory differs: 8 GB, 16 GB",
    ]);
  });
  test("should return differences for different memory sticks", () => {
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

    expect(getHardwareDifferences(nodes)).toEqual([
      "Product differs: Product1, Product2",
    ]);
  });
  test("should return differences for different kernel versions", () => {
    const nodes: INode[] = [
      {
        name: "node1",
        role: "director",
        kernel: {
          version: "5.4.0",
          params: { key1: "value1" },
        },
        hardware: null,
      },
      {
        name: "node2",
        role: "director",
        kernel: {
          version: "5.4.1",
          params: { key1: "value1" },
        },
        hardware: null,
      },
    ];

    expect(getHardwareDifferences(nodes)).toEqual([
      "Kernel versions differ: 5.4.0, 5.4.1",
    ]);
  });
  test("should return differences for different kernel params", () => {
    const nodes: INode[] = [
      {
        name: "node1",
        role: "director",
        kernel: {
          version: "5.4.0",
          params: { key1: "value1", key2: "value2" },
        },
        hardware: null,
      },
      {
        name: "node2",
        role: "director",
        kernel: {
          version: "5.4.0",
          params: { key1: "value1" },
        },
        hardware: null,
      },
    ];

    expect(getHardwareDifferences(nodes)).toEqual([
      'Kernel parameter "key2" is missing in some nodes',
    ]);
  });
  test("should ignore UUID for kernels params", () => {
    const nodes: INode[] = [
      {
        name: "node1",
        role: "director",
        kernel: {
          version: "5.4.0",
          params: { key1: "value1", uuid: "UUID=12345" },
        },
        hardware: null,
      },
      {
        name: "node2",
        role: "director",
        kernel: {
          version: "5.4.0",
          params: { key1: "value1", uuid: "UUID=67890" },
        },
        hardware: null,
      },
    ];

    expect(getHardwareDifferences(nodes)).toEqual([]);
  });
});
