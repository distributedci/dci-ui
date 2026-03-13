import CopyIconButton from "ui/CopyIconButton";

interface BreadcrumbCopyItemProps extends React.ComponentProps<"span"> {
  text: string;
  textToCopy?: string;
}

export default function BreadcrumbCopyItem({
  text,
  textToCopy,
  ...props
}: BreadcrumbCopyItemProps) {
  return (
    <span {...props}>
      {text}
      <CopyIconButton
        text={textToCopy || text}
        className="pf-v6-u-ml-xs pointer"
      />
    </span>
  );
}
