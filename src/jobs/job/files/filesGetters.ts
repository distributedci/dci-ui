import type { IFile } from "types";

export function normalizeFile(file: IFile): IFile {
  if (file.mime === null) {
    return file;
  }
  return { ...file, mime: file.mime.replace("dci-analytics+", "") };
}

export function isJsonFile(file: IFile): boolean {
  const { mime } = file;
  if (mime === null) {
    return false;
  }
  return mime === "application/json";
}

export function formatJsonContent(content: string): string {
  try {
    const parsed = JSON.parse(content);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return content;
  }
}

export function isATextFile(file: IFile) {
  const { mime } = file;
  if (mime) {
    if (mime.startsWith("text/")) return true;
    const otherMimesWeWouldLikeToDisplay = [
      "application/junit",
      "application/json",
      "image/svg+xml",
      "application/xhtml+xml",
      "application/xml",
    ];
    return otherMimesWeWouldLikeToDisplay.indexOf(mime) !== -1;
  }
  return false;
}
