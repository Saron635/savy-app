import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  Link,
  useColorModeValue,
  VStack,
  InputGroup,
  InputRightElement,
  useToast,
  Spinner,
  useDisclosure,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FaGem, FaLock, FaEnvelope, FaUserPlus } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionButton = motion(Button);
const MotionInput = motion(Input);

export default function LoginPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Premium theme colors
  const primaryColor = useColorModeValue('purple.600', 'purple.400');
  const secondaryColor = useColorModeValue('purple.400', 'purple.200');
  const accentColor = useColorModeValue('gold.500', 'gold.400');
  const bg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = primaryColor;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Login Failed",
          description: data.msg || "Invalid credentials",
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      // Save JWT token
      localStorage.setItem("token", data.token);

      toast({
        title: "Welcome Back! 💎",
        description: "Accessing Financial Mastery Dashboard",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      // Smooth redirect with animation
      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      toast({
        title: "Connection Error",
        description: "Unable to reach server. Please check your connection.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: `0 0 0 3px ${primaryColor}20`,
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
      transition: { type: "spring", stiffness: 400, damping: 20 }
    },
    tap: { scale: 0.98 }
  };

  return (
    <Flex 
      minH="100vh" 
      align="center" 
      justify="center" 
      bgGradient={`linear(to-br, ${bg}, gray.100)`}
      position="relative"
      overflow="hidden"
      px={4}
    >
      {/* Animated Background Elements */}
      <Box
        position="absolute"
        top="-10%"
        right="-10%"
        w={{ base: "200px", md: "400px" }}
        h={{ base: "200px", md: "400px" }}
        bg={`${primaryColor}20`}
        borderRadius="full"
        opacity={0.1}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <Box
        position="absolute"
        bottom="20%"
        left="-10%"
        w={{ base: "150px", md: "300px" }}
        h={{ base: "150px", md: "300px" }}
        bg={`${accentColor}10`}
        borderRadius="full"
        opacity={0.05}
      />

 
      <MotionBox
        bg={cardBg}
        p={{ base: 6, md: 10 }}
        borderRadius="3xl"
        boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
        w={{ base: "90%", md: "450px" }}
        maxW="450px"
        border="1px solid"
        borderColor={borderColor}
        position="relative"
        zIndex={2}
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{ y: -5 }}
      >
       
        <VStack spacing={6} align="stretch">
          <HStack justify="center" spacing={4} mb={2}>
            <Box
              p={3}
              bgGradient={`linear(to-r, ${primaryColor}, ${secondaryColor})`}
              borderRadius="full"
              boxShadow="0 10px 25px rgba(0,0,0,0.2)"
            >
              <FaGem size={24} color="white" />
            </Box>
            <Heading 
              textAlign="center" 
              color={headingColor}
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="black"
              bgGradient={`linear(to-r, ${primaryColor}, ${secondaryColor})`}
              bgClip="text"
            >
              Savery
            </Heading>
          </HStack>

          <Text 
            textAlign="center" 
            color={textColor}
            fontSize="lg"
            fontWeight="medium"
          >
            Welcome Back
          </Text>

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <FormControl mb={6} isRequired>
              <HStack spacing={3} align="center" mb={2}>
                <Icon as={FaEnvelope} color={primaryColor} />
                <FormLabel fontWeight="medium" color={headingColor} mb={0}>
                  Email Address
                </FormLabel>
              </HStack>
              <MotionInput
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                bg="whiteAlpha.50"
                border="2px solid"
                borderColor={`${primaryColor}10`}
                _focus={{
                  borderColor: primaryColor,
                  bg: "white",
                  boxShadow: `0 0 0 3px ${primaryColor}20`
                }}
                borderRadius="2xl"
                px={6}
                py={4}
                fontSize="sm"
                variants={inputVariants}
                whileFocus="focus"
                required
              />
            </FormControl>

            {/* Password Input */}
            <FormControl mb={8} isRequired>
              <HStack spacing={3} align="center" mb={2}>
                <Icon as={MdSecurity} color={primaryColor} />
                <FormLabel fontWeight="medium" color={headingColor} mb={0}>
                  Password
                </FormLabel>
              </HStack>
              <InputGroup>
                <MotionInput
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  bg="whiteAlpha.50"
                  border="2px solid"
                  borderColor={`${primaryColor}10`}
                  _focus={{
                    borderColor: primaryColor,
                    bg: "white",
                    boxShadow: `0 0 0 3px ${primaryColor}20`
                  }}
                  borderRadius="2xl"
                  px={6}
                  py={4}
                  fontSize="sm"
                  variants={inputVariants}
                  whileFocus="focus"
                  pr="4.5rem"
                  required
                />
                <InputRightElement pr={4}>
                  <Button
                    variant="ghost"
                    colorScheme="purple"
                    h="100%"
                    borderRadius="xl"
                    _hover={{ bg: `${primaryColor}10` }}
                    onClick={() => setShowPassword(!showPassword)}
                    minW="auto"
                  >
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
             
            </FormControl>

            {/* Login Button */}
            <MotionButton
              colorScheme="purple"
              w="full"
              type="submit"
              size="lg"
              h="14"
              bgGradient={`linear(to-r, ${primaryColor}, ${secondaryColor})`}
              _hover={{ 
                bgGradient: `linear(to-r, ${secondaryColor}, ${primaryColor})`,
                boxShadow: "0 15px 35px rgba(0,0,0,0.2)"
              }}
              _active={{ transform: "scale(0.98)" }}
              isLoading={isLoading}
              loadingText="Signing In..."
              spinner={<Spinner size="sm" color="white" />}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              borderRadius="2xl"
              fontWeight="bold"
              boxShadow="0 10px 25px rgba(0,0,0,0.15)"
            >
              LogIn 
            </MotionButton>
          </form>

          {/* Divider & Signup */}
          <Box
            my={6}
            display="flex"
            alignItems="center"
            position="relative"
          >
            <Box flex={1} h="1px" bg={borderColor} />
            <Text px={4} color={textColor} fontSize="sm">or</Text>
            <Box flex={1} h="1px" bg={borderColor} />
          </Box>

          <MotionButton
            leftIcon={<FaUserPlus />}
            variant="outline"
            colorScheme="purple"
            w="full"
            h="12"
            onClick={() => navigate("/signup")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            borderRadius="2xl"
            borderColor={primaryColor}
            _hover={{ borderColor: secondaryColor, bg: `${primaryColor}10` }}
          >
            Create New Account
          </MotionButton>

       
        </VStack>
      </MotionBox>
    </Flex>
  );
}