import React, { useState, useEffect, useCallback } from "react";
import { Container, Text, VStack, Box, Flex, useToast } from "@chakra-ui/react";
import { useSpring, animated } from "react-spring";

const keyRows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

const keyPositions = keyRows.flat().reduce((acc, key, index) => {
  const rowIndex = keyRows.findIndex(row => row.includes(key));
  const colIndex = keyRows[rowIndex].indexOf(key);
  acc[key] = { rowIndex, colIndex };
  return acc;
}, {});

const getRandomKey = () => {
  const allKeys = keyRows.flat();
  return allKeys[Math.floor(Math.random() * allKeys.length)];
};

const FlyingLetter = ({ letter, onHit }) => {
  const { rowIndex, colIndex } = keyPositions[letter];
  const [style, api] = useSpring(() => ({
    from: { transform: "translateY(-100%)" },
    to: { transform: "translateY(0%)" },
    config: { duration: 3000 },
    onRest: () => onHit(false),
  }));

  useEffect(() => {
    api.start();
  }, [api]);

  return (
    <animated.div
      style={{
        ...style,
        position: "absolute",
        top: `${rowIndex * 60}px`,
        left: `${colIndex * 60}px`,
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid black",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        zIndex: 1,
      }}
    >
      <Text fontSize="2xl" fontWeight="bold">
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
        <Text>Press the corresponding key when the letter is over the key.</Text>
        <Text fontSize="xl">Score: {score}</Text>
        <Box position="relative" width="100%" height="200px">
          <FlyingLetter letter={currentLetter} onHit={(hit) => !hit && setCurrentLetter(getRandomKey())} />
        </Box>
        <Flex direction="column" align="center">
          {keyRows.map((row, rowIndex) => (
            <Flex key={rowIndex}>
              {row.map((key) => (
                <Box key={key} p={2} m={1} border="1px solid black" width="40px" textAlign="center" position="relative">
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