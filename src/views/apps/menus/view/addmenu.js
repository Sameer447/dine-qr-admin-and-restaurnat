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

// ** Icon Imports
import { categoris } from "src/@fake-db/categories";
import { GridRow } from "@mui/x-data-grid";

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down()]: {
    width: "100%",
    textAlign: "center",
  },
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

const AddMenuItemForm = () => {
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

  const onImageSelect = (e) => {
    const reader = new FileReader();
    const { files } = e.target;
    if (files && files.length !== 0) {
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(files[0]);
      if (reader.result !== null) {
        dispatch({ type: "itemImage", payload: reader.result });
      }
    }
  };

  return (
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
                        dispatch({ type: "category", payload: e.target.value });
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
                      <MenuItem key={category.value} value={category.value}>
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
                        .find((category) => category.value === state.category)
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
                    id="validation-basic-select"
                    error={Boolean(errors.select)}
                    aria-describedby="validation-basic-select"
                    {...(errors.select && {
                      helperText: "This field is required",
                    })}
                  >
                    {state.category &&
                      categoris
                        .find((category) => category.value === state.category)
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
                    error={Boolean(errors.select)}
                    aria-describedby="validation-basic-select"
                    {...(errors.select && {
                      helperText: "This field is required",
                    })}
                  >
                    {state.category &&
                      categoris
                        .find((category) => category.value === state.category)
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
                    error={Boolean(errors.firstName)}
                    aria-describedby="validation-basic-first-name"
                    {...(errors.firstName && {
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
                    error={Boolean(errors.firstName)}
                    aria-describedby="validation-basic-first-name"
                    {...(errors.firstName && {
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
                    error={Boolean(errors.firstName)}
                    aria-describedby="validation-basic-first-name"
                    {...(errors.firstName && {
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
                    error={Boolean(errors.firstName)}
                    aria-describedby="validation-basic-first-name"
                    {...(errors.firstName && {
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
                    error={Boolean(errors.select)}
                    aria-describedby="validation-basic-select"
                    {...(errors.select && {
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
                      value: state.allergens,
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
                    error={Boolean(errors.select)}
                    aria-describedby="validation-basic-select"
                    {...(errors.select && {
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
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={image ? 5 : 6}>
              <Controller
                name="itemImage"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomInput
                    type="file"
                    {...field}
                    label="Menu Item Image"
                    onChange={(e) => {
                      field.onChange(e);
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
                    error={Boolean(errors.itemImage)}
                    aria-describedby="validation-basic-item-image"
                    {...(errors.itemImage && {
                      helperText: "This field is required",
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
                    width: 50,
                    height: 50,
                    objectFit: "contain",
                    borderRadius: 50,
                    marginTop: 15,
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
  );
};

export default AddMenuItemForm;
