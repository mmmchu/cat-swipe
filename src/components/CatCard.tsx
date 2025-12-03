import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Heart, X } from "lucide-react";
import type { PanInfo } from "framer-motion";
import { Card, Image } from "@mantine/core";

interface CatCardProps {
  imageUrl: string;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
}

export const CatCard = ({ imageUrl, onSwipe, isTop }: CatCardProps) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const dislikeOpacity = useTransform(x, [-100, 0], [1, 0]);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(
    null
  );

  if (exitDirection !== null) {
    setExitDirection(null);
  }

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const { x } = info.offset;
    if (Math.abs(x) > 100) {
      const direction = x > 0 ? "right" : "left";
      setExitDirection(direction);
      onSwipe(direction);
    }
  };

  return (
    <motion.div
      style={{
        x,
        rotate,
        opacity,
        zIndex: isTop ? 10 : 5,
        width: 320,
        height: 400,
      }}
      drag={isTop ? "x" : false}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      className="cursor-grab active:cursor-grabbing"
      animate={
        exitDirection
          ? {
              x: exitDirection === "right" ? 500 : -500,
              opacity: 0,
              transition: { duration: 0.3 },
            }
          : { x: 0, opacity: 1 }
      }
      exit={{
        x: exitDirection === "right" ? 500 : -500,
        opacity: 0,
        transition: { duration: 0.3 },
      }}
    >
      <Card
        shadow="lg"
        radius="xl"
        p={0}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          background: "transparent",
        }}
      >
        {/* Cat Image */}
        <Image
          src={imageUrl}
          alt="Cat"
          fit="cover"
          style={{ width: "100%", height: "100%", pointerEvents: "none" }}
        />

        {/* Like Overlay */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute inset-0 flex items-center justify-center bg-green-500/20"
        >
          <Heart className="h-16 w-16 fill-green-500 stroke-green-500" />
        </motion.div>

        {/* Dislike Overlay */}
        <motion.div
          style={{ opacity: dislikeOpacity }}
          className="absolute inset-0 flex items-center justify-center bg-red-500/20"
        >
          <X className="h-16 w-16 stroke-red-500 stroke-[3]" />
        </motion.div>
      </Card>
    </motion.div>
  );
};
