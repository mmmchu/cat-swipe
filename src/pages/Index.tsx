import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cat } from "lucide-react";
import { CatCard } from "../components/CatCard";
import SwipeButtons from "../components/SwipeButtons";
import Summary from "../components/Summary";

const TOTAL_CATS = 10;

const Index = () => {
  const [cats, setCats] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedCats, setLikedCats] = useState<string[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCats();
  }, []);

  const loadCats = () => {
    setIsLoading(true);

    const catUrls = Array.from(
      { length: TOTAL_CATS },
      (_, i) => `https://cataas.com/cat?${Date.now()}-${i}`
    );

    setCats(catUrls);
    setCurrentIndex(0);
    setLikedCats([]);
    setShowSummary(false);
    setIsLoading(false);
  };

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      setLikedCats([...likedCats, cats[currentIndex]]);
    }

    if (currentIndex < cats.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handleRestart = () => {
    loadCats();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Cat className="h-12 w-12 text-blue-600" />
        </motion.div>
      </div>
    );
  }

  if (showSummary) {
    return <Summary likedCats={likedCats} onRestart={handleRestart} />;
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Header */}
      <header className="text-center pt-8 pb-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-center gap-2 mb-2"
        >
          <Cat className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-blue-600">Purrfect Match</h1>
        </motion.div>
        <p className="text-gray-600">Swipe to find your favourite cats</p>
      </header>

      {/* Card Stack */}
      <div
        className="relative mx-auto max-w-md px-6 pt-8 pb-32"
        style={{ height: "calc(100vh - 280px)" }}
      >
        <AnimatePresence>
    {cats[currentIndex] && (
        <CatCard
            key={currentIndex}
            imageUrl={cats[currentIndex]}
            onSwipe={handleSwipe}
            isTop={true}
        />
        )}
        </AnimatePresence>
      </div>

      {/* Buttons */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-8 left-0 right-0"
      >
        <SwipeButtons
          onLike={() => handleSwipe("right")}
          onDislike={() => handleSwipe("left")}
        />
      </motion.div>
    </div>
  );
};

export default Index;
