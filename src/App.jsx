import "./App.css";
import { Login, Register, Home, Links, Analytics, Settings } from "./pages";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/" element={<Register />}></Route>
          <Route path="/link" element={<Links />}></Route>
          <Route path="/analytics" element={<Analytics />}></Route>
          <Route path="/settings" element={<Settings />}></Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
