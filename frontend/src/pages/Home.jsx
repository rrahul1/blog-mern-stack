import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";

const Home = () => {
   const [posts, setPosts] = useState([]);

   useEffect(() => {
      const fetchPosts = async () => {
         try {
            const res = await fetch(`/api/post/getposts?limit=5`);
            const data = await res.json();
            setPosts(data.posts);
         } catch (err) {
            console.log(err);
         }
      };
      fetchPosts();
   }, []);

   return (
      <div>
         <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold lg:text-6xl ">
               Welcome to Wish's Blog
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm">
               Step into Wish's Blog, a haven where the MERN stack ignites a
               symphony of words, ideas, and connections. Immerse yourself in a
               tapestry of captivating articles, poignant narratives, and lively
               discussions, woven by our community of passionate writers from
               every corner of the globe. Join us in shaping the dialogue,
               fostering understanding, and celebrating the diversity of human
               expression. With each click, embark on a journey of discovery,
               enlightenment, and empowerment. Together, let's explore the
               boundless horizons of knowledge and imagination that await. Start
               your adventure with Wish's Blog today!
            </p>
            <Link
               to="/search"
               className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
            >
               View all posts
            </Link>
         </div>
         <div className="p-3 bg-amber-100 dark:bg-slate-700">
            <CallToAction />
         </div>
         <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
            {posts && posts.length > 0 && (
               <div className="flex flex-col gap-6">
                  <h2 className="text-2xl font-semibold text-center">
                     Recent Posts
                  </h2>
                  <div className="flex flex-wrap items-center justify-center gap-4 px-4">
                     {posts.map((post) => (
                        <PostCard key={post._id} post={post} />
                     ))}
                  </div>

                  <Link
                     to="/search"
                     className="text-lg text-teal-500 hover:underline"
                  >
                     View all posts
                  </Link>
               </div>
            )}
         </div>
      </div>
   );
};

export default Home;
