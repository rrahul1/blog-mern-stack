import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import AppFooter from "./components/AppFooter";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";

const App = () => {
   return (
      <BrowserRouter>
         <Header />
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route element={<PrivateRoute />}>
               <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route element={<AdminRoute />}>
               <Route path="/create-post" element={<CreatePost />} />
               <Route path="/update-post/:postId" element={<UpdatePost />} />
            </Route>

            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/post/:postSlug" element={<PostPage />} />
         </Routes>
         <AppFooter />
      </BrowserRouter>
   );
};

export default App;
