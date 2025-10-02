"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import CategoryForm from "@/app/v2/components/forms/CategoryForm";
import { Container, Paper, Typography, Box } from "@mui/material";

export default function EditCategoryPage() {
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await fetch(`${API_BASE}/category/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setCategoryData(data);
        } else {
          console.error('Category not found');
          router.push('/v2/category');
        }
      } catch (error) {
        console.error('Error fetching category:', error);
        router.push('/v2/category');
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchCategory();
    }
  }, [params.id, API_BASE, router]);

  const handleFormSubmit = () => {
    // Redirect back to category list after successful update
    router.push('/v2/category');
  };

  const handleCancel = () => {
    router.push('/v2/category');
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!categoryData) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography>Category not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Category
        </Typography>
        <Box sx={{ mt: 3 }}>
          <CategoryForm
            initialData={categoryData}
            mode="edit"
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </Box>
      </Paper>
    </Container>
  );
}
