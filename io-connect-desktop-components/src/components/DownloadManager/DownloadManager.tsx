function DownloadManagerWrapper() {
  return <DownloadManagerInner />;
}

function DownloadManagerInner() {
  return (
    <div
      style={{
        height: "calc(100vh - 2em)",
        margin: "1em",
        padding: "1em",
        borderRadius: "1em",
        color: "white",
        backgroundColor: "red",
      }}
    >
      Download Manager
    </div>
  );
}

export default DownloadManagerWrapper;
