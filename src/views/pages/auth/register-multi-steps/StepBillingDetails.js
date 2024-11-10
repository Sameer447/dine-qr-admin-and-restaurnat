// ** React Imports
import { useState } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'

// ** Third Party Imports
import Payment from 'payment'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomRadioIcons from 'src/@core/components/custom-radio/icons'

// ** Util Import
import { formatCVC, formatExpirationDate, formatCreditCardNumber } from 'src/@core/utils/format'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem } from '@mui/material'
import toast from 'react-hot-toast'
import axios from 'axios'

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
        <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>For small to medium businesses</Typography>
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

const StepBillingDetails = ({ handlePrev, restaurantData, personaDetail }) => {
  const initialSelected = data.filter(item => item.isSelected)[data.filter(item => item.isSelected).length - 1].value

  // ** State
  // const [cvc, setCvc] = useState('');
  // const [name, setName] = useState('');
  // const [expiry, setExpiry] = useState('');
  const [selectedRadio, setSelectedRadio] = useState('standard')
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

  console.log("restaurantData", restaurantData);
  console.log("personaDetail", personaDetail);

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

  // const handleInputChange = ({ target }) => {
  //   if (target.name === 'cardNumber') {
  //     target.value = formatCreditCardNumber(target.value, Payment);
  //     setCardNumber(target.value);
  //   } else if (target.name === 'expiry') {
  //     target.value = formatExpirationDate(target.value);
  //     setExpiry(target.value);
  //   } else if (target.name === 'cvc') {
  //     target.value = formatCVC(target.value, cardNumber, Payment);
  //     setCvc(target.value);
  //   }
  // };

  const handlePaymentMethodChange = (e) => {
    console.log("e payment method", e.target.value);
    const selectedMethod = paymentMethods.find(method => method._id === e.target.value);
    console.log("selectedMethod", selectedMethod);
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
      const res = await axios.get(`/api/Emailcheck/${email}/emailcheck`, {
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
          `/api/Verification_SignUp/verification`,
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
          setOpen(true);
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


  //////////////////////////////////////  Need this verification signup api //////////////////////////////////////

  // const onSubmit = async (formData) => {
  //   try {
  //     setLoading(true);
  //     const email = restaurantData.email;
  //     const res = await axios.get(`/api/Emailcheck/${email}/emailcheck`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     if (res.status === 200) {
  //       toast.success("Account Already Exist");
  //       setLoading(false);
  //     } else {
  //       const completeData = new FormData();
  //       // Append restaurant details
  //       completeData.append("role", "Resturant");
  //       completeData.append("email", restaurantData.email);
  //       completeData.append("logo", restaurantData.logo);
  //       completeData.append("tagline", restaurantData.tagline);
  //       completeData.append("restaurantName", restaurantData.restaurantName);
  //       completeData.append("cnicNumber", restaurantData.registrationNumber);
  //       completeData.append("restaurantOwner", restaurantData.retaurantOwner);

  //       // Append address details
  //       completeData.append("mobile", formData.mobile);
  //       completeData.append("zipcode", formData.zipcode);
  //       completeData.append("address", formData.address);
  //       completeData.append("landmark", formData.landmark);
  //       completeData.append("city", formData.city);
  //       completeData.append("state", formData.state);

  //       const response = await axios.post(
  //         `/api/Verification_SignUp/verification`,
  //         completeData,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         },
  //       );

  //       if (response.status === 200) {
  //         toast.success("We have sent you an email please verify your account");
  //         setLoading(false);
  //         resetField("address");
  //         resetField("city");
  //         resetField("landmark");
  //         resetField("mobile");
  //         resetField("state");
  //         resetField("zipcode");
  //         handlePrev();
  //       } else if (response.status === 400) {
  //         console.error("Error creating account:", response.data.message);
  //         toast.error(response.data.message);
  //         setLoading(false);
  //       } else if (response.status === 500) {
  //         console.error("Error creating account:", response.data.message);
  //         toast.error(response.data.message);
  //         setLoading(false);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error signing up:", error);
  //     toast.error(error);
  //     setLoading(false);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleClose = () => {
    setOpen(false);
    window.location.href = '/signup';
  };


  const handleRadioChange = prop => {
    if (typeof prop === 'string') {
      setSelectedRadio(prop)
    } else {
      setSelectedRadio(prop.target.value)
    }
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
        {Standard_data_Plan.map((item, index) => (
          <CustomRadioIcons
            key={index}
            data={Standard_data_Plan[0]}
            selected={selectedRadio}
            name='custom-radios-plan'
            gridProps={{ sm: 4, xs: 12 }}
            handleChange={handleRadioChange}
          />
        ))}

        {/* <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(6)} !important` }}>
          <Typography variant='h3' sx={{ mb: 1.5 }}>
            Payment Information
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Enter your card information</Typography>
        </Grid>
        <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(6)} !important` }}>
          <FormControl fullWidth>
            <CustomTextField
              fullWidth
              name='cardNumber'
              value={cardNumber}
              autoComplete='off'
              label='Card Number'
              onChange={handleInputChange}
              placeholder='0000 0000 0000 0000'
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            name='name'
            value={name}
            autoComplete='off'
            label='Name on Card'
            placeholder='John Doe'
            onChange={e => setName(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <CustomTextField
            fullWidth
            name='expiry'
            label='Expiry'
            value={expiry}
            placeholder='MM/YY'
            onChange={handleInputChange}
            inputProps={{ maxLength: '5' }}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <CustomTextField
            fullWidth
            name='cvc'
            label='CVC'
            value={cvc}
            placeholder='234'
            autoComplete='off'
            onChange={handleInputChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position='start' sx={{ '& svg': { cursor: 'pointer' } }}>
                  <Tooltip title='Card Verification Value'>
                    <Box sx={{ display: 'flex' }}>
                      <Icon fontSize='1.25rem' icon='tabler:question-circle' />
                    </Box>
                  </Tooltip>
                </InputAdornment>
              )
            }}
          />
        </Grid> */}

        <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(6)} !important` }}>
          <Typography variant='h3' sx={{ mb: 1.5 }}>
            Select Payment Method
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Select a payment method and upload the payment proof</Typography>
        </Grid>
        {/* <Grid item xs={12}>
          <FormControl fullWidth>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={selectedPaymentMethod._id}
              onChange={handlePaymentMethodChange}
              required
            >
              <option value="" disabled>Select a payment method</option>
              {paymentMethods.map((method) => (
                <option key={method._id} value={method._id}>
                  {method.payment_method}
                </option>
              ))}
            </select>
          </FormControl>
        </Grid> */}

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

        <Grid item xs={12}>
          <FormControl fullWidth>
            <Typography variant='h4' sx={{ mb: 1 }}>
              Upload Payment Proof
            </Typography>
            <input
              type="file"
              className="w-full p-2 border border-gray-300 rounded"
              onChange={(e) => setPaymentProof(e.target.files[0])}
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
                <text>Submit</text>
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

export default StepBillingDetails
