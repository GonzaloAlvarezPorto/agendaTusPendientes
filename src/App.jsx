import { BrowserRouter } from "react-router-dom";
import { Header } from "./components/aHeader/Header";
import { Footer } from "./components/cFooter/Footer";
import { Principal } from "./components/bMain/Principal"
import { TaskProvider } from "./context/TaskContext";
import './styles/styles.scss';

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
