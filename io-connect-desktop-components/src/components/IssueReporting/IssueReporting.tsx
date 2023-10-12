import { IssueReporting } from "@interopio/components-react";
import "@interopio/components-react/dist/styles/features/issue-reporting/styles.css";
import "@interopio/components-react/dist/styles/components/ui/header.css";

function IssueReportingWrapper() {
  return (
    <IssueReporting.IssueReportingProvider>
      <IssueReportingInner />
    </IssueReporting.IssueReportingProvider>
  );
}

function IssueReportingInner() {
  return <IssueReporting.Feedback />;
}

export default IssueReportingWrapper;
