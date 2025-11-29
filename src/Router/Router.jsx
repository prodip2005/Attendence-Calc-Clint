import { createBrowserRouter } from "react-router";
import Root from "../Layout/Root";
import Home from "../components/Home";
import Create_Table from "../Pages/Create_Table";
import Percentage from "../Pages/Percentage";
import Update_Table from "../Pages/Update_Table";
import Login from "../Register/Login";
import Registration from "../Register/Registration";
import PrivateRoute from "../contexts/AuthContext/PrivateRoute";

export const router = createBrowserRouter([
    {
        path: '/',
        Component: Root,
        children: [
            {
                index: true,
                Component:Home
            },
            {
                path: '/createTable',
                element:
                    <PrivateRoute>
                        <Create_Table/>
                    </PrivateRoute>
            },
            {
                path: '/updateTable',
                element:
                    <PrivateRoute>
                        <Update_Table/>
                </PrivateRoute>
            },
            {
                path: '/percentage',
                element:
                    <PrivateRoute>
                        <Percentage/>
                </PrivateRoute>
            },
            {
                path: '/login',
                Component:Login
            },
            {
                path: '/registration',
                Component:Registration
            }
        ]
    }
])