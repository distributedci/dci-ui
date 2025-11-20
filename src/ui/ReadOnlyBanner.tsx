export default function ReadOnlyBanner() {
  return (
    <div
      className="pf-m-success"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "5px",
        zIndex: 9999,
        backgroundColor: "#EE0000",
      }}
    />
  );
}
