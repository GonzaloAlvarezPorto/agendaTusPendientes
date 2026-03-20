import { BrowserRouter } from "react-router-dom";
import './styles/globals.scss';
import { Header } from "./components/Header";
import { Principal } from "./components/Principal";
import { Footer } from "./components/Footer";
import { TaskProvider } from "./context/TaskContext";

function App() {

  return (
    <TaskProvider>
      <BrowserRouter>
        <Header />
        <Principal />
        <Footer />
      </BrowserRouter>
    </TaskProvider>
  )
}

export default App;
