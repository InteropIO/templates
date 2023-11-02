import { IOFeedback } from "@interopio/components-react";
import "@interopio/components-react/dist/styles/components/ui/header.css";
import "@interopio/components-react/dist/styles/components/ui/footer.css";
import "@interopio/components-react/dist/styles/components/ui/block.css";
import "@interopio/components-react/dist/styles/components/ui/alert.css";
import "@interopio/components-react/dist/styles/components/ui/progress.css";
import "@interopio/components-react/dist/styles/components/form/checkbox.css";
import "@interopio/components-react/dist/styles/components/form/radio.css";
import "@interopio/components-react/dist/styles/components/form/textarea.css";
import "@interopio/components-react/dist/styles/features/feedback/styles.css";

function FeedbackWrapper() {
  return (
    <IOFeedback.FeedbackProvider>
      <FeedbackInner />
    </IOFeedback.FeedbackProvider>
  );
}

function FeedbackInner() {
  return <IOFeedback.Feedback />;
}

export default FeedbackWrapper;
