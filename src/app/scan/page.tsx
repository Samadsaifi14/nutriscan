"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X, Zap, ZapOff, Image as ImageIcon, Keyboard, RefreshCw } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { cn } from "@/lib/utils";
import { writeScanResult } from "@/types/scanResult";
import toast from "react-hot-toast";

type Mode = "barcode" | "photo";

export default function ScanPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<Mode>("barcode");
  const [torchOn, setTorchOn] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [supported, setSupported] = useState(true);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const lastScanRef = useRef<string>("");
  const lastScanTimeRef = useRef(0);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraReady(false);
  }, []);

  const handleDetected = useCallback(async (barcode: string) => {
    const now = Date.now();
    if (barcode === lastScanRef.current && now - lastScanTimeRef.current < 5000) return;
    lastScanRef.current = barcode;
    lastScanTimeRef.current = now;

    setScanError(null);
    setScanning(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90000);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode, mode }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.status === 429) {
        setScanning(false);
        setScanError("Too many scans. Please wait a moment and try again.");
        return;
      }
      const data = await res.json();
      setScanning(false);
      if (!res.ok || data?.error) {
        setScanError(data?.error || "Scan failed. Please try again.");
        return;
      }
      if (data?.product && data?.analysis) {
        writeScanResult({ product: data.product, analysis: data.analysis, quantity: 1, alternatives: data.alternatives });
        router.replace("/results");
      } else {
        router.replace(`/correct-product?barcode=${barcode}`);
      }
    } catch (err: any) {
      clearTimeout(timeout);
      setScanning(false);
      if (err?.name === "AbortError") {
        setScanError("The product lookup took too long. Try again, or use a photo of the back label.");
      } else {
        setScanError("Scan failed. Please try again.");
      }
    }
  }, [mode, router]);

  useEffect(() => {
    if (!("BarcodeDetector" in window)) {
      setSupported(false);
      return;
    }
    let stream: MediaStream | undefined;
    let raf: number;
    let detecting = false;
    let lastFrameAt = 0;

    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })
      .then((s) => {
        stream = s;
        streamRef.current = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play().then(() => setCameraReady(true)).catch(() => setSupported(false));
        }
        // @ts-expect-error - BarcodeDetector not in lib.dom.d.ts
        const detector = new BarcodeDetector({
          formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "code_39"],
        });

        const tick = async (now: number) => {
          if (videoRef.current && videoRef.current.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && !detecting && now - lastFrameAt >= 120) {
            detecting = true;
            lastFrameAt = now;
            try {
              const codes = await detector.detect(videoRef.current);
              if (codes.length > 0) {
                stopCamera();
                handleDetected(codes[0]!.rawValue);
                return;
              }
            } catch {
              /* frame not ready — keep polling */
            } finally {
              detecting = false;
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
      if (streamRef.current === stream) streamRef.current = null;
    };
  }, [handleDetected, stopCamera]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  async function toggleTorch() {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;
    try {
      const capabilities = track.getCapabilities?.() as MediaTrackCapabilities & { torch?: boolean };
      if (!capabilities?.torch) return toast.error("Flash is not available on this camera.");
      const next = !torchOn;
      await track.applyConstraints({ advanced: [{ torch: next } as MediaTrackConstraintSet] });
      setTorchOn(next);
    } catch {
      toast.error("Could not change the flash setting.");
    }
  }

  async function handlePhotoCapture(blob: Blob) {
    const formData = new FormData();
    formData.append("image", blob, "capture.jpg");
    setScanning(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90000);
    try {
      const res = await fetch("/api/scan-product-photo", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.status === 429) {
        setScanning(false);
        toast.error("Too many scans. Please wait and try again.");
        return;
      }
      const data = await res.json();
      setScanning(false);
      if (!res.ok || data?.error) {
        toast.error(data?.error || "Photo scan failed");
        return;
      }
      if (data?.product && data?.analysis) {
        writeScanResult({ product: data.product, analysis: data.analysis, quantity: 1, alternatives: data.alternatives });
        router.replace("/results");
      } else {
        toast.error("Could not identify product from photo");
      }
    } catch (err: any) {
      clearTimeout(timeout);
      setScanning(false);
      if (err?.name === "AbortError") {
        toast.error("Analysis took too long. Try a clearer photo or scan the barcode.");
      } else {
        toast.error("Photo scan failed");
      }
    }
  }

  return (
    <PageShell variant="fullscreen">
      <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover" muted playsInline />
      <div className="absolute inset-0 bg-black/35" />

      {scanning && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60">
          <RefreshCw size={40} className="text-cream animate-spin mb-4" />
          <p className="text-cream text-body font-semibold">Analyzing product…</p>
          <p className="text-sand text-xs mt-1">Looking up the product and label details…</p>
        </div>
      )}

      <div className="absolute inset-x-0 top-0 z-10 row px-page pt-[calc(var(--safe-top)+12px)]" style={{ justifyContent: "space-between" }}>
        <button onClick={() => router.back()} aria-label="Close scanner" className="icon-btn glass rounded-full">
          <X size={20} className="text-cream" />
        </button>
        <button
          onClick={toggleTorch}
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
      {scanError && (
        <div className="absolute inset-x-0 top-16 z-10 px-page text-center">
          <p className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(192,64,40,0.9)', color: '#fff' }}>{scanError}</p>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 stack--md px-page pb-[calc(var(--safe-bottom)+28px)]">
        <p className="text-center text-cream text-sm">{cameraReady ? "Align the barcode within the frame" : "Starting camera…"}</p>

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
