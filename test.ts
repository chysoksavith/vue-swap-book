// In your script setup
const categoryTree = computed(() => {
  // Create a map for quick lookup
  const categoryMap = new Map<number | null, Category[]>()
  
  // Initialize map with empty arrays
  categories.value.forEach(cat => {
    if (!categoryMap.has(cat.parent_id)) {
      categoryMap.set(cat.parent_id, [])
    }
    categoryMap.get(cat.parent_id)?.push(cat)
  })

  // Recursive function to build tree
  const buildTree = (parentId: number | null, level: number = 0): Category[] => {
    const children = categoryMap.get(parentId) || []
    return children.map(child => ({
      ...child,
      level,
      children: buildTree(child.id, level + 1)
    }))
  }

  return buildTree(null)
})
const fetchCategories = async () => {
  isLoading.value = true
  error.value = null

  try {
    // Always fetch flat data - we'll build the tree ourselves
    const { data } = await api.get('/categories', { params: { format: 'flat' } })
    
    // Store both the raw categories and the tree structure
    categories.value = data.categories || data
    
    // Force re-render of tree view if needed
    if (viewMode.value === 'tree') {
      categoryTree.value = buildCategoryTree(categories.value)
    }
    
  } catch (err: any) {
    error.value = err.response?.data?.message || "Failed to load categories"
    toast.error("Failed to load categories")
  } finally {
    isLoading.value = false
  }
}

// Explicit tree building function
const buildCategoryTree = (categories: Category[]): Category[] => {
  const map = new Map<number | null, Category[]>()
  const tree: Category[] = []
  
  // Create map
  categories.forEach(cat => {
    if (!map.has(cat.parent_id)) {
      map.set(cat.parent_id, [])
    }
    map.get(cat.parent_id)?.push(cat)
  })
  
  // Build tree recursively
  const buildBranch = (parentId: number | null, level: number = 0): Category[] => {
    return (map.get(parentId) || []).map(cat => ({
      ...cat,
      level,
      children: buildBranch(cat.id, level + 1)
    }))
  }
  
 
 
  return buildBranch(null)
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  try {
    if (isEditing.value) {
      // Show confirmation if this will affect subcategories
      if (categoryForm.value.parent_id !== originalParentId.value && isCategoryHasChildren.value) {
        const confirmed = confirm(
          "This will move all subcategories with it. Continue?"
        )
        if (!confirmed) return
      }
      
      await api.put(`/categories/${categoryForm.value.id}`, categoryForm.value)
      toast.success("Category hierarchy updated")
    } else {
      await api.post('/categories', categoryForm.value)
      toast.success("Category created")
    }
    
    // Force refresh
    await fetchCategories()
    closeModal()
  } catch (err: any) {
    if (err.response?.status === 422) {
      validationErrors.value = err.response.data.errors
    } else {
      toast.error(err.response?.data?.message || "Operation failed")
    }
  } finally {
    isSubmitting.value = false
  }
}