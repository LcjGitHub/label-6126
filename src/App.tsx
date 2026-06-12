import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import RadicalDetailPage from './pages/RadicalDetailPage';

/** 应用路由 */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="radical/:id" element={<RadicalDetailPage />} />
      </Route>
    </Routes>
  );
}
