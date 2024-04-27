import { createBrowserRouter } from "react-router-dom";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";
import App from "./App";
import NotFound from "./shared/NotFound";
import Cart from "./pages/products/Cart";
import HomeUser from "./pages/Home/HomeUser";

import ListMedicines from "./pages/ListMedicines/ListMedicines";
import ListMedicinesOfCategory from "./pages/ListMedicines/ListMedicinesOfCategory";

import Guest from "./middleware/Guest";
import Admin from "./middleware/Admin";
import CoughColdList from "./pages/products/CoughColdList";
import EarList from "./pages/products/EarList";
import StomachList from "./pages/products/StomachList";
import PainReliefList from "./pages/products/PainReliefList";
import BabyList from "./pages/products/BabyList";
import HealthCareList from "./pages/products/HealthCareList";
import VitaminsList from "./pages/products/VitaminsList";
import Login from "./pages/Auth/login/Login";
import Register from "./pages/Auth/Register/Register";


//import AdminHome from "./pages/AdminHome/AdminHome";
import Requests from "./pages/Requests/Requests"



import ManageRequests from "./pages/Manage-Requests/ManageRequests";
import RequestsOfUser from "./pages/RequestsOfUser/RequestsOfUser"



import ManageCategories from "./pages/Manage-Categories/ManageCategories";
import UpdateCategory from "./pages/Manage-Categories/UpdateCategory";

import ManageMedicines from "./pages/Manage-Medicines/ManageMedicines";
import UpdateMedicine from "./pages/Manage-Medicines/UpdateMedicine";

import ManagePatients from "./pages/Manage-Patients/ManagePatients";
import UpdatePatient from "./pages/Manage-Patients/UpdatePatients";

import MedicineDetails from "./pages/MedicineDetails/MedicineDetails";


import HistorySearch from "./pages/HistorySearchs/HistorySearch"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path:"/",
                element:<HomeUser/>,
            },
            {
                path:"/coughCouldCategory",
                element:<CoughColdList/>,
            },
            {
                path:"/EarCategory",
                element:<EarList/>,
            },
            {
                path:"/StomachCategory",
                element:<StomachList/>,
            },
            {
                path:"/PainCategory",
                element:<PainReliefList/>,
            },
            {
                path:"/babyCategory",
                element:<BabyList/>,
            },
            {
                path:"/healthcareCategory",
                element:<HealthCareList/>,
            },
            // {
            //     path:"/vitaminsCategory",
            //     element:<VitaminsList/>,
            // },
            {
                path:"/add-to-cart/:id",
                element: <Cart/>,
            },
            {
                path:"/about",
                element: <About/>,
            },
            {
                path:"/contact",
                element: <Contact/>,
            },
                  // GUEST MIDDLEWARE
            {
                element: <Guest />,
                children: [
                {
                    path: "/Login",
                    element: <Login />,
                },
                {
                    path: "/register",
                    element: <Register />,
                },
                ],
            },
            {
                path: "/HistorySearch/:id",
                element:<HistorySearch/>,
            }, 
            {
                path: "/ListMedicines",
                element:<ListMedicines/>,
            },
            {
                path: "/ListMedicinesOfCategory/:id",
                element:<ListMedicinesOfCategory/>,
            },
            {
                path: "/Manage-Categories",
                element: <Admin/>,
                children: [
                    {
                        path: "",
                        element: <ManageCategories/>,
                    },
                    {
                        path: ":id",
                        element: <UpdateCategory/>,
                    },
                ],
            },
            {
                path: "/Manage-Medicines",
                element: <Admin/>,
                children: [
                    {
                        path: "",
                        element: <ManageMedicines/>,
                    },
                    {
                        path: ":id",
                        element: <UpdateMedicine/>,
                    },
                ],
            },
            {
                path: "/Manage-Patients",
                element: <Admin/>,
                children: [
                    {
                        path: "",
                        element: <ManagePatients/>,
                    },
                    {
                        path: ":id",
                        element: <UpdatePatient/>,
                    },
                ],
            },
            
            {
                path: "/Manage-Requests",
                element: <Admin/>,
                children: [
                    {
                        path: "",
                        element: <ManageRequests/>,
                    },
                ],
            },
            {
                path: "/:id",
                element:<MedicineDetails/>,
            },
            {
                path: "/RequestsOfUser",
                element:<RequestsOfUser/>,
            },
            {
                path: "/requests",
                element:<Requests/>,
            },
            
            {
                path:"*",
                element: <NotFound/>
            },
        ],
        
    },
    {
        path:"*",
        element: <NotFound/>
    },
   
    
]);