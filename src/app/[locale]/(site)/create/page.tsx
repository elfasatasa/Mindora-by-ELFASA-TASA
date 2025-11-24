'use client'

import $api from "@/hooks/api"
import { IUser } from "@/types/users"
import { ITest } from "@/types/tests"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useState, useEffect } from "react"

import styles from './Create.module.scss'
import { useRouter } from "next/navigation"

export default function Create() {
   const router = useRouter()
  const { data: session, status } = useSession()
  const [userData, setUserData] = useState<IUser>()
  const [userTestName, setUserSetname] = useState<string>("")
  const [userTests, setUserTests] = useState<ITest[]>([])
  const [loading, setLoading] = useState(false)

  if (status === "unauthenticated")
    return <Link href={"/register"}>Go to Register</Link>

  // ------------------------------
  // FETCH USER DATA
  // ------------------------------
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.email) return

      try {
        const res = await $api.post("users/get-with-email", {
          email: session.user.email
        })
        setUserData(res.data)
      } catch {
        console.error("Error fetching user data")
      }
    }

    const fetchUserTests = async () => {
      if (!session?.user?.email) return

      try {
        const res = await $api.post("tests/get-test-with-email", {
          email: session.user.email
        })
        if (res.data.success) {
          setUserTests(res.data.tests)
        }
      } catch {
        console.error("Error fetching tests")
      }
    }

    if (session?.user?.email) {
      fetchUserData()
      fetchUserTests()
    }
  }, [session?.user?.email])

  // ------------------------------
  // CREATE TEST
  // ------------------------------
  const createTest = async () => {
    if (!userTestName.trim() || !session?.user?.email) return
    setLoading(true)

    try {
      const res = await $api.post("tests/new-create", {
        test_name: userTestName,
        email: session.user.email
      })

      if (res.data.success) {
        const newTest = { test_id: res.data.test_id, test_name: userTestName } as ITest

        setUserData(prev =>
          prev
            ? { ...prev, draft: prev.draft - 1, user_tests: [...prev.user_tests, newTest] }
            : prev
        )
        setUserTests(prev => [newTest, ...prev])
        setUserSetname("")
      }
    } catch (err) {
      console.error("Create test error:", err)
    }

    setLoading(false)
  }

  // ------------------------------
  // EDIT TEST
  // ------------------------------
const edit = async (test_id: string) => {
  router.push(`/create/${test_id}`)
}

  // ------------------------------
  // DELETE TEST
  // ------------------------------
  const deleteTest = async (test_id: string) => {
    if (!confirm("Are you sure you want to delete this test?")) return

    try {
      const res = await $api.post("tests/test-delete", {
        test_id,
        email: session?.user?.email
      })

      if (res.data.success) {
        // Удаляем тест
        setUserTests(prev => prev.filter(t => t.test_id !== test_id))

        // Возвращаем draft +1
        setUserData(prev =>
          prev ? { ...prev, draft: prev.draft + 1 } : prev
        )
      }
    } catch (err) {
      console.error("Delete test error:", err)
    }
  }

  return (
    <div className={styles.container}>
      <div>Draft {userData?.draft}</div>
      <br />
      <div className={styles.userDraft}>
        <input
          type="text"
          maxLength={14}
          value={userTestName}
          onChange={(e) => setUserSetname(e.target.value)}
          placeholder="Test name..."
        />
        <button
          disabled={userData?.draft! <= 0 || loading}
          onClick={createTest}
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>

      <br />
      <hr />
      <h3>Your Tests:</h3>
      <br />
      <div className={styles.userTests}>
        {userTests.length === 0 && <div>No tests created yet</div>}
        {userTests.map(test => (
          <div key={test.test_id} style={{ display: 'flex', justifyContent: "space-between" }}>
            <div className={styles.testName}>{test.test_name}</div>
            <div className={styles.testActions} style={{ marginBottom: 20 }}>
              <button onClick={() => deleteTest(test.test_id)}>Del</button>
              <button onClick={() => edit(test.test_id)}>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
