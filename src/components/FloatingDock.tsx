"use client";

import React, { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";

export interface DockIconProps {
  mouseX?: MotionValue<number>;
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const DockIcon: React.FC<DockIconProps> = ({
  mouseX,
  href,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const defaultMouseX = useMotionValue(Infinity);

  const iconSize = 168
  const iconMagnification = 300;
  const iconDistance = 320;

  const distance = useTransform(mouseX ?? defaultMouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(
    distance,
    [-iconDistance, 0, iconDistance],
    [iconSize, iconMagnification, iconSize]
  );

  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const isLink = href && href !== "#";

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className="flex aspect-square items-center justify-center rounded-2xl bg-white/90 dark:bg-gray-800/90 shadow-lg hover:shadow-xl transition-shadow backdrop-blur-sm dark:border-gray-700/50 overflow-hidden"
    >
      {isLink ? (
        <Link
          href={href}
          className="flex h-full w-full items-center justify-center"
        >
          {children}
        </Link>
      ) : (
        <div className="flex h-full w-full items-center justify-center cursor-default">
          {children}
        </div>
      )}
    </motion.div>
  );
};

interface DockProps {
  children: React.ReactNode;
}

export const FloatingDock: React.FC<DockProps> = ({ children }) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="flex h-[96px] items-center gap-4"
      
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === DockIcon) {
          return React.cloneElement(
            child as React.ReactElement<DockIconProps>,
            {
              ...(child.props as DockIconProps),
              mouseX: mouseX,
            }
          );
        }
        return child;
      })}
    </motion.div>
  );
};
