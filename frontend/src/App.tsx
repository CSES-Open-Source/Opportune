import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { BrowserRouter } from "react-router-dom";
import Applications from "./pages/Applications";
import SavedApplications from "./pages/SavedApplications";
import Companies from "./pages/Companies";
import CompanyProfile from "./pages/Company";
import Connect from "./pages/Connect";
import Sandbox from "./pages/Sandbox";
import Profile from "./pages/Profile";
import AuthLayer from "./components/layout/AuthLayer";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthLayer />}>
            <Route index element={<Home />} />
            <Route path="companies" element={<Companies />} />
            <Route path="/companies/:id" element={<CompanyProfile />} />
            <Route path="connect" element={<Connect />} />
            <Route path="applications">
              <Route path="applied" element={<Applications />} />
              <Route path="saved" element={<SavedApplications />} />
            </Route>
            <Route path="profile" element={<Profile />} />
            <Route path="sandbox" element={<Sandbox />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
