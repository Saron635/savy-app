import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  HStack,
  Select,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react"; // ✅ Removed useContext
import { useGlobalContext } from "../context/context"; // ✅ Correct import

export default function TransactionForm({ isOpen, onClose }) {
  // ✅ FIXED: Use hook directly, not useContext()
  const { 
    formData, 
    setFormData, 
    selectedValue,      // ✅ Updated from 'value'
    setSelectedValue,   // ✅ Updated from 'setValue'
    handleFormSubmit, 
    categories = [] 
  } = useGlobalContext();
  
  const [errors, setErrors] = useState({ description: "", amount: "", category: "" });
  const toast = useToast();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        description: "",
        amount: "",
        category: "",
        type: "expense",
        date: new Date().toISOString().split('T')[0], // Today's date
      });
      setSelectedValue("expense");
      setErrors({ description: "", amount: "", category: "" });
    }
  }, [isOpen, setFormData, setSelectedValue]);

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value })); // Use functional update

    // Clear error on input
    setErrors(prev => ({ ...prev, [name]: "" }));

    // Validate on change
    if (name === "description" && !value.trim()) {
      setErrors(prev => ({ ...prev, description: "Description is required" }));
    } else if (name === "amount" && (!value || parseFloat(value) <= 0)) {
      setErrors(prev => ({ ...prev, amount: "Amount must be greater than 0" }));
    } else if (name === "category" && !value) {
      setErrors(prev => ({ ...prev, category: "Category is required" }));
    }
  }

  function handleTypeChange(val) {
    setSelectedValue(val); // ✅ Use correct setter
    setFormData(prev => ({ ...prev, type: val }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    
    // Validate all fields
    const newErrors = {
      description: !formData.description.trim() ? "Description is required" : "",
      amount: !formData.amount || parseFloat(formData.amount) <= 0 ? "Amount must be greater than 0" : "",
      category: !formData.category ? "Category is required" : "",
    };
    setErrors(newErrors);

    if (newErrors.description || newErrors.amount || newErrors.category) {
      toast({
        title: "Please fix the errors above",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      // Submit with correct type
      handleFormSubmit({ 
        ...formData, 
        type: selectedValue, // Ensure type matches radio selection
        amount: parseFloat(formData.amount) // Convert to number
      });
      
      toast({
        title: "✅ Transaction Added Successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Failed to add transaction",
        description: error.message || "Please try again",
        status: "error",
        duration: 5000,
      });
    }
  }

  // Don't render if modal is closed
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <form onSubmit={handleSubmit}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>💰 Add New Transaction</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody pb={6}>
            {/* Description */}
            <FormControl isInvalid={!!errors.description} mb={4}>
              <FormLabel>Description</FormLabel>
              <Input
                name="description"
                placeholder="e.g., Grocery shopping, Salary"
                value={formData.description || ""}
                onChange={handleFormChange}
                autoFocus
                required
              />
              <FormErrorMessage>{errors.description}</FormErrorMessage>
            </FormControl>

            {/* Amount */}
            <FormControl isInvalid={!!errors.amount} mb={4}>
              <FormLabel>Amount</FormLabel>
              <Input
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={formData.amount || ""}
                onChange={handleFormChange}
                required
              />
              <FormErrorMessage>{errors.amount}</FormErrorMessage>
            </FormControl>

            {/* Category */}
            <FormControl isInvalid={!!errors.category} mb={4}>
              <FormLabel>Category</FormLabel>
              <Select
                name="category"
                placeholder="Select a category"
                value={formData.category || ""}
                onChange={handleFormChange}
                required
              >
                {categories.map((cat) => (
                  <option key={cat._id || cat.name} value={cat.name}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.category}</FormErrorMessage>
            </FormControl>

            {/* Date */}
            <FormControl mb={4}>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                name="date"
                value={formData.date || ""}
                onChange={handleFormChange}
                required
              />
            </FormControl>

            {/* Type Selection */}
            <FormControl as="fieldset" mb={4}>
              <FormLabel as="legend">Transaction Type</FormLabel>
              <RadioGroup
                value={selectedValue}  // ✅ Use selectedValue from context
                onChange={handleTypeChange}
              >
                <HStack spacing={6}>
                  <Radio value="income">
                    💵 Income
                  </Radio>
                  <Radio value="expense">
                    💸 Expense
                  </Radio>
                </HStack>
              </RadioGroup>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} variant="ghost" mr={3}>
              Cancel
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isDisabled={!!errors.description || !!errors.amount || !!errors.category}
            >
              Add Transaction
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}