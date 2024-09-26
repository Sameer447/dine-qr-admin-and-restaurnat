// @ts-nocheck
// ** MUI Components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";

// ** Custom Component Import
import CustomTextField from "src/@core/components/mui/text-field";

// ** Icon Imports
import Icon from "src/@core/components/icon";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { ServiceUrl } from "src/@core/utils/global";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { useState } from "react";

const defaultValues = {
  mobile: "",
  zipcode: "",
  address: "",
  landmark: "",
  city: "",
  state: "",
};

const StepPersonalDetails = ({ handleNext, handlePrev, restaurantData }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm({ defaultValues });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const email = restaurantData.email;
      const res = await axios.get(`/api/Emailcheck/${email}/emailcheck`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("res:", res);

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
        completeData.append("mobile", formData.mobile);
        completeData.append("zipcode", formData.zipcode);
        completeData.append("address", formData.address);
        completeData.append("landmark", formData.landmark);
        completeData.append("city", formData.city);
        completeData.append("state", formData.state);

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
          toast.success("We have sent you an email please verify your account");
          const register = await axios.post(
            "/api/signup/signup",
            completeData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );
          console.log("User created:", register?.data);

          setLoading(false);
          resetField("address");
          resetField("city");
          resetField("landmark");
          resetField("mobile");
          resetField("state");
          resetField("zipcode");
          handlePrev();
        } else if (response.status === 400) {
          console.error("Error creating account:", response.data.message);
          toast.error(response.data.message, 10000);
          setLoading(false);
        } else if (response.status === 500) {
          console.error("Error creating account:", response.data.message);
          toast.error(response.data.message, 10000);
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error(error, 10000);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // const onSubmit = async (formData) => {
  //   try {

  //     const email = restaurantData.email;
  //     const res = await axios.get(`/api/Emailcheck/${email}/emailcheck`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (res.status === 200) {
  //       toast.success("Account Already Exist");
  //     } else if (res.status === 405) {
  //       toast.error(res.data.message);
  //     } else if (res.status === 404) {
  //       toast.error(res.data.message);
  //     } else if (res.status === 500) {
  //       toast.error(res.data.message);
  //     } else {
  //       const completeData = new FormData();

  //       // Append restaurant details
  //       completeData.append('role', 'Resturant');
  //       completeData.append('email', restaurantData.email);
  //       completeData.append('logo', restaurantData.logo);
  //       completeData.append('tagline', restaurantData.tagline);
  //       completeData.append('restaurantName', restaurantData.restaurantName);
  //       completeData.append('cnicNumber', restaurantData.registrationNumber);
  //       completeData.append('restaurantOwner', restaurantData.retaurantOwner);

  //       // Append address details
  //       completeData.append('mobile', formData.mobile);
  //       completeData.append('zipcode', formData.zipcode);
  //       completeData.append('address', formData.address);
  //       completeData.append('landmark', formData.landmark);
  //       completeData.append('city', formData.city);
  //       completeData.append('state', formData.state);
  //       completeData.append('password', 'Ameen123*');

  //       const response = await axios.post(`/api/signup/signup`, completeData, {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       });

  //       if (response.status === 200) {

  //         console.log('User created:', response.data.createdUser);
  //         toast.success("Form Submitted");
  //         // handleNext(); // Move to the next step after success
  //       } else if (response.status === 400) {
  //         console.error('Error creating account:', response.data.message);
  //         toast.error(response.data.message);
  //       } else if (response.status === 500) {
  //         console.error('Error creating account:', response.data.message);
  //         toast.error(response.data.message);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error signing up:', error);
  //     toast.error(error);
  //   }
  // };

  return (
    <>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 1.5 }}>
          Restaurant Address Information
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>
          Enter Your Restaurant Address Information
        </Typography>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="mobile"
              control={control}
              rules={{ required: true, maxLength: 11, minLength: 10 }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  label="Mobile"
                  placeholder="202 555 0111"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">PK (+92)</InputAdornment>
                    ),
                  }}
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.mobile)}
                  aria-describedby="validation-basic-first-name"
                  {...(errors.mobile && {
                    helperText: "This field is required",
                  })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="zipcode"
              control={control}
              rules={{
                required: true,
                minLength: 5,
                maxLength: 5,
                pattern: [0 - 9][5],
              }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  type="tel"
                  label="Zipcode"
                  placeholder="54000"
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.zipcode)}
                  aria-describedby="validation-basic-first-name"
                  {...(errors.zipcode && {
                    helperText: "This field is required",
                  })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="address"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  label="Address"
                  placeholder="7777, Mendez Plains, Florida"
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.address)}
                  aria-describedby="validation-basic-first-name"
                  {...(errors.address && {
                    helperText: "This field is required",
                  })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="landmark"
              control={control}
              rules={{ required: false }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  label="Landmark (Optional)"
                  placeholder="Near Central Park"
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.landmark)}
                  aria-describedby="validation-basic-first-name"
                  {...(errors.landmark && {
                    helperText: "This field is required",
                  })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="city"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  label="City"
                  placeholder="Lahore"
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.city)}
                  aria-describedby="validation-basic-first-name"
                  {...(errors.city && {
                    helperText: "This field is required",
                  })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="state"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  label="State"
                  placeholder="Punjab"
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.state)}
                  aria-describedby="validation-basic-first-name"
                  {...(errors.state && {
                    helperText: "This field is required",
                  })}
                />
              )}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ pt: (theme) => `${theme.spacing(6)} !important` }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                color="secondary"
                variant="tonal"
                onClick={handlePrev}
                sx={{ "& svg": { mr: 2 } }}
              >
                <Icon fontSize="1.125rem" icon="tabler:arrow-left" />
                Previous
              </Button>
              <Button variant="contained" color="success" type="submit">
                {loading ? (
                  <CircularProgress size={24} thickness={6} color="inherit" />
                ) : (
                  <text>Submit</text>
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default StepPersonalDetails;

{
  /* <>
    <Box sx={{ mb: 6 }}>
      <Typography variant="h3" sx={{ mb: 1.5 }}>
        Restaurant Address Information
      </Typography>
      <Typography sx={{ color: "text.secondary" }}>
        Enter Your Restaurant Address Information
      </Typography>
    </Box>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="mobile"
            control={control}
            rules={{ required: true, maxLength: 11, minLength: 10 }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                label="Mobile"
                placeholder="202 555 0111"
                InputProps={{
                  startAdornment: <InputAdornment position="start">PK (+92)</InputAdornment>,
                }}
                value={value}
                onChange={onChange}
                error={Boolean(errors.mobile)}
                helperText={errors.mobile ? "Mobile is required (10-11 digits)" : ""}
              />
            )}
          />
        </Grid>

        {/* Other form fields for zipcode, address, landmark, city, and state 
        
        <Grid item xs={12}>
          <Controller
            name="zipcode"
            control={control}
            rules={{ required: true, minLength: 6, maxLength: 6 }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                label="Zipcode"
                placeholder="689421"
                value={value}
                onChange={onChange}
                error={Boolean(errors.zipcode)}
                helperText={errors.zipcode ? "Zipcode must be 6 digits" : ""}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="address"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                label="Address"
                placeholder="7777, Mendez Plains, Florida"
                value={value}
                onChange={onChange}
                error={Boolean(errors.address)}
                helperText={errors.address ? "Address is required" : ""}
              />
            )}
          />
        </Grid>

        {/* City and state fields
        <Grid item xs={12} sm={6}>
          <Controller
            name="city"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                label="City"
                placeholder="Lahore"
                value={value}
                onChange={onChange}
                error={Boolean(errors.city)}
                helperText={errors.city ? "City is required" : ""}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="state"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                label="State"
                placeholder="Punjab"
                value={value}
                onChange={onChange}
                error={Boolean(errors.state)}
                helperText={errors.state ? "State is required" : ""}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sx={{ pt: (theme) => `${theme.spacing(6)} !important` }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button color="secondary" variant="tonal" onClick={handlePrev}>
              Previous
            </Button>
            <Button variant="contained" color="success" type="submit">
              Submit
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  </> */
}
