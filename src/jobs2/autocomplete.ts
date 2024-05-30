export function getOptions(search: string, options: string[]) {
  const separator = " ";
  const parts = search.trim().split(separator);
  const rightPart = parts.pop() || "";
  const leftPart = parts.join(separator);
  return options
    .filter((option) =>
      option.toLowerCase().startsWith(rightPart.toLowerCase()),
    )
    .map((word) => (leftPart === "" ? word : `${leftPart}${separator}${word}`));
}
