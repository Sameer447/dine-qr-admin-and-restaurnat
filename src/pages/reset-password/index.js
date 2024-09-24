// @ts-nocheck
// ** Next Import
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
// ** MUI Components
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import InputAdornment from "@mui/material/InputAdornment";
// ** Custom Component Import
import CustomTextField from "src/@core/components/mui/text-field";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Layout Import
import BlankLayout from "src/@core/layouts/BlankLayout";

// ** Demo Imports
import FooterIllustrationsV2 from "src/views/pages/auth/FooterIllustrationsV2";
import { Controller, useForm } from "react-hook-form";

// Styled Components
const ForgotPasswordIllustration = styled("img")(({ theme }) => ({
  zIndex: 2,
  maxHeight: 650,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550,
  },
  [theme.breakpoints.down("lg")]: {
    maxHeight: 500,
  },
}));

const RightWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.up("md")]: {
    maxWidth: 450,
  },
  [theme.breakpoints.up("lg")]: {
    maxWidth: 600,
  },
  [theme.breakpoints.up("xl")]: {
    maxWidth: 750,
  },
}));

const LinkStyled = styled(Link)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  justifyContent: "center",
  color: theme.palette.primary.main,
  fontSize: theme.typography.body1.fontSize,
}));
const defaultValues = {
  newPassword: "",
  confirmNewPassword: "",
};
const ResetPassword = () => {
  // ** Hooks
  const router = useRouter();
  const { token } = router.query;
  const theme = useTheme();
  const [values, setValues] = useState({
    showNewPassword: false,
    showCurrentPassword: false,
    showConfirmNewPassword: false,
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down("md"));

  const onSubmit = (data) => {
    console.log(data);
    const body = {
      token,
      newPassword: data.newPassword,
    };
    const response = fetch("/api/SetNewPassword/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (response.status === 200) {
      router.push("/login");
    }
  };

  const handleClickShowCurrentPassword = () => {
    setValues({ ...values, showCurrentPassword: !values.showCurrentPassword });
  };

  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword });
  };

  const handleClickShowConfirmNewPassword = () => {
    setValues({
      ...values,
      showConfirmNewPassword: !values.showConfirmNewPassword,
    });
  };

  return (
    <Box className="content-right" sx={{ backgroundColor: "background.paper" }}>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            position: "relative",
            alignItems: "center",
            borderRadius: "20px",
            justifyContent: "center",
            backgroundColor: "customColors.bodyBg",
            margin: (theme) => theme.spacing(8, 0, 8, 8),
          }}
        >
          <ForgotPasswordIllustration
            alt="forgot-password-illustration"
            src={`/images/pages/auth-v2-forgot-password-illustration-${theme.palette.mode}.png`}
          />
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 400 }}>
            <svg
              width={34}
              viewBox="0 0 32 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                fill={theme.palette.primary.main}
                d="M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z"
              />
              <path
                fill="#161616"
                opacity={0.06}
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z"
              />
              <path
                fill="#161616"
                opacity={0.06}
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                fill={theme.palette.primary.main}
                d="M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z"
              />
            </svg>
            <Box sx={{ my: 6 }}>
              <Typography
                sx={{
                  mb: 1.5,
                  fontWeight: 500,
                  fontSize: "1.625rem",
                  lineHeight: 1.385,
                }}
              >
                Reset Password? 🔒
              </Typography>
              {/* <Typography sx={{ color: "text.secondary" }}>
                Enter your email and we&prime;ll send you instructions to reset
                your password
              </Typography> */}
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={5} sx={{ mt: 0 }}>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name="newPassword"
                    control={control}
                    rules={{
                      required: true,
                      minLength: 8,
                      maxLength: 20,
                      pattern:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
                    }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        label="New Password"
                        id="input-new-password"
                        placeholder="············"
                        error={Boolean(errors.newPassword)}
                        type={values.showNewPassword ? "text" : "password"}
                        {...(errors.newPassword && {
                          helperText: errors.newPassword.message,
                        })}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                edge="end"
                                onClick={handleClickShowNewPassword}
                                onMouseDown={(e) => e.preventDefault()}
                              >
                                <Icon
                                  fontSize="1.25rem"
                                  icon={
                                    values.showNewPassword
                                      ? "tabler:eye"
                                      : "tabler:eye-off"
                                  }
                                />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name="confirmNewPassword"
                    control={control}
                    rules={{
                      required: true,
                      minLength: 8,
                      maxLength: 20,
                      pattern:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
                    }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        placeholder="············"
                        label="Confirm New Password"
                        id="input-confirm-new-password"
                        error={Boolean(errors.confirmNewPassword)}
                        type={
                          values.showConfirmNewPassword ? "text" : "password"
                        }
                        {...(errors.confirmNewPassword && {
                          helperText: errors.confirmNewPassword.message,
                        })}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                edge="end"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={handleClickShowConfirmNewPassword}
                              >
                                <Icon
                                  fontSize="1.25rem"
                                  icon={
                                    values.showConfirmNewPassword
                                      ? "tabler:eye"
                                      : "tabler:eye-off"
                                  }
                                />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">Password Requirements:</Typography>
                  <Box
                    component="ul"
                    sx={{
                      pl: 6,
                      mb: 0,
                      "& li": { mb: 1.5, color: "text.secondary" },
                    }}
                  >
                    <li>Minimum 8 characters long - the more, the better</li>
                    <li>At least one lowercase & one uppercase character</li>
                    <li>
                      At least one number, symbol, or whitespace character
                    </li>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    sx={{ mb: 4 }}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  );
};
ResetPassword.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;
ResetPassword.guestGuard = true;

export default ResetPassword;
