"use client";
import { useState, useEffect } from "react";

import CategoryForm from "@/app/v2/components/forms/CategoryForm";
import Link from "next/link";

import { DataGrid, GridToolbar , GridRowsProp, GridColDef } from "@mui/x-data-grid";

import Modal from "@mui/material/Modal";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";

import IconButton from "@mui/material/IconButton";
import AddBoxIcon from "@mui/icons-material/AddBox";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Home() {
  const [category, setCategory] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const columns = [
    { field: "name", headerName: "Category Name", width: 200 },
    { field: "order", headerName: "Order", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div>
          <IconButton
            onClick={() => handleEdit(params.row)}
            color="primary"
            size="small"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row)}
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  
  async function fetchCategory() {
    try {
      const data = await fetch(`${API_BASE}/category`);
      const c = await data.json();
      const c2 = c.map((category) => {
        category.id = category._id;
        return category;
      });
      setCategory(c2);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  async function fetchCategoryById(id) {
    try {
      const response = await fetch(`${API_BASE}/category/${id}`);
      const categoryData = await response.json();
      return categoryData;
    } catch (error) {
      console.error('Error fetching category by ID:', error);
      return null;
    }
  }

  const handleOpen = () => {
    setEditMode(false);
    setSelectedCategory(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedCategory(null);
  };

  const handleEdit = async (categoryRow) => {
    // Fetch the full category data by ID to ensure we have all fields
    const fullCategoryData = await fetchCategoryById(categoryRow._id);
    if (fullCategoryData) {
      setSelectedCategory(fullCategoryData);
      setEditMode(true);
      setOpen(true);
    }
  };

  const handleDelete = async (categoryRow) => {
    if (!confirm(`Are you sure you want to delete "${categoryRow.name}"?`)) {
      return;
    }

    try {
      await fetch(`${API_BASE}/category/${categoryRow._id}`, {
        method: "DELETE",
      });
      fetchCategory(); // Refresh the list
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  function handleCategoryFormSubmit() {
    // Refresh the category list after form submission
    fetchCategory();
    handleClose();
  }

  return (
    <main>
      <div className="mx-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Categories ({category.length})</h1>
          <IconButton 
            aria-label="new-category" 
            color="primary" 
            onClick={handleOpen}
            size="large"
          >
            <AddBoxIcon />
          </IconButton>
        </div>
        
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <CategoryForm 
            onSubmit={handleCategoryFormSubmit}
            initialData={selectedCategory}
            mode={editMode ? 'edit' : 'add'}
            onCancel={handleClose}
          />
        </Modal>
        
        <DataGrid
          slots={{
            toolbar: GridToolbar,
          }}
          rows={category}
          columns={columns}
          autoHeight
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell:hover': {
              color: 'primary.main',
            },
          }}
        />
      </div>
    </main>
  );
}
