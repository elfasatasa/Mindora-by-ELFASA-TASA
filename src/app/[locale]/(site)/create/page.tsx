'use client'

import { useSession } from "next-auth/react"
import styles from "./Create.module.scss"
import Link from "next/link"
import { useState } from "react"

export default function Create() {
  const { status } = useSession()
  const [nameTest, setNameTest] = useState<string>("")

  if (status === "unauthenticated")
    return <Link href={"/register"}>Go to Register</Link>

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Убираем лишние пробелы и ограничиваем длину
    if (value.length <= 10) {
      setNameTest(value)
    }
  }

  const isValid = nameTest.trim().length > 0 && nameTest.trim().length <= 10

  return (
    <div className={styles.container}>
      <div className={styles.create}>
        <input
          type="text"
          placeholder="Enter name"
          value={nameTest}
          onChange={handleChange}
          maxLength={10}
          className={!isValid && nameTest ? styles.invalid : ""}
        />
        <button disabled={!isValid}>Create</button>
      </div>
    </div>
  )
}
