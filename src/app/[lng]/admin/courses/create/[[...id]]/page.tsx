"use client";

export const runtime = 'edge';
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as yup from "yup";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import courseService from "@/services/course-service";
import { collection, addDoc } from 'firebase/firestore';
import { db } from "@/firebase";

const schema = yup.object().shape({
  number: yup
    .number()
    .transform((val) => (isNaN(val) ? undefined : val))
    .required("Course number is required"),
  name: yup.string().required("Course name is required"),
  description: yup.string().required("Course description is required"),
  credit: yup
    .number()
    .transform((val) => (isNaN(val) ? undefined : val))
    .required("Credit is required"),
  hoursPerWeek: yup
    .number()
    .transform((val) => (isNaN(val) ? undefined : val))
    .required("Hours per week is required"),
  institute: yup.string().required("Institute is required"),
  faculty: yup.string().required("Faculty is required"),
  tags: yup.string().required("Tags is required"),
});

interface CourseData {
  number: number;
  credit: number;
  hoursPerWeek: number;
  name: string;
  description: string;
  institute: string;
  faculty: string;
  tags: string;
}

export default function CreateOrUpdateCourse() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get("id");
  const isNewCourse = !courseId;

  const [_course, setCourse] = useState<Course>();

  const [formData, setFormData] = useState<CourseData>({
    number: 0, 
  credit: 0, 
  hoursPerWeek: 0, 
  name: '',
  description: '',
  institute: '',
  faculty: '',
  tags: '',
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  useEffect(() => {
    if (courseId) {
      courseService
        .getCourseById(Number(courseId))
        .then((response) => {
          reset({ ...response });
          setCourse(response);
        })
        .catch(() => toast("Something went wrong. Please try again!"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  
  const handleChange = <T extends keyof CourseData>(fieldName: T, value: CourseData[T] | string): void => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
  };

  const handleFormSubmit = async (data: any) => {
    // if (isNewCourse) {
    //   courseService
    //     .createCourse(data)
    //     .then(() => {
    //       toast.success("course added successfully");
    //       router.push("/admin/courses");
    //     })
    //     .catch(() => toast.error("Error occurred while adding course"));
    // } else {
    //   delete data.id
    //   delete data.professors
    //   courseService
    //     .updateCourse(data, Number(courseId))
    //     .then(() => {
    //       toast.success("Course updated successfully");
    //       router.push("/admin/courses");
    //     })
    //     .catch(() => toast.error("Error occurred while updating course"));
    // }
    const coursesCollection = collection(db, 'courses');

  try {
    const docRef = await addDoc(coursesCollection, formData);
    toast.success('Course added successfully');
    router.push('/admin/courses');
  } catch (error) {
    console.error('Error adding course:', error);
    toast.error('Error occurred while adding course');
  }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="sm:flex sm:items-centertext-base mb-3 px-8">
        <div className="sm:flex-auto mt-2">
          <h1 className=" font-semibold leading-6 text-gray-900 text-2xl">
            {isNewCourse ? "Add New Course" : "Update Course"}
          </h1>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 flex justify-evenly gap-2 sm:grid-cols-2">
          <Link href={"/admin/courses"}>
            <Button className="inline-flex items-center bg-white text-indigo-600 border border-gray-200">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            className="inline-flex items-center bg-indigo-600"
          >
            {isNewCourse ? "Add Course" : "Update Course"}
          </Button>
        </div>
      </div>
      <div className="flex px-8 justify-evenly flex-col-reverse xl:flex-row md:space-x-0 xl:space-x-10">
        <div className="flex flex-col flex-1 space-y-4">
          <div className="mt-3">
            <div className="overflow-hidden border border-gray-300 sm:rounded-md flex flex-col flex-1">
              <div className="bg-white px-4 py-5 sm:p-6">
                <div className="space-y-4 mb-3">
                  <div>
                    <label className="block mr-2 mb-1 text-base font-medium text-gray-700">
                      Number
                    </label>
                    <Input
                      type="number"
                      id="Number"
                      autoComplete="Number"
                      register={register}
                      name="number"
                      errors={errors}
                      autoCapitalize="false"
                      placeholder="Enter course number"
                      value={formData.number}
                      onChange={(e) => handleChange('number', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mr-2 mb-1 text-base font-medium text-gray-700">
                      Name
                    </label>
                    <Input
                      type="text"
                      id="Name"
                      autoComplete="Name"
                      register={register}
                      name="name"
                      errors={errors}
                      autoCapitalize="false"
                      placeholder="Enter course name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mr-2 mb-1 text-base font-medium text-gray-700">
                      Description
                    </label>
                    <Input
                      type="text"
                      id="Description"
                      autoComplete="Description"
                      register={register}
                      name="description"
                      errors={errors}
                      autoCapitalize="false"
                      placeholder="Enter course description"
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mr-2 mb-1 text-base font-medium text-gray-700">
                      Credit
                    </label>
                    <Input
                      type="number"
                      id="Credit"
                      autoComplete="Credit"
                      register={register}
                      name="credit"
                      errors={errors}
                      autoCapitalize="false"
                      placeholder="Enter course credit"
                      value={formData.credit}
                      onChange={(e) => handleChange('credit', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mr-2 mb-1 text-base font-medium text-gray-700">
                      Hours per week
                    </label>
                    <Input
                      type="number"
                      id="HoursPerWeek"
                      autoComplete="HoursPerWeek"
                      register={register}
                      name="hoursPerWeek"
                      errors={errors}
                      autoCapitalize="false"
                      placeholder="Enter course hours per week"
                      value={formData.hoursPerWeek}
                      onChange={(e) => handleChange('hoursPerWeek', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mr-2 mb-1 text-base font-medium text-gray-700">
                      Institute
                    </label>
                    <Input
                      type="text"
                      id="Institute"
                      autoComplete="Institute"
                      register={register}
                      name="institute"
                      errors={errors}
                      autoCapitalize="false"
                      placeholder="Enter institute name"
                      value={formData.institute}
                      onChange={(e) => handleChange('institute', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mr-2 mb-1 text-base font-medium text-gray-700">
                      Faculty
                    </label>
                    <Input
                      type="text"
                      id="Faculty"
                      autoComplete="Faculty"
                      register={register}
                      name="faculty"
                      errors={errors}
                      autoCapitalize="false"
                      placeholder="Enter faculty name"
                      value={formData.faculty}
                      onChange={(e) => handleChange('faculty', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mr-2 mb-1 text-base font-medium text-gray-700">
                      Tags
                    </label>
                    <Input
                      type="text"
                      id="Tags"
                      autoComplete="Tags"
                      register={register}
                      name="tags"
                      errors={errors}
                      autoCapitalize="false"
                      placeholder="Enter tags separated by commas"
                      value={formData.tags}
                      onChange={(e) => handleChange('tags', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
