"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function CategoryForm({ 
  onSubmit, 
  initialData = null, 
  mode = 'add', // 'add' or 'edit'
  onCancel = null 
}) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  // Fill form when editing
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      reset(initialData);
    } else if (mode === 'add') {
      reset({ name: '', order: '' });
    }
  }, [initialData, mode, reset]);

  // Handle form submission for both ADD and EDIT
  const handleFormSubmit = async (data) => {
    try {
      if (mode === 'edit') {
        await handleEdit(data);
      } else {
        await handleAdd(data);
      }
      
      // Reset form after successful submission
      if (mode === 'add') {
        reset({ name: '', order: '' });
      }
      
      // Call parent onSubmit callback if provided
      if (onSubmit) {
        onSubmit(data);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Handle ADD operation
  const handleAdd = async (data) => {
    const response = await fetch(`${API_BASE}/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create category');
    }
    
    return response.json();
  };

  // Handle EDIT operation
  const handleEdit = async (data) => {
    const response = await fetch(`${API_BASE}/category`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update category');
    }
    
    return response.json();
  };

  const handleCancel = () => {
    reset({ name: '', order: '' });
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        {mode === 'edit' ? 'Edit Category' : 'Add New Category'}
      </Typography>
      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid grid-cols-2 gap-4 w-fit m-4">
            <div>Category Name:</div>
            <div>
              <input
                name="name"
                type="text"
                {...register("name", { required: "Category name is required" })}
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
              {errors.name && (
                <span className="text-red-500 text-xs">{errors.name.message}</span>
              )}
            </div>
            
            <div>Order:</div>
            <div>
              <input
                name="order"
                type="number"
                {...register("order", { 
                  required: "Order is required",
                  valueAsNumber: true 
                })}
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
              {errors.order && (
                <span className="text-red-500 text-xs">{errors.order.message}</span>
              )}
            </div>

            <div className="col-span-2 text-right">
              {mode === 'edit' ? (
                <>
                  <input
                    type="submit"
                    value="Update"
                    className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-2"
                  />
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <input
                  type="submit"
                  value="Add"
                  className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                />
              )}
            </div>
          </div>
        </form>
      </Typography>
    </Box>
  );
}
