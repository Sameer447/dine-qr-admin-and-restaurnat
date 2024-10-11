// @ts-nocheck
// ** React Imports
import { forwardRef, useReducer, useState } from "react";

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
import React from "react";

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.primary.main,
}));

const initialState = {
  category: categoris[0].value,
  subCategory: [],
  specialityTags: [],
  cuisine: [],
  description: "",
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
    case "description":
      return { ...state, description: action.payload };
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

const MenuForm = ({ restaurantData }) => {
  // ** States
  const [state, dispatch] = useReducer(reducer, initialState);
  const [image, setImage] = useState(null);

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialState });
  const onSubmit = () => toast.success("Form Submitted");
  return (
    <DatePickerWrapper>
      <Grid container spacing={6} className="match-height">
        <PageHeader
          title={
            <Typography variant="h4">
              <LinkStyled href="link-to-restaurant" target="_blank">
                {restaurantData?.restaurantDetails?.restaurantName ||
                  "Restaurant Name"}
              </LinkStyled>
            </Typography>
          }
          subtitle={
            <Typography sx={{ color: "text.secondary" }}>
              {restaurantData?.restaurantDetails?.tagline ||
                "A catchy line that summarizes the restaurant's appeal."}
            </Typography>
          }
        />
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Add Menu" />
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="category"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          select
                          fullWidth
                          defaultValue=""
                          label="Category"
                          SelectProps={{
                            value: value,
                            onChange: (e) => {
                              onChange(e);
                              dispatch({
                                type: "category",
                                payload: e.target.value,
                              });
                            },
                          }}
                          id="validation-basic-select"
                          error={Boolean(errors.select)}
                          aria-describedby="validation-basic-select"
                          {...(errors.select && {
                            helperText: "This field is required",
                          })}
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
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          select
                          fullWidth
                          defaultValue=""
                          label="Sub Category"
                          SelectProps={{
                            multiple: true,
                            value: value,
                            onChange: (e) => {
                              onChange(e);
                              dispatch({
                                type: "subCategory",
                                payload: e.target.value,
                              });
                            },
                          }}
                          id="validation-basic-select"
                          error={Boolean(errors.select)}
                          aria-describedby="validation-basic-select"
                          {...(errors.select && {
                            helperText: "This field is required",
                          })}
                        >
                          {state.category &&
                            categoris
                              .find(
                                (category) => category.value === state.category,
                              )
                              .subCategories.map((subCategory) => (
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
                          id="select-multiple-default"
                          error={Boolean(errors.select)}
                          aria-describedby="select-multiple-default"
                          {...(errors.select && {
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
                            multiple: true,
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
                          error={Boolean(errors.select)}
                          aria-describedby="validation-basic-select"
                          {...(errors.select && {
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
                          onChange={(e) => {
                            field.onChange(e);
                            dispatch({
                              type: "description",
                              payload: e.target.value,
                            });
                          }}
                          label="Menu Item Description"
                          error={Boolean(errors.textarea)}
                          aria-describedby="validation-basic-textarea"
                          {...(errors.textarea && {
                            helperText: "This field is required",
                          })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained">
                      Submit
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

export default MenuForm;
