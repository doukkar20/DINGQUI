"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  title: string;
  imageAlt?: string;
  images: string[];
};

export function ProductGallery({ title, imageAlt, images }: ProductGalleryProps) {
  const [active, setActive] = useState(images[0] || "");

  return (
    <div className="grid gap-4">
      <motion.div
        className="relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {active ? (
          <Image src={active} alt={imageAlt || title} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain p-8" />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#111] text-muted">
            Image unavailable
          </div>
        )}
      </motion.div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(image)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border bg-white transition",
                active === image ? "border-gold shadow-[0_0_30px_rgba(212,175,55,0.28)]" : "border-white/10 opacity-70 hover:opacity-100",
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image src={image} alt={`${imageAlt || title} ${index + 1}`} fill sizes="120px" className="object-contain p-2" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
