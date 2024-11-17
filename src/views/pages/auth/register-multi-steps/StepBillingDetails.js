// ** React Imports
import { useState } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Radio } from '@mui/material'
import toast from 'react-hot-toast'
import axios from 'axios'
import { ServiceUrl } from '../../../../@core/utils/global'
// import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'

// // ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// // ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

const data = [
  {
    value: 'basic',
    title: (
      <Typography variant='h4' sx={{ mb: 1 }}>
        Basic
      </Typography>
    ),
    content: (
      <Box sx={{ my: 'auto', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
          A simple start for start ups & Students
        </Typography>
        <Box sx={{ mt: 1, display: 'flex' }}>
          <Typography component='sup' sx={{ mt: 1.5, color: 'primary.main', alignSelf: 'flex-start' }}>
            $
          </Typography>
          <Typography variant='h2' sx={{ color: 'primary.main' }}>
            0
          </Typography>
          <Typography component='sub' sx={{ mb: 1.5, alignSelf: 'flex-end', color: 'text.disabled' }}>
            /month
          </Typography>
        </Box>
      </Box>
    )
  },
  {
    isSelected: true,
    value: 'standard',
    title: (
      <Typography variant='h4' sx={{ mb: 1 }}>
        Standard
      </Typography>
    ),
    content: (
      <Box sx={{ my: 'auto', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>For every businesses</Typography>
        <Box sx={{ mt: 1, display: 'flex' }}>
          <Typography component='sup' sx={{ mt: 1.5, color: 'primary.main', alignSelf: 'flex-start' }}>
            RS
          </Typography>
          <Typography variant='h2' sx={{ color: 'primary.main' }}>
            10,000
          </Typography>
          <Typography component='sub' sx={{ mb: 1.5, alignSelf: 'flex-end', color: 'text.disabled' }}>
            /month
          </Typography>
        </Box>
      </Box>
    )
  },
  {
    value: 'enterprise',
    title: (
      <Typography variant='h4' sx={{ mb: 1 }}>
        Enterprise
      </Typography>
    ),
    content: (
      <Box sx={{ my: 'auto', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
          Solution for enterprise & organizations
        </Typography>
        <Box sx={{ mt: 1, display: 'flex' }}>
          <Typography component='sup' sx={{ mt: 1.5, color: 'primary.main', alignSelf: 'flex-start' }}>
            $
          </Typography>
          <Typography variant='h2' sx={{ color: 'primary.main' }}>
            499
          </Typography>
          <Typography component='sub' sx={{ mb: 1.5, alignSelf: 'flex-end', color: 'text.disabled' }}>
            /month
          </Typography>
        </Box>
      </Box>
    )
  }
]



// // ** Styled Component for the wrapper of whole component
const BoxWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(6),
  paddingTop: theme.spacing(16),
  borderRadius: theme.shape.borderRadius
}))

// ** Styled Component for the wrapper of all the features of a plan
const BoxFeature = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '& > :not(:last-child)': {
    marginBottom: theme.spacing(2.5)
  }
}))


