import type { IFile } from "types";
import { useGetFileContentQuery } from "jobs/job/files/filesApi";

export default function TaskContent({ file }: { file: IFile }) {
  const { data: content, isLoading } = useGetFileContentQuery(file);
  if (isLoading) {
    return <div>Loading</div>;
  }
  if (!content) {
    return <div>{`No content for task "${file.name}"`}</div>;
  }
  return (
    <div>
      {content.split("\\n").map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  );
}
