import React, { useEffect, useState } from "react";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
   getDownloadURL,
   getStorage,
   ref,
   uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const UpdatePost = () => {
   const [file, setFile] = useState(null);
   const [imgUploadProgress, setImgUploadProgress] = useState(null);
   const [imgUploadError, setImgUploadError] = useState(null);
   const [formData, setFormData] = useState({});
   const [publishError, setPublishError] = useState(null);

   const navigate = useNavigate();
   const { postId } = useParams();

   const { currentUser } = useSelector((state) => state.user);

   useEffect(() => {
      try {
         const fetchPost = async () => {
            const res = await fetch(`/api/post/getposts?postId=${postId}`);

            const data = await res.json();
            if (!res.ok) {
               setPublishError(data.message);
               return;
            }
            if (res.ok) {
               setPublishError(null);
               setFormData(data.posts[0]);
            }
         };

         fetchPost();
      } catch (error) {
         console.log(error);
      }
   }, [postId]);

   const handleUploadImage = async () => {
      try {
         if (!file) {
            setImgUploadError("Please select an Image");
            return;
         }
         setImgUploadError(null);
         const storage = getStorage(app);
         const fileName = new Date().getTime() + "-" + file.name;
         const storageRef = ref(storage, fileName);
         const uploadTask = uploadBytesResumable(storageRef, file);
         uploadTask.on(
            "state_changed",
            (snapshot) => {
               const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
               setImgUploadProgress(progress.toFixed(0));
            },
            (error) => {
               setImgUploadError("Image upload failed");
               setImgUploadProgress(null);
            },
            () => {
               getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  setImgUploadError(null);
                  setImgUploadProgress(null);
                  setFormData({ ...formData, image: downloadURL });
               });
            }
         );
      } catch (error) {
         setImgUploadError("Image upload failed");
         setImgUploadProgress(null);
      }
   };

   const handleUpdatePost = async (e) => {
      e.preventDefault();

      try {
         const res = await fetch(
            `/api/post/updatepost/${postId}/${currentUser._id}`,
            {
               method: "PUT",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify(formData),
            }
         );

         const data = await res.json();

         if (!res.ok) {
            setPublishError(data.message);
            return;
         }
         if (data.success === false) {
            setPublishError(data.message);
            return;
         }
         if (res.ok) {
            setPublishError(null);
            navigate(`/post/${data.slug}`);
         }
      } catch (error) {
         setPublishError("Something went wrong");
      }
   };

   return (
      <div className="p-3 max-w-3xl mx-auto min-h-screen">
         <h1 className="text-center text-3xl my-7 font-semibold">
            Update Post
         </h1>
         <form className="flex flex-col gap-4" onSubmit={handleUpdatePost}>
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
               <TextInput
                  type="text"
                  placeholder="Title"
                  required
                  id="title"
                  className="flex-1"
                  onChange={(e) =>
                     setFormData({ ...formData, title: e.target.value })
                  }
                  value={formData.title || ""}
               />
               <Select
                  onChange={(e) =>
                     setFormData({ ...formData, category: e.target.value })
                  }
                  value={formData.category || ""}
               >
                  <option value="uncategorized">Select a category</option>
                  <option value="javascript">Javascript</option>
                  <option value="reactjs">React.js</option>
                  <option value="nextjs">Next.js</option>
                  <option value="java">Java</option>
                  <option value="mongodb">MongoDB</option>
                  <option value="expressjs">Express.js</option>
               </Select>
            </div>
            <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
               <FileInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
               />
               <Button
                  type="button"
                  gradientDuoTone="purpleToBlue"
                  size="sm"
                  outline
                  onClick={handleUploadImage}
                  disabled={imgUploadProgress}
               >
                  {imgUploadProgress ? (
                     <div className="w-16 h-16">
                        <CircularProgressbar
                           value={imgUploadProgress}
                           text={`${imgUploadProgress || 0} %`}
                        />
                     </div>
                  ) : (
                     "Upload Image"
                  )}
               </Button>
            </div>
            {imgUploadError && <Alert color="failure">{imgUploadError}</Alert>}
            {formData.image && (
               <img
                  src={formData.image}
                  alt="upload"
                  className="w-full h-72 object-cover"
               />
            )}
            <ReactQuill
               theme="snow"
               placeholder="Write something"
               className="h-72 mb-12"
               required
               onChange={(value) =>
                  setFormData({ ...formData, content: value })
               }
               value={formData.content || ""}
            />
            <Button type="submit" gradientDuoTone="purpleToPink">
               Update Post
            </Button>
            {publishError && (
               <Alert color="failure" className="mt-5">
                  {publishError}
               </Alert>
            )}
         </form>
      </div>
   );
};

export default UpdatePost;
