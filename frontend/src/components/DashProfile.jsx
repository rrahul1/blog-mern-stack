import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Progress, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";
import {
   getStorage,
   uploadBytesResumable,
   getDownloadURL,
   ref,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const DashProfile = () => {
   const { currentUser } = useSelector((state) => state.user);

   const [imageFile, setImageFile] = useState(null);
   const [imageUrl, setImageUrl] = useState(null);
   const [imgUploadProgress, setImgUploadProgress] = useState(null);
   const [imgUploadError, setImgUploadError] = useState(null);

   const imgPickerRef = useRef();

   const handleImageChange = (e) => {
      const img = e.target.files[0];

      if (img) {
         setImageFile(img);
         setImageUrl(URL.createObjectURL(img));
      }
   };

   useEffect(() => {
      if (imageFile) {
         uploadImage();
      }
   }, [imageFile]);

   const uploadImage = async () => {
      setImgUploadError(null);
      const storage = getStorage(app);
      const imgName = new Date().getTime() + imageFile.name;
      const storageRef = ref(storage, imgName);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTask.on(
         "state_changed",
         (snapshot) => {
            const progress =
               (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            setImgUploadProgress(progress.toFixed(0));
         },
         (error) => {
            setImgUploadError(
               "Couldn't upload image (File must be less than 2MB)"
            );
            setImgUploadProgress(null);
            setImageFile(null);
            setImageUrl(null);
         },
         () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
               setImageUrl(downloadURL);
            });
         }
      );
   };

   return (
      <div className="max-w-lg mx-auto p-3 w-full">
         <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
         <form className="flex flex-col gap-4">
            <input
               type="file"
               accept="images/*"
               onChange={handleImageChange}
               ref={imgPickerRef}
               className="hidden"
            />
            <div
               className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
               onClick={() => imgPickerRef.current.click()}
            >
               {imgUploadProgress && (
                  <CircularProgressbar
                     value={imgUploadProgress || 0}
                     text={`${imgUploadProgress}%`}
                     strokeWidth={5}
                     styles={{
                        root: {
                           width: "100%",
                           height: "100%",
                           position: "absolute",
                           top: 0,
                           left: 0,
                        },
                        path: {
                           stroke: `rgba(61,152,199, ${
                              imgUploadProgress / 100
                           })`,
                        },
                     }}
                  />
               )}
               <img
                  src={imageUrl || currentUser.profilePicture}
                  alt="user"
                  className={`rounded-full size-full object-cover border-8 border-[lightgray] ${
                     imgUploadProgress &&
                     imgUploadProgress < 100 &&
                     "opacity-60"
                  }`}
               />
            </div>
            {imgUploadError && <Alert color="failure">{imgUploadError}</Alert>}
            <TextInput
               type="text"
               id="username"
               placeholder="Username"
               defaultValue={currentUser.username}
            />
            <TextInput
               type="email"
               id="email"
               placeholder="Email"
               defaultValue={currentUser.email}
            />
            <TextInput type="password" id="password" placeholder="Password" />
            <Button type="submit" gradientDuoTone="purpleToBlue" outline>
               Update
            </Button>
         </form>
         <div className="text-red-500 flex justify-between mt-5">
            <span className="cursor-pointer">Delete Account</span>
            <span className="cursor-pointer">Sign Out</span>
         </div>
      </div>
   );
};

export default DashProfile;
