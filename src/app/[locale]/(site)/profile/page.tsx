'use client'

import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Image from "next/image"

import styles from "./Profile.module.scss"

export default function Profile() {
  const { data, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/register")
    }
  }, [status, router])

  if (!data?.user) return null

  const avatar = data.user.image || "/default-avatar.png" // ✅ запасной аватар

  return (
    <div>
      <div className={styles.user__profile}>
        <div className={styles.user__info}>
          <Image
            src={avatar}
            alt={data.user.name || "User avatar"}
            width={40}
            height={40}
          />
          {data.user.name}
        </div>
        <button className={styles.btn} onClick={() => signOut()}>Sign out</button>
      </div>
      <br />


    </div>
  )
}
