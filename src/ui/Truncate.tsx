export default function Truncate({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  return (
    <span
      {...props}
      style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {children}
    </span>
  );
}
