import React, { useState } from "react";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
   signInSuccess,
   signInFailure,
   signInStart,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

const SignIn = () => {
   const [formData, serFormData] = useState({});
   const { loading, error: errorMessage } = useSelector((state) => state.user);

   const navigate = useNavigate();
   const dispatch = useDispatch();

   const handleChange = (e) => {
      serFormData({ ...formData, [e.target.id]: e.target.value.trim() });
   };

   const handleSignin = async (e) => {
      e.preventDefault();
      if (!formData.email || !formData.password) {
         return dispatch(signInFailure("Please fill out all fields"));
      }

      try {
         dispatch(signInStart());
         const res = await fetch("/api/auth/signin", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
         });

         const data = await res.json();

         if (res.ok) {
            dispatch(signInSuccess(data));
            navigate("/");
         }

         if (!data.success) {
            dispatch(signInFailure(data.message));
         }
      } catch (error) {
         dispatch(signInFailure(error.message));
      }
   };

   return (
      <div className="min-h-screen mt-20">
         <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
            <div className="flex-1">
               <Link to="/" className=" font-bold dark:text-white text-4xl">
                  <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                     Wish's{" "}
                  </span>
                  Blog
               </Link>
               <p className="text-sm mt-5">
                  This is a demo project. You can sign in with your email and
                  password or with Google.
               </p>
            </div>
            <div className="flex-1">
               <form className="flex flex-col gap-4" onSubmit={handleSignin}>
                  <div className="">
                     <Label value="Your Email" />
                     <TextInput
                        type="email"
                        placeholder="name@company.com"
                        id="email"
                        onChange={handleChange}
                     />
                  </div>
                  <div className="">
                     <Label value="Your Password" />
                     <TextInput
                        type="password"
                        placeholder="Password"
                        id="password"
                        onChange={handleChange}
                     />
                  </div>
                  <Button
                     gradientDuoTone="purpleToPink"
                     type="submit"
                     disabled={loading}
                  >
                     {loading ? (
                        <>
                           <Spinner size="sm" />
                           <span>Loading...</span>
                        </>
                     ) : (
                        "Sign In"
                     )}
                  </Button>
                  <OAuth />
               </form>
               <div className="flex gap-2 text-sm mt-5">
                  <span>Doesn't have an account?</span>
                  <Link to="/sign-up" className="text-blue-700">
                     Sign Up
                  </Link>
               </div>
               {errorMessage && (
                  <Alert className="mt-5" color="failure">
                     {errorMessage}
                  </Alert>
               )}
            </div>
         </div>
      </div>
   );
};

export default SignIn;
