import type { IFile, IFileStatus } from "types";

export function getFileStatus(file: IFile): IFileStatus {
  return file.name.startsWith("failed/") || file.name.startsWith("item_failed/")
    ? "failed"
    : file.name.startsWith("unreachable/")
      ? "unreachable"
      : file.name.startsWith("skipped/")
        ? "skipped"
        : file.name.startsWith("ignored/")
          ? "ignored"
          : file.name.startsWith("warn/")
            ? "withAWarning"
            : "success";
}

export function buildFileTitle(fileName: string) {
  // Strip any run of status prefixes, in any order
  const re = new RegExp(
    "^((?:(?:failed|unreachable|skipped|ignored|warn)/)+)?(PLAY|TASK)(.*)",
  );
  let title;

  if (re.test(fileName)) {
    title = fileName.replace(re, "$2$3");
  } else {
    title = `TASK [${fileName}] `;
  }
  return title;
}

export function isFileEmpty(file: IFile) {
  const re = new RegExp(
    "^((failed|unreachable|skipped)/)?(PLAY [\\[]|PLAYBOOK)",
  );

  return re.test(file.name);
}
