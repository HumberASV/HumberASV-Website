// src\routes\index.tsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Team from "../pages/Team";
import Vehicle from "../pages/Vehicle";
import Sponsors from "../pages/Sponsors";
import Blog from "../pages/Blog";
import Forces from "../pages/Forces";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/team" element={<Team />} />
      <Route path="/vehicle" element={<Vehicle />} />
      <Route path="/sponsors" element={<Sponsors />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/forces" element={<Forces />} />
    </Routes>
  );
};

export default AppRoutes;
