import React, { useEffect, useState } from "react";
import moment from "moment";

const Comment = ({ comment }) => {
   const [userData, setUserData] = useState({});

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
            <p className="text-gray-500 pb-2">{comment.content}</p>
         </div>
      </div>
   );
};

export default Comment;
