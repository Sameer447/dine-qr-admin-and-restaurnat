'use client'
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Grid, Paper, CircularProgress } from '@mui/material';
import toast from 'react-hot-toast';

const paymentMethods = [
    { label: 'JazzCash', value: 'jazzcash' },
    { label: 'EasyPaisa', value: 'easypaisa' },
    { label: 'SadaPay', value: 'sadapay' },
    { label: 'Meezan Bank', value: 'meezanbank' },
    { label: 'Payoneer', value: 'payoneer' },
];


const AddBilling = () => {
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0].value);
    const [formData, setFormData] = useState({
        cardholderName: '',
        cardNumber: ''
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userData"));
        if (user) {
            setUserData(user);
        }
    }, []);


    const handleMethodChange = (event) => {
        setSelectedMethod(event.target.value);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (selectedMethod === "") {
                toast.error('Please select payment method');
            } else if (!formData.cardholderName) {
                toast.error('Please fill all the fields');
                return;
            } else if (!formData.cardNumber) {
                toast.error('Please fill all the fields');
                return;
            } else {
                setLoading(true);
            }

            const response = await fetch('/api/add-payment-method', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    paymentMethod: selectedMethod,
                    restaurant_id: userData._id
                }),
            });

            const result = await response.json();
            if (result) {
                toast.success('Payment method added successfully');
                setLoading(false);
                setFormData({
                    cardholderName: '',
                    cardNumber: ''
                });
                setSelectedMethod(paymentMethods[0].value);
            } else {
                toast.error('Error adding payment method');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error adding payment method:', error);
            toast.error('Error adding payment method');
            setLoading(false)
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} style={{ padding: '2rem', marginTop: '2rem' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Add Payment Method
                </Typography>
                <Box component="form" noValidate autoComplete="off"
                    onSubmit={handleSubmit}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                select
                                fullWidth
                                label="Select Payment Method"
                                value={selectedMethod}
                                onChange={handleMethodChange}
                                variant="outlined"
                                SelectProps={{
                                    native: true,
                                }}
                                required
                            >
                                {paymentMethods.map((method) => (
                                    <option key={method.value} value={method.value}>
                                        {method.label}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                        <>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Cardholder Name"
                                    variant="outlined"
                                    name="cardholderName"
                                    value={formData.cardholderName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Card Number"
                                    variant="outlined"
                                    name="cardNumber"
                                    value={formData.cardNumber}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>

                        </>
                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                size="large"
                                type="submit"
                            >
                                {loading ? <CircularProgress size={24} thickness={6} color="inherit" /> : 'Add Payment Method'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default AddBilling;