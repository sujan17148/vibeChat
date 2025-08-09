import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
} from "react-router-dom";
import App from "./App";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import { useDispatch, useSelector } from "react-redux";
import authService from "./appwrite/auth";
import { useEffect,} from "react";
import { login,fetchCurrentUserInfo,logout } from "./store/currentUserSlice";
import { fetchAllFriends, fetchAllChats } from "./store/extraInfoSlice";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<App />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </>
  )
);
export default router;

function ProtectedRoute() {
  const {loading}=useSelector(state=>state.currentUser)
  const dispatch = useDispatch();
  const currentUserStatus = useSelector((state) => state.currentUser.status);
  useEffect(() => {
    authService
      .getCurrentUser()
      .then((currentUser) => {
        dispatch(login())
        dispatch(fetchCurrentUserInfo(currentUser.$id))
        dispatch(fetchAllChats(currentUser.$id))
        dispatch(fetchAllFriends(currentUser.$id))
      })
      .catch(() => dispatch(logout()))
  }, []);

  if (loading) return <h1>Loading...  </h1>;
  return currentUserStatus ? <Outlet /> : <Navigate to="/login" />;
}
