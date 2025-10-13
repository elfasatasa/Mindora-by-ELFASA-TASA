'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return
    if (status === "unauthenticated" || session?.user?.role !== "admin") {
      router.replace("/not-found") 
    }
  }, [session, status, router])

  if (status === "loading") return <p>Loading...</p>
  if (session?.user?.role !== "admin") return null

  return (
    <div>
  
      <main >{children}</main>
    </div>
  )
}
