import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import {
   HiAnnotation,
   HiArrowSmRight,
   HiChartPie,
   HiDocumentText,
   HiNewspaper,
   HiOutlineUserGroup,
   HiUser,
} from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

const DashSidebar = () => {
   const { currentUser } = useSelector((state) => state.user);

   const location = useLocation();
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const [tab, setTab] = useState("");

   useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get("tab");

      if (tabFromUrl) {
         setTab(tabFromUrl);
      }
   }, [location.search]);

   const handleSignout = async () => {
      try {
         const res = await fetch("/api/user/signout", {
            method: "POST",
         });
         const data = await res.json();
         if (!res.ok) {
            console.log(data.message);
         } else {
            dispatch(signOutSuccess());
            navigate("/sign-in");
         }
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <>
         <Sidebar className="w-full md:w-56">
            <Sidebar.Items>
               <Sidebar.ItemGroup className="flex flex-col gap-1">
                  {currentUser.isAdmin && (
                     <Link to="/dashboard?tab=overview">
                        <Sidebar.Item
                           active={tab === "overview" || !tab}
                           icon={HiChartPie}
                           as="div"
                        >
                           Dashboard
                        </Sidebar.Item>
                     </Link>
                  )}
                  <Link to="/dashboard?tab=profile">
                     <Sidebar.Item
                        active={tab === "profile"}
                        icon={HiUser}
                        label={currentUser.isAdmin ? "Admin" : "User"}
                        labelColor="dark"
                        as="div"
                     >
                        Profile
                     </Sidebar.Item>
                  </Link>
                  <Link to="/create-post">
                     <Sidebar.Item icon={HiNewspaper} as="div">
                        Create Post
                     </Sidebar.Item>
                  </Link>

                  {currentUser && (
                     <Link to="/dashboard?tab=posts">
                        <Sidebar.Item
                           active={tab === "posts"}
                           icon={HiDocumentText}
                           as="div"
                        >
                           Posts
                        </Sidebar.Item>
                     </Link>
                  )}
                  {currentUser.isAdmin && (
                     <Link to="/dashboard?tab=users">
                        <Sidebar.Item
                           active={tab === "users"}
                           icon={HiOutlineUserGroup}
                           as="div"
                        >
                           Users
                        </Sidebar.Item>
                     </Link>
                  )}
                  {currentUser.isAdmin && (
                     <Link to="/dashboard?tab=comments">
                        <Sidebar.Item
                           active={tab === "comments"}
                           icon={HiAnnotation}
                           as="div"
                        >
                           Comments
                        </Sidebar.Item>
                     </Link>
                  )}
                  <Sidebar.Item
                     as="div"
                     icon={HiArrowSmRight}
                     className="cursor-pointer"
                  >
                     <span onClick={handleSignout}>Sign Out</span>
                  </Sidebar.Item>
               </Sidebar.ItemGroup>
            </Sidebar.Items>
         </Sidebar>
      </>
   );
};

export default DashSidebar;
