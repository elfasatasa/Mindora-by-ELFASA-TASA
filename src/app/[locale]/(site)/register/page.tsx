'use client'

import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import $api from "@/hooks/api"
import styles from "./Register.module.scss"

export default function RegisterPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [userSynced, setUserSynced] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await signIn("google", { redirect: false })
    setLoading(false)
  }

  useEffect(() => {
    const syncUser = async () => {
      if (session?.user && !userSynced) {
        try {
          await $api.post("/users/create", {
            name: session.user.name,
            email: session.user.email,
          })
        } catch {
          console.error("error")
        } finally {
          setUserSynced(true)
          router.push("/")
        }
      }
    }

    if (status === "authenticated") {
      syncUser()
    }
  }, [status, session, router, userSynced])

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <button
        className={styles.reg__btn}
        onClick={handleLogin}
        disabled={loading || status === "loading"}
      >
        {loading ? "Loading..." : "Sign in with Google"}
      </button>

    
    </div>
  )
}
