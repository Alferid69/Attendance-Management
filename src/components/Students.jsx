import { useStudents } from "../context/StudentsProvider";
import StudentsList from "./StudentsList";

export default function Students() {
  const { students, presentStudents, absentStudents, showPresent, showAbsent } =
    useStudents();
  const showNormal = showAbsent || showPresent;

  return (
    <>
      {showNormal || (
        <div className="student-grid">
          {students.map((student) => (
            <StudentsList student={student} key={student.id} />
          ))}
        </div>
      )}
      {showAbsent && (
        <div className="student-grid">
          {absentStudents.map((student) => (
            <StudentsList student={student} key={student.id} />
          ))}
        </div>
      )}
      {showPresent && (
        <div className="student-grid">
          {presentStudents.map((student) => (
            <StudentsList student={student} key={student.id} />
          ))}
        </div>
      )}
    </>
  );
}
