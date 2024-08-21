import { createContext, useContext, useReducer, useEffect } from "react";

const initialState = {
  students: [],
  isAttendanceSet: false,
  date: new Date(),
  isDataAvailable: false,
  isButtonDisabled: false,
  isLoading: false,
  absentStudents: [],
  presentStudents: [],
  showPresent: false,
  showAbsent: false,
  isError: false
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case "filterPresent":
      return {
        ...state,
        showPresent: state.isAttendanceSet,
        showAbsent: false,
        presentStudents: state.students.filter(
          (student) => student.status === "Present"
        ),
      };
    case "filterAbsent":
      return {
        ...state,
        showAbsent: state.isAttendanceSet,
        showPresent: false,
        absentStudents: state.students.filter(
          (student) => student.status === "Absent"
        ),
      };
    case "loading":
      return { ...state, isLoading: true };
    case "oldAttendance":
      return {
        ...state,
        students: action.payload,
        isAttendanceSet: true,
        isDataAvailable: true,
        isButtonDisabled: true,
        isLoading: false,
        showAbsent: false,
        showPresent: false,
      };
    case "newAttendance":
      return {
        ...state,
        students: action.payload,
        isDataAvailable: false,
        isButtonDisabled: false,
        isAttendanceSet: false,
        isLoading: false,
        showAbsent: false,
        showPresent: false,
      };
    case "previousDay":
      return {
        ...state,
        date: decrementDate(state.date),
        isDataAvailable: false,
        showPresent: false,
        showAbsent: false,
      };
    case "nextDay":
      return {
        ...state,
        date: incrementDate(state.date),
        isDataAvailable: false,
        showPresent: false,
        showAbsent: false,
        isError: false
      };
    case "present":
      return {
        ...state,
        students: state.students.map((student) =>
          student.id === action.payload
            ? { ...student, status: "Present", date: state.date }
            : student
        ),
      };
    case "absent":
      return {
        ...state,
        students: state.students.map((student) =>
          student.id === action.payload
            ? { ...student, status: "Absent", date: state.date }
            : student
        ),
      };
    case "saveAttendance":
      return {
        ...state,
        isAttendanceSet: true,
        isDataAvailable: false,
      };

    case "failed":
      return {...state,isLoading: false, isError: true};

    default:
      return state;
  }
}

function decrementDate(date) {
  const prevDate = new Date(date);
  prevDate.setDate(prevDate.getDate() - 1);
  return prevDate;
}

function incrementDate(date) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);
  return nextDate;
}

const StudentsContext = createContext();

function StudentsProvider({ children }) {
  
  const [
    {
      students,
      isLoading,
      isAttendanceSet,
      isDataAvailable,
      date,
      isButtonDisabled,
      absentStudents,
      presentStudents,
      showAbsent,
      showPresent,
      isError
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  useEffect(
    function () {
      async function fetchStudents() {
        try {
          dispatch({ type: "loading" });
          const data = await fetchDataForDate(date);
          if (data.length === 0) {
            const allStudents = await fetchAllStudents();
            dispatch({ type: "newAttendance", payload: allStudents });
            return;
          }
          const extractedStudents = extractStudents(data);
          dispatch({ type: "oldAttendance", payload: extractedStudents });
        } catch (error) {
          handleFetchError(error);
        }
      }

      async function fetchDataForDate(date) {
        const res = await fetch(`http://localhost:9000/${date.toDateString()}`);
        if (!res.ok) {
          throw new Error("404");
        }
        return await res.json();
      }

      async function fetchAllStudents() {
        const res = await fetch(`http://localhost:9000/students`);
        if (!res.ok) {
          throw new Error("Failed to fetch students for the given date");
        }
        return await res.json();
      }

      function extractStudents(data) {
        const studentsArray = data[0];
        const extractedStudents = [];
        for (const key in studentsArray) {
          if (studentsArray.hasOwnProperty(key)) {
            extractedStudents.push(studentsArray[key]);
          }
        }
        extractedStudents.pop();//to remove random id added by post method
        return extractedStudents;
      }

      function handleFetchError(error) {
        console.error("You have this error", error.message);
        if (error.message === "404") {
          dispatch({ type: "failed" });
        }
      }
      fetchStudents();
    },
    [date]
  );

  async function saveAttendance() {
    const isSet = students.every((student) => student.status !== "");
    // console.log(isSet);
    if (isSet) {
      const initial_comfimation = window.confirm(
        "Are You Sure You Want To Save  Attendance? You will not be able to change it once saved!"
      );
      const final_comfirmation = initial_comfimation
        ? window.confirm("Please Comfirm Again to Save Attendance")
        : false;
      if (final_comfirmation) {
        try {
          const res = await fetch(
            `http://localhost:9000/${date.toDateString()}`,
            {
              method: "POST",
              body: JSON.stringify(students),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (!res.ok) throw new Error("Failed to add attendance");
          dispatch({ type: "saveAttendance" });
        } catch (error) {
          console.error(error.message);
        }
      }
    } else {
      alert("please make sure every students attendance is set");
    }
  }

  function handlePresent(id) {
    dispatch({ type: "present", payload: id });
  }
  function handleAbsent(id) {
    dispatch({ type: "absent", payload: id });
  }

  function handlePrev() {
    dispatch({ type: "previousDay" });
  }
  function handleNext() {
    dispatch({ type: "nextDay" });
  }

  function filterPresent() {
    if (!isAttendanceSet) {
      alert("Please Save Today's Attendance First.");
      return;
    }
    dispatch({ type: "filterPresent" });
  }
  function filterAbsent() {
    if (!isAttendanceSet) {
      alert("Please Save Today's Attendance First.");
      return;
    }
    dispatch({ type: "filterAbsent" });
  }

  return (
    <StudentsContext.Provider
      value={{
        students,
        date,
        handlePresent,
        handleAbsent,
        handlePrev,
        handleNext,
        isAttendanceSet,
        isDataAvailable,
        saveAttendance,
        isButtonDisabled,
        isLoading,
        presentStudents,
        absentStudents,
        filterAbsent,
        filterPresent,
        showPresent,
        showAbsent,
        isError
      }}
    >
      {children}
    </StudentsContext.Provider>
  );
}

function useStudents() {
  const context = useContext(StudentsContext);
  if (context === undefined) throw new Error("Used Wrong place");

  return context;
}

export { StudentsProvider, useStudents };
