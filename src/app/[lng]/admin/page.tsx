"use client";
export const runtime = 'edge';

import CheckAuth from "@/components/common/CheckAuth";
import Navbar from "@/components/ui/navbar";
import { Table } from "@/components/ui/table";
import userService from "@/services/user-service";
import { TrashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
import { db } from "@/firebase";

function AdminPage() {
  // const [users, setUsers] = useState([]);
  // useEffect(() => {
  //   userService
  //     .getUsers()
  //     .then((response) => setUsers(response))
  //     .catch((_err) => {
  //       toast.error("Error occurred while Fetching users");
  //     });
  // }, []);

  // const deleteUser = (id: number, name: string) => {
  //   if (
  //     !window.confirm(
  //       `Are you sure you want to delete user with username ${name}?`
  //     )
  //   ) {
  //     return;
  //   }
  //   userService
  //     .deleteUser(id)
  //     .then(() => {
  //       toast.success(`User with username ${name} has been deleted!`);
  //       window.location.reload();
  //     })
  //     .catch(() => {
  //       toast.error("Error occurred while deleting user");
  //     });
  // };

  interface UserData {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    roles: string[];
  }

  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    // Fetch users from Firestore
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);

        const myData: UserData[] = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as UserData[];

      setUsers(myData);

      } catch (error) {
        toast.error('Error occurred while fetching users');
      }
    };

    fetchUsers();
  }, []);

  console.log(users, 'users')

  const deleteUser = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete user with username ${name}?`)) {
      return;
    }

    try {
      // Delete user from Firestore
      const userDocRef = doc(db, 'users', id);
      await deleteDoc(userDocRef);

      toast.success(`User with username ${name} has been deleted!`);
      // Optionally, update state or trigger a re-fetch of users
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      toast.error('Error occurred while deleting user');
    }
  };

  const renderUsersTBody = (users: UserData[]) => {
    return (
      <tbody className='divide-y divide-gray-200 bg-white'>
        {users.map((user) => {
          return (
            <tr key={user.id}>
              <td className='tw-table-td text-center border-r-0'>{user.id}</td>
              <td className='tw-table-td text-center'>
                {user.firstName + " " + user.lastName}
              </td>
              <td className='tw-table-td text-center'>{user.username}</td>
              <td className='tw-table-td text-center'>{user.email}</td>
              {/* <td className='tw-table-td text-center'>{user?.roles[0]}</td> */}
              <td className='tw-table-td text-center'>User</td>
              <td className='tw-table-td text-center'>
                <div className='flex justify-center'>
                  <TrashIcon
                    onClick={() => deleteUser((user as UserData).id, (user as UserData).username)}
                    className='h-6 w-6 stroke-red-600 cursor-pointer'
                  />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  };

  return (
    <div className='px-10 h-[70vh]'>
      <Navbar />
      <div className='sm:flex sm:items-center text-base my-5'>
        <div className='sm:flex-auto'>
          <h1 className=' font-semibold leading-6 text-gray-900 text-2xl'>
            Manage Users
          </h1>
        </div>
        <div className='sm:w-64 mt-4 sm:mt-0'>
      <input
        type='text'
        placeholder='Search users...'
        className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
      </div>
      <div
        className={clsx(
          "mt-6 flow-root overflow-hidden border-slate-300 rounded-lg",
          users.length > 0 && "border"
        )}
      >
        <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
            {users.length > 0 ? (
              <div>
                <Table
                  headers={[
                    "User Id",
                    "Name",
                    "User Name",
                    "Email",
                    "Role",
                    "Action",
                  ]}
                  // items={users}
                  items={users.filter(user =>
                    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
                  )}
                  renderComponent={renderUsersTBody}
                />
              </div>
            ) : (
              <div className='text-center'>No users found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    // <CheckAuth>
      <AdminPage />
    // </CheckAuth>
  );
}
