import { BrowserRouter, Route, Routes } from "react-router-dom";
import BuilderPage from "./pages/BuilderPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/builder" element={<BuilderPage />} />
      </Routes>
    </BrowserRouter>
  );
}
