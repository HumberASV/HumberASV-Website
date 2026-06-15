// src\routes\index.tsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Team from "../pages/Team";
import Vehicle from "../pages/Vehicle";
import Support from "../pages/Support";
import Documentation from "../pages/Documentation";
import Software from "../pages/Software";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/team" element={<Team />} />
      <Route path="/vehicle" element={<Vehicle />} />
      <Route path="/support" element={<Support />} />
      <Route path="/docs" element={<Documentation />} />
      <Route path="/software" element={<Software/>} />
    </Routes>
  );  
};

export default AppRoutes;
