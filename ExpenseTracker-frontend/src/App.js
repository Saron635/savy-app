import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import HomePage from "./pages/Home";
import AddTransaction from "./components/AddTransaction";
import ManageCategories from "./components/CategoryManager";
import SignUp from "./pages/SignUp"
import Login from "./pages/LoginPage"
import LandingPage from "./pages/LandingPage"
import {GlobalProvider} from "./context/context"
function App() {
  return (
    <ChakraProvider>
      <GlobalProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            
            {/* 🔐 Auth Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/landingpage" element={<LandingPage/>}/>

            {/* 🏠 App Pages */}
            
            <Route path="/home" element={<HomePage />} />
            <Route path="/add-transaction" element={<AddTransaction />} />
            <Route path="/manage-categories" element={<ManageCategories />} />
          </Routes>
        </Router>
      </GlobalProvider>  

    </ChakraProvider>
  );
}

export default App;
