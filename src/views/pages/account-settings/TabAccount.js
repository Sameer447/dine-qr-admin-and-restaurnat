// @ts-nocheck
// ** React Imports
import { useEffect, useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import FormControl from "@mui/material/FormControl";
import CardContent from "@mui/material/CardContent";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import DatePicker from "react-datepicker";
import CustomInput from "src/views/forms/form-elements/pickers/PickersCustomInput";
import "react-datepicker/dist/react-datepicker.css";
// ** Custom Component Import
import CustomTextField from "src/@core/components/mui/text-field";

// ** Third Party Imports
import { useForm, Controller } from "react-hook-form";

// ** Icon Imports
import Icon from "src/@core/components/icon";
import PickersTime from "../../forms/form-elements/pickers/PickersTime";

const initialData = {
  email: "",
  role: "Resturant",
  isActivated: true,
  restaurantDetails: {
    logo: "",
    banner: "",
    restaurantName: "",
    cnicNumber: "",
    restaurantOwner: "",
  },
  addressDetails: {
    address: "",
    state: "",
    zipcode: "",
    mobile: "",
    city: "",
    landmark: "",
  },
  restaurantContactUs: {
    heading: "",
    subHeading: "",
    description: "",
  },
  restaurantSocialMedia: {
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    portfolio: "",
  },
  restaurantAboutUs: {
    heading: "",
    subHeading: "",
    description: "",
    banner: "",
    logo: "",
    qualities: [
      {
        description: "",
      },
      {
        description: "",
      },
      {
        description: "",
      },
    ],
    features: {
      description: "",
      features: [
        {
          description: "",
          logo: "",
        },
        {
          description: "",
          logo: "",
        },
        {
          description: "",
          logo: "",
        },
      ],
    },
    workingHours: {
      days: "",
      startTime: "",
      offTime: "",
      banner: "",
    },
    discount: {
      description: "",
      banner: "",
      title: "",
    },
  },
};

const ImgStyled = styled("img")(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(6),
  borderRadius: theme.shape.borderRadius,
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    textAlign: "center",
  },
}));

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    marginLeft: 0,
    textAlign: "center",
    marginTop: theme.spacing(2),
  },
}));

