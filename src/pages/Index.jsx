import React, { useState, useEffect, useCallback } from "react";
import { Container, Text, VStack, Box, Flex, useToast } from "@chakra-ui/react";
import { useSpring, animated } from "react-spring";

const keyRows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

const getRandomKey = () => {
  const allKeys = keyRows.flat();
  return allKeys[Math.floor(Math.random() * allKeys.length)];
};

const FlyingLetter = ({ letter, onHit }) => {
  const [style, api] = useSpring(() => ({
    from: { transform: "translateX(-100%)" },
    to: { transform: "translateX(100%)" },
    config: { duration: 3000 },
    onRest: () => onHit(false),
  }));

  useEffect(() => {
    api.start();
  }, [api]);

  return (
    <animated.div style={{ ...style, position: "absolute", top: "50%", left: "50%" }}>
      <Text fontSize="4xl" fontWeight="bold">
        {letter}
      </Text>
    </animated.div>
  );
};

const Index = () => {
  const [currentLetter, setCurrentLetter] = useState(getRandomKey());
  const [score, setScore] = useState(0);
  const toast = useToast();

  const handleKeyPress = useCallback(
    (event) => {
      if (event.key.toUpperCase() === currentLetter) {
        setScore((prevScore) => prevScore + 1);
        setCurrentLetter(getRandomKey());
        toast({
          title: "Hit!",
          description: `You pressed the correct key: ${event.key.toUpperCase()}`,
          status: "success",
          duration: 1000,
          isClosable: true,
        });
      }
    },
    [currentLetter, toast]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Keyboard Game</Text>
        <Text>Press the corresponding key when the letter is under the key.</Text>
        <Text fontSize="xl">Score: {score}</Text>
        <Box position="relative" width="100%" height="200px" border="1px solid black">
          <FlyingLetter letter={currentLetter} onHit={(hit) => !hit && setCurrentLetter(getRandomKey())} />
        </Box>
        <Flex direction="column" align="center">
          {keyRows.map((row, rowIndex) => (
            <Flex key={rowIndex}>
              {row.map((key) => (
                <Box key={key} p={2} m={1} border="1px solid black" width="40px" textAlign="center">
                  {key}
                </Box>
              ))}
            </Flex>
          ))}
        </Flex>
      </VStack>
    </Container>
  );
};

export default Index;