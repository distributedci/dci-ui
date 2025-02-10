import { humanizeDurationShort } from "services/date";

export function humanizeJobDuration(duration: number) {
  return humanizeDurationShort(duration * 1000, {
    delimiter: " ",
    round: true,
    largest: 1,
  });
}
