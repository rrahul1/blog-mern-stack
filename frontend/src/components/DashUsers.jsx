import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Table } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

const DashUsers = () => {
   const { currentUser } = useSelector((state) => state.user);

   const [userData, setUserData] = useState([]);
   const [showMore, setShowMore] = useState(true);
   const [showModal, setShowModal] = useState(false);
   const [userIdDelete, setUserIdDelete] = useState("");

   useEffect(() => {
      const fetchUsers = async () => {
         try {
            const res = await fetch(`/api/user/getusers`);

            const data = await res.json();

            if (res.ok) {
               setUserData(data.users);
               if (data.users.length < 9) {
                  setShowMore(false);
               }
            }
         } catch (error) {
            console.log(error);
         }
      };

      if (currentUser.isAdmin) {
         fetchUsers();
      }
   }, []);

   const handleShowMore = async () => {
      const startIndex = userData.length;

      try {
         const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
         const data = await res.json();
         if (res.ok) {
            setUserData((prev) => [...prev, ...data.users]);
            if (data.users.length < 9) {
               setShowMore(false);
            }
         }
      } catch (error) {
         console.log(error);
      }
   };

   const handleDeleteUser = async () => {
      setShowModal(false);
      try {
         const res = await fetch(`/api/user/delete/${userIdDelete}`, {
            method: "DELETE",
         });

         const data = await res.json();

         if (!res.ok) {
            console.log(data.message);
         } else {
            setUserData((prev) =>
               prev.filter((newuser) => newuser._id !== userIdDelete)
            );
            setShowModal(false);
         }
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <div
         className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar
       scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700
        dark:scrollbar-thumb-slate-500"
      >
         {currentUser.isAdmin && userData.length > 0 ? (
            <>
               <Table hoverable className="shadow-md">
                  <Table.Head>
                     <Table.HeadCell>Date Created</Table.HeadCell>
                     <Table.HeadCell>User Image</Table.HeadCell>
                     <Table.HeadCell>Username</Table.HeadCell>
                     <Table.HeadCell>Email</Table.HeadCell>
                     <Table.HeadCell>Admin</Table.HeadCell>
                     <Table.HeadCell>Delete</Table.HeadCell>
                  </Table.Head>

                  {userData &&
                     userData.map((user) => (
                        <Table.Body className="divide-y" key={user._id}>
                           <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                              <Table.Cell>
                                 {new Date(user.createdAt).toLocaleDateString()}
                              </Table.Cell>
                              <Table.Cell>
                                 <img
                                    src={user.profilePicture}
                                    alt={user.username}
                                    className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                                 />
                              </Table.Cell>
                              <Table.Cell>{user.username}</Table.Cell>
                              <Table.Cell>{user.email}</Table.Cell>
                              <Table.Cell>
                                 {user.isAdmin ? (
                                    <FaCheck className="text-green-500" />
                                 ) : (
                                    <FaTimes className="text-red-500" />
                                 )}
                              </Table.Cell>
                              <Table.Cell>
                                 <span
                                    onClick={() => {
                                       setShowModal(true);
                                       setUserIdDelete(user._id);
                                    }}
                                    className="font-medium text-red-500 hover:underline cursor-pointer"
                                 >
                                    Delete
                                 </span>
                              </Table.Cell>
                           </Table.Row>
                        </Table.Body>
                     ))}
               </Table>
               {showMore && (
                  <button
                     onClick={handleShowMore}
                     className="w-full text-teal-500 self-center text-sm py-7"
                  >
                     Show More
                  </button>
               )}
            </>
         ) : (
            <p>You have no posts yet.</p>
         )}
         <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            popup
            size="md"
         >
            <Modal.Header />
            <Modal.Body>
               <div className="text-center">
                  <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                  <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                     Are you sure, you want to delete this user?
                  </h3>
                  <div className="flex justify-center gap-4">
                     <Button color="failure" onClick={handleDeleteUser}>
                        Yes, I am sure
                     </Button>
                     <Button color="gray" onClick={() => setShowModal(false)}>
                        Cancel
                     </Button>
                  </div>
               </div>
            </Modal.Body>
         </Modal>
      </div>
   );
};

export default DashUsers;
