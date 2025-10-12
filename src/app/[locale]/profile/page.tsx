'use client'

import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Profile() {
  const { data, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/register")
    }
  }, [status, router])



  return (
    <>
      <div>Welcome, {data?.user?.name}


        <br />
        <button onClick={() => signOut()}>sign out</button>
      </div>
    </>
  )
}
