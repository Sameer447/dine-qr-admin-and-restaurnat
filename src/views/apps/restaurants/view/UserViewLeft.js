// @ts-nocheck
// ** React Imports
import { useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import InputAdornment from "@mui/material/InputAdornment";
import LinearProgress from "@mui/material/LinearProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import DialogContentText from "@mui/material/DialogContentText";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Custom Components
import CustomChip from "src/@core/components/mui/chip";
import CustomAvatar from "src/@core/components/mui/avatar";
import CustomTextField from "src/@core/components/mui/text-field";
import UserSuspendDialog from "src/views/apps/user/view/UserSuspendDialog";
import UserSubscriptionDialog from "src/views/apps/user/view/UserSubscriptionDialog";

// ** Utils Import
import { getInitials } from "src/@core/utils/get-initials";
import { CircularProgress, IconButton } from "@mui/material";
import { Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { ServiceUrl, user } from "../../../../@core/utils/global";
import axios from "axios";

const data = {
  id: 1,
  role: "admin",
  status: "active",
  username: "gslixby0",
  avatarColor: "primary",
  country: "El Salvador",
  company: "Yotz PVT LTD",
  billing: "Manual - Cash",
  contact: "(479) 232-9151",
  currentPlan: "enterprise",
  fullName: "Daisy Patterson",
  email: "gslixby0@abc.net.au",
  avatar: "/images/avatars/14.png",
};

const roleColors = {
  admin: "error",
  Resturant: "info",
  author: "warning",
  maintainer: "success",
  subscriber: "primary",
};

const statusColors = {
  active: "success",
  pending: "warning",
  inactive: "secondary",
};

// ** Styled <sup> component
const Sup = styled("sup")(({ theme }) => ({
  top: 0,
  left: -10,
  position: "absolute",
  color: theme.palette.primary.main,
}));

// ** Styled <sub> component
const Sub = styled("sub")(({ theme }) => ({
  alignSelf: "flex-end",
  color: theme.palette.text.disabled,
  fontSize: theme.typography.body1.fontSize,
}));

const UserViewLeft = ({ userData, billingData }) => {
  // ** States
  const [openEdit, setOpenEdit] = useState(false);
  const [openPlans, setOpenPlans] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");
  // const [status, setStatus] = useState(userData?.isActivated);


  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true);
  const handleEditClose = () => setOpenEdit(false);

  // Handle Upgrade Plan dialog
  const handlePlansClickOpen = () => setOpenPlans(true);
  const handlePlansClose = () => setOpenPlans(false);

  // const handleStatusChange = (event) => {
  //   setStatus(event.target.value === 'active');
  // };

  const [updateLoading, setUpdateLoading] = useState(false);


  // Handle Activate/Deactivate User
  const handleToggleActivation = async () => {
    if (userData.isActivated) {
      if (!reason) {
        toast.error('Please provide a reason to deactivate user');
        return;
      }
    } else {
      if (!password) {
        toast.error('Please provide password to activate user');
        return;
      }
    }

    try {
      setUpdateLoading(true);
      const response = await axios.patch(`${ServiceUrl}/update-user-status`,
        {
          userId: userData._id,
          isActivated: userData.isActivated ? false : true,
          reason: reason,
          password: password
        }
      );
      if (response.data.error) {
        toast.error(response.data.error);
        setUpdateLoading(false);
        return;
      } else {
        setUpdateLoading(false);
        setOpenEdit(false);
        toast.success(`User ${userData.isActivated ? 'deactivated' : 'activated'} successfully`);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };


  if (userData) {
    const { restaurantDetails, addressDetails } = userData;
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent
              sx={{
                pt: 13.5,
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              {restaurantDetails.logo ? (
                <CustomAvatar
                  src={
                    "/api/get-user-image?imageName=" + restaurantDetails.logo
                  }
                  variant="rounded"
                  alt={restaurantDetails.restaurantName}
                  sx={{ width: 100, height: 100, mb: 4 }}
                />
              ) : (
                <CustomAvatar
                  skin="light"
                  variant="rounded"
                  sx={{ width: 100, height: 100, mb: 4, fontSize: "3rem" }}
                >
                  {restaurantDetails.restaurantName.charAt(0)}
                </CustomAvatar>
              )}
              <Typography variant="h4" sx={{ mb: 3 }}>
                {restaurantDetails.restaurantName}
              </Typography>
              <CustomChip
                rounded
                skin="light"
                size="small"
                label={userData.role}
                sx={{ textTransform: "capitalize" }}
              />
            </CardContent>

            <Divider sx={{ my: "0 !important", mx: 6 }} />

            <CardContent sx={{ pb: 4 }}>
              <Typography
                variant="body2"
                sx={{ color: "text.disabled", textTransform: "uppercase" }}
              >
                Details
              </Typography>

              <Box sx={{ pt: 4 }}>
                <Box sx={{ display: "flex", mb: 3 }}>
                  <Typography
                    sx={{ mr: 2, fontWeight: 500, color: "text.secondary" }}
                  >
                    Restaurant Owner:
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {restaurantDetails.restaurantOwner}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", mb: 3 }}>
                  <Typography
                    sx={{ mr: 2, fontWeight: 500, color: "text.secondary" }}
                  >
                    Restaurant Tagline:
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {restaurantDetails.tagline}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", mb: 3 }}>
                  <Typography
                    sx={{ mr: 2, fontWeight: 500, color: "text.secondary" }}
                  >
                    Restaurant CNIC:
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {restaurantDetails.cnicNumber}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", mb: 3 }}>
                  <Typography
                    sx={{ mr: 2, fontWeight: 500, color: "text.secondary" }}
                  >
                    Email:
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {userData.email}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", mb: 3, alignItems: "center" }}>
                  <Typography
                    sx={{ mr: 2, fontWeight: 500, color: "text.secondary" }}
                  >
                    Status:
                  </Typography>
                  <CustomChip
                    rounded
                    skin="light"
                    size="small"
                    label={userData.isActivated ? "active" : "inactive"}
                    sx={{
                      textTransform: "capitalize",
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", mb: 3 }}>
                  <Typography
                    sx={{ mr: 2, fontWeight: 500, color: "text.secondary" }}
                  >
                    Role:
                  </Typography>
                  <Typography
                    sx={{
                      color: "text.secondary",
                      textTransform: "capitalize",
                    }}
                  >
                    {userData.role}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", mb: 3 }}>
                  <Typography
                    sx={{ mr: 2, fontWeight: 500, color: "text.secondary" }}
                  >
                    Contact:
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    (+92) {addressDetails.mobile}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", mb: 3 }}>
                  <Typography
                    sx={{ mr: 2, fontWeight: 500, color: "text.secondary" }}
                  >
                    ZipCode:
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {addressDetails.zipcode}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", mb: 3 }}>
                  <Typography
                    sx={{ mr: 2, fontWeight: 500, color: "text.secondary" }}
                  >
                    Landmark:
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {addressDetails.landmark}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", mb: 3 }}>
                  <Typography
                    sx={{ mr: 2, fontWeight: 500, color: "text.secondary" }}
                  >
                    Address:
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {addressDetails.address}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex" }}>
                  <Typography
                    sx={{ mr: 2, fontWeight: 500, color: "text.secondary" }}
                  >
                    Country:
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {`${addressDetails.city}, ${addressDetails.state}, Pakistan`}
                  </Typography>
                </Box>
              </Box>
            </CardContent>

            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              {!userData.isActivated ? (
                <CardActions sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    color={userData.isActivated ? "error" : "success"}
                    variant="tonal"
                    onClick={handleEditClickOpen}
                  >
                    {/* {userData.isActivated ? "Deactivate User" : "Activate User"} */}
                    Activate User
                  </Button>
                </CardActions>
              ) : (
                <CardActions
                  sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    color={userData.isActivated ? "error" : "success"}
                    variant="tonal"
                    onClick={handleEditClickOpen}
                  >
                    {/* {userData.isActivated ? "Deactivate User" : "Activate User"} */}
                    Deactivate User
                  </Button>
                </CardActions>
              )}
            </Box>

            <Dialog
              open={openEdit}
              onClose={handleEditClose}
              aria-labelledby="user-view-edit"
              aria-describedby="user-view-edit-description"
              sx={{ "& .MuiPaper-root": { width: "100%", maxWidth: 650 } }}
            >
              <DialogTitle
                id="user-view-edit"
                sx={{
                  textAlign: "center",
                  fontSize: "1.5rem !important",
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
                Edit User Information
              </DialogTitle>
              <DialogContent
                sx={{
                  pb: (theme) => `${theme.spacing(8)} !important`,
                  px: (theme) => [
                    `${theme.spacing(5)} !important`,
                    `${theme.spacing(15)} !important`,
                  ],
                }}
              >
                <DialogContentText
                  variant="body2"
                  id="user-view-edit-description"
                  sx={{ textAlign: "center", mb: 7 }}
                >
                  Updating user details will receive a privacy audit.
                </DialogContentText>
                <form>
                  <Grid container spacing={6}>
                    {userData.isActivated && (
                      <Grid item sx={{ width: '100%' }}>
                        <Grid item sx={{ width: '100%' }}  >
                          <CustomTextField
                            rows={4}
                            fullWidth
                            multiline
                            onChange={(e) => setReason(e.target.value)}
                            label="Reason"
                            aria-describedby="validation-basic-textarea"
                            placeholder="Write your reason here"
                            style={{ width: '100%' }}
                          />
                        </Grid>
                      </Grid>
                    )}

                    {!userData.isActivated && (
                      <Grid item sx={{ width: '100%' }}>
                        <CustomTextField
                          fullWidth
                          value={password}
                          label="Password"
                          onChange={(e) => setPassword(e.target.value)}
                          id="auth-login-v2-password"
                          placeholder="Enter Password"
                          type={showPassword ? "text" : "password"}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  edge="end"
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  <Icon
                                    fontSize="1.25rem"
                                    icon={
                                      showPassword ? "tabler:eye" : "tabler:eye-off"
                                    }
                                  />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    )}

                  </Grid>
                </form>
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
                  onClick={handleToggleActivation}
                >
                  {updateLoading ? <CircularProgress size={24} thickness={6} color="inherit" /> : "Update"}
                </Button>
                <Button
                  variant="tonal"
                  color="secondary"
                  onClick={handleEditClose}
                >
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>

            <UserSuspendDialog
              open={suspendDialogOpen}
              setOpen={setSuspendDialogOpen}
            />
          </Card>
        </Grid>
        {/* </Grid> */}

        <Grid item xs={12}>
          <Card>
            <CardContent
              sx={{
                pb: 1,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <CustomChip
                rounded
                skin="light"
                size="small"
                color="primary"
                label="Billing Details"
              />
            </CardContent>

            <CardContent>
              <Box sx={{ mt: 2.5, mb: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    mb: 2,
                    alignItems: "center",
                    "& svg": { mr: 2, color: "text.secondary" },
                  }}
                >
                  <Icon icon="tabler:point" fontSize="1.125rem" />
                  <Typography sx={{ color: "text.secondary" }}>
                    Plan: {billingData?.plan}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    "& svg": { mr: 2, color: "text.secondary" },
                  }}
                >
                  <Icon icon="tabler:point" fontSize="1.125rem" />
                  <Typography sx={{ color: "text.secondary" }}>
                    Plan Amount: {billingData?.planAmount} RS
                  </Typography>
                </Box>
                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    "& svg": { mr: 2, color: "text.secondary" },
                  }}
                >
                  <Icon icon="tabler:point" fontSize="1.125rem" />
                  <Typography sx={{ color: "text.secondary" }}>
                    Cardholder Name: {billingData?.cardholder_name}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    "& svg": { mr: 2, color: "text.secondary" },
                  }}
                >
                  <Icon icon="tabler:point" fontSize="1.125rem" />
                  <Typography sx={{ color: "text.secondary" }}>
                    Card Number: {billingData?.card_number}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    "& svg": { mr: 2, color: "text.secondary" },
                  }}
                >
                  <Icon icon="tabler:point" fontSize="1.125rem" />
                  <Typography sx={{ color: "text.secondary" }}>
                    Payment Proof:
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 2,
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <img
                    src={`/api/get-user-image?imageName=${billingData?.paymentProof}`}
                    alt="Payment Proof"
                    style={{ maxWidth: "100%", borderRadius: "8px" }}
                  />
                </Box>
              </Box>
            </CardContent>

            <Dialog
              open={openPlans}
              onClose={handlePlansClose}
              aria-labelledby="user-view-plans"
              aria-describedby="user-view-plans-description"
              sx={{ "& .MuiPaper-root": { width: "100%", maxWidth: 650 } }}
            >
              <DialogTitle
                id="user-view-plans"
                sx={{
                  textAlign: "center",
                  fontSize: "1.625rem !important",
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
                Upgrade Plan
              </DialogTitle>

              <DialogContent
                sx={{
                  px: (theme) => [
                    `${theme.spacing(5)} !important`,
                    `${theme.spacing(15)} !important`,
                  ],
                }}
              >
                <DialogContentText
                  sx={{ textAlign: "center" }}
                  id="user-view-plans-description"
                >
                  Choose the best plan for the user.
                </DialogContentText>
              </DialogContent>

              <DialogContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: ["wrap", "nowrap"],
                  pt: (theme) => `${theme.spacing(2)} !important`,
                  pb: (theme) => `${theme.spacing(8)} !important`,
                  px: (theme) => [
                    `${theme.spacing(5)} !important`,
                    `${theme.spacing(15)} !important`,
                  ],
                }}
              >
                <CustomTextField
                  select
                  fullWidth
                  label="Choose Plan"
                  defaultValue="Standard"
                  sx={{ mr: [0, 3], mb: [3, 0] }}
                >
                  <MenuItem value="Basic">Basic - $0/month</MenuItem>
                  <MenuItem value="Standard">Standard - $99/month</MenuItem>
                  <MenuItem value="Enterprise">
                    Enterprise - $499/month
                  </MenuItem>
                  <MenuItem value="Company">Company - $999/month</MenuItem>
                </CustomTextField>
                <Button
                  variant="contained"
                  sx={{ minWidth: ["100%", 0], mt: 4 }}
                >
                  Upgrade
                </Button>
              </DialogContent>

              <Divider sx={{ m: "0 !important" }} />

              <DialogContent
                sx={{
                  pt: (theme) => [
                    `${theme.spacing(8)} !important`,
                    `${theme.spacing(8)} !important`,
                  ],
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
                <Typography
                  variant="h6"
                  sx={{ mb: 2, color: (theme) => theme.palette.text.secondary }}
                >
                  User current plan is standard plan
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: ["wrap", "nowrap"],
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      mr: 3,
                      display: "flex",
                      ml: 2.4,
                      position: "relative",
                    }}
                  >
                    <Sup>$</Sup>
                    <Typography
                      variant="h1"
                      sx={{
                        mb: -1.2,
                        color: "primary.main",
                        fontSize: "3rem !important",
                      }}
                    >
                      99
                    </Typography>
                    <Sub>/ month</Sub>
                  </Box>
                  <Button
                    color="error"
                    variant="tonal"
                    sx={{ mt: 2 }}
                    onClick={() => setSubscriptionDialogOpen(true)}
                  >
                    Cancel Subscription
                  </Button>
                </Box>
              </DialogContent>
            </Dialog>
          </Card>
        </Grid>
      </Grid>
    );
  } else {
    return null;
  }
};

export default UserViewLeft;
