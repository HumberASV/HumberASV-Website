import React, { useEffect } from "react";
import MainLayout from "./components/layout/MainLayout";
import AppRoutes from "./routes";
import { LoadingPage } from "./components/common/LoadingPage";
import { useLoadingStore } from "./store/useLoadingStore";

const App = () => {
  const { loading, hideLoading } = useLoadingStore();

  useEffect(() => {
    // Simulate initial app load with a bit longer time for Three.js to initialize
    const timer = setTimeout(() => {
      hideLoading();
    }, 2500);

    return () => clearTimeout(timer);
  }, [hideLoading]);

  return (
    <>
      {loading && <LoadingPage />}
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </>
  );
};

export default App;
