import React, { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

import { useMutation } from "react-query";
import {
  Dialog,
  DialogContent,
  // DialogDescription,
  // DialogFooter,
  // DialogHeader,
  // DialogTitle,

  // DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/hooks";
import { useTranslation } from "@/app/i18n/client";
import { Textarea } from "../ui/textarea";
import reviewService from "@/services/review-service";
import LoginModal from "@/app/[lng]/login/modal";
import { AxiosError } from "axios";
// import toFixed from "@/functions/toFixed";

interface proptypes {
  professorId: number;
  professorName: string;
  open: boolean;
  onClose: () => void;
  onSuccess: (report: ProfessorReport) => void;
}

export default function ReportProfessorModal({
  professorId,
  professorName,
  open,
  onClose,
  onSuccess,
}: proptypes) {
  const params = useParams();
  const lng: string = params?.lng as string;
  const { t } = useTranslation(lng, "common");
  const auth = useAppSelector((state) => state.auth);

  const reportsOptions = [
    {
      label: t("professorReportDialog.misguiding"),
      value: "misguiding",
    },
    {
      label: t("professorReportDialog.spam"),
      value: "spam",
    },
    {
      label: t("professorReportDialog.misplacement"),
      value: "misplacement",
    },
    {
      label: t("professorReportDialog.harmful"),
      value: "harmful",
    },
    {
      label: t("professorReportDialog.other"),
      value: "other",
    },
  ];

  const initialData = {
    professor_id: professorId,
    reason: "",
    details: "",
  };
  const [data, setData] = useState(initialData);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const { mutate, isLoading, isError, error } = useMutation(
    reviewService.reportProfessor,
    {
      onSuccess: (data) => {
        onSuccess({
          ...data,
        });
        setData(initialData);
        onClose();
      },
    }
  );

  const validate = (): boolean => {
    if (!data.professor_id || !data.reason) {
      return false;
    }
    return true;
  };

  const submitHandler = () => {
    const enabled = validate();
    if (!enabled) {
      return;
    }
    if (!auth || !auth.jwt) {
      setLoginModalOpen(true);
      return;
    }
    mutate({
      ...data,
    });
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={(authResponse) => {
          setLoginModalOpen(false);
        }}
      />
      <DialogContent
        className='md:px-7 xs:px-1  gap-0 sm:max-w-100 min-w-[50%] lg:min-w-[60%] md:min-w-[80%] sm:min-w-[95%] xs:min-w-[100%] w-full md:w-fit h-full  md:h-fit '
        style={{ overflowY: "auto" }}
      >
        <div className='flex flex-col'>
          {/* heading */}
          <h1 className='md:text-2xl xs:text-lg mt-4 '>
            {t("professorReportDialog.heading")}{" "}
            <strong>{professorName}</strong>
          </h1>
          <div className='mt-5 w-[50%]'>
            <h1 className='text-lg mt-1 font-bold '>
              {t("professorReportDialog.reasonLabel")}
            </h1>

            {reportsOptions.map((item, i) => (
              <div key={i} className='flex items-center gap-2 mt-2'>
                <Input
                  type='radio'
                  autoFocus={false}
                  id={item.value}
                  name='reason'
                  style={
                    {
                      //border: "0.538px solid #C4C4C4",
                    }
                  }
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                  checked={data.reason === item.value}
                  value={item.value}
                  onChange={(e) => {
                    setData({
                      ...data,
                      reason: e.target.value,
                    });
                  }}
                />
                <label htmlFor={`${item.value}`} className='cursor-pointer'>
                  {item.label}
                </label>
              </div>
            ))}
          </div>

          {/* open review */}
          <div className='mt-10'>
            <h1 className='text-lg mt-1 font-bold '>
              {t("professorReportDialog.detailsLabel")}
            </h1>
            <Textarea
              className='ps-8 pt-4 mt-3 text-foreground bg-input rounded-lg  border-none focus:outline-none placeholder:text-muted-foreground focus-visible:outline-none transition focus-visible:ring-2 focus-visible:ring-ring'
              rows={4}
              placeholder={t("professorReportDialog.detailsPlaceholder")}
              value={data.details}
              aria-label={t("professorReportDialog.detailsPlaceholder")}
              onChange={(e) => {
                setData({
                  ...data,
                  details: e.currentTarget.value,
                });
              }}
            />
          </div>
          {isError && error instanceof AxiosError && (
            <div className='mt-2'>
              <p className='font-bold text-red-600'>
                {error.response?.data?.error || "Semething went wrong"}
              </p>
            </div>
          )}
          {/* submit */}
          <div className='block md:flex  flex-wrap md:flex-row sm:flex-col gap-2 mt-5'>
            <div className='flex-1'>
              <div className='flex items-center gap-2'>
                <Input
                  type='checkbox'
                  id='terms-checkbox'
                  style={{ border: "0.538px solid #C4C4C4" }}
                  className='w-6 h-6 rounded '
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                  }}
                />
                <label htmlFor='terms-checkbox' className='font-bold'>
                  {t("courseDialog.terms")}
                </label>
              </div>
            </div>
            <div className='flex-1  sm:w-100  mt-5 md:mt-0'>
              {/* submit and cancel */}
              <div className='flex items-center justify-end gap-2'>
                <Button
                  variant='default'
                  className='font-light px-8 flex gap-2'
                  disabled={!validate() || !termsAccepted || isLoading}
                  onClick={submitHandler}
                >
                  {isLoading && (
                    <Image
                      src='/dev/loader.gif'
                      width={15}
                      height={15}
                      className='object-cover'
                      alt='loading'
                    />
                  )}
                  {t("courseDialog.post")}
                </Button>
                <Button
                  variant='outline'
                  className='border-0 shadow-none px-8'
                  onClick={() => {
                    setData(initialData);
                    onClose();
                  }}
                >
                  {t("courseDialog.cancel")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
