import { useEffect, useState } from "react";

// const tempStudents = [
//   { name: "John Doe", id: "01", status: "", date: new Date().toDateString() },
//   { name: "Jane Smith", id: "02", status: "", date: new Date().toDateString() },
//   {
//     name: "Emily Johnson",
//     id: "03",
//     status: "",
//     date: new Date().toDateString(),
//   },
//   {
//     name: "Michael Brown",
//     id: "04",
//     status: "",
//     date: new Date().toDateString(),
//   },
//   {
//     name: "Sarah Davis",
//     id: "05",
//     status: "",
//     date: new Date().toDateString(),
//   },
//   {
//     name: "David Wilson",
//     id: "06",
//     status: "",
//     date: new Date().toDateString(),
//   },
//   {
//     name: "Sophia Martinez",
//     id: "07",
//     status: "",
//     date: new Date().toDateString(),
//   },
//   {
//     name: "James Anderson",
//     id: "08",
//     status: "",
//     date: new Date().toDateString(),
//   },
//   {
//     name: "Olivia Thomas",
//     id: "09",
//     status: "",
//     date: new Date().toDateString(),
//   },
//   {
//     name: "Daniel Jackson",
//     id: "10",
//     status: "",
//     date: new Date().toDateString(),
//   },
//   {
//     name: "Isabella Harris",
//     id: "11",
//     status: "",
//     date: new Date().toDateString(),
//   },
//   {
//     name: "Matthew Clark",
//     id: "12",
//     status: "",
//     date: new Date().toDateString(),
//   },
//   { name: "Ava Lewis", id: "13", status: "", date: new Date().toDateString() },
//   {
//     name: "Lucas Robinson",
//     id: "14",
//     status: "",
//     date: new Date().toDateString(),
//   },
//   { name: "Mia Walker", id: "15", status: "", date: new Date().toDateString() },
//   { name: "Ethan Hall", id: "16", status: "", date: new Date().toDateString() },
//   {
//     name: "Amelia Young",
//     id: "17",
//     status: "",
//     date: new Date().toDateString(),
//   },
//   { name: "Noah King", id: "18", status: "", date: new Date().toDateString() },
//   {
//     name: "Chloe Scott",
//     id: "19",
//     status: "",
//     date: new Date().toDateString(),
//   },
//   {
//     name: "Mason Green",
//     id: "20",
//     status: "",
//     date: new Date().toDateString(),
//   },
//   {
//     name: "Charlotte Adams",
//     id: "21",
//     status: "",
//     date: new Date().toDateString(),
//   },
//   { name: "Liam Baker", id: "22", status: "", date: new Date().toDateString() },
//   {
//     name: "Abigail Gonzalez",
//     id: "23",
//     status: "",
//     date: new Date().toDateString(),
//   },
//   {
//     name: "Benjamin Nelson",
//     id: "24",
//     status: "",
//     date: new Date().toDateString(),
//   },
//   {
//     name: "Ella Carter",
//     id: "25",
//     status: "",
//     date: new Date().toDateString(),
//   },
//   {
//     name: "William Mitchell",
//     id: "26",
//     status: "",
//     date: new Date().toDateString(),
//   },
//   {
//     name: "Grace Perez",
//     id: "27",
//     status: "",
//     date: new Date().toDateString(),
//   },
//   {
//     name: "Henry Roberts",
//     id: "28",
//     status: "",
//     date: new Date().toDateString(),
//   },
//   {
//     name: "Sofia Phillips",
//     id: "29",
//     status: "",
//     date: new Date().toDateString(),
//   },
//   {
//     name: "Aiden Campbell",
//     id: "30",
//     status: "",
//     date: new Date().toDateString(),
//   },
// ];

export default function App() {
  return (
    <>
      <Header />
      <Main />
      {/* <Footer /> */}
    </>
  );
}

function Header() {
  return (
    <header>
      <h1>Student Attendance</h1>
      <p>Track attendance with style</p>
    </header>
  );
}

