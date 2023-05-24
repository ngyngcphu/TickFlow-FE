import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Layout } from '@layout';
import { AllProjectsPage, DetailProjectPage, LoginPage } from '@pages';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <>
      <ToastContainer pauseOnHover={false} autoClose={2000} />
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route
          path='/*'
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path='overview' element={<Layout />} />
          <Route path='projects' element={<AllProjectsPage />} />
          <Route path='projects/:projectId' element={<DetailProjectPage />} />
        </Route>
      </Routes>
    </>
  );
}
