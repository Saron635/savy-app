import React, { useState, useEffect } from "react"; // Remove useContext
import {
  Box,
  ScaleFade,
  Wrap,
  WrapItem,
  Button,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useGlobalContext } from "../context/context"; // ✅ Correct import
import ExpenseView from "./ExpenseView";

function Table() {
  // ✅ FIXED: Use hook directly, not useContext(hook)
  const { 
    categories, 
    filteredTransactions,  // Use context's filtered data
    setFilteredCategory 
  } = useGlobalContext();
  
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false); // Context handles loading

  // Remove backend fetch - use context transactions
  // useEffect(() => { fetchTransactions() }, []); // ❌ DELETE THIS

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setFilteredCategory(category === "all" ? null : category);
  };

  // Use context's filteredTransactions, apply category filter
  const categoryFilteredTransactions = filteredTransactions.filter(
    (t) =>
      !selectedCategory || selectedCategory === "all"
        ? true
        : t.category === selectedCategory
  );

  // Separate expenses and income for display
  const expenses = categoryFilteredTransactions.filter(t => t.type === "expense");
  const income = categoryFilteredTransactions.filter(t => t.type === "income");

  return (
    <ScaleFade initialScale={0.9} in={true}>
      {/* Category Filter Buttons */}
      <Wrap spacing={["2", "3"]} justify="center" mb={4}>
        <WrapItem>
          <Button
            leftIcon={<Text mr="2">🌟</Text>}
            bg={selectedCategory === "all" ? "blue.400" : "gray.200"}
            color={selectedCategory === "all" ? "white" : "black"}
            _hover={{ bg: "blue.500", transform: "scale(1.05)" }}
            transition="all 0.2s"
            onClick={() => handleCategoryChange("all")}
          >
            All Categories
          </Button>
        </WrapItem>

        {categories.map((cat) => (
          <WrapItem key={cat._id || cat.name}> {/* Use _id if available */}
            <Button
              leftIcon={<Text mr="2">{cat.icon}</Text>}
              bg={selectedCategory === cat.name ? cat.color : "gray.200"}
              color={selectedCategory === cat.name ? "white" : "black"}
              _hover={{
                bg: cat.color,
                color: "white",
                transform: "scale(1.05)",
              }}
              transition="all 0.2s"
              onClick={() => handleCategoryChange(cat.name)}
            >
              {cat.name}
            </Button>
          </WrapItem>
        ))}
      </Wrap>

      {/* Display Expenses & Income */}
      <Box>
        <ExpenseView data={expenses} type="expense" />
        <ExpenseView data={income} type="income" />
      </Box>
    </ScaleFade>
  );
}

export default Table;