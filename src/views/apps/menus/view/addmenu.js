// ** React Imports
"use client"
import { forwardRef, useEffect, useReducer, useState } from "react";

// ** MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import FormLabel from "@mui/material/FormLabel";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import CardContent from "@mui/material/CardContent";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Icon } from "@iconify/react";
// ** Custom Component Import
import CustomTextField from "src/@core/components/mui/text-field";

// ** Third Party Imports
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Link from "next/link";
// ** Custom Components Imports
import PageHeader from "src/@core/components/page-header";

// ** Icon Imports
import { categoris } from "src/@fake-db/categories";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import axios from "axios";
import { CircularProgress } from "@mui/material";

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.primary.main,
}));

const initialState = {
  category: categoris[0].value,
  subCategory: "",
  specialityTags: [],
  cuisine: "",
  primaryIngredients: [],
  menuItemName: "",
  description: "",
  itemImage: "",
  allergens: [],
  preparationTime: "",
  price: 0,
  avialableSizes: [],
  availability: true,
  customiseable: false,
  customiseableOptions: [],
  calories: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "category":
      return { ...state, category: action.payload };
    case "subCategory":
      return { ...state, subCategory: action.payload };
    case "specialityTags":
      return { ...state, specialityTags: action.payload };
    case "cuisine":
      return { ...state, cuisine: action.payload };
    default:
      return state;
  }
}

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

