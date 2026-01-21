import { useEffect, useState } from "react";
import copyToClipboard from "services/copyToClipboard";
import { CopyIcon, ClipboardCheckIcon } from "@patternfly/react-icons";
import { t_global_color_nonstatus_green_200 } from "@patternfly/react-tokens";

interface CopyIconButtonProps extends React.ComponentProps<"span"> {
  text: string;
  textOnSuccess?: string;
}

export default function CopyIconButton({
  text,
  textOnSuccess = "",
  ...props
}: CopyIconButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setCopied(false);
    }, 2000);
    return () => {
      clearTimeout(t);
    };
  }, [copied, setCopied]);

  if (copied) {
    return (
      <span
        {...props}
        style={{
          color: t_global_color_nonstatus_green_200.value,
        }}
      >
        <ClipboardCheckIcon />
        {textOnSuccess && <span>{textOnSuccess}</span>}
      </span>
    );
  }

  const handleClick = (event: React.MouseEvent<Element>) => {
    copyToClipboard(event, text);
    setCopied(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<Element>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      copyToClipboard(event, text);
      setCopied(true);
    }
  };

  return (
    <span
      {...props}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <CopyIcon />
    </span>
  );
}
