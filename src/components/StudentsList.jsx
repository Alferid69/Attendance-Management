import { useStudents } from "../context/StudentsProvider";

export default function StudentsList({ student }) {
  const { handlePresent, handleAbsent, isButtonDisabled } = useStudents();
  return (
    <div className="student-card">
      <h2>{student.name}</h2>
      <p>
        Roll Number: <strong>{student.id}</strong>
      </p>
      <p>
        Status:{" "}
        <span className={`status ${student.status}`}>{student.status}</span>
      </p>
      <div className="btn-group">
        <button
          className="btn present-btn"
          onClick={() => handlePresent(student.id)}
          disabled={isButtonDisabled}
        >
          Present
        </button>
        <button
          className="btn absent-btn"
          onClick={() => handleAbsent(student.id)}
          disabled={isButtonDisabled}
        >
          Absent
        </button>
      </div>
    </div>
  );
}
