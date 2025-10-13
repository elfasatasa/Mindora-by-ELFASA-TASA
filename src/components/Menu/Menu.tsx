'use client'
import Link from "next/link";
import Image from "next/image";

import logotype from "../../../public/assets/img/elfasatasa.png"

import styles from "./Menu.module.scss"
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function Menu() {
    const { data: session, status } = useSession()
    const t = useTranslations()

    return (
        <div>
            <br />
            <div className={styles.menu__container}>
                <div className={styles.logotype}>
                    <Image src={logotype} alt="elfasa tasa" height={40} width={40} /> &nbsp; <b>Mindora</b>
                </div>
                <menu className={styles.pc__menu}>
                    <ul>
                        <li>
                            <Link href={"/"}>{t("main")}</Link>
                        </li>
                        <li>
                            <Link href={"/create"}>{t("create")}</Link>
                        </li>
                        <li>
                            <Link href={"/workspace"}>{t("work_space")}</Link>
                        </li>
                        <li>
                            <Link href={"/pricing"}>{t("pricing")}</Link>
                        </li>
                        {session?.user.role == "admin" ? <>

                            <li>
                                <Link href={"/dashboard"}>{t("dashboard")}</Link>


                            </li>
                            <li>
                                <Link href={"/dashboard/tests"}>{t("tests")}</Link>

                            </li>
                            <li>
                                <Link href={"/dashboard/Users"}>{t("users")}</Link>
                            </li>
                        </> : ""}
                    </ul>
                </menu>
                <div>  <li>
                    <Link href={status ? "/profile" : "/register"}>  <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="white"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 12c2.67 0 8 1.34 8 4v4H4v-4c0-2.66 5.33-4 8-4zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                    </svg></Link>
                </li>
                </div>
            </div>
            <br />
            <div className={styles.mobile__menu}>
                <menu>
                    <ul>
                        <li>
                            <Link href={"/"}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                                    <path d="M12 3l8 6v12h-5v-7H9v7H4V9l8-6z" />
                                </svg>

                            </Link>
                        </li>
                        <li>
                            <Link href={"/create"}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
                                </svg>

                            </Link>
                        </li>
                        <li>
                            <Link href={"/workspace"}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                                    <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3H3V5zM3 10h18v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7zM7 13h4v4H7v-4zm6 0h4v2h-4v-2z" />
                                </svg>
                            </Link>
                        </li>

                        <li>
                            <Link href={"/pricing"}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                                    <text x="4" y="18" fontSize="18" fontWeight="bold" fill="white">$</text>
                                </svg>

                            </Link>
                        </li>

                    </ul>
                </menu>
            </div>
        </div>
    )
}