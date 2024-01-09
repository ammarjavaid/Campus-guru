"use client";
export const runtime = 'edge';
import CheckAuth from "@/components/common/CheckAuth";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/ui/navbar";
import { Table } from "@/components/ui/table";
import relationsService from "@/services/relation-service";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
import { db } from "@/firebase";


interface RelationData {
  id: string;
  course_id: number;
  professor_id: number;
}

function CoursesPage() {
  // const [relations, setRelations] = useState<Relation[]>([]);
  // useEffect(() => {
  //   relationsService
  //     .getRelations()
  //     .then((response) => setRelations(response))
  //     .catch((_err) => {
  //       toast.error("Error occurred while Fetching Relations");
  //     });
  // }, []);

  // const deleteRelation = (id: number) => {
  //   if (
  //     !window.confirm(`Are you sure you want to delete relation with id ${id}?`)
  //   ) {
  //     return;
  //   }
  //   relationsService
  //     .deleteRelation(id)
  //     .then(() => {
  //       toast.success(`Relation with id ${id} has been deleted!`);
  //       window.location.reload();
  //     })
  //     .catch(() => {
  //       toast.error("Error occurred while deleting Relation");
  //     });
  // };

  const [relations, setRelations] = useState<RelationData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {

    const fetchRelations = async () => {
      try {
        const relationsCollection = collection(db, 'relations');
        const relationsSnapshot = await getDocs(relationsCollection);
  
        const relationData: RelationData[] = relationsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return data ? { course_id: data.course_id, professor_id: data.professor_id } : null;
        }).filter((relation): relation is RelationData => relation !== null);
  
        setRelations(relationData);
      } catch (error) {
        toast.error('Error occurred while fetching relations');
      }
    };
  
    fetchRelations();
  }, []);

  // console.log(relations, 'relations')

  const deleteRelation = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete relation with ID ${id}?`)) {
      return;
    }
  
    try {
      // Delete relation from Firestore
      const relationDocRef = doc(db, 'relations', id);
      await deleteDoc(relationDocRef);
  
      toast.success(`Relation with ID ${id} has been deleted!`);
      // Optionally, update state or trigger a re-fetch of relations
      setRelations((prevRelations) => prevRelations.filter((relation) => relation.id !== id));
    } catch (error) {
      toast.error('Error occurred while deleting relation');
    }
  }

  const renderRelationsTBody = (relations: Relation[]) => {
    return (
      <tbody className='divide-y divide-gray-200 bg-white'>
        {relations.map((relation) => {
          return (
            <tr key={relation.id}>
              <td className='tw-table-td text-center border-r-0'>
                <Link
                  className='text-blue-500 underline'
                  href={`/admin/relations/create?id=${relation.id}`}
                >
                  {relation.id}
                </Link>
              </td>
              <td className='tw-table-td text-center'>{relation.course_id}</td>
              <td className='tw-table-td text-center'>
                {relation.professor_id}
              </td>
              <td className='tw-table-td text-center'>
                <div className='flex justify-center'>
                  <TrashIcon
                    // onClick={() => deleteRelation(relation.id)}
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
            Manage Relations
          </h1>
        </div>

        <div className='sm:w-64 mt-4 sm:mt-0 mr-5'>
      <input
        type='text'
        placeholder='Search relation...'
        className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

        <div className='mt-4 sm:mt-0 flex justify-evenly gap-3 flex-col lg:flex-row'>
          <Link href={`/admin/relations/create`}>
            <Button className='inline-flex items-center bg-indigo-600'>
              <PlusIcon className='w-5 h-5 mr-2 text-white' />
              <span className='mr-2 text-white'>Add Relation</span>
            </Button>
          </Link>
        </div>
      </div>
      <div
        className={clsx(
          "mt-6 flow-root overflow-hidden border-slate-300 rounded-lg",
          relations.length > 0 && "border"
        )}
      >
        <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
            {relations.length > 0 ? (
              <div>
                <Table
                  headers={[
                    "Relation Id",
                    "Course Id",
                    "Professor Id",
                    "Action",
                  ]}
                  items={relations}
                  // items={relations.filter(relation =>
                  //   // relation.course_id.toLowerCase().includes(searchTerm.toLowerCase())
                  // )}
                  renderComponent={renderRelationsTBody}
                />
              </div>
            ) : (
              <div className='text-center'>No relations found</div>
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
