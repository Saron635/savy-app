import { useRef } from "react"; // ✅ Removed useContext
import { useGlobalContext } from "../context/context"; // ✅ Correct import
import { Box, Button, useColorMode, Text } from "@chakra-ui/react";
import Chart from "react-apexcharts";
import ApexCharts from "apexcharts";

export default function TransactionChartSummary() {
  // ✅ FIXED: Use hook directly
  const { 
    filteredTransactions,  // Use context's filtered transactions
    setFilteredCategory, 
    totalIncome, 
    totalExpense, 
    categories 
  } = useGlobalContext();
  
  const { colorMode } = useColorMode();
  const chartRef = useRef(null);

  // Use filteredTransactions for consistency with month/year selection
  const categoryTotals = categories.map((category) => {
    return filteredTransactions  // ✅ Use filtered data
      .filter((t) => t.type === "expense" && t.category === category.name)
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  });

  // Filter valid categories (with non-zero totals)
  const validCategories = categories.filter((_, index) => categoryTotals[index] > 0);
  const validTotals = categoryTotals.filter((total) => total > 0);

  // Calculate remaining income
  const remainingIncome = Math.max(totalIncome - totalExpense, 0);

  // Combine valid categories and remaining income for the pie chart
  const chartLabels = [...validCategories.map((cat) => cat.name), "Remaining Income"];
  const chartSeries = [...validTotals, remainingIncome];
  const chartColors = [...validCategories.map((cat) => cat.color), "#10B981"]; // Green for remaining income

  const options = {
    chart: {
      type: "pie",
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const selectedIndex = config.dataPointIndex;
          const selectedCategory = chartLabels[selectedIndex] === "Remaining Income" ? null : chartLabels[selectedIndex];
          setFilteredCategory(selectedCategory);
          console.log(`Selected: ${selectedCategory || "Remaining Income"}`);
        },
      },
    },
    labels: chartLabels,
    colors: chartColors,
    states: {
      hover: {
        filter: { type: "none" },
      },
    },
    legend: {
      show: true,
      position: "bottom",
      labels: {
        colors: colorMode === "dark" ? "#E2E8F0" : "#1A202C",
      },
    },
    dataLabels: {
      enabled: totalIncome > 0,
      formatter: function (val, opts) {
        return totalIncome > 0 ? `${val.toFixed(0)}%` : "0%";
      },
      style: {
        fontSize: "12px",
        fontWeight: "bold",
      },
    },
    tooltip: {
      enabled: true,
      theme: colorMode === "dark" ? "dark" : "light",
      custom: function ({ series, seriesIndex, w }) {
        const amount = series[seriesIndex];
        const label = w.globals.labels[seriesIndex];
        const percentOfIncome = totalIncome > 0 ? ((amount / totalIncome) * 100).toFixed(1) : 0;
        
        return `
          <div style="padding: 10px; background: ${colorMode === 'dark' ? '#1a202c' : '#fff'}; 
                      border: 1px solid ${colorMode === 'dark' ? '#2d3748' : '#e2e8f0'}; 
                      color: ${colorMode === 'dark' ? '#e2e8f0' : '#1a202c'};">
            <strong style="color: inherit;">${label}</strong><br />
            <strong>$${amount.toFixed(2)}</strong><br />
            <span>${percentOfIncome}% of Income</span>
          </div>
        `;
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: "100%" },
          legend: { position: "bottom" },
        },
      },
    ],
  };

  const handleExport = async () => {
    if (chartRef.current) {
     try {
        const dataURI = await ApexCharts.exec(chartRef.current.chart.id, "dataURI");
        const link = document.createElement("a");
        link.href = dataURI.png;
        link.download = `expense-chart-${new Date().toISOString().split('T')[0]}.png`;
        link.click();
      } catch (error) {
        console.error("Error exporting chart:", error);
      }
    }
  };

  // Show loading or empty state
  if (!categories || categories.length === 0) {
    return (
      <Box textAlign="center" py={8} color="gray.500">
        <Text>No categories available. Add some categories to see the chart.</Text>
      </Box>
    );
  }

  if (totalIncome === 0 && totalExpense === 0) {
    return (
      <Box textAlign="center" py={8} color="gray.500">
        <Text>No income or expense data for the selected period.</Text>
      </Box>
    );
  }

  return (
    <Box position="relative">
      <Chart
        options={options}
        series={chartSeries}
        type="pie"
        width="100%"
        height={300}
        ref={chartRef}
      />
      <Button
        position="absolute"
        top={2}
        right={2}
        size="sm"
        colorScheme="blue"
        onClick={handleExport}
        title="Export chart as PNG"
      >
        📊
      </Button>
    </Box>
  );
}