const StepBillingDetails = ({ handlePrev, restaurantData, personaDetail, resetSteps }) => {

  // ** State
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({
    _id: '',
    payment_method: '',
    cardholder_name: '',
    account_number: ''
  });
  const [paymentProof, setPaymentProof] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const Standard_data_Plan = data.filter(item => item.value === 'standard');

  const paymentMethods = [
    {
      _id: '1',
      payment_method: 'JazzCash',
      cardholder_name: 'Muhammad Ameen Ijaz',
      account_number: '03271277807'
    },
    {
      _id: '2',
      payment_method: 'Sada Pay',
      cardholder_name: 'Muhmmad Ameen Ijaz',
      account_number: '03271277807'
    },
    {
      _id: '3',
      payment_method: 'Meezan Bank',
      cardholder_name: 'Muhammad Ameen Ijaz',
      account_number: ' 01010101010101'
    }
  ];

  const planBenefits = [
    'Seamless QR code-based ordering system',
    'Access to exclusive deals and discounts',
    'Faster table service with real-time order tracking',
    'Customizable digital menus',
    'Integrated payment solutions for quick checkout',
    'Donation feature to support social causes',
    'Analytics dashboard for restaurant performance insights',
    'Customer feedback and rating system',
    'Secure and scalable cloud-based platform'
  ];


  const renderFeatures = () => {
    return planBenefits.map((item, index) => (
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <Box component='span' sx={{ display: 'inline-flex', color: 'text.secondary', mr: 2.5 }}>
          <Icon icon='tabler:circle' fontSize='0.875rem' />
        </Box>
        <Typography sx={{ color: 'text.secondary' }}>{item}</Typography>
      </Box>
    ))
  }


  const handlePaymentMethodChange = (e) => {
    const selectedMethod = paymentMethods.find(method => method._id === e.target.value);
    setSelectedPaymentMethod(selectedMethod);
  };


  const handleSubmit = async () => {

    if (selectedPaymentMethod._id === '') {
      toast.error('Please select a payment method');
      return;
    } else if (paymentProof === null) {
      toast.error('Please upload the payment proof');
      return;
    }

    try {
      setLoading(true);
      const email = restaurantData.email;
      const res = await axios.get(`${ServiceUrl}/Emailcheck/${email}/emailcheck`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        toast.success("Account Already Exist");
        setLoading(false);
      } else {

        const completeData = new FormData();

        // Append restaurant details
        completeData.append("role", "Resturant");
        completeData.append("email", restaurantData.email);
        completeData.append("logo", restaurantData.logo);
        completeData.append("tagline", restaurantData.tagline);
        completeData.append("restaurantName", restaurantData.restaurantName);
        completeData.append("cnicNumber", restaurantData.registrationNumber);
        completeData.append("restaurantOwner", restaurantData.retaurantOwner);

        // Append address details
        completeData.append("mobile", personaDetail.mobile);
        completeData.append("zipcode", personaDetail.zipcode);
        completeData.append("address", personaDetail.address);
        completeData.append("landmark", personaDetail.landmark);
        completeData.append("city", personaDetail.city);
        completeData.append("state", personaDetail.state);

        // Append payment details
        completeData.append("plan", "Standard");
        completeData.append("planAmount", 10000);
        completeData.append("paymentMethod", selectedPaymentMethod.payment_method);
        completeData.append("cardholderName", selectedPaymentMethod.cardholder_name);
        completeData.append("cardNumber", selectedPaymentMethod.account_number);
        completeData.append("paymentProof", paymentProof);

        const response = await axios.post(
          `${ServiceUrl}/Verification_SignUp/verification`,
          completeData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (response.status === 200) {
          toast.success(
            response.data.message || "We sent your request to the super admin",
            {
              duration: 5000,
            }
          );
          setLoading(false);
          setTimeout(() => {
            setOpen(true);
          }, 6000);
        } else if (response.status === 400) {
          console.error("Error sending request:", response.data.message);
          toast.error(response.data.message);
          setLoading(false);
        } else if (response.status === 500) {
          console.error("Error sending request:", response.data.message);
          toast.error(response.data.message);
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    resetSteps();
  };

  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    setPaymentProof(e.target.files[0]);
    const url = URL.createObjectURL(e.target.files[0]);
    setImage(url);
  }



  return (
    <>
      <Box sx={{ mb: 6 }}>
        <Typography variant='h3' sx={{ mb: 1.5 }}>
          Select Plan
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>All features are included in the Standard plan for your restaurant</Typography>
      </Box>

      <Grid container spacing={5} style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 'full'
      }} >

        <BoxWrapper
          sx={{
            marginTop: 5,
            border: theme =>
              `1px solid ${hexToRGBA(theme.palette.primary.main, 0.5)}`
          }}
        >
          <CustomChip
            rounded
            size='small'
            skin='light'
            label='Popular'
            color='primary'
            sx={{
              top: 24,
              right: 24,
              position: 'absolute',
              '& .MuiChip-label': {
                px: 1.75,
                fontWeight: 500,
                fontSize: '0.75rem'
              }
            }}
          />

          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <img
              width={140}
              src={`/images/pages/pricing-plan-standard.png`}
              height={140}
              alt={`standrad-plan-img`}
            />
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ mb: 1.5, fontWeight: 500, lineHeight: 1.385, fontSize: '1.625rem' }}>
              Standard
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>For small to medium businesses</Typography>
            <Box sx={{ my: 7, position: 'relative' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography sx={{ mt: 2.5, mr: 0.5, fontWeight: 500, color: 'primary.main', alignSelf: 'flex-start' }}>
                  Rs
                </Typography>
                <Typography variant='h1' sx={{ color: 'primary.main', fontSize: '3rem', lineHeight: 1.4168 }}>
                  10,000
                </Typography>
                <Typography sx={{ mb: 1.5, alignSelf: 'flex-end', color: 'text.disabled' }}>/month</Typography>
              </Box>
            </Box>
          </Box>
          <BoxFeature>{renderFeatures()}</BoxFeature>
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <Radio
              name={`custom-radios-plan`}
              size='small'
              color={'primary'}
              value={'standard'}
              checked={true}
            />
          </Box>
        </BoxWrapper>

        <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(6)} !important` }}>
          <Typography variant='h3' sx={{ mb: 1.5 }}>
            Select Payment Method
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Select a payment method and upload the payment proof</Typography>
        </Grid>

        <Grid item xs={12} style={{ width: 'full' }} >
          <CustomTextField
            select
            fullWidth
            defaultValue="Select Payment Method"
            SelectProps={{
              value: selectedPaymentMethod._id,
              displayEmpty: true,
              onChange: (e) => handlePaymentMethodChange(e),
            }}
          >
            <MenuItem value="" disabled>Select Payment Method</MenuItem>
            {paymentMethods.map((method) => (
              <MenuItem key={method._id} value={method._id}>
                {method.payment_method}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>

        {selectedPaymentMethod._id && (
          <Grid item xs={12}>
            <Box sx={{ mt: 4 }}>
              <Typography variant='h4' sx={{ mb: 1 }}>
                Selected Payment Method Details
              </Typography>
              <Typography><strong>Payment Method:</strong> {selectedPaymentMethod.payment_method}</Typography>
              <Typography><strong>Account Name:</strong> {selectedPaymentMethod.cardholder_name}</Typography>
              <Typography><strong>Account Number:</strong> {selectedPaymentMethod.account_number}</Typography>
            </Box>
          </Grid>
        )}

        <Grid item xs={12} sx={{
          marginTop: 5,
        }}>
          <FormControl fullWidth>
            <Typography variant='h4' sx={{ mb: 4 }}>
              Upload Payment Proof
            </Typography>
            <input
              type="file"
              className="w-full p-2 border border-gray-300 rounded"
              onChange={handleFileChange}
              required
            />
          </FormControl>
        </Grid>

        {paymentProof && (
          <Grid item xs={12}>
            <Box sx={{ mt: 4 }}>
              <Typography><strong>Selected File:</strong> {paymentProof.name}</Typography>
            </Box>
          </Grid>
        )}

        {paymentProof && (
          <Grid item xs={12}>
            <Box sx={{ mt: 4, width: '100%', height: 400 }}>
              <img src={image} alt="payment-proof" style={{ width: '100%', height: 'auto' }} />
            </Box>
          </Grid>
        )}

        <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(6)} !important` }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button color='secondary' variant='tonal' onClick={handlePrev} sx={{ '& svg': { mr: 2 } }}>
              <Icon fontSize='1.125rem' icon='tabler:arrow-left' />
              Previous
            </Button>
            <Button color='success' variant='contained' onClick={handleSubmit}>
              {loading ? (
                <CircularProgress size={24} thickness={6} color="inherit" />
              ) : (
                "Submit"
              )}
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle variant='h3' >Account Creation Request</DialogTitle>
        <DialogContent>
          <DialogContentText variant='body1' >
            Your request for account creation has been sent to the super admin. If all sets, you will be provided with credentials for login to our admin app. You will also have access to view the customer side.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}


export default StepBillingDetails;