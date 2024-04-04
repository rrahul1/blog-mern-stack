import { Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";

const PostPage = () => {
   const { postSlug } = useParams();

   const [loading, setLoading] = useState();
   const [postData, setPostData] = useState(null);
   const [error, setError] = useState(false);

   useEffect(() => {
      const fetchPost = async () => {
         try {
            setLoading(true);
            const res = await fetch(`/api/post/getposts?=${postSlug}`);
            const data = await res.json();

            if (!res.ok) {
               setError(true);
               setLoading(false);
               return;
            }
            if (res.ok) {
               setPostData(
                  data.posts.filter((newpost) => postSlug === newpost.slug)
               );

               setError(false);
               setLoading(false);
            }
         } catch (error) {
            setError(error);
            setLoading(false);
         }
      };
      fetchPost();
   }, [postSlug]);

   if (loading) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            <Spinner size="xl" />
         </div>
      );
   }

   return (
      <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
         <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl ">
            {postData && postData[0]?.title}
         </h1>
         <Link
            to={`/search?category=${postData && postData[0]?.category}`}
            className="self-center mt-5"
         >
            <Button color="gray" pill size="xs">
               {postData && postData[0]?.category}
            </Button>
         </Link>
         <img
            src={postData && postData[0]?.image}
            alt={postData && postData[0]?.title}
            className="mt-10 p-3 max-h-[600px] w-full object-cover"
         />
         <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
            <span>
               {postData &&
                  new Date(postData[0]?.createdAt).toLocaleDateString()}
            </span>

            <span className="italic">
               {postData && (postData[0]?.content.length / 1000).toFixed(0)}{" "}
               mins read
            </span>
         </div>
         <div
            className="p-3 max-w-2xl mx-auto post-content"
            dangerouslySetInnerHTML={{
               __html: postData && postData[0]?.content,
            }}
         ></div>
         <div className="max-w-4xl mx-auto w-full">
            <CallToAction />
         </div>
         <CommentSection postId={postData && postData[0]?._id} />
      </main>
   );
};

export default PostPage;
