/**
 * @file index.tsx
 * 
 * @description
 * Main routing component for the application, defining the routes and their corresponding components using React Router v6.
 */
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ConnectLayout from "../components/layout/ConnectLayout";

const Home          = lazy(() => import("../pages/Home"));
const Team          = lazy(() => import("../pages/Team"));
const Vehicle       = lazy(() => import("../pages/Vehicle"));
const Support       = lazy(() => import("../pages/Support"));
const Documentation = lazy(() => import("../pages/Documentation"));
const Software      = lazy(() => import("../pages/Software"));
const Connect       = lazy(() => import("../pages/Connect"));
/**
 * Routes component defining the main application routes using React Router v6.
 * @returns the routing structure of the application, 
 *  mapping URL paths to their corresponding page components wrapped in appropriate layouts.
 * 
 * @remarks
 * - The root path ("/") renders the Home page within the MainLayout.
 * - The "/team", "/vehicle", "/support", and "/docs" paths render their respective pages within the MainLayout.
 * - The "/connect" and "/connect/:token" paths render the Connect page within the ConnectLayout,
 *  which is wrapped by the TelemetryProvider to provide telemetry data context for those routes.
 */
const AppRoutes = () => {
  return (
    <Suspense fallback={null}>
    <Routes>
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/team" element={<MainLayout><Team /></MainLayout>} />
      <Route path="/vehicle" element={<MainLayout><Vehicle /></MainLayout>} />
      <Route path="/support" element={<MainLayout><Support /></MainLayout>} />
      <Route path="/docs" element={<MainLayout><Documentation /></MainLayout>} />
      <Route path="/software" element={<MainLayout><Software /></MainLayout>} />
      <Route
        path="/connect"
        element={
            <ConnectLayout>
              <Connect />
            </ConnectLayout>
        }
      />

    </Routes>
    </Suspense>
  );
};

export default AppRoutes;
