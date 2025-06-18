import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import HeroSection from '../pages/HeroSection';
import HomePage2 from '../pages/home';
import AdminLoginPage from '../pages/adminLoginPage';
import AdminDashboard from '../pages/adminDashboard';
import NewUserLoginPage from '../pages/newUserLoginPage';
import EmpLoginPage from '../pages/employeeLogin';
import UserTable from '../pages/EmployeeDashboard';
import ForgotPassword from '../pages/ForgotPassword';
import AnalysisCopy from '../pages/AnalysisCopy';
import Insights from '../pages/Insights';
import LoginPage from '../pages/Gueist/GuiestLoginPage';
import DataTablePage from '../pages/Gueist/GuiestUserTable';
import ProtectedRoute from '../components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: (
          <>
            <HeroSection />
            <AnalysisCopy />
          </>
        ),
      },
      {
        path: 'HomePage',
        element: <HomePage2 />,
      },
      {
        path: 'AdminLoginPage',
        element: <AdminLoginPage />,
      },
      {
        path: 'AdminDashboard',
        element: <AdminDashboard />,
      },
      {
        path: 'NewUserLoginPage',
        element: <NewUserLoginPage />,
      },
      {
        path: 'EmployeeLoginPage',
        element: <EmpLoginPage />,
      },
      {
        path: 'EmployeeDashboard',
        element: <UserTable />,
      },
      {
        path: 'ForgotPassword',
        element: <ForgotPassword />,
      },
      {
        path: 'insights',
        element: <Insights />,
      },
      {
        path: 'guistlogin',
        element: <LoginPage />,
      },
      {
        path: 'guistdatatable',
        element: <ProtectedRoute />,
        children: [
          {
            path: '',
            element: <DataTablePage />,
          },
        ],
      },
    ],
  },
]);

export default router;