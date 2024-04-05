import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
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
import ScrollToTop from "./components/ScrollToTop";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
import Search from "./pages/Search";

const App = () => {
   const { currentUser } = useSelector((state) => state.user);

   return (
      <BrowserRouter>
         <ScrollToTop />
         <Header />
         <Routes>
            {currentUser ? (
               <>
                  <Route path="/" element={<Home />} />
                  <Route element={<PrivateRoute />}>
                     <Route path="/dashboard" element={<Dashboard />} />
                  </Route>
                  <Route path="/create-post" element={<CreatePost />} />
                  <Route element={<AdminRoute />}>
                     <Route
                        path="/update-post/:postId"
                        element={<UpdatePost />}
                     />
                  </Route>

                  <Route path="/projects" element={<Projects />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/post/:postSlug" element={<PostPage />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/sign-in" element={<Navigate to="/" />} />
                  <Route path="/sign-up" element={<Navigate to="/" />} />
               </>
            ) : (
               <>
                  <Route path="/" element={<Home />} />
                  <Route path="/sign-in" element={<SignIn />} />
                  <Route path="/sign-up" element={<SignUp />} />
                  <Route path="*" element={<Navigate to="/sign-up" />} />
               </>
            )}
         </Routes>
         <AppFooter />
      </BrowserRouter>
   );
};

export default App;
