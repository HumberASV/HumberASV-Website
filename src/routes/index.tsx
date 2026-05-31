// src\routes\index.tsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Team from "../pages/Team";
import Vehicle from "../pages/Vehicle";
import Support from "../pages/Support";
import Documentation from "../pages/Documentation";
import Connect from "../pages/Connect";
import MainLayout from "../components/layout/MainLayout";
import ConnectLayout from "../components/layout/ConnectLayout";
import TelemetryProvider from "../providers/TelemetryProvider";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/team" element={<MainLayout><Team /></MainLayout>} />
      <Route path="/vehicle" element={<MainLayout><Vehicle /></MainLayout>} />
      <Route path="/support" element={<MainLayout><Support /></MainLayout>} />
      <Route path="/docs" element={<MainLayout><Documentation /></MainLayout>} />
      <Route
        path="/connect"
        element={
          <TelemetryProvider>
            <ConnectLayout>
              <Connect />
            </ConnectLayout>
          </TelemetryProvider>
        }
      />
      <Route
        path="/connect/:token"
        element={
          <TelemetryProvider>
            <ConnectLayout>
              <Connect />
            </ConnectLayout>
          </TelemetryProvider>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
