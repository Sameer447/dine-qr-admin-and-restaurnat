'use client';
import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { QRCodeCanvas } from 'qrcode.react';
import axios from 'axios';
import toast from 'react-hot-toast';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
    },
    qrCode: {
        margin: '32px',
        marginTop: '16px'
    },
    button: {
        marginTop: '16px',
    },
}));

const QRCodeView = () => {
    const classes = useStyles();
    const [qrCode, setQrCode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const restaurantId = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData'))._id : null;
        const user = JSON.parse(localStorage.getItem('userData'));
        setUserData(user);
        const fetchOrGenerateQRCode = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/getuser`, {
                    params: { _id: restaurantId },
                });
                if (response.data.user.qr_code_url) {
                    const qrCodeUrl = response.data.user.qr_code_url;
                    setQrCode(qrCodeUrl);
                } else {
                    const generateResponse = await axios.post('/api/generate-qr-code', {
                        restaurantId,
                    });
                    if (generateResponse.status === 200 || generateResponse.status === 201) {
                        toast.success(generateResponse.data.message);
                        setQrCode(generateResponse.data.qrCodeUrl);
                    } else {
                        toast.error(generateResponse.message);
                    }
                }
            } catch (error) {
                console.error('Error fetching or generating QR code:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrGenerateQRCode();
    }, []);

    const downloadQRCode = () => {
        const canvas = document.getElementById('qrcode-canvas');

        if (!canvas) {
            console.error("Canvas element not found.");
            return;
        }
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');

        if (!url) {
            console.error("Failed to get data URL from canvas.");
            return;
        }
        a.href = url;
        a.download = userData ? `${userData?.restaurantDetails?.restaurantName.toLowerCase()}_qr_code.png` : 'qr_code.png';
        a.click();
        toast.success("Qr_Code Download sucessfully!")
    };


    if (loading) {
        return (
            <Container className={classes.root}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container className={classes.root}>
            <Typography variant="h4">Restaurant QR Code</Typography>
            {qrCode ? (
                <QRCodeCanvas value={qrCode} size={128} className={classes.qrCode} id="qrcode-canvas" />
            ) : (
                <Typography variant="body1">Failed to load QR Code</Typography>
            )}
            <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => window.location.reload()}
            >
                Refresh QR Code
            </Button>
            <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={downloadQRCode}
            >
                Download QR Code
            </Button>
        </Container>
    );
};

export default QRCodeView;