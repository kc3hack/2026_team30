import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Chat from "./Chat";
import Minutes from "./Minutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/minutes" element={<Minutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
