import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile/Profile";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import NoAccess from "./pages/NoAccess";
import Educations from "./pages/Educations/Educations";
import Teachers from "./pages/Personnels/Personnels";
import Categories from "./pages/Categories/Categories";
import CategoryForm from "./pages/Categories/CategoryForm";
import PersonnelForm from "./pages/Personnels/PersonnelForm";
import CreateEducation from "./pages/Educations/CreateEducation";
import EducationDetail from "./pages/Educations/EducationDetail";
import PendingRequests from "./pages/Educations/PendingRequests";


export const role = localStorage.getItem("role");

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/educations"
            element={
              <ProtectedRoute>
                <Educations />
              </ProtectedRoute>
            }
          />
            <Route path="/education/create" element={<CreateEducation />} />
            <Route path="/education/create/:id" element={<CreateEducation />} />
            <Route path="/education/detail/:id" element={<EducationDetail />} />

            <Route
            path="/pendingrequests"
            element={
              <PendingRequests/>
            }
          />
          <Route
            path="/personnels"
            element={
              <ProtectedRoute>
                <Teachers />
              </ProtectedRoute>
            }
          />
           <Route path="/personnel/create" element={<PersonnelForm />} />
           <Route path="/personnel/edit/:id" element={<PersonnelForm />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route path="/category/create" element={<CategoryForm />} />
          <Route path="/category/edit/:id" element={<CategoryForm />} />
          <Route path="/no-access" element={<NoAccess />} />

        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
