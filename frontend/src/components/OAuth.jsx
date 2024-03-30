import React from "react";
import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice";

const OAuth = () => {
   const auth = getAuth(app);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const handleGoogle = async () => {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      try {
         const googleResult = await signInWithPopup(auth, provider);
         const res = await fetch("/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               name: googleResult.user.displayName,
               email: googleResult.user.email,
               googlePhotoUrl: googleResult.user.photoURL,
            }),
         });

         const data = await res.json();
         if (res.ok) {
            dispatch(signInSuccess(data));
            navigate("/");
         }
      } catch (error) {}
   };

   return (
      <Button
         type="button"
         gradientDuoTone="pinkToOrange"
         outline
         onClick={handleGoogle}
      >
         <AiFillGoogleCircle className="w-6 h-6 mr-2" />
         Continue with Google
      </Button>
   );
};

export default OAuth;
