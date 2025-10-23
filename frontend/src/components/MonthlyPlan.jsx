import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Input,
  Button,
  List,
  ListItem,
  Flex,
  Text,
  Select,
  useColorModeValue,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { 
  MdAdd, 
  MdDelete, 
  MdCalendarToday, 
  MdLightbulbOutline,
  MdCheckCircle
} from "react-icons/md";
import axios from "axios";

const MotionBox = motion(Box);
const MotionButton = motion(Button);
const MotionListItem = motion(ListItem);

export default function MonthlyPlans({ isOpen, onClose }) {
  const [plans, setPlans] = useState([]);
  const [planText, setPlanText] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const primaryColor = useColorModeValue('purple.600', 'purple.400');
  const secondaryColor = useColorModeValue('purple.400', 'purple.200');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const API_URL = "http://localhost:5000/api/plans";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    },
    hover: {
      scale: 1.02,
      y: -2,
      boxShadow: "0 10px 25px -3px rgba(0,0,0,0.1)",
      transition: { type: "spring", stiffness: 400, damping: 20 }
    }
  };

  // Fetch plans whenever month/year changes
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await axios.get(`${API_URL}?month=${selectedMonth}&year=${selectedYear}`);
        setPlans(data);
      } catch (err) {
        console.error("Failed to fetch plans:", err);
      }
    };
    fetchPlans();
  }, [selectedMonth, selectedYear]);

  const handleAddPlan = async () => {
    if (!planText.trim()) return;
    try {
      const { data } = await axios.post(API_URL, {
        text: planText,
        month: selectedMonth,
        year: selectedYear
      });
      setPlans([...plans, data]);
      setPlanText("");
    } catch (err) {
      console.error("Failed to add plan:", err);
    }
  };

  const handleDeletePlan = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setPlans(plans.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete plan:", err);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered>
        <ModalOverlay 
          bg="blackAlpha.600"
          backdropFilter="blur(10px)"
        />
        <ModalContent
          bgGradient={`linear(to-b, ${cardBg}, gray.50)`}
          borderRadius="3xl"
          boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          border="1px solid"
          borderColor={borderColor}
          maxW="800px"
        >
          {/* Premium Header */}
          <ModalHeader
            bgGradient={`linear(to-r, ${primaryColor}, ${secondaryColor})`}
            color="white"
            borderRadius="2xl 2xl 0 0"
            px={8}
            py={6}
            mb={0}
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top={-4}
              right={-4}
              w={20}
              h={20}
              bg={`${secondaryColor}20`}
              borderRadius="full"
              opacity={0.3}
            />
            <Flex align="center" gap={4}>
              <Icon as={MdCalendarToday} w={8} h={8} />
              <VStack align="start" spacing={0}>
                <Text fontSize="2xl" fontWeight="black" lineHeight={1.2}>
                  Monthly Financial Plans
                </Text>
                <Text fontSize="md" opacity={0.9}>
                  {monthNames[selectedMonth - 1]} {selectedYear}
                </Text>
              </VStack>
            </Flex>
          </ModalHeader>
          <ModalCloseButton 
            color="white" 
            size="lg" 
            top={4}
            right={4}
            _hover={{ bg: "whiteAlpha.200" }}
          />

          <ModalBody p={0}>
            <MotionBox
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              p={{ base: 6, md: 8 }}
            >
              {/* Month/Year Selector - Premium Cards */}
              <MotionBox variants={itemVariants} mb={6}>
                <Box
                  bg={cardBg}
                  p={6}
                  borderRadius="2xl"
                  boxShadow="0 10px 25px -3px rgba(0,0,0,0.1)"
                  border="1px solid"
                  borderColor={borderColor}
                >
                  <Flex gap={4} align="center">
                    <Select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      bg="whiteAlpha.50"
                      borderColor={`${primaryColor}20`}
                      _focus={{ borderColor: primaryColor, boxShadow: `0 0 0 3px ${primaryColor}10` }}
                      flex={1}
                    >
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(
                        (y) => <option key={y} value={y}>{y}</option>
                      )}
                    </Select>
                    <Select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(Number(e.target.value))}
                      bg="whiteAlpha.50"
                      borderColor={`${primaryColor}20`}
                      _focus={{ borderColor: primaryColor, boxShadow: `0 0 0 3px ${primaryColor}10` }}
                      flex={1}
                    >
                      {monthNames.map((m, i) => (
                        <option key={i + 1} value={i + 1}>{m}</option>
                      ))}
                    </Select>
                  </Flex>
                </Box>
              </MotionBox>

              {/* Add Plan Input - Glass Effect */}
              <MotionBox variants={itemVariants} mb={6}>
                <Flex gap={4} align="center">
                  <MotionButton
                    leftIcon={<MdAdd />}
                    colorScheme="purple"
                    variant="solid"
                    size="lg"
                    borderRadius="2xl"
                    minW="120px"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddPlan}
                    bgGradient={`linear(to-r, ${primaryColor}, ${secondaryColor})`}
                    _hover={{ bgGradient: `linear(to-r, ${secondaryColor}, ${primaryColor})` }}
                  >
                    Add Plan
                  </MotionButton>
                  <Input
                    placeholder="💡 Write your financial goal, budget target, or monthly reminder..."
                    value={planText}
                    onChange={(e) => setPlanText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddPlan()}
                    flex={1}
                    bg="whiteAlpha.50"
                    border="2px solid"
                    borderColor={`${primaryColor}20`}
                    _focus={{
                      borderColor: primaryColor,
                      bg: "white",
                      boxShadow: `0 0 0 3px ${primaryColor}10`
                    }}
                    borderRadius="2xl"
                    px={6}
                    fontSize="sm"
                  />
                </Flex>
              </MotionBox>

              {/* Plans List - Premium Cards */}
              <MotionBox variants={itemVariants}>
                <VStack spacing={4} align="stretch">
                  {plans.length === 0 ? (
                    <MotionBox
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      bgGradient={`linear(to-br, ${primaryColor}5, purple.50)`}
                      p={8}
                      borderRadius="2xl"
                      textAlign="center"
                      border="1px dashed"
                      borderColor={`${primaryColor}30`}
                    >
                      <Icon as={MdLightbulbOutline} w={16} h={16} color={`${primaryColor}40`} mb={4} />
                      <Text fontSize="lg" color={textColor} fontWeight="medium" mb={2}>
                        No plans yet for this month
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Add your first financial goal above to get started! ✨
                      </Text>
                    </MotionBox>
                  ) : (
                    <List spacing={3}>
                      {plans.map((plan, index) => (
                        <MotionListItem
                          key={plan._id}
                          variants={listItemVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover="hover"
                          transition={{ delay: index * 0.05 }}
                        >
                          <Box
                            bg={cardBg}
                            p={5}
                            borderRadius="2xl"
                            boxShadow="0 4px 15px rgba(0,0,0,0.08)"
                            border="1px solid"
                            borderColor={borderColor}
                            _hover={{
                              borderColor: primaryColor,
                              boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
                            }}
                          >
                            <Flex justify="space-between" align="center" gap={4}>
                              <VStack align="start" flex={1}>
                                <Text 
                                  fontSize="sm" 
                                  fontWeight="medium" 
                                  color="inherit"
                                  noOfLines={2}
                                  lineHeight={1.5}
                                >
                                  {plan.text}
                                </Text>
                                <Text fontSize="xs" color={textColor} mt={1}>
                                  Created: {new Date(plan.createdAt || Date.now()).toLocaleDateString()}
                                </Text>
                              </VStack>
                              <MotionButton
                                size="sm"
                                colorScheme="red"
                                variant="outline"
                                leftIcon={<MdDelete />}
                                onClick={() => handleDeletePlan(plan._id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                borderRadius="full"
                                minW="auto"
                                px={4}
                              >
                                Delete
                              </MotionButton>
                            </Flex>
                          </Box>
                        </MotionListItem>
                      ))}
                    </List>
                  )}
                </VStack>
              </MotionBox>
            </MotionBox>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Fixed Sidebar - Premium Design */}
      <MotionBox
        position="fixed"
        bottom={6}
        left={6}
        zIndex={1000}
        w={{ base: "90vw", md: "350px" }}
        maxH="300px"
        bgGradient={`linear(to-br, ${primaryColor}10, ${secondaryColor}5)`}
        p={5}
        borderRadius="2xl"
        boxShadow="0 20px 40px rgba(0,0,0,0.15)"
        border="1px solid"
        borderColor={`${primaryColor}20`}
        display={{ base: "none", md: "block" }}
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Flex align="center" justify="space-between" mb={4}>
          <Flex align="center" gap={2}>
            <Icon as={MdCalendarToday} color={primaryColor} />
            <Text 
              fontWeight="bold" 
              fontSize="lg" 
              bgGradient={`linear(to-r, ${primaryColor}, ${secondaryColor})`}
              bgClip="text"
            >
              {monthNames[selectedMonth - 1]} {selectedYear}
            </Text>
          </Flex>
          <Icon as={MdCheckCircle} color={`${primaryColor}50`} />
        </Flex>
        
        <VStack spacing={3} align="start" overflowY="auto" maxH="220px">
          {plans.length > 0 ? (
            plans.slice(0, 4).map((plan) => (
              <Box
                key={plan._id}
                p={4}
                bg="whiteAlpha.50"
                borderRadius="xl"
                boxShadow="sm"
                borderLeft="4px solid"
                borderLeftColor={primaryColor}
                w="full"
                _hover={{ bg: "whiteAlpha.70", transform: "translateX(4px)" }}
                transition="all 0.2s"
              >
                <Text 
                  fontSize="sm" 
                  fontWeight="medium" 
                  color={textColor}
                  noOfLines={2}
                  lineHeight={1.4}
                >
                  • {plan.text}
                </Text>
              </Box>
            ))
          ) : (
            <Box textAlign="center" w="full" py={6}>
              <Icon as={MdLightbulbOutline} w={8} h={8} color={textColor} mb={2} />
              <Text fontSize="sm" color={textColor}>
                No plans yet - add some goals! 🎯
              </Text>
            </Box>
          )}
          {plans.length > 4 && (
            <Text fontSize="xs" color={textColor} textAlign="center" w="full">
              +{plans.length - 4} more plans...
            </Text>
          )}
        </VStack>
      </MotionBox>
    </>
  );
}