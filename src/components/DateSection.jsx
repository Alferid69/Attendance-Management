import { useEffect, useState } from "react";
import { useStudents } from "../context/StudentsProvider";

export default function DateSection() {
  const { date, handleNext, handlePrev } = useStudents();
  const [dateText, setDateText] = useState("Today");

  const today = new Date().toDateString();

  useEffect(() => {
    if (today === date.toDateString()) {
      const intervalId = setInterval(() => {
        setDateText((prevDateText) => {
          return prevDateText === "Today" ? date.toDateString() : "Today";
        });
      }, 2000); // 3 seconds interval

      return () => clearInterval(intervalId); // Clear interval on component unmount
    } else setDateText(date.toDateString());
  }, [date]);

  return (
    <div className="date-section">
      <button
        className="btn date-nav-btn"
        id="prev-day-btn"
        onClick={handlePrev}
      >
        <span className="icon">&#9664;</span>
      </button>
      <div className="date">{dateText}</div>
      <button
        className="btn date-nav-btn"
        id="next-day-btn"
        onClick={handleNext}
      >
        <span className="icon">&#9654;</span>
      </button>
    </div>
  );
}
