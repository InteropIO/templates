import { IOFeedback } from "@interopio/components-react";
import "@interopio/components-react/dist/styles/features/feedback/styles.css";

const { FeedbackProvider, Feedback } = IOFeedback;

function FeedbackWrapper() {
  return (
    <FeedbackProvider>
      <Feedback />
    </FeedbackProvider>
  );
}

export default FeedbackWrapper;
