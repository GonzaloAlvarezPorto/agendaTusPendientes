import { BrowserRouter } from "react-router-dom";
import { Header } from "./components/aHeader/Header";
import { Footer } from "./components/cFooter/Footer";
import { Principal } from "./components/bMain/Principal"
import { CartProvider } from "./context/CartProvider";
import './styles/styles.scss';

function App() {

  return (
    <CartProvider>
      <BrowserRouter>
        <Header />
        <Principal />
        <Footer />
      </BrowserRouter>
    </CartProvider>
  )
}

export default App;
