import { describe, test, expect } from "vitest";
import {
  formatMemory,
  formatKernelParams,
  formatKernelData,
  formatHardwareData,
  formatProductName,
} from "./hardwareFormatters";
import type { IKernelData, IHardwareData } from "types";

describe("formatMemory", () => {
  test("should format bytes", () => {
    expect(formatMemory(512)).toBe("512 B");
  });

  test("should format KB", () => {
    expect(formatMemory(2048)).toBe("2.00 KB");
  });

  test("should format MB", () => {
    expect(formatMemory(1048576 * 5)).toBe("5.00 MB");
  });

  test("should format GB", () => {
    expect(formatMemory(1073741824 * 16)).toBe("16.00 GB");
  });

  test("should format TB", () => {
    expect(formatMemory(1099511627776 * 2)).toBe("2.00 TB");
  });

  test("should handle object with amount", () => {
    expect(formatMemory({ amount: 1073741824 })).toBe("1.00 GB");
  });

  test("should handle undefined", () => {
    expect(formatMemory(undefined)).toBe("N/A");
  });

  test("should handle 0", () => {
    expect(formatMemory(0)).toBe("N/A");
  });
});

describe("formatKernelParams", () => {
  test("should handle string params", () => {
    expect(formatKernelParams("param1 param2")).toBe("param1 param2");
  });

  test("should handle object params", () => {
    const params = { key1: "value1", key2: "value2" };
    expect(formatKernelParams(params)).toBe("key1=value1 key2=value2");
  });

  test("should handle nested object params", () => {
    const params = { net: { ifnames: 0 } };
    expect(formatKernelParams(params)).toBe("net.ifnames=0");
  });

  test("should handle undefined", () => {
    expect(formatKernelParams(undefined)).toBe("N/A");
  });

  test("should handle empty object", () => {
    expect(formatKernelParams({})).toBe("");
  });

  test("should handle boolean values", () => {
    const params = { enabled: true, disabled: false };
    expect(formatKernelParams(params)).toBe("enabled=true disabled=false");
  });
});

describe("formatKernelData", () => {
  test("should format complete kernel data", () => {
    const kernel: IKernelData = {
      node: "worker-0",
      version: "5.14.0-570.64.1.el9_6.x86_64",
      params: { net: { ifnames: 0 } },
    };

    const result = formatKernelData(kernel);
    expect(result.nodeName).toBe("worker-0");
    expect(result.node).toBe("worker-0");
    expect(result.version).toBe("5.14.0-570.64.1.el9_6.x86_64");
    expect(result.params).toBe("net.ifnames=0");
  });

  test("should handle missing values", () => {
    const kernel: IKernelData = {};
    const result = formatKernelData(kernel);
    expect(result.nodeName).toBe("Unknown Node");
    expect(result.node).toBe("N/A");
    expect(result.version).toBe("N/A");
    expect(result.params).toBe("N/A");
  });
});

describe("formatProductName", () => {
  test("should remove PCI vendor ID but keep device ID", () => {
    const product = "Intel I350 [8086:1521]";
    expect(formatProductName(product)).toBe("Intel I350 [1521]");
  });

  test("should handle multiple IDs", () => {
    const product = "Card A [1234:5678] Card B [abcd:ef01]";
    expect(formatProductName(product)).toBe("Card A [5678] Card B [ef01]");
  });

  test("should handle undefined", () => {
    expect(formatProductName(undefined)).toBe("N/A");
  });

  test("should handle product without IDs", () => {
    expect(formatProductName("Simple Product")).toBe("Simple Product");
  });
});

