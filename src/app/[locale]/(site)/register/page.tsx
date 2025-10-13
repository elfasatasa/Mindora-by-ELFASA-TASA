'use client'

import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import styles from "./Register.module.scss"

export default function RegisterPage() {
  const {  status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await signIn("google", { redirect: false })

    if (result?.ok) {
      router.push("/")
    }

    setLoading(false)
  }

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/") 
    }
  }, [status, router]) 

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
