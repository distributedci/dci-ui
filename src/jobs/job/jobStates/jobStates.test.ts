import { getFileStatus, buildFileTitle } from "./jobStates";
import type { IFile } from "types";

test("getFileStatus", () => {
  expect(
    getFileStatus({
      name: "failed/installer : xxxxxxxxxxxx",
    } as IFile),
  ).toEqual("failed");
  expect(
    getFileStatus({
      name: "item_failed/xxxxxxxxxxxx",
    } as IFile),
  ).toEqual("failed");
  expect(
    getFileStatus({
      name: "failed/installer : xxxxxxxxxxxx",
    } as IFile),
  ).toEqual("failed");
  expect(
    getFileStatus({
      name: "unreachable/xxxxxxxxxxxx",
    } as IFile),
  ).toEqual("unreachable");
  expect(
    getFileStatus({
      name: "xxxxxxxxxxxx",
    } as IFile),
  ).toEqual("success");
  expect(
    getFileStatus({
      name: "skipped/node-prep : Check ansible version",
    } as IFile),
  ).toEqual("skipped");
  expect(
    getFileStatus({
      name: "ignored/node-prep : Check ansible version",
    } as IFile),
  ).toEqual("ignored");
  expect(
    getFileStatus({
      name: "warn/TASK [mirror-ocp-release : Read release_image from release.txt]",
    } as IFile),
  ).toEqual("withAWarning");
});

test("buildFileTitle", () => {
  expect(
    buildFileTitle("TASK [Upload Junit files to DCI Control Server]"),
  ).toBe("TASK [Upload Junit files to DCI Control Server]");
  expect(
    buildFileTitle("skipped/TASK [Run the failure process for partners]"),
  ).toBe("TASK [Run the failure process for partners]");
  expect(buildFileTitle("failed/PLAY RECAP")).toBe("PLAY RECAP");
  expect(buildFileTitle("failed/TASK [Fail properly]")).toBe(
    "TASK [Fail properly]",
  );
  expect(
    buildFileTitle(
      "warn/TASK [mirror-ocp-release : Read release_image from release.txt]",
    ),
  ).toBe("TASK [mirror-ocp-release : Read release_image from release.txt]");
  expect(buildFileTitle("ignored/TASK [Run the pre-run hook]")).toBe(
    "TASK [Run the pre-run hook]",
  );
  // a status prefix combined with the warn decoration is fully stripped
  expect(buildFileTitle("ignored/warn/TASK [Install nightly catalog]")).toBe(
    "TASK [Install nightly catalog]",
  );
  expect(buildFileTitle("skipped/warn/TASK [Check ansible version]")).toBe(
    "TASK [Check ansible version]",
  );
});
