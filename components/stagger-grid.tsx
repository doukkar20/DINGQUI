"use client";

import { motion } from "framer-motion";
import { Children, type ReactNode } from "react";

type StaggerGridProps = {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
};

export function StaggerGrid({ children, className, itemClassName }: StaggerGridProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-70px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
      }}
    >
      {Children.map(children, (child) => (
        <motion.div
          className={itemClassName}
          variants={{
            hidden: { opacity: 0, y: 30, scale: 0.97, filter: "blur(8px)" },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
