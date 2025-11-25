"use client";

import $api from "@/hooks/api";
import { useRouter } from "next/navigation";
import { IUser } from "@/types/users";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface ChangeStatusProps {
  test_id: string;
}

export default function ChangeStatus({ test_id }: ChangeStatusProps) {
 
  const [open, setOpen] = useState<"local" | "public" | null>(null);
  const { data, status } = useSession();
  const [userData, setUserData] = useState<IUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/register");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!data?.user?.email) return;

      try {
        const response = await $api.post("users/get-with-email", {
          email: data.user.email,
        });
        setUserData(response.data);
      } catch {
        console.error("Error fetching user data");
      }
    };

    if (data?.user?.email) {
      fetchUserData();
    }
  }, [data?.user?.email]);

  const changeStatus = async (statusType: "local" | "public") => {
    if (!userData) return;

   confirm(`Are you sure you want to change the test status to ${statusType}?`)
   {
     try {
      const res = await $api.post("tests/change-status", {
        test_id,
        status: statusType,
        email:userData.email
      });

      if (res.data.success) {
        alert(`Status changed to ${statusType}. Expire: ${res.data.expire}`);
        // обновляем количество на клиенте
        setUserData(prev =>
          prev ? { ...prev, [statusType]: prev[statusType]! - 1 } : prev
        );
      } else {
        alert(res.data.message || "Error changing status");
      }
    } catch {
      window.location.reload();
    }
   }
  };

  return (
    <div>
      <h4>Select Status</h4>
      <div style={{ display: "flex", justifyContent: "space-between", margin: "10px 0" }}>
        <button onClick={() => setOpen(open === "local" ? null : "local")}>Local</button>
        <button onClick={() => setOpen(open === "public" ? null : "public")}>Public</button>
      </div>

      {open === "local" && (
        <div style={{ padding: 10, border: "1px solid gray", borderRadius: 6 }}>
          <h4>Local Mode</h4>
          <p>This test will be visible only to you. Other users will not be able to access it.</p>
          <p><b>Expire:</b> 30 days</p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Quantity {userData?.local}</span>
            <button disabled={userData?.local! <= 0} onClick={() => changeStatus("local")}>
              Change
            </button>
          </div>
        </div>
      )}

      {open === "public" && (
        <div style={{ padding: 10, border: "1px solid gray", borderRadius: 6 }}>
          <h4>Public Mode</h4>
          <p>This test will be available to all users on the platform.</p>
          <p><b>Expire:</b> 30 days</p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Quantity {userData?.public}</span>
            <button disabled={userData?.public! <= 0} onClick={() => changeStatus("public")}>
              Change
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
