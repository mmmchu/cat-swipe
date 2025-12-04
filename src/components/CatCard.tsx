import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Heart, X, RefreshCw } from "lucide-react";
import type { PanInfo } from "framer-motion";
import { Card, Loader, Center, Text, Button } from "@mantine/core";

interface CatCardProps {
  imageUrl: string;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
  stackIndex?: number;
  onRefresh?: () => void;
  nextImages?: string[];
}

function useImagePreloader(url: string) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!url) return;

    setLoaded(false);
    setError(false);

    const img = new Image();
    img.src = url;
    img.onload = () => setLoaded(true);
    img.onerror = () => setError(true);

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [url]);

  return { loaded, error };
}

export const CatCard = ({
  imageUrl,
  onSwipe,
  isTop,
  stackIndex = 0,
  onRefresh,
  nextImages = [],
}: CatCardProps) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const dragOpacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const dislikeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const staticOpacity = stackIndex === 0 ? 1 : Math.max(0.6, 0.9 - stackIndex * 0.1);

  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);
  const [imageKey, setImageKey] = useState(0);
  const [refreshTimestamp, setRefreshTimestamp] = useState(0);
  const prevImageUrlRef = useRef<string>(imageUrl);

  const { loaded, error } = useImagePreloader(
    refreshTimestamp > 0 ? `${imageUrl}&retry=${refreshTimestamp}` : imageUrl
  );

  useEffect(() => {
    nextImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [nextImages]);

  useEffect(() => {
    if (prevImageUrlRef.current !== imageUrl) {
      prevImageUrlRef.current = imageUrl;
      x.set(0);
      setExitDirection(null);
      setImageKey(0);
      setRefreshTimestamp(0);
    }
  }, [imageUrl, x]);

  const handleRefresh = () => {
    setImageKey((prev) => prev + 1);
    setRefreshTimestamp(Date.now());
    onRefresh?.();
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (exitDirection) return;

    const { offset, velocity } = info;
    const threshold = 50;
    const velocityThreshold = 500;

    if (Math.abs(offset.x) > threshold || Math.abs(velocity.x) > velocityThreshold) {
      const currentX = x.get();
      const direction = currentX > 0 ? "right" : "left";
      setExitDirection(direction);
      setTimeout(() => onSwipe(direction), 50);
    } else {
      x.set(0);
    }
  };

  const stackZIndex = 10 - stackIndex;

  const isInteractiveTopCard = isTop && loaded && !exitDirection && !error;

  return (
    <motion.div
      drag={isInteractiveTopCard ? "x" : false}
      dragElastic={0.1}
      dragMomentum={false}
      dragDirectionLock={true}
      dragConstraints={{ left: -1000, right: 1000 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: "grabbing" }}
      style={{
        x,
        rotate,
        opacity: stackIndex === 0 ? dragOpacity : staticOpacity,
        zIndex: stackZIndex,
        width: "min(320px, 85vw)",
        height: "min(400px, 70vh)",
        maxWidth: "100%",
        position: "absolute",
        cursor: isInteractiveTopCard ? "grab" : "default",
        pointerEvents: isInteractiveTopCard ? "auto" : "none",
        touchAction: isInteractiveTopCard ? "pan-x" : "none",
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
        {!loaded && !error && (
          <Center
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#f3f4f6",
              zIndex: 1,
              pointerEvents: "none",
            }}
          >
            <Loader size="lg" color="blue" />
          </Center>
        )}

        {error && (
          <Center
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#f3f4f6",
              zIndex: 1,
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <Text c="dimmed" size="sm">
              Failed to load image
            </Text>
            {isTop && (
              <Button leftSection={<RefreshCw size={16} />} onClick={handleRefresh} size="sm" variant="light">
                Retry
              </Button>
            )}
          </Center>
        )}

        {loaded && !error && (
          <img
            key={`${imageUrl}-${imageKey}`}
            src={imageUrl}
            alt="Cat"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "16px", pointerEvents: "none" }}
          />
        )}

        {isInteractiveTopCard && (
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
            <Heart className="h-16 w-16 fill-green-500 stroke-green-500" />
          </motion.div>
        )}

        {isInteractiveTopCard && (
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
            <X className="h-16 w-16 stroke-red-500 stroke-[3]" />
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};
