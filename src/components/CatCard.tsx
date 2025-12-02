import { motion } from "framer-motion";

interface CatCardProps {
  imageUrl: string;
  onSwipe: (dir: "left" | "right") => void;
  isTop: boolean;
}

export default function CatCard({ imageUrl, onSwipe, isTop }: CatCardProps) {
  return (
    <motion.div
      className="absolute inset-0 rounded-3xl overflow-hidden shadow-xl bg-white"
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 120) onSwipe("right");
        if (info.offset.x < -120) onSwipe("left");
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.3 }}
    >
      <img src={imageUrl} className="w-full h-full object-cover" />
    </motion.div>
  );
}
