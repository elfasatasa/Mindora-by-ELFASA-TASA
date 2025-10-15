'use client'
import { useSession } from "next-auth/react"
import Link from "next/link"



export default function WorkSpace () {
    const {data,status} = useSession()
if(status == "unauthenticated") return <Link href={"/register"}>Go to Register</Link>
    return (
        <div>Work space</div>
    )
}