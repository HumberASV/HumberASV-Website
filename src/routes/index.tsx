// src\routes\index.tsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Team from "../pages/Team";
import Vehicle from "../pages/Vehicle";
import Support from "../pages/Support";
import Documentation from "../pages/Documentation";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/team" element={<Team />} />
      <Route path="/vehicle" element={<Vehicle />} />
      <Route path="/support" element={<Support />} />
      <Route path="/docs" element={<Documentation />} />
    </Routes>
  );
};

export default AppRoutes;