describe("formatHardwareData", () => {
  test("should format basic hardware data", () => {
    const hardware: IHardwareData = {
      node: "worker-0",
      data: {
        product: "PowerEdge R740",
        vendor: "Dell Inc.",
        memory: 1073741824 * 64,
        children: [],
      },
    };

    const result = formatHardwareData(hardware);
    expect(result.nodeName).toBe("worker-0");
    expect(result.product).toBe("PowerEdge R740");
    expect(result.vendor).toBe("Dell Inc.");
    expect(result.memory).toBe("64.00 GB");
  });

  test("should handle missing node name", () => {
    const hardware: IHardwareData = {
      data: {
        product: "Test Product",
        vendor: "Test Vendor",
        children: [],
      },
    };

    const result = formatHardwareData(hardware);
    expect(result.nodeName).toBe("Unknown Node");
  });

  test("should handle error field", () => {
    const hardware: IHardwareData = {
      node: "worker-0",
      error: "Failed to collect hardware info",
      data: {
        children: [],
      },
    };

    const result = formatHardwareData(hardware);
    expect(result.error).toBe("Failed to collect hardware info");
  });

  test("should extract disks from children", () => {
    const hardware: IHardwareData = {
      node: "worker-0",
      data: {
        children: [
          {
            class: "disk",
            logicalname: "/dev/sda",
            product: "SAMSUNG SSD",
            vendor: "Samsung",
            size: 500000000000,
            units: "bytes",
          },
        ],
      },
    };

    const result = formatHardwareData(hardware);
    expect(result.disks).toHaveLength(1);
    expect(result.disks[0].device).toBe("/dev/sda");
    expect(result.disks[0].product).toBe("SAMSUNG SSD");
    expect(result.disks[0].vendor).toBe("Samsung");
  });

  test("should extract network cards from children", () => {
    const hardware: IHardwareData = {
      node: "worker-0",
      data: {
        children: [
          {
            class: "network",
            vendor: "Intel",
            product: "I350 [8086:1521]",
            logicalname: "eth0",
            configuration: {
              link: "yes",
              speed: "1Gbit/s",
              firmware: "1.63",
            },
          },
        ],
      },
    };

    const result = formatHardwareData(hardware);
    expect(result.networkCards).toHaveLength(1);
    expect(result.networkCards[0].vendor).toBe("Intel");
    expect(result.networkCards[0].product).toBe("I350 [1521]");
    expect(result.networkCards[0].interfaceName).toBe("eth0");
    expect(result.networkCards[0].linkStatus).toBe("Up");
    expect(result.networkCards[0].speed).toBe("1Gbit/s");
    expect(result.networkCards[0].firmwareVersion).toBe("1.63");
  });

  test("should calculate total memory from children", () => {
    const hardware: IHardwareData = {
      node: "worker-0",
      data: {
        children: [
          {
            id: "memory",
            description: "System Memory",
            size: 1073741824 * 32,
            units: "bytes",
          },
          {
            id: "memory",
            description: "System Memory",
            size: 1073741824 * 32,
            units: "bytes",
          },
        ],
      },
    };

    const result = formatHardwareData(hardware);
    expect(result.memory).toBe("64.00 GB");
  });

  test("should format CPU information", () => {
    const hardware: IHardwareData = {
      node: "worker-0",
      data: {
        children: [
          {
            id: "cpu",
            vendor: "Intel",
            product: "Xeon Silver 4214",
            configuration: {
              cores: "12",
              threads: "24",
            },
            size: 2200000000,
            capacity: 3200000000,
            units: "Hz",
          },
        ],
      },
    };

    const result = formatHardwareData(hardware);
    expect(result.cpu).toBe("Intel Xeon Silver 4214");
    expect(result.cpuCoresThreads).toBe("12 cores, 24 threads");
    expect(result.cpuFrequency).toBe("2.20 GHz (max 3.20 GHz)");
  });

  test("should handle multiple CPUs", () => {
    const hardware: IHardwareData = {
      node: "worker-0",
      data: {
        children: [
          {
            id: "cpu",
            vendor: "Intel",
            product: "Xeon Silver 4214",
            configuration: {
              cores: "12",
              threads: "24",
            },
          },
          {
            id: "cpu",
            vendor: "Intel",
            product: "Xeon Silver 4214",
            configuration: {
              cores: "12",
              threads: "24",
            },
          },
        ],
      },
    };

    const result = formatHardwareData(hardware);
    expect(result.cpu).toBe("2 x Intel Xeon Silver 4214");
    expect(result.cpuCoresThreads).toBe("24 cores, 48 threads");
  });
});
