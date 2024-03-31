import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Progress, TextInput } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import {
   getStorage,
   uploadBytesResumable,
   getDownloadURL,
   ref,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
   updateFailure,
   updateSuccess,
   updateStart,
} from "../redux/user/userSlice";

const DashProfile = () => {
   const { currentUser } = useSelector((state) => state.user);

   const [imageFile, setImageFile] = useState(null);
   const [imageUrl, setImageUrl] = useState(null);
   const [imgUploadProgress, setImgUploadProgress] = useState(null);
   const [imgUploadError, setImgUploadError] = useState(null);
   const [formData, setFormData] = useState({});
   const [imgUploading, setImgUploading] = useState(false);
   const [updateSuccess, setUpadateSuccess] = useState(null);
   const [updateError, setUpdateError] = useState(null);

   const imgPickerRef = useRef();
   const dispatch = useDispatch();

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
      setImgUploading(true);
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
            setImgUploading(false);
         },
         () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
               setImageUrl(downloadURL);
               setFormData({ ...formData, profilePicture: downloadURL });
               setImgUploading(false);
            });
         }
      );
   };
   console.log(formData);

   const handleChangeProfile = (e) => {
      setFormData({ ...formData, [e.target.id]: e.target.value });
   };

   const handleUpdateProfile = async (e) => {
      e.preventDefault();

      setUpdateError(null);
      setUpadateSuccess(null);

      if (Object.keys(formData).length === 0) {
         setUpdateError("No changes made");
         return;
      }

      if (imgUploading) {
         setUpdateError("Please wait for image to upload");
         return;
      }

      try {
         dispatch(updateStart());

         const res = await fetch(`/api/user/update/${currentUser._id}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
         });

         const data = await res.json();
         if (!res.ok) {
            dispatch(updateFailure(data.message));
            setUpdateError(data.message);
         } else {
            dispatch(updateSuccess(data));
            setUpadateSuccess("User's profile updated successfully");
         }
      } catch (error) {
         dispatch(updateFailure(error.message));
         setUpdateError(error.message);
      }
   };

   return (
      <div className="max-w-lg mx-auto p-3 w-full">
         <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
         <form className="flex flex-col gap-4" onSubmit={handleUpdateProfile}>
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
                  src={currentUser.profilePicture || imageUrl}
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
               onChange={handleChangeProfile}
            />
            <TextInput
               type="email"
               id="email"
               placeholder="Email"
               defaultValue={currentUser.email}
               onChange={handleChangeProfile}
            />
            <TextInput
               type="password"
               id="password"
               placeholder="Password"
               onChange={handleChangeProfile}
            />
            <Button type="submit" gradientDuoTone="purpleToBlue" outline>
               Update
            </Button>
         </form>
         <div className="text-red-500 flex justify-between mt-5">
            <span className="cursor-pointer">Delete Account</span>
            <span className="cursor-pointer">Sign Out</span>
         </div>
         {updateSuccess && (
            <Alert color="success" className="mt-5">
               {updateSuccess}
            </Alert>
         )}
         {updateError && (
            <Alert color="failure" className="mt-5">
               {updateError}
            </Alert>
         )}
      </div>
   );
};

export default DashProfile;
