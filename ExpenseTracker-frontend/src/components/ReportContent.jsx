import { Box, Flex, Select, Text, Button } from "@chakra-ui/react";
import { useGlobalContext } from "../context/context";
import { useContext, useState } from "react";

export default function ReportContent() {
  const { transactions } = useContext(GlobalContext);
  const [filter, setFilter] = useState("month"); // or "year"
  const [selectedDate, setSelectedDate] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    const tDate = new Date(t.date);
    if (filter === "month") return tDate.getMonth() + 1 === selectedDate;
    if (filter === "year") return tDate.getFullYear() === selectedYear;
    return true;
  });

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  // Convert to CSV
  const exportCSV = () => {
    if (filteredTransactions.length === 0) return;

    const headers = ["Description", "Amount", "Category", "Type", "Date"];
    const rows = filteredTransactions.map((t) =>
      [t.description, t.amount, t.category, t.type, t.date].join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${filter}_${filter === "month" ? selectedDate : selectedYear}.csv`;
    link.click();
  };

  return (
    <Box>
      {/* Filters */}
      <Flex mb={4} gap={2} flexWrap="wrap">
        <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </Select>

        {filter === "month" && (
          <Select value={selectedDate} onChange={(e) => setSelectedDate(Number(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </Select>
        )}

        {filter === "year" && (
          <Select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </Select>
        )}
      </Flex>

      {/* Totals */}
      <Text>Total Income: ${totalIncome.toFixed(2)}</Text>
      <Text>Total Expense: ${totalExpense.toFixed(2)}</Text>

      {/* Export Button */}
      <Button mt={4} colorScheme="blue" onClick={exportCSV}>
        Export CSV
      </Button>
    </Box>
  );
}
