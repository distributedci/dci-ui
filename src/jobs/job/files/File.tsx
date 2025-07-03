import FileSaver from "file-saver";
import { Button } from "@patternfly/react-core";
import { humanFileSize, isATextFile } from "./filesGetters";
import {
  FileDownloadIcon,
  EyeIcon,
  ExternalLinkAltIcon,
} from "@patternfly/react-icons";
import { RotatingSpinnerIcon } from "../../../ui";
import type { IFile } from "../../../types";
import { useNavigate } from "react-router";
import SeeFileContentModal from "./SeeFileContentModal";
import { Tr, Td } from "@patternfly/react-table";
import { useState } from "react";
import { getFileContentAsBlob } from "./filesApi";

interface FileProps {
  file: IFile;
}

export default function File({ file }: FileProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const isText = isATextFile(file);
  return (
    <Tr>
      <Td>
        {isText ? (
          <SeeFileContentModal file={file}>
            {(show) => (
              <Button variant="link" className="pf-v6-u-p-0" onClick={show}>
                {file.name}
              </Button>
            )}
          </SeeFileContentModal>
        ) : (
          file.name
        )}
      </Td>
      <Td>{humanFileSize(file.size)}</Td>
      <Td>{file.mime}</Td>
      <Td className="text-center">
        <Button
          variant="primary"
          icon={isLoading ? <RotatingSpinnerIcon /> : <FileDownloadIcon />}
          onClick={() => {
            setIsLoading(true);
            getFileContentAsBlob(file)
              .then((blob) => FileSaver.saveAs(blob, `${file.name}`))
              .finally(() => setIsLoading(false));
          }}
          className="pf-v6-u-mr-xs"
          isDisabled={isLoading}
        >
          download
        </Button>
        <Button
          variant="secondary"
          icon={<ExternalLinkAltIcon />}
          className="pf-v6-u-mr-xs"
          iconPosition="right"
          onClick={() => {
            navigate(`/files/${file.id}`);
          }}
        >
          link
        </Button>
        <SeeFileContentModal file={file}>
          {(show) => (
            <Button
              variant="secondary"
              icon={<EyeIcon />}
              onClick={show}
              isDisabled={!isText}
            >
              see
            </Button>
          )}
        </SeeFileContentModal>
      </Td>
    </Tr>
  );
}
