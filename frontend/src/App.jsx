import AppLayout from "./AppLayout";
import { CartProvider } from './context/CartContext'; // Import CartProvider  

const App = () => {
  return (
    <>
      <CartProvider>
      <AppLayout />
      </CartProvider>
    </>
  );
};

export default App;
