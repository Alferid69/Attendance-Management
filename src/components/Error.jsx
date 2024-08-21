import { useStudents } from "../context/StudentsProvider";

function Error() {
  const { handleNext } = useStudents();
  return (
    <div className="error-page-container">
      <div className="error-content">
        <h1>Oops! Something went wrong.</h1>
        <p>We couldn’t process your request. Please try again later.</p>
        <button className="btn go-back-btn" onClick={handleNext}>
          Go Back
        </button>
      </div>
    </div>
  );
}

export default Error;
