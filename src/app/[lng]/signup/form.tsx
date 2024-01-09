"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/app/i18n/client";
import { useAppSelector } from "@/hooks";
import authService from "@/services/auth-service";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import Image from "next/image";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../firebase";
import { collection, addDoc } from "firebase/firestore";

interface propsType {
  modal?: Boolean;
  onLoginClick?: () => void;
  onSuccess?: () => void;
}
interface SignupFormData {
  firstName: string;
  lastName: string;
  username: string;
}
export default function Form({
  modal = false,
  onLoginClick,
  onSuccess,
}: propsType) {
  const params = useParams();
  const lng = (params?.lng as string) || "en";
  const { t } = useTranslation(lng, "signup");
  const token = useAppSelector((state) => state.auth.jwt);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (token) {
      router.push(`/${lng}/`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const schema = yup.object<User>().shape({
    firstName: yup.string().required(t("firstNameRequired")),
    lastName: yup.string().required(t("lastNameRequired")),
    username: yup.string().required(t("usernameRequired")),
    email: yup.string().required(t("emailRequired")),
    password: yup.string().required(t("passwordRequired")),
  });

  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    username: '',
  });

  const handleChange = (fieldName: string, value: string): void => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
  };

  // const auth = getAuth()

  const handleSignup = (
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string
  ) => {
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (_res) => {
        // todo: handle success signup

        toast.success(t("signupSuccess"));

        try {
          const docRef = await addDoc(collection(db, "users"), {
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: formData.username,
            email: email,
            password: password,
          });
          console.log(docRef);
          // onSuccess();
          alert("User Created");
          router.push(`/${lng}/login`);
        } catch (e) {
         
          alert("Something went wrong");
          console.error("Error adding document: ", e);
        }

        // if (modal && onSuccess) {

        // } else {
        //   router.push(`/${lng}/login`);
        // }

        setLoading(false);
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          console.error('Email already in use:', error);
          toast.error('Email is already in use. Please choose a different email.');
        } else if (error.code === 'auth/invalid-email') {
          console.error('Invalid email:', error);
          toast.error('Invalid email format. Please enter a valid email address.');
        } else if (error.code === 'auth/weak-password') {
          console.error('Weak password:', error);
          toast.error('Weak password. Please choose a stronger password.');
        } else {
          console.error('Other error:', error);
          toast.error('Signup failed. Please try again.');
        }
        toast.error(t("signupFail"));
        setLoading(false);
      });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const handleFormSubmit = (data: any) => {
    handleSignup(
      data.firstName,
      data.lastName,
      data.username,
      data.email,
      data.password
    );
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center">{t("heading")}</h2>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="min-w-[100%] my-2"
      >
        <div className="space-y-1 flex md:flex-row sm:flex-col gap-2">
          <div className="flex-1">
            <label htmlFor="firstName">{t("firstName")}</label>
            <Input
              type="text"
              name="firstName"
              register={register}
              errors={errors}
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="lastName">{t("lastName")}</label>
            <Input
              type="text"
              name="lastName"
              register={register}
              errors={errors}
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-1 my-4">
          <label htmlFor="username">{t("username")}</label>
          <Input
            type="text"
            name="username"
            register={register}
            errors={errors}
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
          />
        </div>
        <div className="space-y-1 my-4">
          <label htmlFor="email">{t("email")}</label>
          <Input type="text" name="email" register={register} errors={errors} />
        </div>
        <div className="space-y-1 my-4">
          <label htmlFor="password">{t("password")}</label>
          <Input
            type="password"
            name="password"
            register={register}
            errors={errors}
          />
        </div>
        <Button className="w-full flex items-center gap-2" disabled={loading}>
          {loading && (
            <Image
              src="/dev/loader.gif"
              width={15}
              height={15}
              className="object-cover"
              alt="loading"
            />
          )}
          {t("signup")}
        </Button>
      </form>
      {/* <h2 className='text-lg mt-4 text-center'>{t("signInWith")}</h2> */}
      {modal ? (
        <>
          <h2 className="text-lg mt-4 text-center">
            {t("already")}
            <span
              onClick={onLoginClick}
              className="text-blue-500 cursor-pointer"
            >
              {" "}
              {t("signIn")}
            </span>
          </h2>
        </>
      ) : (
        <>
          <h2 className="text-lg mt-4 text-center">
            {t("already")}{" "}
            <Link href={`/${lng}/login`} className="text-blue-500">
              {" "}
              {t("signIn")}
            </Link>
          </h2>
        </>
      )}
    </>
  );
}