function Main() {
  const [students, setStudents] = useState([]);
  const [isDataAvailable, setIsDataAvailable] = useState(false);
  const [day, setDay] = useState(new Date());

  useEffect(
    function () {
      async function fetchStudents() {
        try {
          //check for the given date
          const res = await fetch(
            `http://localhost:9000/${day.toDateString()}`
          );
          if (!res.ok)
            throw new Error("Failed to fetch students for the given date");
          const data = await res.json();
          setIsDataAvailable(data.length > 0);
          if (data.length === 0) {
            //if there is no  data for the given date, fetch all students
            console.log("no data for given date");

            const res = await fetch(`http://localhost:9000/students`);
            if (!res.ok)
              throw new Error("Failed to fetch students for the given date");
            const data = await res.json();
            setStudents(data);
            return;
          }
          setIsDataAvailable(true);
          const studentsArray = data[0];
          const extractedStudents = [];

          for (const key in studentsArray) {
            if (studentsArray.hasOwnProperty(key)) {
              extractedStudents.push(studentsArray[key]);
            }
          }

          setStudents(extractedStudents);
          console.log(extractedStudents);

          // console.log(data);
          // const dateKey = "Sun Aug 18 2024";
        } catch (error) {
          console.error(error);
          if (error.message === "Failed to fetch students for the given date")
            setStudents([]);
        }
      }
      fetchStudents();
    },
    [day]
  );

  function handlePresent(id) {
    setStudents((students) =>
      students.map((student) =>
        student.id === id
          ? { ...student, status: "Present", date: day.toDateString() }
          : student
      )
    );
  }
  function handleAbsent(id) {
    setStudents((students) =>
      students.map((student) =>
        student.id === id
          ? { ...student, status: "Absent", date: day.toDateString() }
          : student
      )
    );
  }

  function handlePrev() {
    setDay((d) => {
      const newDate = new Date(d);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  }
  function handleNext() {
    setDay((d) => {
      const newDate = new Date(d);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  }

  return (
    <>
      <main>
        <div className="date-section">
          <button
            className="btn date-nav-btn"
            id="prev-day-btn"
            onClick={handlePrev}
          >
            <span className="icon">&#9664;</span>
          </button>
          <div className="date">{day.toDateString()}</div>
          <button
            className="btn date-nav-btn"
            id="next-day-btn"
            onClick={handleNext}
          >
            <span className="icon">&#9654;</span>
          </button>
        </div>

        {students.length > 0 && (
          <div className="student-grid">
            {students.map((student) => (
              <StudentsList
                student={student}
                key={student.id}
                onAbsent={handleAbsent}
                onPresent={handlePresent}
              />
            ))}
          </div>
        )}
      </main>
      <Footer students={students} day={day} isDataAvailable={isDataAvailable} setIsDataAvailable={setIsDataAvailable} />
    </>
  );
}

function StudentsList({ student, onAbsent, onPresent }) {
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
          onClick={() => onPresent(student.id)}
        >
          Present
        </button>
        <button className="btn absent-btn" onClick={() => onAbsent(student.id)}>
          Absent
        </button>
      </div>
    </div>
  );
}

function Footer({ students, day, isDataAvailable, setIsDataAvailable }) {
  const totalStudents = students.length;
  const presentStudents = students.filter(
    (student) => student.status === "Present"
  ).length;
  // const  absentStudents = students.filter((student) => student.status === "Absent").length;
  const percentage = (presentStudents / totalStudents) * 100;

  async function saveAttendacne() {
    const isSet = students.every((student) => student.status !== "");
    console.log(isSet);
    if (isSet) {
      try {
        const res = await fetch(`http://localhost:9000/${day.toDateString()}`, {
          method: "POST",
          body: JSON.stringify(students),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to add attendance");
        const data = await res.json();
        setIsDataAvailable(true)
        console.log(data);
      } catch (error) {
        console.error(error.message);
      }
    } else {
      alert("please make sure every students attendance is set");
    }
  }

  return (
    <>
      {!isDataAvailable ? (
        <div className="save-button-container">
          <button className="btn save-btn" onClick={saveAttendacne}>
            Save Today's Attendance
          </button>
        </div>
      ) : (
        <div className="save-button-container">
          <button className="btn save-btn" onClick={saveAttendacne} disabled >
            {percentage}% students were present
          </button>
        </div>
      )}

      <footer>
        <p>&copy; 2024 Student Attendance Management System</p>
      </footer>
    </>
  );
}
