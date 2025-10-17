import {
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
  useToast,
  Box,
  HStack,
  Text,
  SimpleGrid,
  Tooltip,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useGlobalContext } from "../context/context";
import { ChromePicker } from "react-color";

export default function CategoryManager({ isOpen, onClose }) {
  const rawContext = useGlobalContext();
  const { 
    categories = [],
    addCategory = async () => { throw new Error("addCategory not available in context") },
    editCategory = async () => { throw new Error("editCategory not available in context") },
    deleteCategory = async () => { throw new Error("deleteCategory not available in context") },
    fetchCategories = async () => { console.warn("fetchCategories not implemented") }
  } = rawContext || {};

  const [newCategory, setNewCategory] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#3B82F6");
  const [newCategoryIcon, setNewCategoryIcon] = useState("🏠");
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  // ✅ ALL EMOJIS - No slicing/limiting
  const emojiOptions = [
    { name: "🏠", label: "Home" }, { name: "🍔", label: "Food" }, { name: "🚗", label: "Transport" },
    { name: "💡", label: "Utilities" }, { name: "🩺", label: "Health" }, { name: "🎬", label: "Entertainment" },
    { name: "👕", label: "Clothing" }, { name: "💳", label: "Credit Card" }, { name: "💰", label: "Savings" },
    { name: "🛒", label: "Shopping" }, { name: "🎮", label: "Gaming" }, { name: "✈️", label: "Travel" },
    { name: "📚", label: "Education" }, { name: "🎁", label: "Gifts" }, { name: "🏋️", label: "Gym" },
    { name: "🐾", label: "Pets" }, { name: "🍷", label: "Dining Out" }, { name: "🎸", label: "Hobbies" },
    { name: "📱", label: "Phone" }, { name: "💻", label: "Tech" }, { name: "🛠️", label: "Tools" },
    { name: "🌍", label: "International" }, { name: "🎉", label: "Events" }, { name: "🖼️", label: "Art" },
    { name: "🌱", label: "Plants" }, { name: "🚲", label: "Bike" }, { name: "❓", label: "Other" },
  ];

  // ... (keep all your existing useEffect and handler functions - unchanged)

  useEffect(() => {
    const loadCategories = async () => {
      if (isOpen && typeof fetchCategories === 'function') {
        try {
          setError(null);
          setLoading(true);
          await fetchCategories();
        } catch (err) {
          console.error("Failed to fetch categories:", err);
          setError("Failed to load categories from server. Using local data.");
          toast({
            title: "Offline Mode",
            description: "Categories will sync when server is available",
            status: "warning",
            duration: 5000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
        }
      }
    };

    if (isOpen) {
      loadCategories();
    }
  }, [isOpen, fetchCategories]);

  const resetForm = () => {
    setEditingCategory(null);
    setNewCategory("");
    setNewCategoryColor("#3B82F6");
    setNewCategoryIcon("🏠");
    setError(null);
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast({ title: "Category name is required", status: "error", duration: 3000 });
      return;
    }
    if (typeof addCategory !== 'function') {
      toast({ title: "Category manager not available", status: "error", duration: 5000 });
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await addCategory(newCategory.trim(), newCategoryColor, newCategoryIcon);
      resetForm();
      toast({ title: "✅ Category added!", status: "success", duration: 3000 });
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Failed to add category";
      setError(message);
      toast({ title: "Failed to add category", description: message, status: "error", duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = async () => {
    if (!newCategory.trim() || !editingCategory) {
      toast({ title: "Invalid category data", status: "error" });
      return;
    }
    if (typeof editCategory !== 'function') {
      toast({ title: "Edit function not available", status: "error" });
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await editCategory(editingCategory, newCategory.trim(), newCategoryColor, newCategoryIcon);
      resetForm();
      toast({ title: "✅ Category updated!", status: "success", duration: 3000 });
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Failed to update category";
      setError(message);
      toast({ title: "Failed to update category", description: message, status: "error", duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    const cat = categories.find(c => c._id === id);
    if (!cat) {
      toast({ title: "Category not found", status: "error" });
      return;
    }
    if (cat.name.toLowerCase() === "other") {
      toast({ title: "Cannot delete 'Other' category", status: "warning", duration: 4000 });
      return;
    }
    const confirmed = window.confirm(`Delete "${cat.name}"? This cannot be undone.`);
    if (!confirmed) return;
    if (typeof deleteCategory !== 'function') {
      toast({ title: "Delete function not available", status: "error" });
      return;
    }
    try {
      setLoading(true);
      await deleteCategory(id);
      toast({ title: `🗑️ "${cat.name}" deleted!`, status: "success", duration: 3000 });
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Failed to delete category";
      setError(message);
      toast({ title: "Failed to delete category", description: message, status: "error", duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (cat) => {
    setEditingCategory(cat._id);
    setNewCategory(cat.name || "");
    setNewCategoryColor(cat.color || "#3B82F6");
    setNewCategoryIcon(cat.icon || "🏠");
  };

  if (!isOpen) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size={{ base: "md", md: "lg", lg: "xl" }}
      isCentered
    >
      <ModalOverlay />
      <ModalContent 
        borderRadius="2xl"
        maxW={{ base: "95vw", md: "60vw", lg: "50vw" }}
        maxH={{ base: "95vh", md: "80vh", lg: "70vh" }}
      >
        <ModalHeader>🗂️ Manage Categories</ModalHeader>
        <ModalCloseButton />
        
        {error && (
          <Alert status="error" mb={3} borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}
        
        <ModalBody pb={4}>
          <Flex 
            direction={{ base: "column", lg: "row" }} 
            gap={{ base: 2, md: 3 }}
          >
            {/* ✅ WIDER Add/Edit Form Section - Full Emoji Support */}
            <Box 
              flex={{ base: 1, lg: "0 0 70%" }}
              p={{ base: 2, md: 3 }} 
              borderWidth="1px" 
              borderRadius="md" 
              bg="gray.50"
              minW={{ lg: "400px" }}
              maxW={{ lg: "600px" }}
            >
              <Text fontWeight="bold" mb={3} fontSize={{ base: "sm", md: "md" }}>
                {editingCategory ? "✏️ Edit Category" : "➕ Add New Category"}
              </Text>
              
              <Input
                placeholder="Enter category name (e.g., Groceries, Salary)"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                mb={3}
                isDisabled={loading}
                size={{ base: "sm", md: "md" }}
                isRequired
              />
              
              <Text fontWeight="medium" mb={2}>Emoji Icon</Text>
              {/* ✅ RESPONSIVE COLUMNS - Shows ALL 26 emojis */}
              <SimpleGrid 
                columns={{ 
                  base: 4,    // Mobile: 4 per row (7 rows)
                  md: 5,      // Tablet: 5 per row (6 rows) 
                  lg: 6,      // Desktop: 6 per row (5 rows)
                  xl: 7       // Extra large: 7 per row (4 rows)
                }} 
                spacing={{ base: 1, md: 2 }}
                mb={3}
              >
                {emojiOptions.map(({ name, label }) => ( // ✅ NO .slice() - ALL emojis
                  <Tooltip key={name} label={label}>
                    <Button
                      size={{ base: "sm", md: "md" }}
                      variant={newCategoryIcon === name ? "solid" : "outline"}
                      colorScheme={newCategoryIcon === name ? "blue" : "gray"}
                      onClick={() => setNewCategoryIcon(name)}
                      isDisabled={loading}
                      borderRadius="full"
                      minW={{ base: "36px", md: "40px" }}
                      h={{ base: "36px", md: "40px" }}
                      fontSize={{ base: "md", md: "lg" }}
                    >
                      {name}
                    </Button>
                  </Tooltip>
                ))}
              </SimpleGrid>
              
              {/* ✅ REMOVED: No more "+X more" message - ALL visible */}
              
              <Text fontWeight="medium" mb={2}>Category Color</Text>
              <Box mb={3}>
                <ChromePicker
                  color={newCategoryColor}
                  onChange={(c) => setNewCategoryColor(c.hex)}
                  disableAlpha
                  width="100%"
                />
              </Box>
              
              <Button
                colorScheme="blue"
                w="full"
                onClick={editingCategory ? handleEditCategory : handleAddCategory}
                isLoading={loading}
                isDisabled={loading || !newCategory.trim()}
                size={{ base: "sm", md: "md" }}
                mb={2}
              >
                {editingCategory ? "Update Category" : "Add Category"}
              </Button>
              
              {editingCategory && (
                <Button
                  w="full"
                  onClick={resetForm}
                  isDisabled={loading}
                  variant="outline"
                  size={{ base: "sm", md: "md" }}
                  colorScheme="gray"
                >
                  Cancel Edit
                </Button>
              )}
            </Box>

            {/* Categories List - Unchanged */}
            <Box 
              flex={{ base: 1, lg: "0 0 30%" }}
              minW={{ lg: "200px" }}
              maxW={{ lg: "300px" }}
            >
              <Flex alignItems="center" mb={3}>
                <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
                  📋 Categories
                </Text>
                {loading && <Spinner size="sm" ml={2} />}
                <Text as="span" fontSize="xs" color="gray.500" ml={2}>
                  ({categories.length})
                </Text>
              </Flex>
              
              {categories.length === 0 ? (
                <Box 
                  textAlign="center" 
                  py={6} 
                  color="gray.500" 
                  border="1px dashed" 
                  borderColor="gray.200" 
                  borderRadius="md"
                  fontSize="sm"
                >
                  <Text>No categories yet</Text>
                </Box>
              ) : (
                <SimpleGrid spacing={2}>
                  {categories.slice(0, 10).map((cat) => {
                    const isProtected = cat.name?.toLowerCase() === "other";
                    const catId = cat._id || cat.name;
                    
                    return (
                      <HStack
                        key={catId}
                        justify="space-between"
                        p={2}
                        borderWidth="1px"
                        borderRadius="md"
                        bg="white"
                        boxShadow="sm"
                        transition="all 0.2s"
                        _hover={{ bg: "gray.50" }}
                        opacity={isProtected ? 0.6 : 1}
                        spacing={2}
                        align="center"
                      >
                        <Box display="flex" alignItems="center" gap={2} flex={1}>
                          <Text fontSize="18px">{cat.icon || "🏠"}</Text>
                          <Box
                            w="12px"
                            h="12px"
                            bg={cat.color || "#3B82F6"}
                            borderRadius="full"
                            border="1px solid white"
                          />
                          <Text 
                            fontWeight="medium" 
                            fontSize="sm" 
                            noOfLines={1}
                            maxW="120px"
                          >
                            {cat.name}
                          </Text>
                          {isProtected && <Text fontSize="xs" color="gray.500">🔒</Text>}
                        </Box>
                        
                        <HStack spacing={1}>
                          <Button
                            size="xs"
                            onClick={() => handleEditClick(cat)}
                            isDisabled={isProtected || loading}
                            colorScheme="blue"
                            variant="outline"
                            minW="0"
                            p={1}
                          >
                            ✏️
                          </Button>
                          <Button
                            size="xs"
                            onClick={() => handleDeleteCategory(catId)}
                            isDisabled={isProtected || loading}
                            colorScheme="red"
                            variant="outline"
                            minW="0"
                            p={1}
                          >
                            🗑️
                          </Button>
                        </HStack>
                      </HStack>
                    );
                  })}
                  {categories.length > 10 && (
                    <Box textAlign="center" py={2} color="gray.500" fontSize="sm">
                      +{categories.length - 10} more...
                    </Box>
                  )}
                </SimpleGrid>
              )}
            </Box>
          </Flex>
        </ModalBody>
        
        <ModalFooter>
          <Button 
            onClick={onClose} 
            isDisabled={loading} 
            ml="auto" 
            size="sm"
            variant="ghost"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}