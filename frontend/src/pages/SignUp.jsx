import React, { useState } from "react";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

const SignUp = () => {
   const [formData, serFormData] = useState({});
   const [errorMessage, setErrorMessage] = useState(null);
   const [loading, setLoading] = useState(false);

   const navigate = useNavigate();

   const handleChange = (e) => {
      serFormData({ ...formData, [e.target.id]: e.target.value.trim() });
   };

   const handleSignup = async (e) => {
      e.preventDefault();
      if (!formData.username || !formData.email || !formData.password) {
         return setErrorMessage("Please fill out all fields");
      }

      try {
         setLoading(true);
         setErrorMessage(null);
         const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
         });

         const data = await res.json();

         if (res.ok) {
            navigate("/sign-in");
         }

         if (!data.success) {
            return setErrorMessage(data.message);
         }
         setLoading(false);
      } catch (error) {
         setErrorMessage(error.message);
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen mt-20">
         <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
            <div className="flex-1">
               <Link to="/" className=" font-bold dark:text-white text-4xl">
                  <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                     Rahul's{" "}
                  </span>
                  Blog
               </Link>
               <p className="text-sm mt-5">
                  This is a demo project. You can signup with your email and
                  password or with Google.
               </p>
            </div>
            <div className="flex-1">
               <form className="flex flex-col gap-4" onSubmit={handleSignup}>
                  <div className="">
                     <Label value="Your Username" />
                     <TextInput
                        type="text"
                        placeholder="Username"
                        id="username"
                        onChange={handleChange}
                     />
                  </div>
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
                        "Sign Up"
                     )}
                  </Button>
                  <OAuth />
               </form>
               <div className="flex gap-2 text-sm mt-5">
                  <span>Have an account?</span>
                  <Link to="/sign-in" className="text-blue-700">
                     Sign In
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

export default SignUp;
