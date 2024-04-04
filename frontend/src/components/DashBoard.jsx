import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
   HiAnnotation,
   HiArrowNarrowUp,
   HiDocumentText,
   HiOutlineUserGroup,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import { Button, Table } from "flowbite-react";

const DashBoard = () => {
   const { currentUser } = useSelector((state) => state.user);

   const [users, setUsers] = useState([]);
   const [totalUsers, setTotalUsers] = useState(0);

   const [comments, setComments] = useState([]);
   const [totalComments, setTotalComments] = useState(0);

   const [posts, setPosts] = useState([]);
   const [totalPosts, setTotalPosts] = useState(0);

   const [lastMonthUsers, setLastMonthUsers] = useState(0);
   const [lastMonthPosts, setLastMonthPosts] = useState(0);
   const [lastmonthComments, setLastMonthComments] = useState(0);

   useEffect(() => {
      const fetchUsers = async () => {
         try {
            const res = await fetch(`/api/user/getusers?limit=5`);
            const data = await res.json();
            setUsers(data.users);
            setTotalUsers(data.totalUser);
            setLastMonthUsers(data.lastMonthUser);
         } catch (err) {
            console.log(err);
         }
      };

      const fetchPosts = async () => {
         try {
            const res = await fetch(`/api/post/getposts?limit=5`);
            const data = await res.json();
            setPosts(data.posts);
            setTotalPosts(data.totalPosts);
            setLastMonthPosts(data.lastMonthPosts);
         } catch (err) {
            console.log(err);
         }
      };

      const fetchComments = async () => {
         try {
            const res = await fetch(`/api/comment/getcomments?limit=5`);
            const data = await res.json();
            setComments(data.comments);
            setTotalComments(data.totalComments);
            setLastMonthComments(data.lastMonthComments);
         } catch (err) {
            console.log(err);
         }
      };

      if (currentUser.isAdmin) {
         fetchUsers();
         fetchPosts();
         fetchComments();
      }
   }, []);

   return (
      <div className="p-3 md:mx-auto">
         <div className="flex flex-wrap gap-3 justify-center">
            <div className=" flex flex-col p-3 mt-5 dark:bg-slate-400 gap-4 md:w-72 w-full rounded-md shadow-md">
               <div className="flex justify-between">
                  <div className="">
                     <h3 className="text-gray-500 text-md uppercase">
                        Total Users
                     </h3>
                     <p className="text-2xl">{totalUsers}</p>
                  </div>
                  <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
               </div>
               <div className="flex gap-2 text-sm">
                  <span className="text-green-500 flex items-center">
                     <HiArrowNarrowUp />
                     {lastMonthUsers}
                  </span>
                  <div className="text-gray-500">Last Month</div>
               </div>
            </div>

            <div className=" flex flex-col mt-5 p-3 dark:bg-slate-400 gap-4 md:w-72 w-full rounded-md shadow-md">
               <div className="flex justify-between">
                  <div className="">
                     <h3 className="text-gray-500 text-md uppercase">
                        Total Posts
                     </h3>
                     <p className="text-2xl">{totalPosts}</p>
                  </div>
                  <HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg" />
               </div>
               <div className="flex gap-2 text-sm">
                  <span className="text-green-500 flex items-center">
                     <HiArrowNarrowUp />
                     {lastMonthPosts}
                  </span>
                  <div className="text-gray-500">Last Month</div>
               </div>
            </div>

            <div className=" flex flex-col p-3 mt-5 dark:bg-slate-400 gap-4 md:w-72 w-full rounded-md shadow-md">
               <div className="flex justify-between">
                  <div className="">
                     <h3 className="text-gray-500 text-md uppercase">
                        Total Comments
                     </h3>
                     <p className="text-2xl">{totalComments}</p>
                  </div>
                  <HiDocumentText className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
               </div>
               <div className="flex gap-2 text-sm">
                  <span className="text-green-500 flex items-center">
                     <HiArrowNarrowUp />
                     {lastmonthComments}
                  </span>
                  <div className="text-gray-500">Last Month</div>
               </div>
            </div>
         </div>

         <div className=" flex flex-wrap gap-4 mx-auto justify-center">
            <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800 mt-3">
               <div className="flex justify-between p-3 text-sm font-semibold">
                  <h1 className="text-center p-2">Recent Users</h1>
                  <Button outline gradientDuoTone="purpleToPink">
                     <Link to={"/dashboard?tab=users"}>See More</Link>
                  </Button>
               </div>
               <Table hoverable>
                  <Table.Head>
                     <Table.HeadCell>User Image</Table.HeadCell>
                     <Table.HeadCell>Username</Table.HeadCell>
                  </Table.Head>

                  {users &&
                     users.map((user) => (
                        <Table.Body key={user._id}>
                           <Table.Row className="bg-white dark:bg-gray-800 dark:border-gray-700">
                              <Table.Cell>
                                 <img
                                    src={user.profilePicture}
                                    className="w-10 h-10 rounded-full bg-gray-500"
                                    alt="User Image"
                                 />
                              </Table.Cell>
                              <Table.Cell>{user.username}</Table.Cell>
                           </Table.Row>
                        </Table.Body>
                     ))}
               </Table>
            </div>

            <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800 mt-3">
               <div className="flex justify-between p-3 text-sm font-semibold">
                  <h1 className="text-center p-2">Recent Posts</h1>
                  <Button outline gradientDuoTone="purpleToPink">
                     <Link to={"/dashboard?tab=posts"}>See More</Link>
                  </Button>
               </div>
               <Table hoverable>
                  <Table.Head>
                     <Table.HeadCell>Post Image</Table.HeadCell>
                     <Table.HeadCell>Title</Table.HeadCell>
                     <Table.HeadCell>Category</Table.HeadCell>
                  </Table.Head>

                  {users &&
                     posts.map((post) => (
                        <Table.Body key={post._id}>
                           <Table.Row className="bg-white dark:bg-gray-800 dark:border-gray-700">
                              <Table.Cell>
                                 <img
                                    src={post.image}
                                    className="w-14 h-10 rounded-md bg-gray-500"
                                    alt="post Image"
                                 />
                              </Table.Cell>
                              <Table.Cell className="w-96">
                                 {post.title}
                              </Table.Cell>
                              <Table.Cell className="w-5">
                                 {post.category}
                              </Table.Cell>
                           </Table.Row>
                        </Table.Body>
                     ))}
               </Table>
            </div>

            <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800 mt-3">
               <div className="flex justify-between p-3 text-sm font-semibold">
                  <h1 className="text-center p-2">Recent Comments</h1>
                  <Button outline gradientDuoTone="purpleToPink">
                     <Link to={"/dashboard?tab=comments"}>See More</Link>
                  </Button>
               </div>
               <Table hoverable>
                  <Table.Head>
                     <Table.HeadCell>Comment</Table.HeadCell>
                     <Table.HeadCell>Likes</Table.HeadCell>
                  </Table.Head>

                  {comments &&
                     comments.map((comment) => (
                        <Table.Body key={comment._id}>
                           <Table.Row className="bg-white dark:bg-gray-800 dark:border-gray-700">
                              <Table.Cell className="w-96">
                                 <p className="line-clamp-2">
                                    {comment.content}
                                 </p>
                              </Table.Cell>
                              <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                           </Table.Row>
                        </Table.Body>
                     ))}
               </Table>
            </div>
         </div>
      </div>
   );
};

export default DashBoard;
