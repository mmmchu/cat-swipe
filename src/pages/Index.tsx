import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cat } from "lucide-react";
import { CatCard } from "../components/CatCard";
import SwipeButtons from "../components/SwipeButtons";
import Summary from "../components/Summary";
import { Box, Container, Stack, Title, Text, Button } from "@mantine/core";

const TOTAL_CATS = 10;
const CATS_PER_PAGE = 10;

const Index = () => {
  const [cats, setCats] = useState<string[]>(() =>
    Array.from(
      { length: TOTAL_CATS },
      (_, i) => `https://cataas.com/cat?${Date.now()}-${i}`
    )
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedCats, setLikedCats] = useState<string[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const isSwipingRef = useRef(false);

  const loadCats = (page: number = 1) => {
    const newCats = Array.from(
      { length: CATS_PER_PAGE },
      (_, i) => `https://cataas.com/cat?${Date.now()}-${page}-${i}`
    );
    setCats(newCats);
    setCurrentIndex(0);
    setLikedCats([]);
    setShowSummary(false);
    setCurrentPage(page);
  };

  const loadMoreCats = () => {
    const nextPage = currentPage + 1;
    const newCats = Array.from(
      { length: CATS_PER_PAGE },
      (_, i) => `https://cataas.com/cat?${Date.now()}-${nextPage}-${i}`
    );
    setCats((prev) => [...prev, ...newCats]);
    setCurrentPage(nextPage);
  };

  const refreshCurrentImage = () => {
    const newCats = [...cats];
    newCats[currentIndex] = `https://cataas.com/cat?${Date.now()}-refresh-${currentIndex}`;
    setCats(newCats);
  };

  const handleSwipe = (direction: "left" | "right") => {
    if (isSwipingRef.current) return;
    isSwipingRef.current = true;

    if (direction === "right") {
      setLikedCats((prev) => [...prev, cats[currentIndex]]);
    }

    const isLast = currentIndex >= cats.length - 1;

    if (isLast) {
      setShowSummary(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }

    setTimeout(() => {
      isSwipingRef.current = false;
    }, 500);
  };

  const handleRestart = () => loadCats();

  if (showSummary) {
    return <Summary likedCats={likedCats} onRestart={handleRestart} />;
  }

  return (
    <Box
      style={{
        position: "relative",
        minHeight: "100vh",
   backgroundColor: "#E5F3FD",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        paddingBottom: "100px",
        overflowX: "hidden",
        width: "100%",
      }}
    >
      <Container size="sm" style={{ textAlign: "center", marginBottom: "2rem" }}>
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <Stack gap="xs" align="center">
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
              }}
            >
              <Cat className="h-6 w-6 md:h-8 md:w-8" style={{ color: "#2563eb" }} />
              <Title
                order={1}
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 2rem)",
                  color: "#2563eb",
                }}
              >
                Cat Matching
              </Title>
            </Box>
            <Text c="dimmed" size="sm" style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)" }}>
              Swipe to find your favourite cats
            </Text>
            <Text c="dimmed" size="xs" style={{ fontSize: "clamp(0.75rem, 2vw, 0.875rem)" }}>
              {cats.length - currentIndex} cats remaining
            </Text>
          </Stack>
        </motion.div>
      </Container>

      {currentIndex >= cats.length - 3 && cats.length - currentIndex > 0 && (
        <Box style={{ marginBottom: "1rem", display: "flex", justifyContent: "center" }}>
          <Button onClick={loadMoreCats} variant="light" size="sm">
            Load More Cats
          </Button>
        </Box>
      )}

      <Box
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "min(400px, 50vh)",
          maxHeight: "70vh",
          flex: 1,
          overflow: "hidden",
        }}
      >
        <AnimatePresence initial={false}>
          {Array.from({ length: Math.min(3, cats.length - currentIndex) }, (_, i) => {
            const actualIndex = currentIndex + i;
            const url = cats[actualIndex];

            return (
              <CatCard
                key={`${url}-${actualIndex}`}
                imageUrl={url}
                onSwipe={handleSwipe}
                isTop={i === 0}
                stackIndex={i}
                onRefresh={i === 0 ? refreshCurrentImage : undefined}
              />
            );
          })}
        </AnimatePresence>
      </Box>

      <Box
        component={motion.div}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          position: "fixed",
          bottom: "1rem",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          padding: "0 1rem",
        }}
      >
        <SwipeButtons
          onLike={() => handleSwipe("right")}
          onDislike={() => handleSwipe("left")}
        />
      </Box>
    </Box>
  );
};

export default Index;
