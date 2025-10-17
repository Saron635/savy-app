// components/SideBar.jsx - COMPLETE FIXED VERSION
import React from 'react';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  VStack,
  Button,
  Box,
  useColorModeValue,
  Icon,
  Text,
  HStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion'; // ✅ ADDED
import { MdAdd, MdCategory, MdBarChart, MdAnalytics, MdClose } from 'react-icons/md';

const MotionDrawerContent = motion(DrawerContent);
const MotionButton = motion(Button); // ✅ DEFINED MotionButton

const Sidebar = ({ isOpen, onClose, onTransactionOpen, onCategoryOpen, onReportOpen, onPlanOpen }) => {
  const primaryColor = useColorModeValue('purple.600', 'purple.400');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');

  const menuItems = [
    {
      icon: MdAdd,
      title: 'Add Transaction',
      onClick: onTransactionOpen,
      color: 'blue.500',
      subtitle: 'Record new income/expense'
    },
    {
      icon: MdCategory,
      title: 'Manage Categories',
      onClick: onCategoryOpen,
      color: 'green.500',
      subtitle: 'Organize spending categories'
    },
    {
      icon: MdBarChart,
      title: 'Monthly Planner',
      onClick: onPlanOpen,
      color: 'purple.500',
      subtitle: 'Set financial goals'
    },
    {
      icon: MdAnalytics,
      title: 'Generate Reports',
      onClick: onReportOpen,
      color: 'teal.500',
      subtitle: 'View detailed analysis'
    },
  ];

  return (
    <Drawer 
      isOpen={isOpen} 
      placement="left" 
      onClose={onClose} 
      size={{ base: "full", md: "sm", lg: "md" }}
    >
      <DrawerOverlay />
      <MotionDrawerContent
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        exit={{ x: -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        bgGradient="linear(to-b, gray.900 0%, gray.800 100%)"
        color="white"
        maxW={{ base: "full", md: "320px", lg: "380px" }}
        minW="280px"
        boxShadow="2xl"
      >
        {/* Compact Header */}
        <Box p={{ base: 4, md: 6 }} borderBottom="1px solid" borderColor="gray.700">
          <HStack justify="space-between" align="center">
            <Text 
              fontSize={{ base: "lg", md: "xl" }} 
              fontWeight="bold"
              color="white"
            >
              💎 Financial Tools
            </Text>
            <Button 
              variant="ghost" 
              onClick={onClose} 
              color="whiteAlpha.700"
              size="sm"
              minW="0"
              p={2}
            >
              <MdClose size={20} />
            </Button>
          </HStack>
          <Text fontSize="xs" color="whiteAlpha.600" mt={1}>
            Premium Wealth Management
          </Text>
        </Box>

        {/* Compact Menu */}
        <VStack spacing={0} p={{ base: 2, md: 4 }} align="stretch" overflowY="auto">
          {menuItems.map((item, index) => (
            <MotionButton // ✅ Now properly defined
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              variant="ghost"
              color="whiteAlpha.900"
              _hover={{ 
                bg: "whiteAlpha.100", 
                transform: "translateX(4px)",
                boxShadow: "md"
              }}
              p={{ base: 4, md: 5 }}
              borderRadius={{ base: "md", md: "lg" }}
              borderRight="3px solid transparent"
              _active={{ borderRightColor: item.color }}
              transition="all 0.2s"
              leftIcon={
                <Box
                  p={{ base: 1.5, md: 2 }}
                  bg={item.color}
                  borderRadius="full"
                  minW={{ base: "32px", md: "40px" }}
                  h={{ base: "32px", md: "40px" }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={item.icon} w={{ base: 4, md: 5 }} h={{ base: 4, md: 5 }} color="white" />
                </Box>
              }
              onClick={() => {
                item.onClick();
                onClose();
              }}
              justifyContent="flex-start"
              size="lg"
            >
              <VStack align="start" spacing={1} flex={1} ml={3}>
                <Text 
                  fontSize={{ base: "sm", md: "md" }} 
                  fontWeight="semibold"
                >
                  {item.title}
                </Text>
                <Text 
                  fontSize="xs" 
                  color="whiteAlpha.600"
                  display={{ base: "none", md: "block" }}
                >
                  {item.subtitle}
                </Text>
              </VStack>
            </MotionButton>
          ))}
        </VStack>

        {/* Footer */}
        <Box 
          p={4} 
          borderTop="1px solid" 
          borderColor="gray.700"
          mt="auto"
        >
          <Button
            w="full"
            colorScheme="purple"
            leftIcon={<Icon as={MdAnalytics} />}
            size="sm"
            _hover={{ bg: primaryColor }}
          >
            View Analytics
          </Button>
        </Box>
      </MotionDrawerContent>
    </Drawer>
  );
};

export default Sidebar;