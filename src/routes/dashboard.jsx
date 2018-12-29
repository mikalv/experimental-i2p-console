import Dashboard from "views/Dashboard/Dashboard";
import UserProfile from "views/UserProfile/UserProfile";
import TableList from "views/TableList/TableList";
import Typography from "views/Typography/Typography";
import Icons from "views/Icons/Icons";
import Maps from "views/Maps/Maps";
import Notifications from "views/Notifications/Notifications";
import Upgrade from "views/Upgrade/Upgrade";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard
  },
  {
    path: "/table",
    name: "NetDB",
    icon: "pe-7s-note2",
    component: TableList
  },
  {
    path: "/typography",
    name: "Settings",
    icon: "pe-7s-news-paper",
    component: Typography
  },
  {
    path: "/user",
    name: "Whatever",
    icon: "pe-7s-user",
    component: UserProfile
  },
  { path: "/icons", name: "Icons", icon: "pe-7s-science", component: Icons },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "pe-7s-bell",
    component: Notifications
  },
  { redirect: true, path: "/", to: "/dashboard", name: "Dashboard" }
];

export default dashboardRoutes;
