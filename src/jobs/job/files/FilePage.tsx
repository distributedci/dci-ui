import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFileContent } from "jobs/job/files/filesActions";
import { IFile } from "types";
import pages from "pages";

export default function FilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const { file_id } = useParams();

  useEffect(() => {
    if (file_id) {
      getFileContent({ id: file_id } as IFile)
        .then((content) => {
          setFileContent(content);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [file_id]);

  if (!file_id) return null;

  if (isLoading) {
    return <pages.NotAuthenticatedLoadingPage />;
  }
  if (fileContent === null) return null;
  return (
    <div className="p-md" style={{ fontSize: "0.8rem" }}>
      <pre>{fileContent}</pre>
    </div>
  );
}
