import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import RadicalDetailPage from './pages/RadicalDetailPage';
import StatsPage from './pages/StatsPage';
import StudyPage from './pages/StudyPage';

/** 应用路由 */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="study" element={<StudyPage />} />
        <Route path="stats" element={<StatsPage />} />
        <Route path="radical/:id" element={<RadicalDetailPage />} />
      </Route>
    </Routes>
  );
}
