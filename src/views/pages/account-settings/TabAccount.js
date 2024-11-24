// @ts-nocheck
// ** React Imports
import { useEffect, useState } from "react";

// ** MUI Imports
import GridRow from "@mui/material/Grid";
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
import { set } from "nprogress";
import axios from "axios";
import { color } from "@mui/system";

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
  const [qualities, setQualities] = useState([]);
  const [features, setFeatures] = useState([]);
  const url = process?.env?.API_URL || "http://localhost:3000/api";
  const [restaurantBanner, setRestaurantBanner] = useState("");
  const [aboutUsBanner, setAboutUsBanner] = useState("");
  const [aboutUsLogo, setAboutUsLogo] = useState("");
  const [workingBanner, setWorkingBanner] = useState("");
  const [discountBanner, setDiscountBanner] = useState("");
  const [featureLogos, setFeatureLogos] = useState({});



  // ** Hooks
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues: initialData });
  const handleClose = () => setOpen(false);
  const handleSecondDialogClose = () => setSecondDialogOpen(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    setUserData(user);
    if (user) {
      setValue("email", user?.email);
      setValue("role", user?.role);
      setValue("isActivated", user?.isActivated);
      setValue("restaurantDetails.restaurantName", user?.restaurantDetails?.restaurantName);
      setValue("restaurantDetails.cnicNumber", user?.restaurantDetails?.cnicNumber);
      setValue("restaurantDetails.restaurantOwner", user?.restaurantDetails?.restaurantOwner);
      setValue("restaurantDetails.tagline", user?.restaurantDetails?.tagline);
      setValue("addressDetails.address", user?.addressDetails?.address);
      setValue("addressDetails.state", user?.addressDetails?.state);
      setValue("addressDetails.zipcode", user?.addressDetails?.zipcode);
      setValue("addressDetails.mobile", user?.addressDetails?.mobile);
      setValue("addressDetails.city", user?.addressDetails?.city);
      setValue("addressDetails.landmark", user?.addressDetails?.landmark);
      setValue("restaurantContactUs.heading", user?.restaurantContactUs?.heading);
      setValue("restaurantContactUs.subHeading", user?.restaurantContactUs?.subHeading);
      setValue("restaurantContactUs.description", user?.restaurantContactUs?.description);
      setValue("restaurantSocialMedia.facebook", user?.restaurantSocialMedia?.facebook);
      setValue("restaurantSocialMedia.twitter", user?.restaurantSocialMedia?.twitter);
      setValue("restaurantSocialMedia.instagram", user?.restaurantSocialMedia?.instagram);
      setValue("restaurantSocialMedia.linkedin", user?.restaurantSocialMedia?.linkedin);
      setValue("restaurantSocialMedia.portfolio", user?.restaurantSocialMedia?.portfolio);
      setValue("restaurantAboutUs.heading", user?.restaurantAboutUs?.heading);
      setValue("restaurantAboutUs.subHeading", user?.restaurantAboutUs?.subHeading);
      setValue("restaurantAboutUs.description", user?.restaurantAboutUs?.description);
      setValue("restaurantAboutUs.qualities", user?.restaurantAboutUs?.qualities);
      setValue("restaurantAboutUs.features", user?.restaurantAboutUs?.features);
      setValue("restaurantAboutUs.workingHours.days", user?.restaurantAboutUs?.workingHours?.days);
      setValue("restaurantAboutUs.workingHours.startTime", user?.restaurantAboutUs?.workingHours?.startTime);
      setValue("restaurantAboutUs.workingHours.offTime", user?.restaurantAboutUs?.workingHours?.offTime);
      setValue("restaurantAboutUs.discount.title", user?.restaurantAboutUs?.discount?.title);
      setValue("restaurantAboutUs.discount.description", user?.restaurantAboutUs?.discount?.description);

      setQualities(
        user?.restaurantAboutUs?.qualities?.length > 0
          ? user?.restaurantAboutUs?.qualities
          : [{ id: 1, description: "" }]
      );
      setFeatures(
        user?.restaurantAboutUs?.features?.features?.length
          ? user?.restaurantAboutUs?.features?.features
          : [{ id: 1, description: "", logo: "" }]
      );

      const initialLogos = {};
      user?.restaurantAboutUs?.features?.features?.forEach((feature, index) => {
        if (feature.logo) {
          initialLogos[index] = `/api/get-user-image?imageName=${feature?.logo}`;
        }
      });
      setFeatureLogos(initialLogos);

      setImgSrc(`/api/get-user-image?imageName=${user?.restaurantDetails?.logo}`);
      setValue("restaurantDetails.logo", user?.restaurantDetails?.logo);
      setRestaurantBanner(`/api/get-user-image?imageName=${user?.restaurantDetails?.banner}`);
      setValue("restaurantDetails.banner", user?.restaurantDetails?.banner);
      setAboutUsBanner(`/api/get-user-image?imageName=${user?.restaurantAboutUs?.banner}`);
      setValue("restaurantAboutUs.banner", user?.restaurantAboutUs?.banner);
      setAboutUsLogo(`/api/get-user-image?imageName=${user?.restaurantAboutUs?.logo}`);
      setValue("restaurantAboutUs.logo", user?.restaurantAboutUs?.logo);
      setWorkingBanner(`/api/get-user-image?imageName=${user?.restaurantAboutUs?.workingHours?.banner}`);
      setValue("restaurantAboutUs.workingHours.banner", user?.restaurantAboutUs?.workingHours?.banner);
      setDiscountBanner(`/api/get-user-image?imageName=${user?.restaurantAboutUs?.discount?.banner}`);
      setValue("restaurantAboutUs.discount.banner", user?.restaurantAboutUs?.discount?.banner);
    }
  }, [setValue]);

  const handleFileChange = (e, index, onChange) => {
    const file = e.target.files[0];
    if (file) {
      // Update the state with the new selected image URL
      const imageURL = URL.createObjectURL(file);
      setFeatureLogos((prevLogos) => ({
        ...prevLogos,
        [index]: imageURL,
      }));
      onChange(file);
    }
  };

  const onSubmit = async (data) => {
    try {

      console.log("data", data);
      const formData = new FormData();

      formData.append("email", data.email);
      formData.append("role", data.role);
      formData.append("isActivated", data.isActivated);

      // Append restaurantDetails fields
      formData.append("restaurantName", data.restaurantDetails.restaurantName);
      formData.append("cnicNumber", data.restaurantDetails.cnicNumber);
      formData.append("restaurantOwner", data.restaurantDetails.restaurantOwner);
      formData.append("tagline", data.restaurantDetails.tagline);

      // Append addressDetails fields
      formData.append("address", data.addressDetails.address);
      formData.append("state", data.addressDetails.state);
      formData.append("zipcode", data.addressDetails.zipcode);
      formData.append("mobile", data.addressDetails.mobile);
      formData.append("city", data.addressDetails.city);
      formData.append("landmark", data.addressDetails.landmark);

      // Append restaurantContactUs fields
      formData.append("contactUsHeading", data.restaurantContactUs.heading);
      formData.append("contactUsSubHeading", data.restaurantContactUs.subHeading);
      formData.append("contactUsDescription", data.restaurantContactUs.description);

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

      // Append complex fields
      if (data.restaurantAboutUs.qualities) {
        formData.append("qualities", JSON.stringify(data.restaurantAboutUs.qualities));
      }

      if (data.restaurantAboutUs.features && data.restaurantAboutUs.features.features) {
        // Append the description and other text fields of the features
        formData.append("features", JSON.stringify(data.restaurantAboutUs.features));

        // Append the logos for each feature separately
        data.restaurantAboutUs.features.features.forEach((feature, index) => {
          if (feature.logo) {
            formData.append(`featuresLogo_${index + 1}`, feature.logo);
          }
        });
      }

      formData.append("featuresDescription", data.restaurantAboutUs.features.description);

      const parseTime = (timeString) => {
        const date = new Date(timeString);
        const options = {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
          timeZone: 'Asia/Karachi' // Adjust the time zone as needed
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
      };

      let startTime = typeof data.restaurantAboutUs.workingHours.startTime === 'string'
        ? parseTime(data.restaurantAboutUs.workingHours.startTime)
        : parseTime(data.restaurantAboutUs.workingHours.startTime.toString());

      let offTime = typeof data.restaurantAboutUs.workingHours.offTime === 'string'
        ? parseTime(data.restaurantAboutUs.workingHours.offTime)
        : parseTime(data.restaurantAboutUs.workingHours.offTime.toString());

      offTime = offTime.split('"').find((item) => item !== "");
      startTime = startTime.split('"').find((item) => item !== "");

      console.log('Start Time:', startTime);
      console.log('Off Time:', offTime);

      // Append working hours
      formData.append("workingDays", data.restaurantAboutUs.workingHours.days);
      formData.append("startTime", JSON.stringify(startTime));
      formData.append("offTime", JSON.stringify(offTime));

      // Append discount details
      formData.append("discountTitle", data.restaurantAboutUs.discount.title);
      formData.append("discountDescription", data.restaurantAboutUs.discount.description);

      // Handle file uploads (logo, banner, etc.)
      const appendFile = (key, file) => {
        if (file) {
          formData.append(key, file);
        }
      };

      // restaurantDetails images fields
      appendFile("logo", data.restaurantDetails.logo);
      appendFile("banner", data.restaurantDetails.banner);

      // restaurantAboutUs images fields
      appendFile("aboutUsLogo", data.restaurantAboutUs.logo);
      appendFile("aboutUsBanner", data.restaurantAboutUs.banner);

      // restaurantAboutUs working hours image fields
      appendFile("workingBanner", data.restaurantAboutUs.workingHours.banner);

      // restaurantAboutUs discount image fields
      appendFile("discountBanner", data.restaurantAboutUs.discount.banner);

      console.log([...formData.entries()]);


      const response = await axios.post(
        `${url}/RestaurantProfile/${userData._id}/profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("response", response);

      if (response.status === 200) {
        const result = response.data;
        console.log("result", result);
        window.localStorage.setItem("userData", JSON.stringify(result?.updatedUser));
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

  const handleInputImageChange = (event) => {
    const { files } = event.target;
    if (files && files.length > 0) {
      const file = files[0];
      const fileUrl = URL.createObjectURL(file);
      setImgSrc(fileUrl);
      setInputValue(file);
    }
  };

  const handleInputImageReset = () => {
    setInputValue("");
    setImgSrc("/images/avatars/15.png");
  };

  const addQuality = () => {
    if (qualities.length < 3) {
      setQualities([
        ...qualities,
        {
          id: qualities.length + 1,
          description: "",
        },
      ]);
    } else {
      setError("restaurantAboutUs.qualities", {
        type: "manual",
        message: "You can add a maximum of 3 qualities",
      });
    }
  };

  const removeQuality = (index) => {
    const newQualities = qualities.filter((_, i) => i !== index);
    setQualities(newQualities);
  };

  const addFeature = () => {
    if (features.length < 3) {
      setFeatures([
        ...features,
        {
          id: features.length + 1,
          description: "",
          logo: "",
        },
      ]);
    } else {
      setError("restaurantAboutUs.features", {
        type: "manual",
        message: "You can add a maximum of 3 features",
      });
    }
  };

  const removeFeature = (index) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
  };

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
                  <Controller
                    name="restaurantDetails.logo"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <ButtonStyled
                        component="label"
                        variant="contained"
                        htmlFor="account-settings-upload-image"
                      >
                        Upload New Logo
                        <input
                          hidden
                          type="file"
                          accept="image/png, image/jpeg"
                          onChange={(e) => {
                            const file = e.target.files[0]; // Capture the file object
                            onChange(file);
                            handleInputImageChange(e);
                          }}
                          id="account-settings-upload-image"
                        />
                      </ButtonStyled>
                    )}
                  />
                  <Typography sx={{ mt: 4, color: "text.disabled" }}>
                    Allowed PNG or JPEG. Max size of 800K.
                  </Typography>
                </div>
              </Box>
            </CardContent>
            <Divider />
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantDetails.banner"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, ...rest } }) => (
                      <CustomTextField
                        fullWidth
                        type="file"
                        label="Upload High-Quality Restaurant Banner"
                        placeholder="banner"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          const fileUrl = URL.createObjectURL(file);
                          setRestaurantBanner(fileUrl);
                          onChange(file);
                        }}
                        error={Boolean(errors.restaurantDetails?.banner)}
                        helperText={
                          errors.restaurantDetails?.banner
                            ? "This field is required"
                            : ""
                        }
                      />
                    )}
                  />
                  {getValues("restaurantDetails.banner") &&
                    <Grid xs={12} sx={{ mt: 5 }} sm={2}> <ImgStyled src={restaurantBanner} alt="Profile Pic" />
                    </Grid>
                  }
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
                        // value={value}
                        onChange={(e) => {
                          const file = e.target.files[0]; // Capture the file object
                          const fileUrl = URL.createObjectURL(file);
                          setAboutUsLogo(fileUrl);
                          onChange(file); // Pass the file object to React Hook Form
                        }}
                        error={Boolean(errors?.restaurantAboutUs?.logo)}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors?.restaurantAboutUs?.logo && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                  {getValues("restaurantAboutUs.logo") &&
                    <Grid xs={12} sx={{ mt: 5 }} sm={2}> <ImgStyled src={aboutUsLogo} alt="Profile Pic" />
                    </Grid>
                  }
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
                        // value={value}
                        onChange={(e) => {
                          const file = e.target.files[0]; // Capture the file object
                          const fileUrl = URL.createObjectURL(file);
                          setAboutUsBanner(fileUrl);
                          onChange(file); // Pass the file object to React Hook Form
                        }}
                        error={Boolean(errors?.restaurantAboutUs?.banner)}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors?.restaurantAboutUs?.banner && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                  {getValues("restaurantAboutUs.banner") &&
                    <Grid xs={12} sx={{ mt: 5 }} sm={2}>
                      <ImgStyled src={aboutUsBanner} alt="Profile Pic" />
                    </Grid>
                  }
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CardHeader title="Qualities" />
                </Grid>
                {qualities?.map((quality, index) => (
                  <GridRow
                    key={index}
                    item
                    xs={12}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 5,
                    }}
                  >
                    <Grid item xs={12} sm={10}>
                      <Controller
                        name={`restaurantAboutUs.qualities[${index}].description`}
                        control={control}
                        rules={{ required: false }}
                        render={({ field: { value, onChange } }) => (
                          <CustomTextField
                            fullWidth
                            label={`Quality ${index + 1}`}
                            placeholder="List your restaurant's top qualities in one line"
                            value={value}
                            onChange={onChange}
                          />
                        )}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={2}
                      sx={{ marginTop: 5, marginLeft: 10 }}
                    >
                      {index === qualities.length - 1 ? (
                        <Button onClick={addQuality}>Add</Button>
                      ) : null}
                      {index !== 0 ? (
                        <Button onClick={() => removeQuality(index)}>
                          Remove
                        </Button>
                      ) : null}
                    </Grid>
                  </GridRow>
                ))}
                <Grid item xs={12} sm={12}>
                  <CardHeader title="Features" />
                </Grid>
                {features?.map((feature, index) => (
                  <Grid
                    container
                    key={index}
                    item
                    xs={12}
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'start',
                      justifyContent: 'space-between',
                      marginBottom: 5,
                    }}
                  >
                    <Grid item xs={12} sm={5}>
                      <Controller
                        name={`restaurantAboutUs.features.features[${index}].description`}
                        control={control}
                        rules={{ required: false }}
                        render={({ field: { value, onChange } }) => (
                          <CustomTextField
                            fullWidth
                            label={`Restaurant Core Value ${index + 1}`}
                            placeholder="List your restaurant's top features in one line"
                            value={value}
                            onChange={onChange}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Controller
                        name={`restaurantAboutUs.features.features[${index}].logo`}
                        control={control}
                        rules={{ required: false }}
                        render={({ field: { value, onChange } }) => (
                          <CustomTextField
                            fullWidth
                            label={`Restaurant Core Value ${index + 1} Logo`}
                            type="file"
                            placeholder="Upload your restaurant's core value logo"
                            onChange={(e) => handleFileChange(e, index, onChange)} // Handle file selection
                          />
                        )}
                      />
                      {featureLogos[index] && (
                        <Grid item xs={12} sm={2} sx={{ mt: 5 }}>
                          <ImgStyled
                            src={featureLogos[index]} // Use the corresponding image preview or initial image
                            alt={`Core Value ${index + 1} Logo Preview`}
                          />
                        </Grid>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={2} sx={{ marginTop: 5, marginLeft: 10 }}>
                      {index === features.length - 1 ? (
                        <Button onClick={addFeature}>Add</Button>
                      ) : null}
                      {index !== 0 ? (
                        <Button onClick={() => removeFeature(index)}>Remove</Button>
                      ) : null}
                    </Grid>
                  </Grid>
                ))}

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
                        // value={value}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          const fileUrl = URL.createObjectURL(file);
                          setDiscountBanner(fileUrl);
                          onChange(file);
                        }}
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
                  {getValues(`restaurantAboutUs.discount.banner`) &&
                    <Grid xs={12} sx={{ mt: 5 }} sm={2}>
                      <ImgStyled src={discountBanner} alt="Profile Pic" />
                    </Grid>
                  }
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
                          errors.restaurantAboutUs?.workingHours?.days,
                        )}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors.restaurantAboutUs?.workingHours?.days && {
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
                        onChange={(e) => {
                          const file = e.target.files[0]; // Capture the file object
                          const fileUrl = URL.createObjectURL(file);
                          setWorkingBanner(fileUrl);
                          onChange(file); // Pass the file object to React Hook Form
                        }}
                        error={Boolean(
                          errors.restaurantAboutUs?.workingHours?.banner,
                        )}
                        id="validation-basic-select"
                        aria-describedby="validation-basic-select"
                        {...(errors.restaurantAboutUs?.workingHours?.banner && {
                          helperText: "This field is required",
                        })}
                      />
                    )}
                  />
                  {getValues(`restaurantAboutUs.workingHours.banner`) &&
                    <Grid xs={12} sx={{ mt: 5 }} sm={2}>
                      <ImgStyled src={workingBanner} alt="Profile Pic" />
                    </Grid>
                  }
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
