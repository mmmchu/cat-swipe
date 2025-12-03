import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cat } from "lucide-react";
import { CatCard } from "../components/CatCard";
import SwipeButtons from "../components/SwipeButtons";
import Summary from "../components/Summary";
import { Box, Container, Stack, Title, Text } from "@mantine/core";

const TOTAL_CATS = 10;

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

  const loadCats = () => {
    const newCats = Array.from(
      { length: TOTAL_CATS },
      (_, i) => `https://cataas.com/cat?${Date.now()}-${i}`
    );

    setCats(newCats);
    setCurrentIndex(0);
    setLikedCats([]);
    setShowSummary(false);
  };

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      setLikedCats((prev) => [...prev, cats[currentIndex]]);
    }

    if (currentIndex < cats.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowSummary(true);
    }
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
        backgroundColor: "#f9fafb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        paddingBottom: "100px",
      }}
    >
      {/* Header */}
      <Container size="sm" style={{ textAlign: "center", marginBottom: "2rem" }}>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
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
                Purrfect Match
              </Title>
            </Box>
            <Text c="dimmed" size="sm" style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)" }}>
              Swipe to find your favourite cats
            </Text>
          </Stack>
        </motion.div>
      </Container>

      {/* Card Stack */}
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
        }}
      >
        <AnimatePresence mode="popLayout">
          {cats[currentIndex] !== undefined && (
            <CatCard
              key={`${cats[currentIndex]}-${currentIndex}`}
              imageUrl={cats[currentIndex]}
              onSwipe={handleSwipe}
              isTop={true}
            />
          )}
        </AnimatePresence>
      </Box>

      {/* Buttons */}
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
