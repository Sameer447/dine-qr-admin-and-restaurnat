// ** React Imports
import { useState } from "react";

// ** MUI Components
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";

// ** Custom Component Import
import CustomTextField from "src/@core/components/mui/text-field";

// ** Icon Imports
import Icon from "src/@core/components/icon";

const restaurantCategories = [
  "Fast Food",
  "Fine Dining",
  "Casual Dining",
  "Cafe",
  "Food Truck",
  "Buffet",
  "Barbecue",
  "Bakery",
  "Pizzeria",
];
const StepAccountDetails = ({ handleNext }) => {
  // ** States
  const [personName, setPersonName] = useState([]);
  const [values, setValues] = useState({
    showPassword: false,
    showConfirmPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleClickShowConfirmPassword = () => {
    setValues({ ...values, showConfirmPassword: !values.showConfirmPassword });
  };

  const handleChange = (event) => {
    setPersonName(event.target.value);
  };

  return (
    <>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 1.5 }}>
          Basic Information
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>
          Enter Your Restaurant Details
        </Typography>
      </Box>

      <Grid container spacing={5}>
        <Grid item xs={12} sm={12}>
          <FormControl fullWidth>
            <CustomTextField
              fullWidth
              type="file"
              label="Restaurant Logo"
              placeholder="Upload a high-resolution logo"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12}>
          <FormControl fullWidth>
            <CustomTextField
              fullWidth
              type="file"
              label="Restaurant Banner"
              placeholder="Upload a high-resolution Banner"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12}>
          <FormControl fullWidth>
            <CustomTextField
              fullWidth
              type="textarea"
              multiline
              label="Restaurant Tagline/Slogan"
              placeholder="A catchy line that summarizes the restaurant's appeal."
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <CustomTextField
              fullWidth
              label="Restaurant Name"
              placeholder="The official name of the restaurant."
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <CustomTextField
              fullWidth
              label="Business Registration Number"
              placeholder="0000-000-000-0000"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <CustomTextField
              fullWidth
              type="email"
              label="Email"
              placeholder="john.doe@email.com"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <CustomTextField
              fullWidth
              label="Phone Number"
              placeholder="+92321123456"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <CustomTextField
              fullWidth
              label="Owner/Manager Name"
              placeholder="John Doe"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <CustomTextField
              select
              fullWidth
              label="Restaurant Category"
              id="select-multiple-placeholder"
              SelectProps={{
                multiple: true,
                displayEmpty: true,
                value: personName,
                onChange: (e) => handleChange(e),
                inputProps: { "aria-label": "Without label" },
                renderValue: (selected) => {
                  if (selected.length === 0) {
                    return <em>Placeholder</em>;
                  }

                  return selected.join(", ");
                },
              }}
            >
              <MenuItem disabled value="">
                <em>Restaurant Category</em>
              </MenuItem>
              {restaurantCategories.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </CustomTextField>
          </FormControl>
        </Grid>
        {/* <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            label='Password'
            id='input-password'
            placeholder='············'
            type={values.showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                    <Icon fontSize='1.25rem' icon={values.showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            label='Confirm Password'
            id='input-confirm-password'
            type={values.showConfirmPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton edge='end' onMouseDown={e => e.preventDefault()} onClick={handleClickShowConfirmPassword}>
                    <Icon fontSize='1.25rem' icon={values.showConfirmPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextField fullWidth label='Profile Link' placeholder='johndoe/profile' />
        </Grid> */}
        <Grid
          item
          xs={12}
          sx={{ pt: (theme) => `${theme.spacing(6)} !important` }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button disabled variant="tonal" sx={{ "& svg": { mr: 2 } }}>
              <Icon fontSize="1.125rem" icon="tabler:arrow-left" />
              Previous
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{ "& svg": { ml: 2 } }}
            >
              Next
              <Icon fontSize="1.125rem" icon="tabler:arrow-right" />
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default StepAccountDetails;
