import React from "react";
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";

export default function Report({ isOpen, onClose, transactions }) {
  const handleExportCSV = () => {
    const csvHeader = ["Description,Amount,Category,Type,Date"];
    const csvRows = transactions.map((t) => {
      const formattedDate = new Date(t.date).toLocaleDateString("en-GB");
      return `${t.description},${t.amount},${t.category},${t.type},${formattedDate}`;
    });

    const csvContent = [...csvHeader, ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions_report.csv";
    link.click();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Report</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {transactions && transactions.length > 0 ? (
            <>
              <Button mb={4} colorScheme="blue" onClick={handleExportCSV}>
                Export CSV
              </Button>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Description</Th>
                    <Th>Amount</Th>
                    <Th>Category</Th>
                    <Th>Type</Th>
                    <Th>Date</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {transactions.map((t) => (
                    <Tr key={t._id || t.id}>
                      <Td>{t.description}</Td>
                      <Td>${t.amount}</Td>
                      <Td>{t.category}</Td>
                      <Td>{t.type}</Td>
                      <Td>{new Date(t.date).toLocaleDateString("en-GB")}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </>
          ) : (
            <Text>No transactions to display</Text>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
