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
  HStack,
  Icon,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FaGem, FaUserPlus, FaEnvelope, FaUser } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionButton = motion(Button);
const MotionInput = motion(Input);

export default function SignUpPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const primaryColor = useColorModeValue("purple.600", "purple.400");
  const secondaryColor = useColorModeValue("purple.400", "purple.200");
  const accentColor = useColorModeValue("gold.500", "gold.400");
  const bg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = primaryColor;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Signup Failed",
          description: data.msg || "Something went wrong",
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      toast({
        title: "Welcome to Savy 💎",
        description: "Your account has been created successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      setTimeout(() => navigate("/login"), 1000);
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
      transition: { duration: 0.2 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
      transition: { type: "spring", stiffness: 400, damping: 20 },
    },
    tap: { scale: 0.98 },
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
      {/* Background decoration */}
      <Box
        position="absolute"
        top="-10%"
        right="-10%"
        w={{ base: "200px", md: "400px" }}
        h={{ base: "200px", md: "400px" }}
        bg={`${primaryColor}20`}
        borderRadius="full"
        opacity={0.1}
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

      {/* Main Card */}
      <MotionBox
        bg={cardBg}
        p={{ base: 6, md: 10 }}
        borderRadius="3xl"
        boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
        w={{ base: "90%", md: "450px" }}
        border="1px solid"
        borderColor={borderColor}
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{ y: -5 }}
      >
        <VStack spacing={6} align="stretch">
          {/* Header */}
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
              Savy
            </Heading>
          </HStack>

          <Text textAlign="center" color={textColor} fontSize="lg">
            Create Your Account
          </Text>

          {/* Signup Form */}
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <FormControl mb={5} isRequired>
              <HStack spacing={3} align="center" mb={2}>
                <Icon as={FaUser} color={primaryColor} />
                <FormLabel fontWeight="medium" color={headingColor} mb={0}>
                  Full Name
                </FormLabel>
              </HStack>
              <MotionInput
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                border="2px solid"
                borderColor={`${primaryColor}10`}
                borderRadius="2xl"
                px={6}
                py={4}
                fontSize="sm"
                variants={inputVariants}
                whileFocus="focus"
                required
              />
            </FormControl>

            {/* Email */}
            <FormControl mb={5} isRequired>
              <HStack spacing={3} align="center" mb={2}>
                <Icon as={FaEnvelope} color={primaryColor} />
                <FormLabel fontWeight="medium" color={headingColor} mb={0}>
                  Email
                </FormLabel>
              </HStack>
              <MotionInput
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                border="2px solid"
                borderColor={`${primaryColor}10`}
                borderRadius="2xl"
                px={6}
                py={4}
                fontSize="sm"
                variants={inputVariants}
                whileFocus="focus"
                required
              />
            </FormControl>

            {/* Password */}
            <FormControl mb={5} isRequired>
              <HStack spacing={3} align="center" mb={2}>
                <Icon as={MdSecurity} color={primaryColor} />
                <FormLabel fontWeight="medium" color={headingColor} mb={0}>
                  Password
                </FormLabel>
              </HStack>
              <InputGroup>
                <MotionInput
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  border="2px solid"
                  borderColor={`${primaryColor}10`}
                  borderRadius="2xl"
                  px={6}
                  py={4}
                  fontSize="sm"
                  variants={inputVariants}
                  whileFocus="focus"
                  required
                />
                <InputRightElement pr={4}>
                  <Button
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    _hover={{ bg: `${primaryColor}10` }}
                  >
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            {/* Confirm Password */}
            <FormControl mb={8} isRequired>
              <HStack spacing={3} align="center" mb={2}>
                <Icon as={MdSecurity} color={primaryColor} />
                <FormLabel fontWeight="medium" color={headingColor} mb={0}>
                  Confirm Password
                </FormLabel>
              </HStack>
              <InputGroup>
                <MotionInput
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  border="2px solid"
                  borderColor={`${primaryColor}10`}
                  borderRadius="2xl"
                  px={6}
                  py={4}
                  fontSize="sm"
                  variants={inputVariants}
                  whileFocus="focus"
                  required
                />
                <InputRightElement pr={4}>
                  <Button
                    variant="ghost"
                    onClick={() => setShowConfirm(!showConfirm)}
                    _hover={{ bg: `${primaryColor}10` }}
                  >
                    {showConfirm ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            {/* Sign Up Button */}
            <MotionButton
              colorScheme="purple"
              w="full"
              type="submit"
              size="lg"
              h="14"
              bgGradient={`linear(to-r, ${primaryColor}, ${secondaryColor})`}
              _hover={{
                bgGradient: `linear(to-r, ${secondaryColor}, ${primaryColor})`,
                boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
              }}
              _active={{ transform: "scale(0.98)" }}
              isLoading={isLoading}
              loadingText="Creating Account..."
              spinner={<Spinner size="sm" color="white" />}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              borderRadius="2xl"
              fontWeight="bold"
            >
              Create Account
            </MotionButton>
          </form>

          <Text textAlign="center" color={textColor} fontSize="sm" mt={4}>
            Already have an account?{" "}
            <Link color={primaryColor} onClick={() => navigate("/login")}>
              Sign In
            </Link>
          </Text>

        
        </VStack>
      </MotionBox>
    </Flex>
  );
}
