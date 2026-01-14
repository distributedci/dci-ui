import { test, expect } from "vitest";
import { formatHardwareData } from "./hardwareFormatter";
import hardwareData from "./__tests__/fixtures/hardware-data.json";

test("formatHardwareData", () => {
  const result = formatHardwareData(hardwareData);
  expect(result).toEqual([
    {
      name: "worker-0.test-lab.example.com",
      kernel: {
        version: "5.14.0-570.64.1.el9_6.x86_64",
        params: {
          BOOT_IMAGE:
            "(hd0,gpt3)/boot/ostree/rhcos-fcf7dd9c3b9a4c4bbb02379c0c8eba69c2e642604d73730606e4031e92dff169/vmlinuz-5.14.0-570.64.1.el9_6.x86_64",
          boot: "UUID=374e8e0a-b33f-48e1-bf1d-a0cc9db66c8d",
          cgroup_no_v1: "all",
          "ignition.platform.id": "metal",
          ostree:
            "/ostree/boot.0/rhcos/fcf7dd9c3b9a4c4bbb02379c0c8eba69c2e642604d73730606e4031e92dff169/0",
          psi: "0",
          root: "UUID=3956aaab-98f1-46c8-ad90-68398149e7fe",
          rootflags: "prjquota",
          rw: "",
          "systemd.unified_cgroup_hierarchy": "1",
        },
      },
      hardware: {
        product: "PowerEdge R740 (SKU=0715;ModelName=PowerEdge R740)",
        vendor: "Dell Inc.",
        motherboard: "Dell Inc. 0YWR7D vA16",
        bios: "Dell Inc. 2.22.2 (09/12/2024)",
        cpu: "2 x Intel Corp. Intel(R) Xeon(R) Gold 6248R CPU @ 3.00GHz",
        nbCore: 48,
        nbThread: 96,
        cpuFrequency: 3000000000,
        cpuCapacity: 3000000000,
        memory: 412316860416,
        disks: [
          {
            device: "/dev/sda",
            product: "PERC H740P Adp",
            size: 479559942144,
            vendor: "DELL",
          },
        ],
        networkCards: [
          {
            firmwareVersion: "14.32.2004 (DEL2810000034)",
            interfaceName: "eno1np0",
            linkStatus: "up",
            product: "MT27710 Family [ConnectX-4 Lx] [1015]",
            speed: "10Gbit/s",
            vendor: "Mellanox Technologies [15B3]",
          },
          {
            firmwareVersion: "14.32.2004 (DEL2810000034)",
            interfaceName: "eno2np1",
            linkStatus: "up",
            product: "MT27710 Family [ConnectX-4 Lx] [1015]",
            speed: "10Gbit/s",
            vendor: "Mellanox Technologies [15B3]",
          },
          {
            firmwareVersion: "9.50 0x8000f251 23.0.8",
            interfaceName: "ens7f0",
            linkStatus: "up",
            product: "Ethernet Controller XXV710 for 25GbE SFP28 [158B]",
            speed: "10Gbit/s",
            vendor: "Intel Corporation [8086]",
          },
          {
            firmwareVersion: "9.50 0x8000f251 23.0.8",
            interfaceName: "ens7f1",
            linkStatus: "up",
            product: "Ethernet Controller XXV710 for 25GbE SFP28 [158B]",
            speed: "10Gbit/s",
            vendor: "Intel Corporation [8086]",
          },
        ],
      },
      role: "worker",
    },
    {
      name: "worker-1.test-lab.example.com",
      kernel: {
        version: "5.14.0-570.64.1.el9_6.x86_64",
        params: {
          BOOT_IMAGE:
            "(hd0,gpt3)/boot/ostree/rhcos-fcf7dd9c3b9a4c4bbb02379c0c8eba69c2e642604d73730606e4031e92dff169/vmlinuz-5.14.0-570.64.1.el9_6.x86_64",
          boot: "UUID=24a32cf3-da78-4bc5-8735-626ca22716a4",
          cgroup_no_v1: "all",
          "ignition.platform.id": "metal",
          ostree:
            "/ostree/boot.0/rhcos/fcf7dd9c3b9a4c4bbb02379c0c8eba69c2e642604d73730606e4031e92dff169/0",
          psi: "0",
          root: "UUID=f5316d87-57bd-4cdc-84f8-f19d48abeae1",
          rootflags: "prjquota",
          rw: "",
          "systemd.unified_cgroup_hierarchy": "1",
        },
      },
      hardware: {
        product: "PowerEdge R740 (SKU=0715;ModelName=PowerEdge R740)",
        vendor: "Dell Inc.",
        motherboard: "Dell Inc. 0YWR7D vA16",
        bios: "Dell Inc. 2.21.2 (02/19/2024)",
        cpu: "2 x Intel Corp. Intel(R) Xeon(R) Gold 6248R CPU @ 3.00GHz",
        nbCore: 48,
        nbThread: 96,
        cpuFrequency: 3000000000,
        cpuCapacity: 3000000000,
        memory: 412316860416,
        disks: [
          {
            device: "/dev/sda",
            product: "PERC H740P Adp",
            size: 479559942144,
            vendor: "DELL",
          },
        ],
        networkCards: [
          {
            firmwareVersion: "14.32.2004 (DEL2810000034)",
            interfaceName: "eno1np0",
            linkStatus: "up",
            product: "MT27710 Family [ConnectX-4 Lx] [1015]",
            speed: "10Gbit/s",
            vendor: "Mellanox Technologies [15B3]",
          },
          {
            firmwareVersion: "14.32.2004 (DEL2810000034)",
            interfaceName: "eno2np1",
            linkStatus: "up",
            product: "MT27710 Family [ConnectX-4 Lx] [1015]",
            speed: "10Gbit/s",
            vendor: "Mellanox Technologies [15B3]",
          },
          {
            firmwareVersion: "9.40 0x8000e9b0 22.5.7",
            interfaceName: "ens7f0",
            linkStatus: "up",
            product: "Ethernet Controller XXV710 for 25GbE SFP28 [158B]",
            speed: "10Gbit/s",
            vendor: "Intel Corporation [8086]",
          },
          {
            firmwareVersion: "9.40 0x8000e9b0 22.5.7",
            interfaceName: "ens7f1",
            linkStatus: "up",
            product: "Ethernet Controller XXV710 for 25GbE SFP28 [158B]",
            speed: "10Gbit/s",
            vendor: "Intel Corporation [8086]",
          },
        ],
      },
      role: "worker",
    },
  ]);
});
