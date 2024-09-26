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
const StepAccountDetails = ({ handleNext, setRestaurantData }) => {
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
    setRestaurantData({
      ...data,
    })
    // toast.success("Form Submitted");
    handleNext();
  };

  const onImageSelect = (e) => {
    const { files } = e.target;
    if (files && files.length !== 0) {
      const url = URL.createObjectURL(files[0]);
      setImage(url);
    }
  };

  const handleNumberInput = (e) => {
    const value = e.target.value.replace(/\D/g, "");
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={12}>
            <Controller
              name="logo"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field: { onChange, ...field } }) => (
                <CustomInput
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    onChange(file); // Make sure form state is updated with the selected file
                    onImageSelect(e); // Call the preview function
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
                  {...(errors.logo && {
                    helperText: errors.logo.message,
                  })}
                />
              )}
            />

            {image && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "start",
                  mt: 2,
                }}
              >
                <img
                  src={image}
                  alt="item"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={12}>
            <Controller
              name="tagline"
              control={control}
              rules={{ required: true, minLength: 10 }}
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
              rules={{ required: true }}
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
              rules={{
                required: true,
                pattern: /^[0-9]{5}-[0-9]{7}-[0-9]$|^[0-9]{13}$/,
                maxLength: 13,
                minLength: 13,
              }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  label="CNIC (Without Dashes)"
                  placeholder="00000-0000000-0"
                  maxLength="13"
                  type="tel"
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
              rules={{ required: true, pattern: /^\S+@\S+$/i }}
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
          <Grid item xs={12} sm={6}>
            <Controller
              name="retaurantOwner"
              control={control}
              rules={{ required: true }}
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
