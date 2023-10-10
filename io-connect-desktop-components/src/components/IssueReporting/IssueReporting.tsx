import { Feedback, IssueReportingProvider } from "@interopio/components-react";

function IssueReportingWrapper() {
  return (
    <IssueReportingProvider>
      <IssueReporting />
    </IssueReportingProvider>
  );
}

function IssueReporting() {
  return <Feedback />;
}

export default IssueReportingWrapper;
