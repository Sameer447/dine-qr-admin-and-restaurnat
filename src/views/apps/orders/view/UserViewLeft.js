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
  editor: "info",
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

const UserViewLeft = ({ orderData }) => {
  // ** States
  const [openEdit, setOpenEdit] = useState(false);
  const [openPlans, setOpenPlans] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true);
  const handleEditClose = () => setOpenEdit(false);

  // Handle Upgrade Plan dialog
  const handlePlansClickOpen = () => setOpenPlans(true);
  const handlePlansClose = () => setOpenPlans(false);
  if (data) {
    return (
      <Grid
        container
        spacing={6}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Grid item xs={8}>
          <Card>
            <CardContent
              sx={{
                pt: 13.5,
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              {orderData.user_name ? (
                <CustomAvatar
                  src={orderData.user_name}
                  variant="rounded"
                  alt={orderData.user_name}
                  sx={{ width: 100, height: 100, mb: 4 }}
                />
              ) : (
                <CustomAvatar
                  skin="light"
                  variant="rounded"
                  color={data.avatarColor}
                  sx={{ width: 100, height: 100, mb: 4, fontSize: "3rem" }}
                >
                  {getInitials(orderData.user_name)}
                </CustomAvatar>
              )}
              <Typography variant="h4" sx={{ mb: 3 }}>
                {orderData.user_name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 1, color: "text.secondary" }}
              >
                {orderData.user_email}
              </Typography>
              <Typography
                variant="h6"
                sx={{ mt: 2, color: "text.secondary", mb: 3 }}
              >
                Table Number: {orderData.table_number}
              </Typography>
              <CustomChip
                rounded
                skin="light"
                size="small"
                label={"Customer"}
                color={roleColors[data.role]}
                sx={{ textTransform: "capitalize" }}
              />
            </CardContent>

            {/* <CardContent
              sx={{ pt: (theme) => `${theme.spacing(2)} !important` }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              ></Box>
            </CardContent> */}

            <Divider sx={{ my: "0 !important", mx: 6 }} />

            <CardContent sx={{ pb: 4 }}>
              <Typography
                variant="heading"
                sx={{ color: "text.disabled", textTransform: "uppercase" }}
              >
                Order Details
              </Typography>
              {orderData.cart_items.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 2,
                    width: "100%",
                  }}
                >
                  {/* Show Item with Name Capital and description, price, ccategory, subcategory and devider after every item width beautifull interface */}
                  <Box sx={{ width: "100%" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                      {item.food_name.toUpperCase()}
                    </Typography>
                    <Typography variant="h6" sx={{ color: "text.secondary" }}>
                      {item.description}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 2,
                      }}
                    >
                      <Typography variant="h6" sx={{ color: "text.secondary" }}>
                        Cuisine
                      </Typography>
                      <Typography variant="h6" sx={{ color: "text.secondary" }}>
                        {item.cuisine}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 2,
                      }}
                    >
                      <Typography variant="h6" sx={{ color: "text.secondary" }}>
                        Category
                      </Typography>
                      <Typography variant="h6" sx={{ color: "text.secondary" }}>
                        {item.category}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 2,
                      }}
                    >
                      <Typography variant="h6" sx={{ color: "text.secondary" }}>
                        Subcategory
                      </Typography>
                      <Typography variant="h6" sx={{ color: "text.secondary" }}>
                        {item.subCategory}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 2,
                      }}
                    >
                      <Typography variant="h6" sx={{ color: "text.secondary" }}>
                        Sizes
                      </Typography>
                      {item.availableSizes.length > 0 && (
                        <Typography
                          variant="h6"
                          sx={{ color: "text.secondary" }}
                        >
                          {item.availableSizes.join(", ")}
                        </Typography>
                      )}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 2,
                      }}
                    >
                      <Typography variant="h6" sx={{ color: "text.secondary" }}>
                        Price
                      </Typography>
                      <Typography variant="h6" sx={{ color: "text.secondary" }}>
                        RS {item.price}
                      </Typography>
                    </Box>
                    {item.selectedAddOns.length > 0 && (
                      <>
                        <Typography
                          variant="subtitle1"
                          sx={{ color: "text.secondary", fontWeight: 600 }}
                        >
                          Addons
                        </Typography>
                        {item.selectedAddOns.map((addon, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mt: 2,
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{ color: "text.secondary" }}
                            >
                              {addon.name}
                            </Typography>
                            <Typography
                              variant="h6"
                              sx={{ color: "text.secondary" }}
                            >
                              RS {addon.price}
                            </Typography>
                          </Box>
                        ))}
                      </>
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        Total Price
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        RS {item.total_price}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </CardContent>

            <CardActions sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                sx={{ mr: 2 }}
                onClick={handleEditClickOpen}
              >
                Change Status To Preparing
              </Button>
              <Button
                color="error"
                variant="tonal"
                onClick={() => setSuspendDialogOpen(true)}
              >
                Cancel Order
              </Button>
            </CardActions>

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
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        label="Full Name"
                        placeholder="John Doe"
                        defaultValue={data.fullName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        label="Username"
                        placeholder="John.Doe"
                        defaultValue={data.username}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">@</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        type="email"
                        label="Billing Email"
                        defaultValue={data.email}
                        placeholder="john.doe@gmail.com"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        select
                        fullWidth
                        label="Status"
                        defaultValue={data.status}
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                      </CustomTextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        label="TAX ID"
                        defaultValue="Tax-8894"
                        placeholder="Tax-8894"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        label="Contact"
                        placeholder="723-348-2344"
                        defaultValue={`+1 ${data.contact}`}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        select
                        fullWidth
                        label="Language"
                        defaultValue="English"
                      >
                        <MenuItem value="English">English</MenuItem>
                        <MenuItem value="Spanish">Spanish</MenuItem>
                        <MenuItem value="Portuguese">Portuguese</MenuItem>
                        <MenuItem value="Russian">Russian</MenuItem>
                        <MenuItem value="French">French</MenuItem>
                        <MenuItem value="German">German</MenuItem>
                      </CustomTextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        select
                        fullWidth
                        label="Country"
                        defaultValue="USA"
                      >
                        <MenuItem value="USA">USA</MenuItem>
                        <MenuItem value="UK">UK</MenuItem>
                        <MenuItem value="Spain">Spain</MenuItem>
                        <MenuItem value="Russia">Russia</MenuItem>
                        <MenuItem value="France">France</MenuItem>
                        <MenuItem value="Germany">Germany</MenuItem>
                      </CustomTextField>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        label="Use as a billing address?"
                        control={<Switch defaultChecked />}
                        sx={{ "& .MuiTypography-root": { fontWeight: 500 } }}
                      />
                    </Grid>
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
                  onClick={handleEditClose}
                >
                  Submit
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
            <UserSubscriptionDialog
              open={subscriptionDialogOpen}
              setOpen={setSubscriptionDialogOpen}
            />
          </Card>
        </Grid>
      </Grid>
    );
  } else {
    return null;
  }
};

export default UserViewLeft;
