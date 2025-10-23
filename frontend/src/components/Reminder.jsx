// ReminderModal.js
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export default function ReminderModal({ isOpen, onClose }) {
  const textColor = useColorModeValue("gray.700", "gray.200");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontWeight="bold" textAlign="center" color={textColor}>
          💡 Financial Reminders
        </ModalHeader>
       
        <ModalBody>
          <ul style={{ listStyleType: "disc", paddingLeft: "1.5rem", lineHeight: "1.8" }}>
            <li>
              <Text color={textColor}>
                <b>50/30/20 Rule:</b> Allocate 50% to needs, 30% to wants, 20% to savings/debt repayment.
              </Text>
            </li>
            <li>
              <Text color={textColor}>
                <b>Pay Yourself First:</b> Prioritize saving before spending; automate transfers to savings.
              </Text>
            </li>
            <li>
              <Text color={textColor}>
                <b>Emergency Fund:</b> Aim for 3–6 months of expenses in a separate savings account.
              </Text>
            </li>
            <li>
              <Text color={textColor}>
                <b>Debt Management:</b> Save while paying high-interest debt; prioritize debts with rates over 6%.
              </Text>
            </li>
            <li>
              <Text color={textColor}>
                <b>Goal-Based Saving:</b> Set specific savings goals (e.g., retirement, house) and track progress.
              </Text>
            </li>
          </ul>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={onClose}>
            Got it
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
