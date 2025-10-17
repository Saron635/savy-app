import React from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  SimpleGrid,
  Container,
  useColorModeValue,
  VStack,
  HStack,
  useBreakpointValue,
  Icon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  MdAnalytics, 
  MdSecurity, 
  MdSync, 
  MdBarChart, 
  MdAttachMoney,
  MdTrendingUp,
  MdStar,
  MdKeyboardArrowDown
} from 'react-icons/md';
import { 
  FaGem,
  FaShieldAlt,
  FaRocket,
  FaChartLine,
  FaCrown
} from 'react-icons/fa';

// ✅ SAFE MOTION COMPONENTS - Direct motion wrappers only
const MotionBox = motion(Box);
const MotionButton = motion(Button);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

// ✅ NO HOOKS - Simple forwardRef wrapper component
const SafeMotionWrapper = React.forwardRef(({ children, ...props }, ref) => {
  return (
    <Box ref={ref} {...props}>
      {children}
    </Box>
  );
});
SafeMotionWrapper.displayName = 'SafeMotionWrapper';

// ✅ SAFE ICON WRAPPER - No motion on icons
const SafeIcon = ({ as: Component, ...props }) => {
  return <Icon as={Component} {...props} />;
};

const LandingPage = () => {
  // Theme colors
  const bg = useColorModeValue('white', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');
  const primaryColor = useColorModeValue('purple.600', 'purple.400');
  const secondaryColor = useColorModeValue('purple.400', 'purple.200');
  const accentColor = useColorModeValue('gold.500', 'gold.400');

  const problems = [
    { icon: MdAttachMoney, title: 'Untracked Spending', desc: 'Silent financial leaks erode wealth.', color: 'red.500' },
    { icon: MdBarChart, title: 'Complex Systems', desc: 'Overwhelming tools create resistance.', color: 'orange.500' },
    { icon: MdTrendingUp, title: 'Forgotten Goals', desc: 'Vision without structure fades.', color: 'green.500' },
  ];

  const features = [
    { icon: FaChartLine, title: 'Precision Planning', desc: 'AI-powered monthly frameworks.', color: primaryColor },
    { icon: FaGem, title: 'Intelligent Insights', desc: 'Real-time analytics transform data.', color: accentColor },
    { icon: FaShieldAlt, title: 'Fortified Security', desc: 'Military-grade encryption.', color: 'teal.500' },
    { icon: FaRocket, title: 'Seamless Sync', desc: 'Universal access with enterprise-grade.', color: 'blue.500' },
  ];

  const stats = [
    { value: '10K+', label: 'Active Users', icon: FaCrown },
    { value: '99.9%', label: 'Uptime', icon: FaShieldAlt },
    { value: '$50M+', label: 'Tracked', icon: FaChartLine },
    { value: '4.9/5', label: 'Rating', icon: MdStar },
  ];

  // ✅ ANIMATION VARIANTS - No hooks needed
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      y: -5,
      transition: { type: "spring", stiffness: 400, damping: 17 }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <Box bg={bg} overflow="hidden" position="relative">
      {/* Hero Section */}
      <MotionBox
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        minH="100vh"
        bgGradient={`linear(to-br, ${primaryColor}, ${secondaryColor})`}
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={{ base: 4, md: 8 }}
        pt={{ base: 20, md: 0 }}
        position="relative"
      >
        {/* Background floating element - CSS animation */}
        <Box
          position="absolute"
          top="10%"
          right="10%"
          w={{ base: "100px", md: "200px" }}
          h={{ base: "100px", md: "200px" }}
          bg={`${accentColor}20`}
          borderRadius="50%"
          className="floating-circle"
          zIndex={1}
        />

        <VStack spacing={8} textAlign="center" maxW="container.lg" zIndex={2} position="relative">
          {/* Premium Badge */}
          <MotionBox
            variants={itemVariants}
            whileHover={buttonVariants.hover}
            whileTap={buttonVariants.tap}
            bgGradient={`linear(to-r, ${accentColor}, gold.400)`}
            color="white"
            px={6}
            py={3}
            borderRadius="full"
            boxShadow={`0 10px 30px ${accentColor}40`}
            fontWeight="bold"
            fontSize="sm"
            letterSpacing="1px"
            textTransform="uppercase"
            display="inline-flex"
            alignItems="center"
            gap={2}
          >
            <FaGem />
            <Text>Premium Wealth Platform</Text>
            <MdStar />
          </MotionBox>

          {/* Hero Title */}
          <MotionHeading
            variants={itemVariants}
            fontSize={{ base: "4xl", md: "6xl", lg: "8xl" }}
            fontWeight="black"
            lineHeight={1}
            bgGradient="linear(to-r, white, gray.100)"
            bgClip="text"
          >
            Savvy
            <br />
            <Text as="span" color={accentColor}></Text>
          </MotionHeading>

          {/* Subtitle */}
          <MotionText
            variants={itemVariants}
            fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
            color="whiteAlpha.900"
            lineHeight={1.6}
            maxW="600px"
            px={4}
          >
            Elevate your wealth management with precision-engineered tools for the discerning individual.
          </MotionText>

          {/* CTA Buttons */}
          <HStack spacing={6} mt={8}>
            <MotionButton
              variants={itemVariants}
              size="lg"
              bgGradient={`linear(to-r, white, gray.100)`}
              color={primaryColor}
              _hover={{ bg: "white" }}
              boxShadow="0 20px 40px rgba(255,255,255,0.3)"
              borderRadius="2xl"
              minW="200px"
              h="50px"
              fontSize="lg"
              fontWeight="bold"
              whileHover={buttonVariants.hover}
              whileTap={buttonVariants.tap}
              as={Link}
              to="/login"
            >
              Begin Journey
            </MotionButton>

            
          </HStack>
        </VStack>
      </MotionBox>

      {/* Stats Section */}
      <MotionBox
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        bg="gray.50"
        py={20}
      >
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={12}>
            {stats.map((stat, i) => (
              <MotionBox
                key={i}
                variants={itemVariants}
                textAlign="center"
                p={6}
                bg="white"
                borderRadius="2xl"
                boxShadow="md"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                border="1px solid"
                borderColor="gray.200"
              >
                <SafeIcon as={stat.icon} w={12} h={12} color={primaryColor} mb={4} />
                <Text fontSize="3xl" fontWeight="black" color={primaryColor} mb={2}>
                  {stat.value}
                </Text>
                <Text fontSize="sm" color={textColor} fontWeight="medium">
                  {stat.label}
                </Text>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </MotionBox>

      {/* Problems Section */}
      <Box py={20} bg={bg}>
        <Container maxW="container.xl">
          <MotionHeading
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            textAlign="center"
            mb={16}
            fontSize={{ base: '2xl', md: '4xl' }}
            bgGradient={`linear(to-r, ${primaryColor}, ${accentColor})`}
            bgClip="text"
            transition={{ duration: 0.8 }}
          >
            Barriers to Financial Excellence
          </MotionHeading>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={12}>
            {problems.map((problem, i) => (
              <MotionBox
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.02 }}
                bg={cardBg}
                p={8}
                borderRadius="3xl"
                boxShadow={`0 20px 40px ${problem.color}20`}
                border={`1px solid ${problem.color}30`}
              >
                <SafeIcon as={problem.icon} w={12} h={12} color={problem.color} mb={4} />
                <Heading size="lg" mb={4} color={headingColor} fontWeight="bold">
                  {problem.title}
                </Heading>
                <Text fontSize="md" color={textColor} lineHeight={1.6}>
                  {problem.desc}
                </Text>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Final CTA */}
      <MotionBox
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        bgGradient={`linear(to-br, ${primaryColor}, ${secondaryColor})`}
        py={24}
        color="white"
        textAlign="center"
        transition={{ duration: 1 }}
      >
        <Container maxW="container.lg">
          <MotionHeading
            fontSize={{ base: "3xl", md: "5xl" }}
            mb={6}
            fontWeight="black"
            whileHover={{ scale: 1.02 }}
          >
            Your Financial Legacy Awaits
          </MotionHeading>
          <MotionText
            fontSize="lg"
            color="whiteAlpha.900"
            mb={8}
            maxW="500px"
            mx="auto"
          >
            Join the elite who master their finances with precision and confidence.
          </MotionText>
          <MotionButton
            size="lg"
            bg="white"
            color={primaryColor}
            _hover={{ bg: "gray.100" }}
            minW="250px"
            whileHover={buttonVariants.hover}
            whileTap={buttonVariants.tap}
            as={Link}
            to="/signup"
          >
            Claim Your Future
          </MotionButton>
        </Container>
      </MotionBox>

      {/* ✅ CSS Animations for Background Elements */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-20px) rotate(180deg); 
          }
        }
        .floating-circle {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </Box>
  );
};

export default LandingPage;