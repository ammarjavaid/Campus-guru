"use client";
export const runtime = 'edge';
import CheckAuth from "@/components/common/CheckAuth";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/ui/navbar";
import { Table } from "@/components/ui/table";
import courseService from "@/services/course-service";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
import { db } from "@/firebase";


interface Course {
  id: string,
  number: number;
credit: number;
hoursPerWeek: number;
name: string;
description: string;
institute: string;
faculty: string;
tags: string;
}


function CoursesPage() {
  // const [courses, setCourses] = useState<Course[]>([]);
  // useEffect(() => {
  //   courseService
  //     .getCourses()
  //     .then((response) => setCourses(response))
  //     .catch((_err) => {
  //       toast.error("Error occurred while Fetching users");
  //     });
  // }, []);

  // const deleteCourse = (id: number, name: string) => {
  //   if (
  //     !window.confirm(
  //       `Are you sure you want to delete course with name ${name}?`
  //     )
  //   ) {
  //     return;
  //   }
  //   courseService
  //     .deleteCourse(id)
  //     .then(() => {
  //       toast.success(`Course with name ${name} has been deleted!`);
  //       window.location.reload();
  //     })
  //     .catch(() => {
  //       toast.error("Error occurred while deleting Course");
  //     });
  // };


const [courses, setCourses] = useState<Course[]>([]);
const [searchTerm, setSearchTerm] = useState<string>('');

useEffect(() => {
  // Fetch courses from Firestore
  const fetchCourses = async () => {
    try {
      const coursesCollection = collection(db, 'courses');
      const coursesSnapshot = await getDocs(coursesCollection);

      const courseData: Course[] = coursesSnapshot.docs.map((doc) => {
        const data = doc.data();
        return data ? { id: doc.id, ...data } : null;
      }).filter((course): course is Course => course !== null);

      setCourses(courseData);
    } catch (error) {
      toast.error('Error occurred while fetching courses');
    }
  };

  fetchCourses();
}, []);


const deleteCourse = async (id: string, name: string) => {
  if (!window.confirm(`Are you sure you want to delete user with username ${name}?`)) {
    return;
  }

  try {
    // Delete user from Firestore
    const userDocRef = doc(db, 'courses', id);
    await deleteDoc(userDocRef);

    toast.success(`User with username ${name} has been deleted!`);
    // Optionally, update state or trigger a re-fetch of users
    setCourses((prevUsers) => prevUsers.filter((user) => user.id !== id));
  } catch (error) {
    toast.error('Error occurred while deleting user');
  }
};


  const renderCoursesTBody = (courses: Course[]) => {
    return (
      <tbody className='divide-y divide-gray-200 bg-white'>
        {courses.map((course) => {
          return (
            <tr key={course.id}>
              <td className='tw-table-td text-center border-r-0'>
                {course.id}
              </td>
              <td className='tw-table-td text-center'>
                <Link
                  className='text-blue-500 underline'
                  href={`/admin/courses/create?id=${course.id}`}
                >
                  {course.name}
                </Link>
              </td>
              <td className='tw-table-td text-center'>{course.description}</td>
              <td className='tw-table-td text-center'>{course.credit}</td>
              <td className='tw-table-td text-center'>{course.hoursPerWeek}</td>
              <td className='tw-table-td text-center'>{course.institute}</td>
              <td className='tw-table-td text-center'>{course.faculty}</td>
              <td className='tw-table-td text-center'>
                {/* {course.tags.join(",")} */}
              </td>
              {/* <td className="tw-table-td text-center">
                {course.contentReview}
              </td>
              <td className="tw-table-td text-center">
                {course.structureReview}
              </td>
              <td className="tw-table-td text-center">
                {course.relevanceReview}
              </td>
              <td className="tw-table-td text-center">
                {course.difficultyReview}
              </td>
              <td className="tw-table-td text-center">
                {course.averageReview}
              </td> */}
              <td className='tw-table-td text-center'>
                <Link href={`/admin/courses/reviews?id=${course.id}`}>
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
                    onClick={() => deleteCourse(course.id, course.name)}
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
            Manage Courses
          </h1>
        </div>

        <div className='sm:w-64 mt-4 sm:mt-0 mr-5'>
      <input
        type='text'
        placeholder='Search courses...'
        className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

        <div className='mt-4 sm:mt-0 flex justify-evenly gap-3 flex-col lg:flex-row'>
          <Link href={`/admin/courses/create`}>
            <Button className='inline-flex items-center bg-indigo-600'>
              <PlusIcon className='w-5 h-5 mr-2 text-white' />
              <span className='mr-2 text-white'>Add Course</span>
            </Button>
          </Link>
        </div>
      </div>
      <div
        className={clsx(
          "mt-6 flow-root overflow-hidden border-slate-300 rounded-lg",
          courses.length > 0 && "border"
        )}
      >
        <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
            {courses.length > 0 ? (
              <div>
                <Table
                  headers={[
                    "Course Id",
                    "Name",
                    "Description",
                    "Credit",
                    "Hours Per Week",
                    "Institute",
                    "Faculty",
                    "Tags",
                    "Content Review",
                    "Structure Review",
                    "Relevance Review",
                    "Difficulty Review",
                    "Average Review",
                    "Reviews",
                    "Action",
                  ]}
                  // items={courses}
                  items={courses.filter(course =>
                    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    course.description.toLowerCase().includes(searchTerm.toLowerCase())
                  )}
                  renderComponent={renderCoursesTBody}
                />
              </div>
            ) : (
              <div className='text-center'>No course found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Courses() {
  return (
    // <CheckAuth>
      <CoursesPage />
    // </CheckAuth>
  );
}
