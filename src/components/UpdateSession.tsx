/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function UpdateSession() {
  const { update } = useSession();

  useEffect(() => {
    update({ isVerified: true });
  }, []);
  return null;
}
