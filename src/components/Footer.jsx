import { useStudents } from "../context/StudentsProvider";

export default function Footer() {
  const {
    students,
    isAttendanceSet,
    saveAttendance,
    filterAbsent,
    filterPresent,
    showAbsent,
    showPresent,
  } = useStudents();

  const totalStudents = students.length;
  const numberOfPresentStudents = students.filter(
    (student) => student.status === "Present"
  ).length;
  const percentage = (numberOfPresentStudents / totalStudents) * 100;

  const filterButton = showPresent || showAbsent;

  return (
    <>
      <div className="save-button-container">
        <button
          className="btn save-btn"
          onClick={saveAttendance}
          disabled={isAttendanceSet}
        >
          {isAttendanceSet
            ? `${Math.floor(percentage)}% students were present`
            : "Save Today's Attendance"}
        </button>

        <button
          className="btn filter-btn"
          onClick={filterAbsent}
          disabled={showAbsent}
        >
          Filter Absent Students
        </button>
        <button
          className="btn filter-btn"
          onClick={filterPresent}
          disabled={showPresent}
        >
          Filter Present Students
        </button>
      </div>

      <footer>
        <p>&copy; 2024 Student Attendance Management System</p>
      </footer>
    </>
  );
}