const AddMenuItemForm = ({ restaurantData }) => {
  // ** States
  const [state, dispatch] = useReducer(reducer, initialState);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ** Hooks
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialState });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append('category', data.category);
      formData.append('subCategory', data.subCategory);
      formData.append('cuisine', data.cuisine);
      formData.append('menuItemName', data.menuItemName);
      formData.append('description', data.description);
      formData.append('preparationTime', data.preparationTime);
      formData.append('price', data.price);
      formData.append('calories', data.calories);
      formData.append('availability', data.availability);
      formData.append('customiseable', data.customiseable);

      data.specialityTags.forEach(tag => formData.append('specialityTags', tag));
      data.allergens.forEach(allergen => formData.append('allergens', allergen));
      data.avialableSizes.forEach(size => formData.append('availableSizes', size));

      formData.append('itemImage', data.itemImage);
      formData.append('restaurant_id', restaurantData._id)


      const response = await axios.post(`/api/Add/fooditems`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message || 'Menu item added Successfully!');
        setLoading(false);
        setImage(null);
        reset();
      } else {
        toast.error(response.data.message || 'Error in saving menu item!');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
      setLoading(false);
    }
  };

  const onImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('itemImage', file);
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <DatePickerWrapper>
      <Grid container spacing={6} className="match-height">
        <PageHeader
          title={
            <Typography variant="h4">
              <LinkStyled href="link-to-restaurant" target="_blank">
                {restaurantData?.restaurantDetails?.restaurantName || "Restaurant Name"}
              </LinkStyled>
            </Typography>
          }
          subtitle={
            <Typography sx={{ color: "text.secondary" }}>
              {restaurantData?.restaurantDetails?.tagline || "A catchy line that summarizes the restaurant's appeal."}
            </Typography>
          }
        />
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Add Menu Item" />
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="category"
                      control={control}
                      rules={{ required: true, message: "Category is required" }}
                      render={({ field }) => (
                        <CustomTextField
                          select
                          fullWidth
                          label="Category"
                          value={state.category}
                          onChange={(e) => {
                            field.onChange(e);
                            dispatch({ type: "category", payload: e.target.value });
                          }}
                          error={!!errors.category}
                          helperText={errors.category ? "This field is required" : ""}
                        >
                          {categoris.map((category) => (
                            <MenuItem
                              key={category.value}
                              value={category.value}
                            >
                              {category.name}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="subCategory"
                      control={control}
                      rules={{
                        required: "Subcategory is required", // Custom error message
                      }}
                      render={({ field: { value, onChange }, fieldState: { error } }) => (
                        <CustomTextField
                          select
                          fullWidth
                          label="Sub Category"
                          value={value}
                          onChange={(e) => {
                            onChange(e.target.value);
                            dispatch({
                              type: "subCategory",
                              payload: e.target.value, // Update the reducer state
                            });
                          }}
                          error={Boolean(error)} // Handle error display
                          helperText={error ? error.message : ""} // Display error message
                          id="validation-basic-select"
                        >
                          {state.category &&
                            categoris
                              .find((category) => category.value === state.category) // Ensure category exists
                              ?.subCategories?.map((subCategory) => ( // Safely access subCategories
                                <MenuItem key={subCategory.value} value={subCategory.value}>
                                  {subCategory.name}
                                </MenuItem>
                              ))}
                        </CustomTextField>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="specialityTags"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          select
                          fullWidth
                          defaultValue=""
                          label="Speciality Tags"
                          SelectProps={{
                            multiple: true,
                            value: state.specialityTags,
                            onChange: (e) => {
                              onChange(e);
                              dispatch({
                                type: "specialityTags",
                                payload: e.target.value,
                              });
                            },
                          }}
                          id="validation-basic-select"
                          error={Boolean(errors.specialityTags)}
                          aria-describedby="validation-basic-select"
                          {...(errors.specialityTags && {
                            helperText: "This field is required",
                          })}
                        >
                          {state.category &&
                            categoris
                              .find(
                                (category) => category.value === state.category,
                              )
                              .specialityTags.map((subCategory) => (
                                <MenuItem
                                  key={subCategory.value}
                                  value={subCategory.value}
                                >
                                  {subCategory.name}
                                </MenuItem>
                              ))}
                        </CustomTextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="cuisine"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          select
                          fullWidth
                          defaultValue=""
                          label="Cuisine"
                          SelectProps={{
                            value: value,
                            onChange: (e) => {
                              onChange(e);
                              dispatch({
                                type: "cuisine",
                                payload: e.target.value,
                              });
                            },
                          }}
                          id="validation-basic-select"
                          error={Boolean(errors.cuisine)}
                          aria-describedby="validation-basic-select"
                          {...(errors.cuisine && {
                            helperText: "This field is required",
                          })}
                        >
                          {state.category &&
                            categoris
                              .find(
                                (category) => category.value === state.category,
                              )
                              .cuisineTypes.map((subCategory) => (
                                <MenuItem
                                  key={subCategory.value}
                                  value={subCategory.value}
                                >
                                  {subCategory.name}
                                </MenuItem>
                              ))}
                        </CustomTextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="menuItemName"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          label="Menu Item Name"
                          onChange={onChange}
                          placeholder="Leonard"
                          error={Boolean(errors.menuItemName)}
                          aria-describedby="validation-basic-first-name"
                          {...(errors.menuItemName && {
                            helperText: "This field is required",
                          })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="price"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          label="Menu Item Price"
                          onChange={onChange}
                          placeholder="RS 100"
                          error={Boolean(errors.price)}
                          aria-describedby="validation-basic-first-name"
                          {...(errors.price && {
                            helperText: "This field is required",
                          })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="preparationTime"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          label="Preparation Time"
                          onChange={onChange}
                          placeholder="20 minutes"
                          error={Boolean(errors.preparationTime)}
                          aria-describedby="validation-basic-first-name"
                          {...(errors.preparationTime && {
                            helperText: "This field is required",
                          })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="calories"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          label="Calories"
                          onChange={onChange}
                          placeholder="100"
                          error={Boolean(errors.calories)}
                          aria-describedby="validation-basic-first-name"
                          {...(errors.calories && {
                            helperText: "This field is required",
                          })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="avialableSizes"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          select
                          fullWidth
                          defaultValue=""
                          label="Avialable Sizes"
                          SelectProps={{
                            value: value,
                            multiple: true,
                            onChange: (e) => {
                              onChange(e);
                              dispatch({
                                type: "avialableSizes",
                                payload: e.target.value,
                              });
                            },
                          }}
                          id="validation-basic-select"
                          error={Boolean(errors.avialableSizes)}
                          aria-describedby="validation-basic-select"
                          {...(errors.avialableSizes && {
                            helperText: "This field is required",
                          })}
                        >
                          <MenuItem value={"Small"}>Small</MenuItem>
                          <MenuItem value={"Medium"}>Medium</MenuItem>
                          <MenuItem value={"Large"}>Large</MenuItem>
                        </CustomTextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="allergens"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          select
                          multiple
                          fullWidth
                          defaultValue=""
                          label="Allergens"
                          SelectProps={{
                            value: value,
                            multiple: true,
                            onChange: (e) => {
                              onChange(e);
                              dispatch({
                                type: "allergens",
                                payload: e.target.value,
                              });
                            },
                          }}
                          id="validation-basic-select"
                          error={Boolean(errors.allergens)}
                          aria-describedby="validation-basic-select"
                          {...(errors.allergens && {
                            helperText: "This field is required",
                          })}
                        >
                          <MenuItem value={"Dairy"}>Diary</MenuItem>
                          <MenuItem value={"Gluten"}>Gluten</MenuItem>
                          <MenuItem value={"Nuts"}>Nuts</MenuItem>
                        </CustomTextField>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="availability"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <FormControl component="fieldset">
                          <FormLabel component="legend">Availability</FormLabel>
                          <RadioGroup
                            aria-label="availability"
                            name="availability"
                            value={value}
                            onChange={onChange}
                            style={{ flexDirection: "row" }}
                          >
                            <FormControlLabel
                              value="true"
                              control={<Radio />}
                              label="Available"
                            />
                            <FormControlLabel
                              value="false"
                              control={<Radio />}
                              label="Not Available"
                            />
                          </RadioGroup>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="customiseable"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={value}
                              onChange={(e) => onChange(e.target.checked)}
                            />
                          }
                          label="Customiseable"
                          {...(errors.customiseable && {
                            helperText: "This Customiseable is required",
                          })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={image ? 5 : 6}>
                    <Controller
                      name="itemImage"
                      control={control}
                      rules={{ required: "Image is required" }}  // Custom error message
                      render={({ field }) => (
                        <CustomInput
                          type="file"
                          label="Menu Item Image"
                          onChange={(e) => {
                            field.onChange(e.target.files);  // Store file object in form state
                            onImageSelect(e);  // Handle image preview
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
                          error={Boolean(errors.itemImage)}
                          aria-describedby="validation-basic-item-image"
                          {...(errors.itemImage && {
                            helperText: errors.itemImage.message,  // Show the validation message
                          })}
                        />
                      )}
                    />
                  </Grid>

                  {image && (
                    <Grid item xs={12} sm={1}>
                      <img
                        src={image}
                        alt="item"
                        style={{
                          width: 75,
                          height: 75,
                          objectFit: "contain",
                          borderRadius: 50,
                          marginTop: 15,
                          marginBottom: 15,
                        }}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Controller
                      name="description"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <CustomTextField
                          rows={4}
                          fullWidth
                          multiline
                          {...field}
                          label="Menu Item Description"
                          error={Boolean(errors.textarea)}
                          aria-describedby="validation-basic-textarea"
                          {...(errors.description && {
                            helperText: "This field is required",
                          })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" type="submit">
                      {loading ? (
                        <CircularProgress size={24} thickness={6} color="inherit" />
                      ) : (
                        <text>Submit</text>
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  );
};

export default AddMenuItemForm;