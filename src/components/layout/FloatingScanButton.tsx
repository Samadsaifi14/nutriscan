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
        background: "linear-gradient(155deg, var(--clay), var(--clay-dim))",
        boxShadow: "0 8px 24px -6px var(--clay-glow), 0 2px 6px rgba(0,0,0,0.4)",
      }}
      whileTap={{ scale: 0.88 }}
      animate={{
        boxShadow: [
          "0 8px 24px -6px var(--clay-glow), 0 2px 6px rgba(0,0,0,0.4)",
          "0 8px 30px -4px var(--clay-glow), 0 2px 6px rgba(0,0,0,0.4)",
          "0 8px 24px -6px var(--clay-glow), 0 2px 6px rgba(0,0,0,0.4)",
        ],
      }}
      transition={{ boxShadow: { duration: 2.4, repeat: Infinity, ease: "easeInOut" } }}
    >
      <Camera size={24} color="#1a1108" strokeWidth={2.3} />
    </motion.button>
  );
}
