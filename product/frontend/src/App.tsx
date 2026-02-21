import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import Chat from "./Chat";
import Minutes from "./Minutes";

// アプリケーション全体のルーティング設定
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />   {/* ←最初 */}
        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/Minutes" element={<Minutes />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
