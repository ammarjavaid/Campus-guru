"use client";
export const runtime = 'edge';
import CheckAuth from "@/components/common/CheckAuth";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/ui/navbar";
import { Table } from "@/components/ui/table";
import professorService from "@/services/professor-service";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
import { db } from "@/firebase";

interface Professor {
  id: string,
  name: string;
  institute: string;
  faculty: string;
  tags: string;
}


function ProfessorsPage() {
  // const [professors, setProfessors] = useState<Professor[]>([]);
  // useEffect(() => {
  //   professorService
  //     .getProfessors()
  //     .then((response) => setProfessors(response))
  //     .catch((_err) => {
  //       toast.error("Error occurred while Fetching users");
  //     });
  // }, []);

  // const deleteUser = (id: number, name: string) => {
  //   if (
  //     !window.confirm(
  //       `Are you sure you want to delete professor with name ${name}?`
  //     )
  //   ) {
  //     return;
  //   }
  //   professorService
  //     .deleteProfessor(id)
  //     .then(() => {
  //       toast.success(`Professor with name ${name} has been deleted!`);
  //       window.location.reload();
  //     })
  //     .catch(() => {
  //       toast.error("Error occurred while deleting professor");
  //     });
  // };

  const [professors, setProfessors] = useState<Professor[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

useEffect(() => {
  // Fetch courses from Firestore
  // const fetchCourses = async () => {
  //   try {
  //     const professorsCollection = collection(db, 'professors');
  //     const professorSnapshot = await getDocs(professorsCollection);

  //     const courseData: Professor[] = professorSnapshot.docs.map((doc) => {
  //       const data = doc.data();
  //       return data ? { id: doc.id, ...data } : null;
  //     }).filter((course): course is Professor => course !== null);

  //     setProfessors(courseData);
  //   } catch (error) {
  //     toast.error('Error occurred while fetching courses');
  //   }
  // };
  const fetchProfessors = async () => {
    try {
      const professorsCollection = collection(db, 'professors');
      const professorSnapshot = await getDocs(professorsCollection);
  
      const professorData: (Professor | null)[] = professorSnapshot.docs.map((doc) => {
        const data = doc.data() as { name: string; institute: string; faculty: string; tags: string }; // Explicitly define the shape
        return data ? { id: doc.id, ...data } : null;
      });
  
      // Use filter and type guard to remove null values
      const professors: Professor[] = professorData.filter(
        (professor): professor is Professor => professor !== null
      );
  
      setProfessors(professors);
    } catch (error) {
      toast.error('Error occurred while fetching professors');
    }
  };

  fetchProfessors();
}, []);


const deleteProfessor = async (id: string, name: string) => {
  if (!window.confirm(`Are you sure you want to delete user with username ${name}?`)) {
    return;
  }

  try {
    // Delete user from Firestore
    const userDocRef = doc(db, 'professors', id);
    await deleteDoc(userDocRef);

    toast.success(`User with username ${name} has been deleted!`);
    // Optionally, update state or trigger a re-fetch of users
    setProfessors((prevUsers) => prevUsers.filter((user) => user.id !== id));
  } catch (error) {
    toast.error('Error occurred while deleting user');
  }
};

  const renderProfessorsTBody = (professors: Professor[]) => {
    return (
      <tbody className='divide-y divide-gray-200 bg-white'>
        {professors.map((professor) => {
          return (
            <tr key={professor.id}>
              <td className='tw-table-td text-center border-r-0'>
                {professor.id}
              </td>
              <td className='tw-table-td text-center'>
                <Link
                  className='text-blue-500 underline'
                  href={`/admin/professors/create?id=${professor.id}`}
                >
                  {professor.name}
                </Link>
              </td>
              <td className='tw-table-td text-center'>{professor.institute}</td>
              <td className='tw-table-td text-center'>{professor.faculty}</td>
              {/* <td className='tw-table-td text-center'>{professor.tags?.join(" ")}</td> */}
              {/* <td className="tw-table-td text-center">{professor.interpersonalRelationshipsReview}</td>
              <td className="tw-table-td text-center">{professor.professionalKnowledgeReview}</td>
              <td className="tw-table-td text-center">{professor.teachingMethodReview}</td>
              <td className="tw-table-td text-center">{professor.averageReview}</td> */}
              <td className='tw-table-td text-center'>
                <Link href={`/admin/professors/reviews?id=${professor.id}`}>
                  <Button className='inline-flex items-center text-white bg-indigo-600'>
                    See Reviews
                  </Button>
                </Link>
              </td>
              <td className="tw-table-td text-center"></td>
              <td className="tw-table-td text-center"></td>
              <td className="tw-table-td text-center"></td>
              <td className="tw-table-td text-center"></td>
              <td className="tw-table-td text-center"></td>
              <td className='tw-table-td text-center'>
                <div className='flex justify-center'>
                  <TrashIcon
                    onClick={() => deleteProfessor(professor.id, professor.name)}
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
            Manage Professors
          </h1>
        </div>

        <div className='sm:w-64 mt-4 sm:mt-0 mr-5'>
      <input
        type='text'
        placeholder='Search professor...'
        className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

        <div className='mt-4 sm:mt-0 flex justify-evenly gap-3 flex-col lg:flex-row'>
          <Link href={`/admin/professors/create`}>
            <Button className='inline-flex items-center bg-indigo-600'>
              <PlusIcon className='w-5 h-5 mr-2 text-white' />
              <span className='mr-2 text-white'>Add Professor</span>
            </Button>
          </Link>
        </div>
      </div>
      <div
        className={clsx(
          "mt-6 flow-root overflow-hidden border-slate-300 rounded-lg",
          professors.length > 0 && "border"
        )}
      >
        <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
            {professors.length > 0 ? (
              <div>
                <Table
                  headers={[
                    "Professor Id",
                    "Name",
                    "Institute",
                    "Faculty",
                    "Tags",
                    "Interpersonal Relationship Review",
                    "Professional Knowledge Review",
                    "Teaching Method Review",
                    "Average Review",
                    "Reviews",
                    "Action",
                  ]}
                  // items={professors}
                  items={professors.filter(professor =>
                    professor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    professor.institute.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    professor.faculty.toLowerCase().includes(searchTerm.toLowerCase())
                  )}
                  renderComponent={renderProfessorsTBody}
                />
              </div>
            ) : (
              <div className='text-center'>No professors found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Professors() {
  return (
    // <CheckAuth>
      <ProfessorsPage />
    // </CheckAuth>
  );
}
