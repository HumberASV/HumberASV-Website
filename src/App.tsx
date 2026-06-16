import { useEffect } from 'react';
import AppRoutes from './routes';
import ScrollToTop from './components/ScrollToTop';
import { GlobalToast } from './components/GlobalToast';
import { useAppDispatch } from './store';
import { initConnection } from './store/actions/connectionActions';

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initConnection());
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
