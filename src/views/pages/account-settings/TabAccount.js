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
      hours: "",
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
  const [formData, setFormData] = useState(initialData);
  const [imgSrc, setImgSrc] = useState("/images/avatars/15.png");
  const [secondDialogOpen, setSecondDialogOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [dateTime, setDateTime] = useState(new Date());

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { checkbox: false } });
  const handleClose = () => setOpen(false);
  const handleSecondDialogClose = () => setSecondDialogOpen(false);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const user = JSON.parse(localStorage.getItem("userData"));
      console.log(`user`, user);

      if (user) {
        setFormData({
          ...formData,
          email: user.email,
          number: user.phone,
          restaurantDetails: {
            ...formData.restaurantDetails,
            logo: user.restaurantDetails.logo,
            restaurantName: user.restaurantDetails.restaurantName,
            restaurantOwner: user.restaurantDetails.restaurantOwner,
            cnicNumber: user.restaurantDetails.cnicNumber,
            tagline: user.restaurantDetails.tagline,
          },
          addressDetails: {
            ...formData.addressDetails,
            address: user.addressDetails.address,
            state: user.addressDetails.state,
            zipcode: user.addressDetails.zipcode,
            mobile: user.addressDetails.mobile,
          },
        });
        setImgSrc(
          `/api/get-user-image?imageName=${user.restaurantDetails.logo}`,
        );
      }
    }
    return () => {
      mounted = false;
    };
  }, []);

  const onSubmit = () => setOpen(true);
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

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Grid container spacing={6}>
      {/* Account Details Card */}
      <Grid item xs={12}>
        <Card>
          <form>
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
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <CustomTextField
                        fullWidth
                        type="file"
                        label="Upload High Quality Restaurant Banner"
                        placeholder="banner"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error.message : null}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantDetails.restaurantName"
                    control={control}
                    rules={{ required: true }}
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <CustomTextField
                        fullWidth
                        label="Restaurant Full Name"
                        placeholder="John"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error.message : null}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantDetails.restaurantOwner"
                    control={control}
                    rules={{ required: true }}
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <CustomTextField
                        fullWidth
                        label="Restaurant Owner"
                        placeholder="Doe"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error.message : null}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantDetails.cnicNumber"
                    control={control}
                    rules={{ required: true }}
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <CustomTextField
                        fullWidth
                        label="CNIC Number"
                        placeholder="12345-1234567-1"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error.message : null}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="restaurantDetails.tagline"
                    control={control}
                    rules={{ required: true }}
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <CustomTextField
                        fullWidth
                        label="Tagline"
                        placeholder="Tagline"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        helperText={error ? error.message : null}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    type="email"
                    label="Email"
                    disabled
                    value={formData.email}
                    placeholder="john.doe@example.com"
                    onChange={(e) => handleFormChange("email", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    type="number"
                    label="Phone Number"
                    disabled
                    value={formData.addressDetails.mobile}
                    placeholder="317 961 0447"
                    onChange={(e) => handleFormChange("number", e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          PK (+92)
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label="Address"
                    placeholder="Address"
                    value={formData.addressDetails.address}
                    onChange={(e) =>
                      handleFormChange("address", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label="State"
                    placeholder="Punjab"
                    value={formData.addressDetails.state}
                    onChange={(e) => handleFormChange("state", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    type="number"
                    label="Zip Code"
                    placeholder="231465"
                    value={formData.addressDetails.zipcode}
                    onChange={(e) =>
                      handleFormChange("zipcode", e.target.value)
                    }
                  />
                </Grid>
                {/* <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    defaultValue=""
                    label="Country"
                    SelectProps={{
                      value: formData.country,
                      onChange: (e) =>
                        handleFormChange("country", e.target.value),
                    }}
                  >
                    <MenuItem value="australia">Australia</MenuItem>
                    <MenuItem value="canada">Canada</MenuItem>
                    <MenuItem value="france">France</MenuItem>
                    <MenuItem value="united-kingdom">United Kingdom</MenuItem>
                    <MenuItem value="united-states">United States</MenuItem>
                  </CustomTextField>
                </Grid> */}
                {/* <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    defaultValue=""
                    label="Language"
                    SelectProps={{
                      value: formData.language,
                      onChange: (e) =>
                        handleFormChange("language", e.target.value),
                    }}
                  >
                    <MenuItem value="arabic">Arabic</MenuItem>
                    <MenuItem value="english">English</MenuItem>
                    <MenuItem value="french">French</MenuItem>
                    <MenuItem value="german">German</MenuItem>
                    <MenuItem value="portuguese">Portuguese</MenuItem>
                  </CustomTextField>
                </Grid> */}
                {/* <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    defaultValue=""
                    label="Timezone"
                    SelectProps={{
                      value: formData.timezone,
                      onChange: (e) =>
                        handleFormChange("timezone", e.target.value),
                    }}
                  >
                    <MenuItem value="gmt-12">
                      (GMT-12:00) International Date Line West
                    </MenuItem>
                    <MenuItem value="gmt-11">
                      (GMT-11:00) Midway Island, Samoa
                    </MenuItem>
                    <MenuItem value="gmt-10">(GMT-10:00) Hawaii</MenuItem>
                    <MenuItem value="gmt-09">(GMT-09:00) Alaska</MenuItem>
                    <MenuItem value="gmt-08">
                      (GMT-08:00) Pacific Time (US & Canada)
                    </MenuItem>
                    <MenuItem value="gmt-08-baja">
                      (GMT-08:00) Tijuana, Baja California
                    </MenuItem>
                    <MenuItem value="gmt-07">
                      (GMT-07:00) Chihuahua, La Paz, Mazatlan
                    </MenuItem>
                    <MenuItem value="gmt-07-mt">
                      (GMT-07:00) Mountain Time (US & Canada)
                    </MenuItem>
                    <MenuItem value="gmt-06">
                      (GMT-06:00) Central America
                    </MenuItem>
                    <MenuItem value="gmt-06-ct">
                      (GMT-06:00) Central Time (US & Canada)
                    </MenuItem>
                    <MenuItem value="gmt-06-mc">
                      (GMT-06:00) Guadalajara, Mexico City, Monterrey
                    </MenuItem>
                    <MenuItem value="gmt-06-sk">
                      (GMT-06:00) Saskatchewan
                    </MenuItem>
                    <MenuItem value="gmt-05">
                      (GMT-05:00) Bogota, Lima, Quito, Rio Branco
                    </MenuItem>
                    <MenuItem value="gmt-05-et">
                      (GMT-05:00) Eastern Time (US & Canada)
                    </MenuItem>
                    <MenuItem value="gmt-05-ind">
                      (GMT-05:00) Indiana (East)
                    </MenuItem>
                    <MenuItem value="gmt-04">
                      (GMT-04:00) Atlantic Time (Canada)
                    </MenuItem>
                    <MenuItem value="gmt-04-clp">
                      (GMT-04:00) Caracas, La Paz
                    </MenuItem>
                  </CustomTextField>
                </Grid> */}
                {/* <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    defaultValue=""
                    label="Currency"
                    SelectProps={{
                      value: formData.currency,
                      onChange: (e) =>
                        handleFormChange("currency", e.target.value),
                    }}
                  >
                    <MenuItem value="usd">USD</MenuItem>
                    <MenuItem value="eur">EUR</MenuItem>
                    <MenuItem value="pound">Pound</MenuItem>
                    <MenuItem value="bitcoin">Bitcoin</MenuItem>
                  </CustomTextField>
                </Grid> */}
              </Grid>
            </CardContent>
            <Divider />
            <CardHeader title="Profile Contact Us Informations" />
            <Divider />
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label="Heading"
                    placeholder="Get in Touch with Us or We’d Love to Hear from You! like that"
                    value={formData.restaurantContactUs.heading}
                    onChange={(e) =>
                      handleFormChange("heading", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label="Tagline"
                    placeholder="Reach out for any inquiries or feedback"
                    value={formData.restaurantContactUs.subHeading}
                    onChange={(e) =>
                      handleFormChange("subHeading", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CustomTextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    placeholder="Briefly describe what your restaurant offers or how customers can contact you"
                    value={formData.restaurantContactUs.description}
                    onChange={(e) =>
                      handleFormChange("description", e.target.value)
                    }
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
                  <CustomTextField
                    fullWidth
                    label="Tagline"
                    placeholder="Enter your restaurant's tagline (e.g., 'Serving deliciousness since 2005')"
                    value={formData.restaurantAboutUs.heading}
                    onChange={(e) =>
                      handleFormChange("heading", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label="Sub Heading"
                    placeholder="Our Story"
                    value={formData.restaurantAboutUs.subHeading}
                    onChange={(e) =>
                      handleFormChange("subHeading", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CustomTextField
                    fullWidth
                    multiline
                    rows={4}
                    label="History/Background"
                    placeholder="Tell us the story of how your restaurant began."
                    value={formData.restaurantAboutUs.description}
                    onChange={(e) =>
                      handleFormChange("description", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CardHeader title="Qualities" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label="Quality 1"
                    placeholder="List your restaurant's top qualities in one line"
                    value={formData.restaurantAboutUs.qualities[0].description}
                    onChange={(e) =>
                      handleFormChange("description", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label="Quality 2"
                    placeholder="List your restaurant's top qualities in one line"
                    value={formData.restaurantAboutUs.qualities[1].description}
                    onChange={(e) =>
                      handleFormChange("description", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label="Quality 3"
                    placeholder="List your restaurant's top qualities in one line"
                    value={formData.restaurantAboutUs.qualities[2].description}
                    onChange={(e) =>
                      handleFormChange("description", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label="About us logo"
                    type="file"
                    placeholder="Upload your restaurant's about us logo"
                    value={formData.restaurantAboutUs.logo}
                    onChange={(e) => handleFormChange("logo", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label="About us side banner"
                    type="file"
                    placeholder="Upload your restaurant's about us side banner"
                    value={formData.restaurantAboutUs.banner}
                    onChange={(e) => handleFormChange("logo", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CardHeader title="Features" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label="Restaurant's Core Value 1"
                    placeholder="Share your restaurant's core values (e.g., 'Sustainability, Freshness, Innovation')."
                    value={
                      formData.restaurantAboutUs.features.features[0]
                        .description
                    }
                    onChange={(e) =>
                      handleFormChange("description", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label="Restaurant's Core Value 1 Logo"
                    placeholder="Share your restaurant's core values (e.g., 'Sustainability, Freshness, Innovation')."
                    type="file"
                    value={formData.restaurantAboutUs.features.features[0].logo}
                    onChange={(e) =>
                      handleFormChange("description", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label="Restaurant's Core Value 2"
                    placeholder="Share your restaurant's core values (e.g., 'Sustainability, Freshness, Innovation')."
                    value={
                      formData.restaurantAboutUs.features.features[1]
                        .description
                    }
                    onChange={(e) =>
                      handleFormChange("description", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label="Restaurant's Core Value 2 Logo"
                    placeholder="Share your restaurant's core values (e.g., 'Sustainability, Freshness, Innovation')."
                    type="file"
                    value={formData.restaurantAboutUs.features.features[1].logo}
                    onChange={(e) =>
                      handleFormChange("description", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label="Restaurant's Core Value 3"
                    placeholder="Share your restaurant's core values (e.g., 'Sustainability, Freshness, Innovation')."
                    value={
                      formData.restaurantAboutUs.features.features[2]
                        .description
                    }
                    onChange={(e) =>
                      handleFormChange("description", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label="Restaurant's Core Value 3 Logo"
                    placeholder="Share your restaurant's core values (e.g., 'Sustainability, Freshness, Innovation')."
                    type="file"
                    value={formData.restaurantAboutUs.features.features[2].logo}
                    onChange={(e) =>
                      handleFormChange("description", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CustomTextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description Max (100 characters)"
                    placeholder="What principles guide the restaurant’s operations"
                    value={formData.restaurantAboutUs.features.description}
                    onChange={(e) =>
                      handleFormChange("description", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CardHeader title="Discounts" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label="Discount Title"
                    placeholder="Enter the title of the discount"
                    value={formData.restaurantAboutUs.discount.title}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label="Discount Banner"
                    type="file"
                    placeholder="Upload the discount banner"
                    value={formData.restaurantAboutUs.discount.banner}
                    onChange={(e) => handleFormChange("banner", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CustomTextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Discount Description"
                    placeholder="Enter the description of the discount"
                    value={formData.restaurantAboutUs.discount.description}
                    onChange={(e) =>
                      handleFormChange("description", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CardHeader title="Working Hours" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    showTimeSelect
                    selected={time}
                    timeIntervals={30}
                    showTimeSelectOnly
                    dateFormat="h:mm aa"
                    id="time-only-picker"
                    popperPlacement={"top-start"}
                    onChange={(date) => setTime(date)}
                    customInput={
                      <CustomInput label={"Select Restaurant On Time"} />
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    showTimeSelect
                    selected={time}
                    timeIntervals={30}
                    showTimeSelectOnly
                    dateFormat="h:mm aa"
                    id="time-only-picker"
                    popperPlacement={"top-start"}
                    onChange={(date) => setTime(date)}
                    customInput={
                      <CustomInput label={"Select Restaurant Off Time"} />
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CardHeader title="Social Links" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label="Facebook Link"
                    placeholder="https://www.facebook.com/your-restaurant"
                    value={formData.restaurantSocialMedia.facebook}
                    onChange={(e) =>
                      handleFormChange("facebook", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label="Twitter Link"
                    placeholder="https://www.twitter.com/your-restaurant"
                    value={formData.restaurantSocialMedia.twitter}
                    onChange={(e) =>
                      handleFormChange("twitter", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label="Instagram Link"
                    placeholder="https://www.instagram.com/your-restaurant"
                    value={formData.restaurantSocialMedia.instagram}
                    onChange={(e) =>
                      handleFormChange("instagram", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label="LinkedIn Link"
                    placeholder="https://www.linkedin.com/your-restaurant"
                    value={formData.restaurantSocialMedia.linkedin}
                    onChange={(e) =>
                      handleFormChange("linkedin", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label="Portfolio Link"
                    placeholder="https://www.portfolio.com/your-restaurant"
                    value={formData.restaurantSocialMedia.portfolio}
                    onChange={(e) =>
                      handleFormChange("portfolio", e.target.value)
                    }
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
                <Button variant="contained" sx={{ mr: 4 }}>
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
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Delete Account" />
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
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
      </Grid>

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
