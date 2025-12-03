import { Group, Button } from "@mantine/core";

interface SwipeButtonsProps {
  onLike: () => void;
  onDislike: () => void;
}

export default function SwipeButtons({ onLike, onDislike }: SwipeButtonsProps) {
  return (
    <Group justify="center" gap="md" wrap="nowrap">
      <Button
        variant="default"
        size="md"
        onClick={onDislike}
        style={{
          minWidth: "120px",
          fontSize: "clamp(0.875rem, 2vw, 1rem)",
        }}
      >
        Dislike
      </Button>

      <Button
        variant="light"
        size="md"
        onClick={onLike}
        style={{
          minWidth: "120px",
          fontSize: "clamp(0.875rem, 2vw, 1rem)",
        }}
      >
        Like
      </Button>
    </Group>
  );
}
