import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import CalendarPage from "./pages/calendar/CalendarPage";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<CalendarPage />} path="/calendar" />
    </Routes>
  );
}

export default App;
