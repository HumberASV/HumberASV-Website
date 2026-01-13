import MainLayout from "./components/layout/MainLayout";
import AppRoutes from "./routes";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  return (
    <MainLayout>
      <ScrollToTop />
      <AppRoutes />
    </MainLayout>
  );
};

export default App;
