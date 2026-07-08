"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X, Zap, ZapOff, Image as ImageIcon, Keyboard } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { cn } from "@/lib/utils";
import { writeScanResult } from "@/types/scanResult";

type Mode = "barcode" | "photo";

export default function ScanPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<Mode>("barcode");
  const [torchOn, setTorchOn] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [supported, setSupported] = useState(true);

  const handleDetected = useCallback(async (barcode: string) => {
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode, mode }),
      });
      const data = await res.json();
      if (data?.product && data?.analysis) {
        writeScanResult({ product: data.product, analysis: data.analysis, quantity: 1, alternatives: data.alternatives });
        router.replace("/results");
      } else {
        router.replace(`/correct-product?barcode=${barcode}`);
      }
    } catch {
      // silent
    }
  }, [mode, router]);

  useEffect(() => {
    if (!("BarcodeDetector" in window)) {
      setSupported(false);
      return;
    }
    let stream: MediaStream;
    let raf: number;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play();
        }
        // @ts-expect-error - BarcodeDetector not in lib.dom.d.ts
        const detector = new BarcodeDetector({
          formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "code_39"],
        });

        const tick = async () => {
          if (videoRef.current && videoRef.current.readyState === 4) {
            try {
              const codes = await detector.detect(videoRef.current);
              if (codes.length > 0) {
                handleDetected(codes[0]!.rawValue);
                return;
              }
            } catch {
              /* frame not ready — keep polling */
            }
          }
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      })
      .catch(() => setSupported(false));

    return () => {
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [handleDetected]);

  async function handlePhotoCapture(blob: Blob) {
    const formData = new FormData();
    formData.append("image", blob, "capture.jpg");
    try {
      const res = await fetch("/api/scan-product-photo", { method: "POST", body: formData });
      const data = await res.json();
      if (data?.product && data?.analysis) {
        writeScanResult({ product: data.product, analysis: data.analysis, quantity: 1, alternatives: data.alternatives });
        router.replace("/results");
      }
    } catch {
      // silent
    }
  }

  return (
    <PageShell variant="fullscreen">
      <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover" muted playsInline />
      <div className="absolute inset-0 bg-black/35" />

      <div className="absolute inset-x-0 top-0 z-10 row px-page pt-[calc(var(--safe-top)+12px)]" style={{ justifyContent: "space-between" }}>
        <button onClick={() => router.back()} aria-label="Close scanner" className="icon-btn glass rounded-full">
          <X size={20} className="text-cream" />
        </button>
        <button
          onClick={() => setTorchOn((v) => !v)}
          aria-label="Toggle flash"
          className={cn("icon-btn glass rounded-full", torchOn && "icon-btn--active")}
        >
          {torchOn ? <Zap size={18} className="text-clay" /> : <ZapOff size={18} className="text-cream" />}
        </button>
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="scan-frame">
          <div className="scan-corner--tl" />
          <div className="scan-corner--tr" />
          <div className="scan-corner--bl" />
          <div className="scan-corner--br" />
          <div className="scan-line" />
        </div>
      </div>

      {!supported && (
        <div className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-page text-center">
          <p className="text-cream text-body">Camera scanning isn't supported on this browser.</p>
          <p className="text-sand text-xs mt-2">Use manual entry or photo upload below instead.</p>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 stack--md px-page pb-[calc(var(--safe-bottom)+28px)]">
        <p className="text-center text-cream text-sm">Align the barcode within the frame</p>

        <div className="row" style={{ justifyContent: "center", gap: 12 }}>
          <button
            onClick={() => setMode("barcode")}
            className={cn("chip", mode === "barcode" && "chip--active")}
          >
            Barcode
          </button>
          <button
            onClick={() => setMode("photo")}
            className={cn("chip", mode === "photo" && "chip--active")}
          >
            Photo of label
          </button>
        </div>

        <div className="row" style={{ justifyContent: "center", gap: 32 }}>
          <button
            className="icon-btn glass rounded-full"
            aria-label="Upload from gallery"
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = () => {
                const file = input.files?.[0];
                if (file) handlePhotoCapture(file);
              };
              input.click();
            }}
          >
            <ImageIcon size={20} className="text-cream" />
          </button>
          <button
            onClick={() => {
              if (mode === "photo") {
                const canvas = document.createElement("canvas");
                const video = videoRef.current;
                if (!video) return;
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext("2d")?.drawImage(video, 0, 0);
                canvas.toBlob((blob) => {
                  if (blob) handlePhotoCapture(blob);
                }, "image/jpeg");
              }
            }}
            className="icon-btn glass rounded-full"
            style={{ width: 64, height: 64 }}
            aria-label="Capture"
          >
            <div style={{ width: 52, height: 52, borderRadius: "9999px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: "9999px", border: "2px solid rgba(0,0,0,0.15)" }} />
            </div>
          </button>
          <button
            onClick={() => setManualOpen(true)}
            className="icon-btn glass rounded-full"
            aria-label="Enter barcode manually"
          >
            <Keyboard size={20} className="text-cream" />
          </button>
        </div>
      </div>

      {manualOpen && (
        <div className="absolute inset-0 z-20 flex items-end bg-black/60" onClick={() => setManualOpen(false)}>
          <div className="glass w-full rounded-t-2xl p-page pb-8" onClick={(e) => e.stopPropagation()}>
            <p className="text-h3 text-cream mb-4">Enter barcode</p>
            <input
              className="input"
              inputMode="numeric"
              placeholder="e.g. 8901058851599"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleDetected((e.target as HTMLInputElement).value);
              }}
            />
          </div>
        </div>
      )}
    </PageShell>
  );
}
