import { Container, Title, Image, SimpleGrid, Button, Stack } from "@mantine/core";

interface SummaryProps {
  likedCats: string[];
  onRestart: () => void;
}

export default function Summary({ likedCats, onRestart }: SummaryProps) {
  return (
    <Container
      p="md"
      style={{
        maxWidth: 480,
        textAlign: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      <Stack gap="lg">
        <Title
          order={2}
          style={{ fontSize: "clamp(1.25rem, 4vw, 1.75rem)" }}
        >
          You liked {likedCats.length} cats!
        </Title>

        {likedCats.length > 0 ? (
          <SimpleGrid
            cols={{ base: 2, sm: 2, md: 3 }}
            spacing="md"
            style={{ width: "100%" }}
          >
            {likedCats.map((url, i) => (
              <Image
                key={i}
                src={url}
                radius="md"
                style={{ width: "100%", height: "auto" }}
              />
            ))}
          </SimpleGrid>
        ) : (
          <Text c="dimmed">No cats liked yet. Try again!</Text>
        )}

        <Button
          mt="md"
          onClick={onRestart}
          size="md"
          fullWidth
          style={{ maxWidth: "200px", margin: "1rem auto 0" }}
        >
          Restart
        </Button>
      </Stack>
    </Container>
  );
}
