import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HeroSection from "../pages/HeroSection";
import HomePage2 from "../pages/home";
import AdminLoginPage from "../pages/adminLoginPage";
import AdminDashboard from "../pages/adminDashboard";
import NewUserLoginPage from "../pages/newUserLoginPage";
import EmpLoginPage from "../pages/employeeLogin";
import UserTable from "../pages/EmployeeDashboard";
import ForgotPassword from "../pages/ForgotPassword";
import AnalysisCopy from "../pages/AnalysisCopy";

const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path: "",
                element: (
                  <>
                    <HeroSection />
                    <AnalysisCopy  />
                  </>
                )
            },
            {
                path : "HomePage",
                element : <HomePage2/>
            },
            {
                path : 'AdminLoginPage',
                element : <AdminLoginPage/>
            },
            {
                path : "AdminDashboard",
                element : <AdminDashboard/>
            },
            {
                path : "NewUSerLoginPage",
                element : <NewUserLoginPage/>
            },
            {
                path : "EmployeeLoginPage",
                element : <EmpLoginPage/>
            },
            {
                path : "EmployeeDashboard",
                element : <UserTable/>
            },
            {
                path : "ForgotPassword",
                element : <ForgotPassword/>
            },
            
        ]
    }
])

export default router

