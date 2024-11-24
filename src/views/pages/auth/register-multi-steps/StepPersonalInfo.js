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
import { useEffect, useState } from "react";

const defaultValues = {
  mobile: "",
  zipcode: "",
  address: "",
  landmark: "",
  city: "",
  state: "",
};

const StepPersonalDetails = ({ handleNext, handlePrev, SetPersonalDetails, personaDetail }) => {
  
  const { control, handleSubmit, formState: { errors }, setValue } = useForm({ defaultValues: personaDetail });

  useEffect(() => {
    Object.keys(personaDetail).forEach(key => {
      setValue(key, personaDetail[key]);
    });
  }, [personaDetail, setValue]);

  const onSubmit = (data) => {
    SetPersonalDetails(data);
    handleNext();
  };

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

export default StepPersonalDetails;
