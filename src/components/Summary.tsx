import { Container, Title, Image, SimpleGrid, Button } from "@mantine/core";

interface SummaryProps {
  likedCats: string[];
  onRestart: () => void;
}

export default function Summary({ likedCats, onRestart }: SummaryProps) {
  return (
    <Container p="md" style={{ maxWidth: 480, textAlign: "center" }}>
      <Title order={2}>You liked {likedCats.length} cats!</Title>

      <SimpleGrid cols={2} spacing="md" mt="lg">
        {likedCats.map((url, i) => (
          <Image key={i} src={url} radius="md" />
        ))}
      </SimpleGrid>

      <Button mt="md" onClick={onRestart}>
        Restart
      </Button>
    </Container>
  );
}
