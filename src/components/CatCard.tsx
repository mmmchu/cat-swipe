import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Heart, X } from "lucide-react";
import type { PanInfo } from "framer-motion";
import { Card, Loader, Center, Text } from "@mantine/core";

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
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Reset exit direction and loading state when imageUrl changes (new card)
  useEffect(() => {
    setExitDirection(null);
    setIsLoading(true);
    setHasError(false);
    x.set(0);

    // Timeout fallback for images that take too long to load
    let isMounted = true;
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        setIsLoading(false);
        setHasError(true);
      }
    }, 10000); // 10 second timeout

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [imageUrl, x]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const { x: offsetX } = info.offset;
    if (Math.abs(offsetX) > 100) {
      const direction = offsetX > 0 ? "right" : "left";
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
        width: "min(320px, 85vw)",
        height: "min(400px, 70vh)",
        maxWidth: "100%",
        position: "absolute",
        cursor: isTop ? "grab" : "default",
      }}
      drag={isTop ? "x" : false}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: "grabbing" }}
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
        {/* Loading State */}
        {isLoading && (
          <Center
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#f3f4f6",
              zIndex: 1,
            }}
          >
            <Loader size="lg" color="blue" />
          </Center>
        )}

        {/* Error State */}
        {hasError && (
          <Center
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#f3f4f6",
              zIndex: 1,
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <Text c="dimmed" size="sm">
              Failed to load image
            </Text>
          </Center>
        )}

        {/* Cat Image */}
        <img
          src={imageUrl}
          alt="Cat"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
            display: isLoading || hasError ? "none" : "block",
          }}
        />

        {/* Like Overlay */}
        {!isLoading && !hasError && (
          <motion.div
            style={{
              opacity: likeOpacity,
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(34, 197, 94, 0.2)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          >
            <Heart className="h-12 w-12 md:h-16 md:w-16 fill-green-500 stroke-green-500" />
          </motion.div>
        )}

        {/* Dislike Overlay */}
        {!isLoading && !hasError && (
          <motion.div
            style={{
              opacity: dislikeOpacity,
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(239, 68, 68, 0.2)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          >
            <X className="h-12 w-12 md:h-16 md:w-16 stroke-red-500 stroke-[3]" />
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};
