"use client";

import { usePathname, useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import { motion } from "framer-motion";

const HIDDEN = ["/scan", "/auth", "/signin"];

export function FloatingScanButton() {
  const pathname = usePathname();
  const router = useRouter();

  if (HIDDEN.some((p) => pathname.startsWith(p))) return null;

  return (
    <motion.button
      onClick={() => router.push("/scan")}
      aria-label="Scan a product"
      className="fixed z-fab left-1/2 flex items-center justify-center rounded-full"
      style={{
        width: "var(--fab-size)",
        height: "var(--fab-size)",
        bottom: "calc(var(--nav-h) - var(--fab-lift) + var(--safe-bottom))",
        marginLeft: "calc(var(--fab-size) / -2)",
        background: "var(--clay)",
        border: "6px solid var(--bg)",
        boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
      }}
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.04 }}
    >
      <Camera size={24} color="#1a1108" strokeWidth={2.3} />
    </motion.button>
  );
}
