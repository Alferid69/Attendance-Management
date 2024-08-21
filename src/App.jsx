import { useStudents } from "./context/StudentsProvider";
import Error from "./components/Error";
import Footer from "./components/Footer";
import { Header } from "./components/Header";
import Loader from "./components/Loader";
import MainBody from "./components/MainBody";

export default function App() {
  const { isLoading, isError } = useStudents();

  return (
    <>
      <Header />
      {isLoading && <Loader />}

      {isError && <Error />}
      {!isError && !isLoading && (
        <>
          <MainBody />
          <Footer />
        </>
      )}
    </>
  );
}
