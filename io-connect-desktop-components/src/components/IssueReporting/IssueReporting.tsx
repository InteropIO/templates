import { IssueReporting } from "@interopio/components-react";
import "@interopio/components-react/dist/styles/components/ui/header.css";
import "@interopio/components-react/dist/styles/components/ui/footer.css";
import "@interopio/components-react/dist/styles/components/ui/block.css";
import "@interopio/components-react/dist/styles/components/ui/alert.css";
import "@interopio/components-react/dist/styles/components/ui/progress.css";
import "@interopio/components-react/dist/styles/components/form/checkbox.css";
import "@interopio/components-react/dist/styles/components/form/radio.css";
import "@interopio/components-react/dist/styles/components/form/textarea.css";
import "@interopio/components-react/dist/styles/features/issue-reporting/styles.css";

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
