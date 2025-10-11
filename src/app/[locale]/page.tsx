'use client'

import { signIn, signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";



export default async function Home() {
const t = useTranslations()

  return (
    <div >

{t("hello")}
     
    </div>
  );
}

