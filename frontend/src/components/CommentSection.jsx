import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, TextInput } from "flowbite-react";
import Comment from "./Comment";

const CommentSection = ({ postId }) => {
   const { currentUser } = useSelector((state) => state.user);
   const [comment, setComment] = useState("");
   const [error, setErrror] = useState(null);
   const [commentData, setCommentData] = useState([]);

   const navigate = useNavigate();

   useEffect(() => {
      const getComments = async () => {
         try {
            const res = await fetch(`/api/comment/getcomments/${postId}`);
            if (res.ok) {
               const comments = await res.json();
               setComment(" ");
               setCommentData(comments);
            }
         } catch (error) {
            setErrror(error.message);
         }
      };
      getComments();
   }, [postId]);

   const handleComment = async (e) => {
      e.preventDefault();

      if (comment.length > 200) {
         return;
      }

      try {
         const res = await fetch("/api/comment/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               content: comment,
               postId,
               userId: currentUser._id,
            }),
         });

         const data = await res.json();
         console.log(data);
         if (res.ok) {
            setComment("");
            setErrror(null);
            setCommentData([data, ...commentData]);
         }
      } catch (error) {
         setErrror(error.message);
      }
   };

   const handleLikes = async (commentId) => {
      try {
         if (!currentUser) {
            navigate("/sign-in");
            return;
         }

         const res = await fetch(`/api/comment/likecomment/${commentId}`, {
            method: "PUT",
         });

         if (res.ok) {
            const data = await res.json();
            setCommentData(
               commentData.map((comment) =>
                  comment._id === commentId
                     ? {
                          ...comment,
                          likes: data.likes,
                          numberOfLikes: data.likes.length,
                       }
                     : comment
               )
            );
         }
      } catch (error) {
         console.log(error);
      }
   };

   const handleEdit = async (comment, editedContent) => {
      setCommentData(
         commentData.map((c) =>
            c._id === comment._id ? { ...c, content: editedContent } : c
         )
      );
   };

   return (
      <div className="max-w-2xl mx-auto w-full p-3">
         {currentUser ? (
            <div className="flex items-center gap-1 my5 text-gray-500 text-sm">
               <p>Signed in as: </p>
               <img
                  className="h-5 w-5 object-cover rounded-full"
                  src={currentUser.profilePicture}
                  alt=""
               />
               <Link
                  to="/dashboard?tab=profile"
                  className="text-xs text-cyan-600 hover:underline"
               >
                  @{currentUser.username}
               </Link>
            </div>
         ) : (
            <div className="text-sm text-teal-500 my-5 flex gap-1">
               <p>You must login to comment</p>
               <Link className="text-blue-500" to="/sign-in">
                  Sign In
               </Link>
            </div>
         )}

         {currentUser && (
            <form
               className="border border-teal-500 rounded-md p-3 mt-5"
               onSubmit={handleComment}
            >
               <TextInput
                  placeholder="Add a comment..."
                  rows="3"
                  maxLength="200"
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
               />
               <div className=" flex justify-between items-center mt-5">
                  <p className="text-gray-500 text-xs">
                     {200 - comment.length} Characters remaining
                  </p>
                  <Button type="submit" outline gradientDuoTone="purpleToBlue">
                     Submit
                  </Button>
               </div>
               {error && (
                  <Alert color="failure" className="mt-5">
                     {error}
                  </Alert>
               )}
            </form>
         )}
         {commentData.length === 0 ? (
            <p className="text-sm my-5 font-bold">No comments yet</p>
         ) : (
            <>
               <div className="text-sm my-5 flex items-center gap-1">
                  <p>Comments</p>
                  <div className="border border-gray-400 py-1 px-2 rounded-sm ">
                     <p>{commentData.length}</p>
                  </div>
               </div>
               {commentData.map((comment) => (
                  <Comment
                     key={comment._id}
                     comment={comment}
                     onLike={handleLikes}
                     onEdit={handleEdit}
                  />
               ))}
            </>
         )}
      </div>
   );
};

export default CommentSection;
