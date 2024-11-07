"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Container, Typography, Card, CardContent, CardMedia, Grid, Chip, List, ListItem, ListItemText, CardHeader } from '@mui/material';
import PageHeader from "src/@core/components/page-header";
import { fontStyle } from '@mui/system';

const MenuItemPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [menuItem, setMenuItem] = useState(null);

    useEffect(() => {
        if (id) {
            axios.get(`/api/menu-item?id=${id}`)
                .then(response => {
                    setMenuItem(response.data);
                })
                .catch(error => {
                    console.error('Error fetching menu item:', error);
                });
        }
    }, [id]);

    if (!menuItem) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container>
            <PageHeader
          title={
            <Typography variant="h4" sx={{
                fontWeight: 'bold',
                color: 'text.primary',
            }} >
                View Menu Item
            </Typography>
          }
        />
            {/* <CardHeader title="View Menu Item" /> */}
            <Typography sx={{ mt: 10 }} variant="h4" gutterBottom>{menuItem.food_name}</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="200"
                            image={`/api/get-food-image?imageName=${menuItem.images[0].name}`}
                            alt={menuItem.food_name}
                        />
                        <CardContent>
                            <Typography variant="body1">{menuItem.description}</Typography>
                            <Typography variant="h6">Price: ${menuItem.price}</Typography>
                            <Typography variant="body2">Preparation Time: {menuItem.preparationTime} mins</Typography>
                            <Typography variant="body2">Cuisine: {menuItem.cuisine}</Typography>
                            <Typography variant="body2">Calories: {menuItem.calories}</Typography>
                            <Typography variant="body2">Category: {menuItem.category}</Typography>
                            <Typography variant="body2">Sub-Category: {menuItem.subCategory}</Typography>
                            <Typography variant="body2">Availability: {menuItem.availability ? 'Available' : 'Not Available'}</Typography>
                            <Typography variant="body2">Customisable: {menuItem.customiseable ? 'Yes' : 'No'}</Typography>
                            <Typography variant="body2">Quantity: {menuItem.quantity}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Allergens</Typography>
                            {menuItem.allergens.map((allergen, index) => (
                                <Chip key={index} label={allergen} />
                            ))}
                            <Typography variant="h6" style={{ marginTop: '16px' }}>Speciality Tags</Typography>
                            {menuItem.specialityTags.map((tag, index) => (
                                <Chip key={index} label={tag} />
                            ))}
                            <Typography variant="h6" style={{ marginTop: '16px' }}>Add-Ons</Typography>
                            <List>
                                {menuItem.addOns.map((addOn, index) => (
                                    <ListItem key={index}>
                                        <ListItemText primary={addOn.name} secondary={`Price: $${addOn.price}`} />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default MenuItemPage;