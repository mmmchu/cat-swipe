import { motion, useMotionValue, useTransform} from "framer-motion";
import { Heart, X } from "lucide-react";
import type { PanInfo } from "framer-motion";
import { useState } from "react";

interface CatCardProps {
  imageUrl: string;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
}

export const CatCard = ({ imageUrl, onSwipe, isTop }: CatCardProps) => {
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const dislikeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      const direction = info.offset.x > 0 ? "right" : "left";
      setExitDirection(direction);
      onSwipe(direction);
    }
  };

  return (
    <motion.div
      className="absolute inset-0 flex justify-center items-center cursor-grab active:cursor-grabbing"
      style={{
        x,
        rotate,
        opacity,
        zIndex: isTop ? 10 : 5,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={
        exitDirection
          ? {
              x: exitDirection === "right" ? 500 : -500,
              opacity: 0,
              transition: { duration: 0.3 },
            }
          : {}
      }
    >
      {/* Card container */}
      <motion.div
        className="flex justify-center items-center rounded-3xl bg-white shadow-lg relative overflow-hidden"
        style={{
          width: 320,      // Adjust container width
          height: 400,     // Adjust container height
        }}
      >
        {/* Image */}
        <motion.img
          src={imageUrl}
          alt="Cat"
          draggable={false}
          loading="lazy"
          className="object-cover w-full h-full"
        />

        {/* Like overlay */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-3xl"
        >
          <Heart className="h-16 w-16 fill-green-500 stroke-green-500" />
        </motion.div>

        {/* Dislike overlay */}
        <motion.div
          style={{ opacity: dislikeOpacity }}
          className="absolute inset-0 flex items-center justify-center bg-red-500/20 rounded-3xl"
        >
          <X className="h-16 w-16 stroke-red-500 stroke-[3]" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
