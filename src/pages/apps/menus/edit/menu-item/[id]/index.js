'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, TextField, Button, Typography, CircularProgress, MenuItem } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';

const EditMenuItem = () => {
    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        food_name: '',
        description: '',
        price: '',
        preparationTime: '',
        cuisine: '',
        calories: '',
        category: '',
        subCategory: '',
        images: [],
        allergens: '',
        specialityTags: '',
        availableSizes: '',
        availability: false,
        customiseable: false,
        addOns: [],
        quantity: '',
    });

    useEffect(() => {
        if (id) {
            axios.get(`/api/menu-item?id=${id}`)
                .then(response => {
                    setFormData({
                        food_name: response.data.food_name,
                        description: response.data.description,
                        price: response.data.price,
                        preparationTime: response.data.preparationTime,
                        cuisine: response.data.cuisine,
                        calories: response.data.calories,
                        category: response.data.category,
                        subCategory: response.data.subCategory,
                        images: response.data.images,
                        allergens: response.data.allergens.join(', '),
                        specialityTags: response.data.specialityTags.join(', '),
                        availableSizes: response.data.availableSizes.join(', '),
                        availability: response.data.availability,
                        customiseable: response.data.customiseable,
                        addOns: response.data.addOns,
                        quantity: response.data.quantity,
                    });
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching menu item:', error);
                    setLoading(false);
                });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleImageChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const updatedImages = [...formData.images];
            updatedImages[index] = { file, url: URL.createObjectURL(file) };
            setFormData(prevState => ({
                ...prevState,
                images: updatedImages,
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedFormData = new FormData();

        updatedFormData.append('food_name', formData.food_name);
        updatedFormData.append('description', formData.description);
        updatedFormData.append('price', formData.price);
        updatedFormData.append('preparationTime', formData.preparationTime);
        updatedFormData.append('cuisine', formData.cuisine);
        updatedFormData.append('calories', formData.calories);
        updatedFormData.append('category', formData.category);
        updatedFormData.append('subCategory', formData.subCategory);
        updatedFormData.append('allergens', JSON.stringify(formData.allergens.split(',').map(item => item.trim())));
        updatedFormData.append('specialityTags', JSON.stringify(formData.specialityTags.split(',').map(item => item.trim())));
        updatedFormData.append('availableSizes', JSON.stringify(formData.availableSizes.split(',').map(item => item.trim())));
        updatedFormData.append('availability', formData.availability);
        updatedFormData.append('customiseable', formData.customiseable);
        updatedFormData.append('quantity', formData.quantity);

        formData.images.forEach((image, index) => {
            if (image.file) {
                updatedFormData.append(`images[${index}]`, image.file, image.file.name);
            } else {
                updatedFormData.append(`images[${index}]`, image.name);
            }
        });

        formData.addOns.forEach((addOn, index) => {
            updatedFormData.append(`addOns[${index}]`, JSON.stringify(addOn));
        });

        axios.put(`/api/update-menu-item?id=${id}`, updatedFormData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(response => {
                if (response.data) {
                    toast.success('Menu item updated successfully');
                    router.push('/apps/menus/list');
                } else {
                    toast.error('Error updating menu item');
                }
            })
            .catch(error => {
                console.error('Error updating menu item:', error);
                toast.error('Error updating menu item');
            });
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                Edit Menu Item
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Food Name"
                    name="food_name"
                    value={formData.food_name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Preparation Time"
                    name="preparationTime"
                    value={formData.preparationTime}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Cuisine"
                    name="cuisine"
                    value={formData.cuisine}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Calories"
                    name="calories"
                    value={formData.calories}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Sub Category"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                {formData.images.map((image, index) => (
                    <div key={index}>
                        <img
                            src={image?.url || `/api/get-food-image?imageName=${image.name}`}
                            alt={`Image ${index + 1}`}
                            style={{ width: '100%', marginBottom: '10px' }}
                        />
                        <Button
                            type="button"
                            variant="contained"
                            onClick={() => document.getElementById(`image-input-${index}`).click()}
                        >
                            Change Image
                        </Button>
                        <input
                            type="file"
                            id={`image-input-${index}`}
                            style={{ display: 'none' }}
                            onChange={(e) => handleImageChange(index, e)}
                        />
                    </div>
                ))}
                <TextField
                    label="Allergens"
                    name="allergens"
                    value={formData.allergens}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Speciality Tags"
                    name="specialityTags"
                    value={formData.specialityTags}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Available Sizes"
                    name="availableSizes"
                    value={formData.availableSizes}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    select
                >
                    <MenuItem value={true}>Available</MenuItem>
                    <MenuItem value={false}>Not Available</MenuItem>
                </TextField>
                <TextField
                    label="Customiseable"
                    name="customiseable"
                    value={formData.customiseable}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    select
                >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                </TextField>
                <Button type="submit" variant="contained" color="primary">
                    Save
                </Button>
            </form>
        </Container>
    );
};

export default EditMenuItem;