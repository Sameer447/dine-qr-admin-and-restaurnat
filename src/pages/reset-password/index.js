// @ts-nocheck
// ** Next Import
import { useEffect, useState } from "react";
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
import toast from "react-hot-toast";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Layout Import
import BlankLayout from "src/@core/layouts/BlankLayout";

// ** Demo Imports
import FooterIllustrationsV2 from "src/views/pages/auth/FooterIllustrationsV2";
import { Controller, useForm } from "react-hook-form";
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import axios from "axios";

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
  const { token, type } = router.query;
  const theme = useTheme();
  const [values, setValues] = useState({
    showNewPassword: false,
    showCurrentPassword: false,
    showConfirmNewPassword: false,
  });
  const [loaing, setLoading] = useState(false);

  const [isTokenExpired, setIsTokenExpired] = useState(false);

  useEffect(() => {
    // Function to check token expiration
    const checkTokenExpiration = async () => {
      if (token) {

        const body = {
          token,
        };

        try {
          const response = await fetch(`/api/CheckTokenExpiration`, { // Create an API endpoint to validate the token
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
 
          if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 401) {
              setIsTokenExpired(true);
            } else {
              toast.error(errorData.message || "Something went wrong");
            }
          }
        } catch (error) {
          toast.error("Error checking token expiration.");
        }
      }
    };

    checkTokenExpiration();
  }, [token]);

  // Function to handle dialog close
  const handleDialogClose = () => {
    setIsTokenExpired(false);
    router.push("/login"); // Redirect to login page
  };

  // ** useForm hook with default values
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues, // <- Adding default values here
    mode: 'onSubmit', // <- Ensure form is submitted onSubmit
  });


  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down("md"));

  const onSubmit = async (data) => {
    try {
      if (data.newPassword === data.confirmNewPassword) {
        setLoading(true);
        const body = {
          type: type,
          token,
          newPassword: data.newPassword,
        };

        const response = await fetch(`/api/SetNewPassword/password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (response?.status === 200) {
          if (!response.error) {
            toast.success(
              `Password ${type === "reset-password" ? "Reset" : "Set"
              } Successfully`,
            );
          }
          setLoading(false);
          router.push("/login");
        } else {
          const errorData = await response.json();
          if (response.status === 401) {
            toast.error(errorData.message); // Show token expiration message
            router.push("/login"); // Redirect to login
          } else {
            toast.error(errorData.message || "Something went wrong");
            setLoading(false);
          }
        }
      } else {
        console.log("Password does not match");
        toast.error("Password does not match", 10000);
        setLoading(false);
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Something went wrong", 10000);
      setLoading(false);
    } finally {
      setLoading(false);
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
      
      <Dialog open={isTokenExpired} >
        <DialogTitle sx={{ fontSize: 25 }}  >{type === "set-password" ? "Set Password Link Expired" : "Reset Password Link Expired"}</DialogTitle>
        <DialogContent>
          <p>Your {type === "set-password" ? "set password" : "reset password"} link has expired. Please request a new link to proceed.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Go to Login
          </Button>
        </DialogActions>
      </Dialog>
      
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
                {`${type === "reset-password" ? "Reset" : "Set"}`} Password? 🔒
              </Typography>
              {/* <Typography sx={{ color: "text.secondary" }}>
                Enter your email and we&prime;ll send you instructions to reset
                your password
              </Typography> */}
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={5} sx={{ mt: 0 }}>
                {/* New Password Field */}
                <Grid item xs={12} sm={12}>
                  <Controller
                    name="newPassword"
                    control={control}
                    rules={{
                      required: "New password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters long",
                      },
                      maxLength: {
                        value: 20,
                        message: "Password must not exceed 20 characters",
                      },
                      pattern: {
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
                        message:
                          "Password must contain at least one uppercase, one lowercase, one number, and one special character",
                      },
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
                        helperText={errors.newPassword?.message}
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
                                    values.showNewPassword ? "tabler:eye" : "tabler:eye-off"
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

                {/* Confirm New Password Field */}
                <Grid item xs={12} sm={12}>
                  <Controller
                    name="confirmNewPassword"
                    control={control}
                    rules={{
                      required: "Please confirm your new password",
                      validate: (value) =>
                        value === watch('newPassword') || "Passwords do not match",
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
                        type={values.showConfirmNewPassword ? "text" : "password"}
                        helperText={errors.confirmNewPassword?.message}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                edge="end"
                                onClick={handleClickShowConfirmNewPassword}
                                onMouseDown={(e) => e.preventDefault()}
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

                {/* Password Requirements */}
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
                    <li>At least one number, symbol, or whitespace character</li>
                  </Box>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Button fullWidth type="submit" variant="contained" sx={{ mb: 4 }}>
                    {loaing ? (
                      <CircularProgress size={24} thickness={6} color="inherit" />
                    ) : (
                      type === "reset-password" ? "Reset Password" : "Set Password"
                    )}
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
