import React from "react";
import { Flex, Select, ScaleFade } from "@chakra-ui/react";

export default function MonthYearSelector({ onChange }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString("default", { month: "long" }),
  }));

  return (
    <ScaleFade initialScale={0.95} in={true}>
      <Flex gap={4} align="center" justify="center">
        <Select
          w="150px"
          onChange={(e) =>
            onChange({
              month: parseInt(e.target.value),
              year: currentYear,
            })
          }
          defaultValue={new Date().getMonth() + 1}
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </Select>

        <Select
          w="120px"
          onChange={(e) =>
            onChange({
              month: new Date().getMonth() + 1,
              year: parseInt(e.target.value),
            })
          }
          defaultValue={currentYear}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </Select>
      </Flex>
    </ScaleFade>
  );
}
