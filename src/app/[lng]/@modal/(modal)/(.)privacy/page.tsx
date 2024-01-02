"use client";
export const runtime = 'edge';

import Privacy from "@/components/common/Privacy";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useModal from "@/lib/hooks/useModal";
import { useTranslation } from "@/app/i18n/client";

interface propsType {
  params: {
    lng: string;
  };
}
export default function PrivacyModal({ params: { lng } }: propsType) {
  const { t } = useTranslation(lng, "privacy");

  const [open, close] = useModal();

  return (
    <Dialog open={open} onOpenChange={close} defaultOpen>
      <DialogContent className='sm:max-w-[425px] lg:max-w-screen-lg overflow-y-scroll max-h-[50vh] min-w-[80vw]'>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <Privacy />
        </div>
        <DialogFooter>
          <Button type='submit'>{t("saveChanges")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
