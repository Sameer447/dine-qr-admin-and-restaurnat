// ** React Imports
import { useState, forwardRef } from "react";

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
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

// const restaurantCategories = [
//   "Fast Food",
//   "Fine Dining",
//   "Casual Dining",
//   "Cafe",
//   "Food Truck",
//   "Buffet",
//   "Barbecue",
//   "Bakery",
//   "Pizzeria",
// ];

const CustomInput = forwardRef(({ ...props }, ref) => {
  return (
    <CustomTextField
      fullWidth
      inputRef={ref}
      {...props}
      sx={{ width: "100%" }}
    />
  );
});

const defaultValues = {
  logo: "",
  tagline: "",
  restaurantName: "",
  registrationNumber: "",
  email: "",
  retaurantOwner: "",
};
const StepAccountDetails = ({ handleNext }) => {
  // ** States
  const [image, setImage] = useState(null);
  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  // ** Vars

  const onSubmit = (data) => {
    console.log("data :>> ", data);
    toast.success("Form Submitted");
    handleNext();
  };

  const onImageSelect = (e) => {
    const reader = new FileReader();
    const { files } = e.target;
    if (files && files.length !== 0) {
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(files[0]);
      if (reader.result !== null) {
        return reader.result;
      }
    }
  };

  // const handleChange = (event) => {
  //   setPersonName(event.target.value);
  // };

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

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={12}>
            <Controller
              name="logo"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field: { value, onChange } }) => (
                <CustomInput
                  type="file"
                  // value={value}
                  label="Restaurant Logo"
                  onChange={(e) => {
                    onChange(e.target.files[0]);
                    onImageSelect(e);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton
                          color="primary"
                          aria-label="upload picture"
                          component="span"
                        >
                          <Icon icon="bi:image" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={Boolean(errors.logo)}
                  aria-describedby="validation-basic-item-image"
                  {...(errors.itemImage && {
                    helperText: "This field is required",
                  })}
                />
              )}
            />
          </Grid>
          {/* <Grid item xs={12} sm={12}>
          <FormControl fullWidth>
            <CustomTextField
              fullWidth
              type="file"
              label="Restaurant Banner"
              placeholder="Upload a high-resolution Banner"
            />
          </FormControl>
        </Grid> */}
          <Grid item xs={12} sm={12}>
            <Controller
              name="tagline"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  type="textarea"
                  label="Restaurant Tagline/Slogan"
                  placeholder="A catchy line that summarizes the restaurant's appeal."
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.tagline)}
                  aria-describedby="validation-basic-first-name"
                  {...(errors.tagline && {
                    helperText: "This field is required",
                  })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="restaurantName"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  label="Restaurant Name"
                  placeholder="The official name of the restaurant."
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.restaurantName)}
                  aria-describedby="validation-basic-first-name"
                  {...(errors.restaurantName && {
                    helperText: "This field is required",
                  })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="registrationNumber"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  label="Business Registration Number/CNIC"
                  placeholder="00000-0000000-0"
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.registrationNumber)}
                  aria-describedby="validation-basic-first-name"
                  {...(errors.registrationNumber && {
                    helperText: "This field is required",
                  })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="email"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  type="email"
                  label="Email"
                  placeholder="john.doe@email.com"
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.email)}
                  aria-describedby="validation-basic-first-name"
                  {...(errors.email && {
                    helperText: "This field is required",
                  })}
                />
              )}
            />
          </Grid>
          {/* <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <CustomTextField
              fullWidth
              label="Phone Number"
              placeholder="+92321123456"
            />
          </FormControl>
        </Grid> */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="retaurantOwner"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  label="Owner/Manager Name"
                  placeholder="John Doe"
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.retaurantOwner)}
                  aria-describedby="validation-basic-first-name"
                  {...(errors.retaurantOwner && {
                    helperText: "This field is required",
                  })}
                />
              )}
            />
          </Grid>
          {/* <Grid item xs={12} sm={6}>
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
        </Grid> */}
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
                // onClick={handleNext}
                type="submit"
                sx={{ "& svg": { ml: 2 } }}
              >
                Next
                <Icon fontSize="1.125rem" icon="tabler:arrow-right" />
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default StepAccountDetails;
