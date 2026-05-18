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
        data-cursor-product
        className="metal-border relative aspect-square overflow-hidden rounded-lg bg-[radial-gradient(circle_at_center,#ffffff,#eef0f3)] shadow-[0_30px_90px_rgba(17,24,39,0.24)]"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {active ? (
          <Image src={active} alt={imageAlt || title} fill preload loading="eager" sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain p-8 drop-shadow-[0_24px_24px_rgba(17,24,39,0.2)]" />
        ) : (
          <div className="flex h-full items-center justify-center bg-light-gray text-muted">
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
                active === image ? "border-orange shadow-[0_0_30px_rgba(249,115,22,0.22)]" : "border-gray-200 opacity-70 hover:opacity-100",
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
