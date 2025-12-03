import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Heart, X, RefreshCw } from "lucide-react";
import type { PanInfo } from "framer-motion";
import { Card, Loader, Center, Text, Button } from "@mantine/core";

interface CatCardProps {
  imageUrl: string;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
  stackIndex?: number; // 0 = top card, 1 = second card, etc.
  onRefresh?: () => void; // Callback to refresh the image
}

export const CatCard = ({
  imageUrl,
  onSwipe,
  isTop,
  stackIndex = 0,
  onRefresh,
}: CatCardProps) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  // For top card, use drag-based opacity; for cards behind, use static opacity
  const dragOpacity = useTransform(
    x,
    [-200, -100, 0, 100, 200],
    [0, 1, 1, 1, 0]
  );
  const staticOpacity = Math.max(0.4, 0.7 - stackIndex * 0.15);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const dislikeOpacity = useTransform(x, [-100, 0], [1, 0]);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageKey, setImageKey] = useState(0); // Key to force image reload
  const [refreshTimestamp, setRefreshTimestamp] = useState(0);
  const prevImageUrlRef = useRef<string>(imageUrl);

  // Reset exit direction and loading state when imageUrl changes (new card)
  useEffect(() => {
    // Only reset if imageUrl actually changed
    if (prevImageUrlRef.current !== imageUrl) {
      prevImageUrlRef.current = imageUrl;

      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setImageKey(0); // Reset image key when URL changes
        setRefreshTimestamp(0); // Reset refresh timestamp
        setExitDirection(null);
        setIsLoading(true);
        setHasError(false);
        x.set(0);
      }, 0);
    }

    // Timeout fallback for images that take too long to load
    // Only set error if still loading after timeout
    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (isLoading && !hasError) {
      timeoutId = setTimeout(() => {
        if (isMounted && isLoading) {
          setIsLoading(false);
          setHasError(true);
        }
      }, 15000); // Increased to 15 second timeout
    }

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [imageUrl, x, isLoading, hasError]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setHasError(false);
    setImageKey((prev) => prev + 1); // Force image reload by changing key
    setRefreshTimestamp(Date.now()); // Store timestamp for cache busting
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    // Prevent handling if already exiting
    if (exitDirection) return;

    const { x: offsetX } = info.offset;
    const { x: velocityX } = info.velocity;
    const threshold = 50; // Lower threshold for easier swiping
    const velocityThreshold = 500; // Velocity threshold for quick swipes

    // Check if user swiped far enough or with enough velocity
    if (
      Math.abs(offsetX) > threshold ||
      Math.abs(velocityX) > velocityThreshold
    ) {
      // Direction logic:
      // - offsetX > 0 means dragged to the RIGHT (positive x direction) = LIKE
      // - offsetX < 0 means dragged to the LEFT (negative x direction) = DISLIKE
      // When swiping RIGHT (like), card should exit to the RIGHT (positive x: 1000)
      // When swiping LEFT (dislike), card should exit to the LEFT (negative x: -1000)
      const direction = offsetX > 0 ? "right" : "left";

      // Set exit direction immediately - this disables drag and triggers exit animation
      setExitDirection(direction);

      // Call onSwipe after a brief delay to ensure state updates
      setTimeout(() => {
        onSwipe(direction);
      }, 10);
    } else {
      // If not swiped far enough, snap back to center smoothly
      x.set(0);
    }
  };

  // Calculate stack styling for cards behind
  const stackOffset = stackIndex * 8; // Offset in pixels for each card behind
  const stackScale = 1 - stackIndex * 0.05; // Slightly smaller for each card behind
  const stackZIndex = 10 - stackIndex; // Lower z-index for cards behind

  return (
    <motion.div
      drag={isTop && !exitDirection ? "x" : false}
      dragElastic={0.1}
      dragMomentum={false}
      dragDirectionLock={true}
      dragConstraints={{ left: -1000, right: 1000 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: "grabbing" }}
      animate={
        exitDirection
          ? {
              x: exitDirection === "right" ? 1000 : -1000,
              opacity: 0,
              scale: 0.8,
              transition: {
                duration: 0.3,
                ease: "easeIn",
                x: { duration: 0.3, ease: "easeIn" },
              },
            }
          : {
              scale: stackIndex === 0 ? 1 : stackScale,
              y: stackIndex === 0 ? 0 : stackOffset,
              transition: {
                duration: 0.2,
                type: "spring",
                stiffness: 400,
                damping: 25,
              },
            }
      }
      style={{
        x,
        rotate,
        opacity: stackIndex === 0 ? dragOpacity : staticOpacity,
        zIndex: stackZIndex,
        width: "min(320px, 85vw)",
        height: "min(400px, 70vh)",
        maxWidth: "100%",
        position: "absolute",
        cursor: isTop ? "grab" : "default",
        touchAction: isTop && !exitDirection ? "pan-x" : "auto",
      }}
      exit={{
        x: exitDirection === "right" ? 1000 : -1000,
        opacity: 0,
        scale: 0.8,
        transition: {
          duration: 0.3,
          ease: "easeIn",
        },
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
          pointerEvents: "auto",
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
              pointerEvents: "none",
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
              gap: "1rem",
              pointerEvents: "none",
            }}
          >
            <Text c="dimmed" size="sm">
              Failed to load image
            </Text>
            {isTop && (
              <Button
                leftSection={<RefreshCw size={16} />}
                onClick={handleRefresh}
                size="sm"
                variant="light"
                style={{ pointerEvents: "auto" }}
              >
                Retry
              </Button>
            )}
          </Center>
        )}

        {/* Cat Image */}
        <img
          key={`${imageUrl}-${imageKey}`}
          src={`${imageUrl}${
            refreshTimestamp > 0 ? `&retry=${refreshTimestamp}` : ""
          }`}
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
