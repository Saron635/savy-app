import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import TransactionForm from "./AddTransaction";
import TransactionChartSummary from "./PieChart";

export default function Summary({
  onClose,
  isOpen,
  totalExpense = 0,
  totalIncome = 0,
  transactions = [],
  categories = [],
}) {
  const balance = totalIncome - totalExpense;

  return (
    <Box
      p={{ base: 4, md: 6 }}
      border="1px solid"
      borderColor="gray.100"
      overflow="hidden"
      borderRadius="10"
      background="white"
      w="full"
    >
      <Flex
        w="full"
        justifyContent="center"
        alignItems="flex-start"
        flexDirection={{ base: "column", lg: "row" }}
        gap={{ base: 6, lg: 10 }}
      >
        {/* Left Column: Balance & Totals */}
        <Flex
          flex={1}
          w="full"
          flexDirection="column"
          alignItems="center"
          justifyContent="flex-start"
          gap={4}
        >
          <Heading size="md" mb={4} color="gray.600" textAlign="center">
            Balance: $ {balance.toFixed(2)}
          </Heading>

          <Flex
            justifyContent="space-between"
            alignItems="center"
            bg="gray.50"
            w={{ base: "full", sm: "80%", md: "full" }}
            h="100px"
            border="1px solid"
            borderColor="gray.100"
            borderRadius="md"
            p={4}
          >
            <Flex flexDirection="column" alignItems="center">
              <Heading color="gray.700">$ {totalIncome.toFixed(2)}</Heading>
              <Text color="gray.600">Total Income</Text>
            </Flex>
          </Flex>

          <Flex
            justifyContent="space-between"
            alignItems="center"
            bg="gray.50"
            w={{ base: "full", sm: "80%", md: "full" }}
            h="100px"
            border="1px solid"
            borderColor="gray.100"
            borderRadius="md"
            p={4}
          >
            <Flex flexDirection="column" alignItems="center">
              <Heading color="gray.700">$ {totalExpense.toFixed(2)}</Heading>
              <Text color="gray.600">Total Expense</Text>
            </Flex>
          </Flex>
        </Flex>

        {/* Right Column: Pie Chart */}
        <Box
          flex={1}
          w={{ base: "100%", md: "300px" }}
          h={{ base: "300px", md: "300px" }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <TransactionChartSummary
            transactions={transactions}
            categories={categories}
          />
        </Box>
      </Flex>

      {/* Transaction Form */}
      <TransactionForm onClose={onClose} isOpen={isOpen} />
    </Box>
  );
}