const TabAccount = () => {
  // ** State
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [userInput, setUserInput] = useState("yes");
  const [userData, setUserData] = useState(initialData);
  const [imgSrc, setImgSrc] = useState("/images/avatars/15.png");
  const [secondDialogOpen, setSecondDialogOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [offTime, setOffTime] = useState(new Date());
  const [dateTime, setDateTime] = useState(new Date());

  // ** Hooks
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: initialData });
  const handleClose = () => setOpen(false);
  const handleSecondDialogClose = () => setSecondDialogOpen(false);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const user = JSON.parse(localStorage.getItem("userData"));
      setUserData(user);
      if (user) {
        setValue("email", user?.email);
        setValue("role", user?.role);
        setValue("isActivated", user?.isActivated);
        setValue("restaurantDetails", user?.restaurantDetails);
        setValue("addressDetails", user?.addressDetails);
        setValue("restaurantContactUs", user?.restaurantContactUs);
        setValue("restaurantSocialMedia", user?.restaurantSocialMedia);
        setValue("restaurantAboutUs", user?.restaurantAboutUs);
        setImgSrc(
          `/api/get-user-image?imageName=${user.restaurantDetails.logo}`,
        );
      }
    }
    return () => {
      mounted = false;
    };
  }, []);

  const onSubmit = async (data) => {
    console.log("data", data);

    try {
      // Create a new FormData object
      const formData = new FormData();

      // Append regular fields
      formData.append("email", data.email);
      formData.append("role", data.role);

      // Append restaurantDetails fields
      formData.append("logo", data.restaurantDetails.logo);
      formData.append("banner", data.restaurantDetails.banner);
      formData.append("restaurantName", data.restaurantDetails.restaurantName);
      formData.append("cnicNumber", data.restaurantDetails.cnicNumber);
      formData.append(
        "restaurantOwner",
        data.restaurantDetails.restaurantOwner,
      );

      // Append addressDetails fields
      formData.append("address", data.addressDetails.address);
      formData.append("state", data.addressDetails.state);
      formData.append("zipcode", data.addressDetails.zipcode);
      formData.append("mobile", data.addressDetails.mobile);
      formData.append("city", data.addressDetails.city);
      formData.append("landmark", data.addressDetails.landmark);

      // Append restaurantContactUs fields
      formData.append("contactUsHeading", data.restaurantContactUs.heading);
      formData.append(
        "contactUsSubHeading",
        data.restaurantContactUs.subHeading,
      );
      formData.append(
        "contactUsDescription",
        data.restaurantContactUs.description,
      );

      // Append restaurantSocialMedia fields
      formData.append("facebook", data.restaurantSocialMedia.facebook);
      formData.append("twitter", data.restaurantSocialMedia.twitter);
      formData.append("instagram", data.restaurantSocialMedia.instagram);
      formData.append("linkedin", data.restaurantSocialMedia.linkedin);
      formData.append("portfolio", data.restaurantSocialMedia.portfolio);

      // Append restaurantAboutUs fields
      formData.append("aboutUsHeading", data.restaurantAboutUs.heading);
      formData.append("aboutUsSubHeading", data.restaurantAboutUs.subHeading);
      formData.append("aboutUsDescription", data.restaurantAboutUs.description);

      // Append "About Us" qualities and features as JSON strings
      formData.append(
        "qualities",
        JSON.stringify(data.restaurantAboutUs.qualities),
      );
      formData.append(
        "features",
        JSON.stringify(data.restaurantAboutUs.features.features),
      );
      formData.append(
        "featuresDescription",
        data.restaurantAboutUs.features.description,
      );

      // Append working hours
      formData.append("workingDays", data.restaurantAboutUs.workingHours.days);
      formData.append(
        "startTime",
        data.restaurantAboutUs.workingHours.startTime,
      );
      formData.append("offTime", data.restaurantAboutUs.workingHours.offTime);
      // Append discount details
      formData.append(
        "discountDescription",
        data.restaurantAboutUs.discount.description,
      );
      formData.append("discountTitle", data.restaurantAboutUs.discount.title);

      // Append images (ensure file inputs are handled)
      if (data.restaurantDetails.logo)
        formData.append("logo", data.restaurantDetails.logo[0]);
      if (data.restaurantDetails.banner)
        formData.append("banner", data.restaurantDetails.banner[0]);
      if (data.restaurantAboutUs.logo)
        formData.append("aboutUsLogo", data.restaurantAboutUs.logo[0]);
      if (data.restaurantAboutUs.banner)
        formData.append("aboutUsBanner", data.restaurantAboutUs.banner[0]);
      if (data.restaurantAboutUs.workingHours.banner)
        formData.append(
          "workingBanner",
          data.restaurantAboutUs.workingHours.banner[0],
        );
      if (data.restaurantAboutUs.discount.banner)
        formData.append(
          "discountBanner",
          data.restaurantAboutUs.discount.banner[0],
        );

      // Make the API call
      const response = await fetch(`/api/RestaurantProfile/${userData._id}`, {
        method: "PUT",
        body: formData, // Send the FormData
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Restaurant updated successfully:", result);
      } else {
        console.error("Error updating restaurant:", response.statusText);
      }
    } catch (error) {
      console.error("Error in submission:", error);
    }
  };

  const handleConfirmation = (value) => {
    handleClose();
    setUserInput(value);
    setSecondDialogOpen(true);
  };

  const handleInputImageChange = (file) => {
    const reader = new FileReader();
    const { files } = file.target;
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result);
      reader.readAsDataURL(files[0]);
      if (reader.result !== null) {
        setInputValue(reader.result);
      }
    }
  };

  const handleInputImageReset = () => {
    setInputValue("");
    setImgSrc("/images/avatars/15.png");
  };

  // const handleFormChange = (field, value) => {
  //   setFormData({ ...formData, [field]: value });
  // };

  return (
    <Grid container spacing={6}>
      {/* Account Details Card */}
      <Grid item xs={12}>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader title="Profile Basic Informations" />
            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ImgStyled src={imgSrc} alt="Profile Pic" />
                <div>
                  <ButtonStyled
                    component="label"
                    variant="contained"
                    htmlFor="account-settings-upload-image"
                  >
                    Upload New Logo
                    <input
                      hidden
                      type="file"
                      value={inputValue}
                      accept="image/png, image/jpeg"
                      onChange={handleInputImageChange}
                      id="account-settings-upload-image"
                    />
                  </ButtonStyled>
                  {/* <ResetButtonStyled
                    color="secondary"
                    variant="tonal"
                    onClick={handleInputImageReset}
                  >
                    Reset
                  </ResetButtonStyled> */}
                  <Typography sx={{ mt: 4, color: "text.disabled" }}>
                    Allowed PNG or JPEG. Max size of 800K.
                  </Typography>
                </div>
              </Box>
            </CardContent>
            <Divider />
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name="restaurantDetails.banner"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type="file"
                        label="Upload High Quality Restaurant Banner"
                        placeholder="banner"
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.restaurantDetails?.banner)}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors.restaurantDetails?.banner && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantDetails.restaurantName"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="Restaurant Full Name"
                        placeholder="John"
                        value={value}
                        onChange={onChange}
                        error={Boolean(
                          errors.restaurantDetails?.restaurantName,
                        )}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors.restaurantDetails?.restaurantName && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantDetails.restaurantOwner"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="Restaurant Owner"
                        placeholder="Doe"
                        value={value}
                        onChange={onChange}
                        error={Boolean(
                          errors.restaurantDetails?.restaurantOwner,
                        )}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors.restaurantDetails?.restaurantOwner && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantDetails.cnicNumber"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="CNIC Number"
                        placeholder="12345-1234567-1"
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.restaurantDetails?.cnicNumber)}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors.restaurantDetails?.cnicNumber && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantDetails.tagline"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="Tagline"
                        placeholder="Tagline"
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.restaurantDetails?.tagline)}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors.restaurantDetails?.tagline && {
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
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type="email"
                        label="Email"
                        disabled
                        value={value}
                        placeholder="john.doe@example.com"
                        onChange={onChange}
                        error={Boolean(errors.email)}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors.email && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="addressDetails.mobile"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type="mobile"
                        label="Phone Number"
                        disabled
                        value={value}
                        onChange={onChange}
                        placeholder="317 961 0447"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              PK (+92)
                            </InputAdornment>
                          ),
                        }}
                        error={Boolean(errors.addressDetails?.mobile)}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors.addressDetails?.mobile && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="addressDetails.address"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="Address"
                        placeholder="Address"
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.addressDetails?.address)}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors.addressDetails?.address && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="addressDetails.state"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="State"
                        placeholder="Punjab"
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.addressDetails?.state)}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors.addressDetails?.state && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="addressDetails.zipcode"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        type="number"
                        label="Zip Code"
                        placeholder="231465"
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.addressDetails?.zipcode)}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors.addressDetails?.zipcode && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <CardHeader title="Profile Contact Us Informations" />
            <Divider />
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantContactUs.heading"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="Heading"
                        placeholder="Get in Touch with Us or We’d Love to Hear from You! like that"
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.restaurantContactUs?.heading)}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors.restaurantContactUs?.heading && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantContactUs.subHeading"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="Tagline"
                        placeholder="Reach out for any inquiries or feedback"
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.restaurantContactUs?.subHeading)}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors.restaurantContactUs?.subHeading && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name="restaurantContactUs.description"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Description"
                        placeholder="Briefly describe what your restaurant offers or how customers can contact you"
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.restaurantContactUs?.description)}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors.restaurantContactUs?.description && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <CardHeader title="Profile About Us Informations" />
            <Divider />
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantAboutUs.heading"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="Tagline"
                        placeholder="Enter your restaurant's tagline (e.g., 'Serving deliciousness since 2005')"
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.restaurantAboutUs?.heading)}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors.restaurantAboutUs?.heading && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantAboutUs.subHeading"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="Sub Heading"
                        placeholder="Our Story"
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.restaurantAboutUs?.subHeading)}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors.restaurantAboutUs?.subHeading && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name="restaurantAboutUs.description"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        multiline
                        rows={4}
                        label="History/Background"
                        placeholder="Tell us the story of how your restaurant began."
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.restaurantAboutUs?.description)}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors.restaurantAboutUs?.description && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CardHeader title="Qualities" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantAboutUs.qualities[0].description"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="Quality 1"
                        placeholder="List your restaurant's top qualities in one line"
                        value={value}
                        onChange={onChange}
                        error={Boolean(
                          errors?.restaurantAboutUs?.qualities[0]?.description,
                        )}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors?.restaurantAboutUs?.qualities[0]
                          .description && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantAboutUs.qualities[1].description"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="Quality 2"
                        placeholder="List your restaurant's top qualities in one line"
                        value={value}
                        onChange={onChange}
                        error={Boolean(
                          errors?.restaurantAboutUs?.qualities[1]?.description,
                        )}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors?.restaurantAboutUs?.qualities[1]
                          ?.description && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantAboutUs.qualities[2].description"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="Quality 3"
                        placeholder="List your restaurant's top qualities in one line"
                        value={value}
                        onChange={onChange}
                        error={Boolean(
                          errors.restaurantAboutUs?.qualities[2].description,
                        )}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors.restaurantAboutUs?.qualities[2]
                          .description && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantAboutUs.logo"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="About us logo"
                        type="file"
                        placeholder="Upload your restaurant's about us logo"
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors?.restaurantAboutUs?.logo)}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors?.restaurantAboutUs?.logo && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantAboutUs.banner"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="About us side banner"
                        type="file"
                        placeholder="Upload your restaurant's about us side banner"
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors?.restaurantAboutUs?.banner)}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors?.restaurantAboutUs?.banner && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CardHeader title="Features" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantAboutUs.features.features[0].description"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="Restaurant's Core Value 1"
                        placeholder="Share your restaurant's core values (e.g., 'Sustainability, Freshness, Innovation')."
                        value={value}
                        onChange={onChange}
                        error={Boolean(
                          errors?.restaurantAboutUs?.features?.features[0]
                            ?.description,
                        )}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors?.restaurantAboutUs?.features?.features[0]
                          ?.description && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantAboutUs.features.features[0].logo"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="Restaurant's Core Value 1 Logo"
                        type="file"
                        placeholder="Share your restaurant's core values (e.g., 'Sustainability, Freshness, Innovation')."
                        value={value}
                        onChange={onChange}
                        error={Boolean(
                          errors?.restaurantAboutUs?.features?.features[0]
                            ?.logo,
                        )}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors?.restaurantAboutUs?.features?.features[0]
                          ?.logo && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantAboutUs.features.features[1].description"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="Restaurant's Core Value 2"
                        placeholder="Share your restaurant's core values (e.g., 'Sustainability, Freshness, Innovation')."
                        value={value}
                        onChange={onChange}
                        error={Boolean(
                          errors?.restaurantAboutUs?.features?.features[1]
                            ?.description,
                        )}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors?.restaurantAboutUs?.features?.features[1]
                          ?.description && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantAboutUs.features.features[1].logo"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="Restaurant's Core Value 2 Logo"
                        type="file"
                        placeholder="Share your restaurant's core values (e.g., 'Sustainability, Freshness, Innovation')."
                        value={value}
                        onChange={onChange}
                        error={Boolean(
                          errors?.restaurantAboutUs?.features?.features[1]
                            ?.logo,
                        )}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors?.restaurantAboutUs?.features?.features[1]
                          ?.logo && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantAboutUs.features.features[2].description"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="Restaurant's Core Value 3"
                        placeholder="Share your restaurant's core values (e.g., 'Sustainability, Freshness, Innovation')."
                        value={value}
                        onChange={onChange}
                        error={Boolean(
                          errors?.restaurantAboutUs?.features?.features[2]
                            ?.description,
                        )}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors?.restaurantAboutUs?.features?.features[2]
                          ?.description && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantAboutUs.features.features[2].logo"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="Restaurant's Core Value 3 Logo"
                        type="file"
                        placeholder="Share your restaurant's core values (e.g., 'Sustainability, Freshness, Innovation')."
                        value={value}
                        onChange={onChange}
                        error={Boolean(
                          errors?.restaurantAboutUs?.features?.features[2]
                            ?.logo,
                        )}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors?.restaurantAboutUs?.features?.features[2]
                          ?.logo && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name="restaurantAboutUs.features.description"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Description Max (100 characters)"
                        placeholder="What principles guide the restaurant’s operations"
                        value={value}
                        onChange={onChange}
                        error={Boolean(
                          errors?.restaurantAboutUs?.features?.description,
                        )}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors?.restaurantAboutUs?.features
                          ?.description && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CardHeader title="Discounts" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantAboutUs.discount.title"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="Discount Title"
                        placeholder="Enter the title of the discount"
                        value={value}
                        onChange={onChange}
                        error={Boolean(
                          errors?.restaurantAboutUs?.discount?.title,
                        )}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors?.restaurantAboutUs?.discount?.title && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantAboutUs.discount.banner"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="Discount Banner"
                        type="file"
                        placeholder="Upload the discount banner"
                        value={value}
                        onChange={onChange}
                        error={Boolean(
                          errors?.restaurantAboutUs?.discount?.banner,
                        )}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors?.restaurantAboutUs?.discount?.banner && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name="restaurantAboutUs.discount.description"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Discount Description"
                        placeholder="Enter the description of the discount"
                        value={value}
                        onChange={onChange}
                        error={Boolean(
                          errors?.restaurantAboutUs?.discount?.description,
                        )}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors?.restaurantAboutUs?.discount
                          ?.description && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CardHeader title="Working Hours" />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Controller
                    name="restaurantAboutUs.workingHours.startTime"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        showTimeSelect
                        selected={time}
                        timeIntervals={30}
                        showTimeSelectOnly
                        dateFormat="h:mm aa"
                        id="time-only-picker"
                        popperPlacement={"top-start"}
                        onChange={(date) => {
                          setTime(date);
                          onChange(date);
                        }}
                        customInput={
                          <CustomInput label={"Select Restaurant On Time"} />
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Controller
                    name="restaurantAboutUs.workingHours.offTime"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        showTimeSelect
                        selected={offTime}
                        timeIntervals={30}
                        showTimeSelectOnly
                        dateFormat="h:mm aa"
                        id="time-only-picker"
                        popperPlacement={"top-start"}
                        onChange={(date) => {
                          setOffTime(date);
                          onChange(date);
                        }}
                        customInput={
                          <CustomInput label={"Select Restaurant Off Time"} />
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantAboutUs.workingHours.days"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="Working Days"
                        placeholder="Monday - Sunday"
                        value={value}
                        onChange={onChange}
                        error={Boolean(
                          errors.restaurantAboutUs?.workingHours.days,
                        )}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors.restaurantAboutUs?.workingHours.days && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name="restaurantAboutUs.workingHours.banner"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="Working Hours Banner"
                        type="file"
                        placeholder="Upload the working hours banner"
                        value={value}
                        onChange={onChange}
                        error={Boolean(
                          errors.restaurantAboutUs?.workingHours.banner,
                        )}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors.restaurantAboutUs?.workingHours.banner && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CardHeader title="Social Links" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantSocialMedia.facebook"
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="Facebook Link"
                        placeholder="https://www.facebook.com/your-restaurant"
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.restaurantSocialMedia?.facebook)}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors.restaurantSocialMedia?.facebook && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantSocialMedia.twitter"
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="Twitter Link"
                        placeholder="https://www.twitter.com/your-restaurant"
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.restaurantSocialMedia?.twitter)}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors.restaurantSocialMedia?.twitter && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantSocialMedia.instagram"
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="Instagram Link"
                        placeholder="https://www.instagram.com/your-restaurant"
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.restaurantSocialMedia?.instagram)}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors.restaurantSocialMedia?.instagram && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantSocialMedia.linkedin"
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="LinkedIn Link"
                        placeholder="https://www.linkedin.com/your-restaurant"
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.restaurantSocialMedia?.linkedin)}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors.restaurantSocialMedia?.linkedin && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantSocialMedia.portfolio"
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        label="Portfolio Link"
                        placeholder="https://www.portfolio.com/your-restaurant"
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.restaurantSocialMedia?.portfolio)}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors.restaurantSocialMedia?.portfolio && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardContent>
              <Grid
                item
                xs={12}
                sx={{ pt: (theme) => `${theme.spacing(6.5)} !important` }}
              >
                <Button type="submit" variant="contained" sx={{ mr: 4 }}>
                  Save Changes
                </Button>
                {/* <Button
                    type="reset"
                    variant="tonal"
                    color="secondary"
                    onClick={() => setFormData(initialData)}
                  >
                    Reset
                  </Button> */}
              </Grid>
            </CardContent>
          </form>
        </Card>
      </Grid>

      {/* Delete Account Card */}
      {/* <Grid item xs={12}>
        <Card>
          <CardHeader title="Delete Account" />
          <CardContent>
            <form>
              <Box sx={{ mb: 4 }}>
                <FormControl>
                  <Controller
                    name="checkbox"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormControlLabel
                        label="I confirm my account deactivation"
                        sx={{
                          "& .MuiTypography-root": {
                            color: errors.checkbox
                              ? "error.main"
                              : "text.secondary",
                          },
                        }}
                        control={
                          <Checkbox
                            {...field}
                            size="small"
                            name="validation-basic-checkbox"
                            sx={
                              errors.checkbox ? { color: "error.main" } : null
                            }
                          />
                        }
                      />
                    )}
                  />
                  {errors.checkbox && (
                    <FormHelperText
                      id="validation-basic-checkbox"
                      sx={{
                        mx: 0,
                        color: "error.main",
                        fontSize: (theme) => theme.typography.body2.fontSize,
                      }}
                    >
                      Please confirm you want to delete account
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>
              <Button
                variant="contained"
                color="error"
                type="submit"
                disabled={errors.checkbox !== undefined}
              >
                Deactivate Account
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid> */}

      {/* Deactivate Account Dialogs */}
      <Dialog fullWidth maxWidth="xs" open={open} onClose={handleClose}>
        <DialogContent
          sx={{
            pb: (theme) => `${theme.spacing(6)} !important`,
            px: (theme) => [
              `${theme.spacing(5)} !important`,
              `${theme.spacing(15)} !important`,
            ],
            pt: (theme) => [
              `${theme.spacing(8)} !important`,
              `${theme.spacing(12.5)} !important`,
            ],
          }}
        >
          <Box
            sx={{
              display: "flex",
              textAlign: "center",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center",
              "& svg": { mb: 6, color: "warning.main" },
            }}
          >
            <Icon icon="tabler:alert-circle" fontSize="5.5rem" />
            <Typography>
              Are you sure you would like to cancel your subscription?
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            px: (theme) => [
              `${theme.spacing(5)} !important`,
              `${theme.spacing(15)} !important`,
            ],
            pb: (theme) => [
              `${theme.spacing(8)} !important`,
              `${theme.spacing(12.5)} !important`,
            ],
          }}
        >
          <Button
            variant="contained"
            sx={{ mr: 2 }}
            onClick={() => handleConfirmation("yes")}
          >
            Yes
          </Button>
          <Button
            variant="tonal"
            color="secondary"
            onClick={() => handleConfirmation("cancel")}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth
        maxWidth="xs"
        open={secondDialogOpen}
        onClose={handleSecondDialogClose}
      >
        <DialogContent
          sx={{
            pb: (theme) => `${theme.spacing(6)} !important`,
            px: (theme) => [
              `${theme.spacing(5)} !important`,
              `${theme.spacing(15)} !important`,
            ],
            pt: (theme) => [
              `${theme.spacing(8)} !important`,
              `${theme.spacing(12.5)} !important`,
            ],
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              "& svg": {
                mb: 8,
                color: userInput === "yes" ? "success.main" : "error.main",
              },
            }}
          >
            <Icon
              fontSize="5.5rem"
              icon={
                userInput === "yes" ? "tabler:circle-check" : "tabler:circle-x"
              }
            />
            <Typography variant="h4" sx={{ mb: 5 }}>
              {userInput === "yes" ? "Deleted!" : "Cancelled"}
            </Typography>
            <Typography>
              {userInput === "yes"
                ? "Your subscription cancelled successfully."
                : "Unsubscription Cancelled!!"}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            px: (theme) => [
              `${theme.spacing(5)} !important`,
              `${theme.spacing(15)} !important`,
            ],
            pb: (theme) => [
              `${theme.spacing(8)} !important`,
              `${theme.spacing(12.5)} !important`,
            ],
          }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={handleSecondDialogClose}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default TabAccount;
