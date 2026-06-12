import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ComparePage from './pages/ComparePage';
import DailyPage from './pages/DailyPage';
import PinyinIndexPage from './pages/PinyinIndexPage';
import RadicalDetailPage from './pages/RadicalDetailPage';
import StatsPage from './pages/StatsPage';
import StudyPage from './pages/StudyPage';

/** 应用路由 */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="compare" element={<ComparePage />} />
        <Route path="daily" element={<DailyPage />} />
        <Route path="pinyin" element={<PinyinIndexPage />} />
        <Route path="study" element={<StudyPage />} />
        <Route path="stats" element={<StatsPage />} />
        <Route path="radical/:id" element={<RadicalDetailPage />} />
      </Route>
    </Routes>
  );
}
