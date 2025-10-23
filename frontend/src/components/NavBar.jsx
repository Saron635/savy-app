import {
  Box,
  Button,
  Flex,
  Spacer,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import ReminderModal from "./Reminder"; // import the component

export default function NavBar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue("gray.100", "gray.900");
  const color = useColorModeValue("black", "white");

  return (
    <Box bg={bg} px={6} py={3} w="100%" boxShadow="md">
      <Flex align="center" w="100%">
        <Text fontSize="xl" fontWeight="bold" color={color}>
          Expense Tracker
        </Text>
        <Spacer />
        <Flex align="center" gap={3}>
          {/* Remind Button */}
          <Button size="sm" leftIcon={<Text>🔔</Text>} colorScheme="teal" onClick={onOpen}>
            Reminder
          </Button>

          {/* Modal Component */}
          <ReminderModal isOpen={isOpen} onClose={onClose} />

          {/* Logout */}
          <Button size="sm" leftIcon={<Text>🚪</Text>} colorScheme="red">
            Logout
          </Button>

          {/* Color Mode Toggle */}
          <Button
            onClick={toggleColorMode}
            size="sm"
            bg="transparent"
            _hover={{ bg: colorMode === "light" ? "gray.200" : "gray.700" }}
          >
            {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
