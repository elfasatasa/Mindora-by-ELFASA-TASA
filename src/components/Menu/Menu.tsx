'use client'
import Link from "next/link";
import Image from "next/image";

import logotype from "../../../public/assets/img/elfasatasa.png"

import styles from "./Menu.module.scss"
import { useSession } from "next-auth/react";

export default function Menu() {
    const {data:session,status} = useSession()

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
                            <Link href={"/"}>Main</Link>
                        </li>
                        <li>
                            <Link href={"/create"}>Create</Link>
                        </li>
                        <li>
                            <Link href={"/pricing"}>Pricing</Link>
                        </li>
                    </ul>
                </menu>
                <div>  <li>
                    <Link href={status ? "/profile": "/register"}>  <svg
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
                            <Link href={"/"}>Main</Link>
                        </li>
                        <li>
                            <Link href={"/create"}>Create</Link>
                        </li>
                        <li>
                            <Link href={"/pricing"}>Pricing</Link>
                        </li>
                    </ul>
                </menu>
            </div>
        </div>
    )
}