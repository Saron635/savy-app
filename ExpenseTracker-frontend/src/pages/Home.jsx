// src/pages/Home.jsx - FIXED SCROLLABLE VERSION
import React, { useState } from "react";
import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  useDisclosure,
  Heading,
  Text,
  Icon,
  SimpleGrid,
  VStack,
  HStack,
  Portal,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { 
  MdAnalytics, 
  MdBarChart, 
  MdCategory,
  MdAdd,
  MdTrendingUp,
  MdTrendingDown,
  MdEditNote,
  MdCalendarToday
} from "react-icons/md";
import { 
  FaChartPie, 
  FaTable, 
  FaFileAlt,
  FaGem
} from "react-icons/fa";

import NavBar from "../components/NavBar";
import Sidebar from "../components/SideBar";
import TransactionForm from "../components/AddTransaction";
import CategoryManager from "../components/CategoryManager";
import Summary from "../components/Summary";
import Table from "../components/Table";
import { useGlobalContext } from "../context/context";
import MonthYearSelector from "../components/MonthSelector";
import MonthlyPlanner from "../components/MonthlyPlan";
import Report from "../components/Report";

const MotionBox = motion(Box);
const MotionButton = motion(Button);
const MotionHeading = motion(Heading);

export default function HomePage() {
  const { 
    transactions, 
    categories, 
    setFilteredCategory, 
    filteredCategory,
    monthlyNotes = '',
    updateMonthlyNotes 
  } = useGlobalContext();

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Modals
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isPlanOpen, setIsPlanOpen] = useState(false);

  // Theme colors
  const primaryColor = useColorModeValue('purple.600', 'purple.400');
  const secondaryColor = useColorModeValue('purple.400', 'purple.200');
  const accentColor = useColorModeValue('gold.500', 'gold.400');
  const bg = useColorModeValue("white", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Month-Year filter
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    if (!t.date) return false;
    const [year, month] = t.date.split("-");
    return (
      year === selectedYear.toString() &&
      month === selectedMonth.toString().padStart(2, "0")
    );
  });

  // Totals
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  const balance = totalIncome - totalExpense;

  const handleMonthYearChange = ({ month, year }) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const lightShadow = "0 20px 25px -5px rgba(0,0,0,0.1)";
  const darkShadow = "0 20px 25px -5px rgba(0,0,0,0.4)";
  const boxShadow = useColorModeValue(lightShadow, darkShadow);

  // ✅ ACTION CARDS DATA
  const actionCards = [
    {
      title: "Monthly Planner",
      description: "Set financial goals & track progress",
      icon: MdCalendarToday,
      color: primaryColor,
      onClick: () => setIsPlanOpen(true)
    },
    {
      title: "Category Manager",
      description: "Organize spending categories",
      icon: MdCategory,
      color: "teal.500",
      onClick: () => setIsCategoryOpen(true)
    },
    {
      title: "Advanced Reports",
      description: "Generate detailed analysis",
      icon: FaFileAlt,
      color: accentColor,
      onClick: () => setIsReportOpen(true)
    }
  ];

  return (
    <Box 
      minH="100vh" 
      bg={bg}
      position="relative"
      display="flex"
      flexDirection="column"
      overflow="hidden" // ✅ Prevent body scroll conflicts
    >
      {/* ✅ FIXED NAVBAR */}
      <MotionBox
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        bgGradient={`linear(to-r, ${primaryColor}, ${secondaryColor})`}
        boxShadow={boxShadow}
        zIndex={1000}
        position="sticky"
        top={0}
        flexShrink={0}
      >
        <Flex align="center" justify="space-between" px={{ base: 4, md: 8 }} py={4}>
          <Heading fontSize={{ base: "xl", md: "2xl" }} color="white" fontWeight="black">
            💎 Savy
          </Heading>
          <HStack spacing={4}>
            <MotionButton
              leftIcon={<MdAdd />}
              colorScheme="whiteAlpha"
              variant="outline"
              borderColor="white"
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsTransactionOpen(true)}
              size="lg"
            >
              Add Transaction
            </MotionButton>
            <Button 
              onClick={onOpen} 
              colorScheme="whiteAlpha" 
              variant="ghost"
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
            >
              ☰ Tools
            </Button>
          </HStack>
        </Flex>
      </MotionBox>

      {/* ✅ MAIN LAYOUT - PROPER SCROLL CONTAINER */}
      <Flex flex={1} minH={0} position="relative">
        {/* Sidebar */}
        <Sidebar
          isOpen={isOpen}
          onClose={onClose}
          onTransactionOpen={() => setIsTransactionOpen(true)}
          onCategoryOpen={() => setIsCategoryOpen(true)}
          onReportOpen={() => setIsReportOpen(true)}
          onPlanOpen={() => setIsPlanOpen(true)}
        />

        {/* ✅ MAIN CONTENT - FULLY SCROLLABLE */}
        <Box flex={1} position="relative" display="flex" flexDirection="column">
          {/* SCROLLABLE CONTENT AREA */}
          <Box 
            flex={1}
            overflowY="auto"
            px={{ base: 4, md: 8 }}
            py={8}
            pb={{ base: 40, md: 32 }} // ✅ Extra padding for fixed notes
            css={{
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: useColorModeValue('gray.300', 'gray.600'),
                borderRadius: '3px',
              },
            }}
          >
            {/* Hero Section */}
            <MotionBox
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              bgGradient={`linear(to-r, ${primaryColor}, ${secondaryColor})`}
              py={{ base: 8, md: 12 }}
              borderRadius="3xl"
              mb={8}
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                top="20%"
                right="10%"
                w={{ base: "150px", md: "300px" }}
                h={{ base: "150px", md: "300px" }}
                bg="whiteAlpha.100"
                borderRadius="full"
                opacity={0.3}
              />
              
              <Flex
                direction="column"
                align="center"
                justify="center"
                px={{ base: 4, md: 6 }}
                position="relative"
                zIndex={1}
              >
                <MotionHeading
                  fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
                  color="white"
                  textAlign="center"
                  mb={6}
                  fontWeight="black"
                  textShadow="0 4px 20px rgba(0,0,0,0.3)"
                >
                  Your Financial Journey
                </MotionHeading>
                
                <Box
                  bg={cardBg}
                  p={{ base: 4, md: 6 }}
                  borderRadius="2xl"
                  boxShadow={boxShadow}
                  w="full"
                  maxW={{ base: "90vw", md: "500px" }}
                  mx="auto"
                >
                  <MonthYearSelector onChange={handleMonthYearChange} />
                </Box>
              </Flex>
            </MotionBox>

            {/* Metrics Grid */}
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              spacing={{ base: 6, md: 8 }}
              mb={8}
            >
              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                bg={cardBg}
                p={6}
                borderRadius="2xl"
                boxShadow={boxShadow}
                textAlign="center"
                border="1px solid"
                borderColor={borderColor}
              >
                <Icon as={FaChartPie} w={10} h={10} color={primaryColor} mb={3} />
                <Heading size="md" color={headingColor} mb={1}>
                  ${totalIncome.toFixed(2)}
                </Heading>
                <Text color={textColor} fontSize="sm">Total Income</Text>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                bg={cardBg}
                p={6}
                borderRadius="2xl"
                boxShadow={boxShadow}
                textAlign="center"
                border="1px solid"
                borderColor={borderColor}
              >
                <Icon as={MdBarChart} w={10} h={10} color="orange.500" mb={3} />
                <Heading size="md" color={headingColor} mb={1}>
                  ${totalExpense.toFixed(2)}
                </Heading>
                <Text color={textColor} fontSize="sm">Total Expenses</Text>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                bg={balance >= 0 ? "green.50" : "red.50"}
                p={6}
                borderRadius="2xl"
                boxShadow={boxShadow}
                textAlign="center"
                border="2px solid"
                borderColor={balance >= 0 ? "green.500" : "red.500"}
              >
                <Icon 
                  as={balance >= 0 ? MdTrendingUp : MdTrendingDown} 
                  w={10} h={10} 
                  color={balance >= 0 ? "green.500" : "red.500"} 
                  mb={3} 
                />
                <Heading size="md" color={balance >= 0 ? "green.800" : "red.800"} mb={1}>
                  ${Math.abs(balance).toFixed(2)}
                </Heading>
                <Text fontSize="sm" fontWeight="bold" color={balance >= 0 ? "green.700" : "red.700"}>
                  {balance >= 0 ? "Net Surplus" : "Net Deficit"}
                </Text>
              </MotionBox>
            </SimpleGrid>

            {/* Main Content */}
            <Flex
              direction={{ base: "column", lg: "row" }}
              gap={6}
              mb={8}
            >
              <MotionBox
                flex={{ base: 1, lg: 2 }}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                bg={cardBg}
                p={6}
                borderRadius="2xl"
                boxShadow={boxShadow}
                border="1px solid"
                borderColor={borderColor}
              >
                <HStack spacing={3} mb={4}>
                  <Box p={2} bgGradient={`linear(to-r, ${primaryColor}, ${secondaryColor})`} borderRadius="full">
                    <FaChartPie size={20} color="white" />
                  </Box>
                  <Heading size="md" color={headingColor}>Financial Summary</Heading>
                </HStack>
                <Summary totalIncome={totalIncome} totalExpense={totalExpense} balance={balance} />
              </MotionBox>

              <MotionBox
                flex={1}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                bg={cardBg}
                p={6}
                borderRadius="2xl"
                boxShadow={boxShadow}
                border="1px solid"
                borderColor={borderColor}
              >
                <HStack spacing={3} mb={4}>
                  <Box p={2} bg={accentColor} borderRadius="full">
                    <FaTable size={20} color="white" />
                  </Box>
                  <Heading size="md" color={headingColor}>Recent Transactions</Heading>
                </HStack>
                <Table
                  filteredTransactions={filteredTransactions}
                  selectedCategory={filteredCategory || "all"}
                  setFilteredCategory={setFilteredCategory}
                  categories={categories}
                />
              </MotionBox>
            </Flex>

            {/* ✅ FIXED ACTION CARDS - NOW COMPLETE */}
            {/* <SimpleGrid
              columns={{ base: 1, md: 3 }}
              spacing={6}
              mb={8}
            >
              {actionCards.map((card, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  bg={cardBg}
                  p={6}
                  borderRadius="2xl"
                  boxShadow={boxShadow}
                  borderLeft="4px solid"
                  borderLeftColor={card.color}
                  border="1px solid"
                  borderColor={borderColor}
                  cursor="pointer"
                  _hover={{ 
                    transform: "translateY(-8px)",
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)"
                  }}
                  onClick={card.onClick}
                  whileHover={{ scale: 1.02 }}
                >
                  <HStack spacing={3} mb={3} align="center">
                    <Box p={3} bg={card.color} borderRadius="full">
                      <Icon as={card.icon} w={6} h={6} color="white" />
                    </Box>
                    <VStack align="start" spacing={1} flex={1}>
                      <Heading size="sm" color={headingColor}>{card.title}</Heading>
                      <Text fontSize="xs" color={textColor}>{card.description}</Text>
                    </VStack>
                  </HStack>
                </MotionBox>
              ))}
            </SimpleGrid> */}
          </Box>

       
        </Box>
      </Flex>

      {/* Modals - Higher z-index */}
      <TransactionForm isOpen={isTransactionOpen} onClose={() => setIsTransactionOpen(false)} />
      <CategoryManager isOpen={isCategoryOpen} onClose={() => setIsCategoryOpen(false)} />
      <Report
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        balance={balance}
        transactions={filteredTransactions}
      />
      <MonthlyPlanner 
        isOpen={isPlanOpen} 
        onClose={() => setIsPlanOpen(false)}
        monthlyNotes={monthlyNotes}
        updateMonthlyNotes={updateMonthlyNotes}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />
    </Box>
  );
}