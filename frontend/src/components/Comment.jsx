import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";

const Comment = ({ comment, onLike, onEdit }) => {
   const [userData, setUserData] = useState({});
   const [isEditing, setIsEditing] = useState(false);
   const [editContent, setEditContent] = useState(comment.content);

   const { currentUser } = useSelector((state) => state.user);

   useEffect(() => {
      const getUser = async () => {
         try {
            const res = await fetch(`/api/user/${comment.userId}`);
            const data = await res.json();
            if (res.ok) {
               setUserData(data);
            }
         } catch (error) {}
      };
      getUser();
   }, [comment]);

   const handleEdit = async () => {
      setIsEditing(true);

      setEditContent(comment.content);
   };

   const handleSave = async () => {
      try {
         const res = await fetch(`/api/comment/editcomment/${comment._id}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               content: editContent,
            }),
         });

         if (res.ok) {
            setIsEditing(false);
            onEdit(comment, editContent);
         }
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <div className="flex p-4 border-b dark:border-b-gray-600 text-sm ">
         <div className="flex-shrink-0 mr-3">
            <img
               className="w-10 h-10 rounded-full bg-gray-200"
               src={userData.profilePicture}
               alt={userData.username}
            />
         </div>
         <div className="flex-1">
            <div className="flex items-center mb-1">
               <span className="font-bold mr-1 text-xs truncate">
                  {userData ? `@${userData.username}` : "anonymous user"}
               </span>
               <span className="text-gray-500 text-xs ">
                  {moment(comment.createdAt).fromNow()}
               </span>
            </div>

            {isEditing ? (
               <>
                  <Textarea
                     className="mb-2"
                     value={editContent}
                     onChange={(e) => setEditContent(e.target.value)}
                  />
                  <div className=" flex justify-end gap-2 text-xs">
                     <Button
                        className=""
                        type="button"
                        size="sm"
                        gradientDuoTone="purpleToBlue"
                        onClick={handleSave}
                     >
                        Save
                     </Button>
                     <Button
                        className=""
                        type="button"
                        size="sm"
                        gradientDuoTone="purpleToBlue"
                        outline
                        onClick={() => setIsEditing(false)}
                     >
                        Cancel
                     </Button>
                  </div>
               </>
            ) : (
               <>
                  <p className="text-gray-500 pb-2">{comment.content}</p>
                  <div className="flex items-center pt-2 text-xs border-t dark:border-r-gray-700 max-w-fit gap-2">
                     <button
                        type="button"
                        className={`text-gray-400 hover:text-blue-500 ${
                           currentUser &&
                           comment.likes.includes(currentUser._id) &&
                           "!text-blue-500"
                        } `}
                        onClick={() => onLike(comment._id)}
                     >
                        <FaThumbsUp className="text-sm" />
                     </button>
                     <p className="text-gray-400">
                        {comment.numberOfLikes > 0 &&
                           comment.numberOfLikes +
                              " " +
                              (comment.numberOfLikes === 1 ? "like" : "likes")}
                     </p>
                     {currentUser &&
                        (currentUser._id === comment.userId ||
                           currentUser.isAdmin) && (
                           <button
                              className="text-gray-400 hover:text-blue-500"
                              onClick={handleEdit}
                           >
                              Edit
                           </button>
                        )}
                  </div>
               </>
            )}
         </div>
      </div>
   );
};

export default Comment;
