import { useEffect } from 'react';
import AppRoutes from './routes';
import ScrollToTop from './components/ScrollToTop';
import { GlobalToast } from './components/GlobalToast';
import { useAppDispatch, initConnection } from 'visualizer-components/store';
import { TELEMETRY_ENABLED } from './utils/features';

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (TELEMETRY_ENABLED) dispatch(initConnection());
  }, [dispatch]);

  return (
    <>
      <ScrollToTop />
      <AppRoutes />
      <GlobalToast />
    </>
  );
};

export default App;
