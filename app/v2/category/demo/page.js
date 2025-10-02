"use client";

import { useState } from "react";
import CategoryForm from "@/app/v2/components/forms/CategoryForm";
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Grid,
  Alert
} from "@mui/material";

export default function CategoryFormDemo() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [message, setMessage] = useState("");

  // Sample category data for editing demo
  const sampleCategory = {
    _id: "sample123",
    name: "Electronics",
    order: 1
  };

  const handleFormSuccess = (data) => {
    setMessage(`Form submitted successfully! Data: ${JSON.stringify(data)}`);
    setShowAddForm(false);
    setShowEditForm(false);
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setShowEditForm(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        CategoryForm Component Demo
      </Typography>
      
      {message && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* ADD Mode Demo */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              ADD Mode
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Use this mode to create new categories. The form will be empty and ready for new input.
            </Typography>
            
            <Button 
              variant="contained" 
              onClick={() => setShowAddForm(true)}
              disabled={showAddForm}
            >
              Show Add Form
            </Button>

            {showAddForm && (
              <Box sx={{ mt: 3 }}>
                <CategoryForm
                  mode="add"
                  onSubmit={handleFormSuccess}
                  onCancel={handleCancel}
                />
              </Box>
            )}
          </Paper>
        </Grid>

        {/* EDIT Mode Demo */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              EDIT Mode
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Use this mode to edit existing categories. The form will be pre-filled with existing data using reset().
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 2 }}>
              Sample data: {JSON.stringify(sampleCategory)}
            </Typography>

            <Button 
              variant="contained" 
              color="secondary"
              onClick={() => setShowEditForm(true)}
              disabled={showEditForm}
            >
              Show Edit Form
            </Button>

            {showEditForm && (
              <Box sx={{ mt: 3 }}>
                <CategoryForm
                  initialData={sampleCategory}
                  mode="edit"
                  onSubmit={handleFormSuccess}
                  onCancel={handleCancel}
                />
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Usage Instructions */}
      <Paper elevation={2} sx={{ p: 3, mt: 4, bgcolor: 'grey.50' }}>
        <Typography variant="h5" gutterBottom>
          Usage Instructions
        </Typography>
        
        <Typography variant="h6" sx={{ mt: 2 }}>
          Props:
        </Typography>
        <ul>
          <li><strong>mode</strong>: 'add' | 'edit' - Determines form behavior</li>
          <li><strong>initialData</strong>: Object - Category data to pre-fill form (for edit mode)</li>
          <li><strong>onSubmit</strong>: Function - Callback after successful form submission</li>
          <li><strong>onCancel</strong>: Function - Callback when cancel is clicked (optional)</li>
        </ul>

        <Typography variant="h6" sx={{ mt: 2 }}>
          Key Features:
        </Typography>
        <ul>
          <li>Uses React Hook Form's <code>reset()</code> to fill entire form</li>
          <li>Handles both ADD (POST) and EDIT (PUT) operations</li>
          <li>Built-in form validation and error handling</li>
          <li>Automatic form reset after successful ADD operations</li>
          <li>Fetches category by ID when editing to ensure complete data</li>
        </ul>

        <Typography variant="h6" sx={{ mt: 2 }}>
          API Endpoints Used:
        </Typography>
        <ul>
          <li><strong>GET /api/category/[id]</strong> - Fetch single category for editing</li>
          <li><strong>POST /api/category</strong> - Create new category</li>
          <li><strong>PUT /api/category</strong> - Update existing category</li>
        </ul>
      </Paper>
    </Container>
  );
}
