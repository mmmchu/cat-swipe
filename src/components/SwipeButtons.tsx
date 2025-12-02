import { Group, Button } from "@mantine/core";

interface SwipeButtonsProps {
  onLike: () => void;
  onDislike: () => void;
}

export default function SwipeButtons({ onLike, onDislike }: SwipeButtonsProps) {
  return (
    <Group justify="center" mt="md">
      <Button variant="default" size="md" onClick={onDislike}>
        Dislike
      </Button>

      <Button variant="light" size="md" onClick={onLike}>
        Like
      </Button>
    </Group>
  );
}
