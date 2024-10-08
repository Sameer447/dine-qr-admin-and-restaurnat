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
import { CardMedia, CircularProgress } from "@mui/material";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const serviceUrl = process.env.NEXT_PUBLIC_CUSTOMER_API_URL;


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
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true);
  const handleEditClose = () => setOpenEdit(false);

  const handlePlansClickOpen = () => setOpenPlans(true);
  const handlePlansClose = () => setOpenPlans(false);

  const handleChangeStatus = async () => {
    try {
      let object;
      if (orderData.status === 'Pending') {
        object = {
          orderId: orderData._id,
          status: 'preparing',
        }
      } else if (orderData.status === 'preparing') {
        object = {
          orderId: orderData._id,
          status: 'ready',
        }
      } else if (orderData.status === 'ready') {
        object = {
          orderId: orderData._id,
          status: 'delivered',
        }
      }
      setLoading(true);
      const response = await fetch(`${serviceUrl}/change-order-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(object)
      });
      if (!response.ok) {
        const error = await response.json();
        setLoading(false);
        throw new Error(error.message);
      }
      toast.success('Order status changed successfully');
      router.push('/dashboards/orders/list/');
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };



  if (data) {
    return (
      <Grid
        container
        spacing={6}
        sx={{ mt: 6 }}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Grid container spacing={6} justifyContent={"center"} alignItems={"center"}>
          <Grid item xs={8}>
            <Card>
              <CardContent sx={{ pt: 18.5, display: "flex", alignItems: "center", flexDirection: "column" }}>
                {orderData.user_name ? (
                  <CustomAvatar skin="light" variant="rounded" color={data.avatarColor} sx={{ width: 100, height: 100, mb: 4, fontSize: "3rem" }}>
                    {getInitials(orderData.user_name)}
                  </CustomAvatar>
                ) : (
                  <CustomAvatar src={orderData.user_name} variant="rounded" alt={orderData.user_name} sx={{ width: 100, height: 100, mb: 4 }} />
                )}
                <Typography variant="h4" sx={{ mb: 3 }}>{orderData.user_name}</Typography>
                <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>{orderData.user_email}</Typography>
                <Typography variant="h6" sx={{ mt: 2, color: "text.secondary", mb: 3 }}>Table Number: {orderData.table_number}</Typography>
                <CustomChip rounded skin="light" size="small" label="Customer" color={roleColors[data.role]} sx={{ textTransform: "capitalize" }} />
              </CardContent>

              <Divider sx={{ my: "0 !important", mx: 6 }} />

              <Box container spacing={1} marginTop={3} justifyContent={"center"}
                alignItems={"start"} >
                {orderData.cart_items.map((item) => (
                  <Grid item xs={12} md={6} lg={4} key={item._id.$oid} justifyContent={'center'} >
                    <Card sx={{ width: 800 }} >
                      {item.images && item.images.length > 0 && (
                        <CardMedia
                          component="img"
                          height="400"
                          image={`/api/get-food-image?imageName=${item.images[0].name}`} // Assuming you serve images from this path
                          alt={item.food_name}
                          className="object-center"
                        />
                      )}
                      <CardContent>
                        <Typography variant="h6">{item.food_name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {item.description}
                        </Typography>
                        <Typography variant="body1">Price: ${item.price}</Typography>
                        <Typography variant="body1">Cuisine: {item.cuisine}</Typography>
                        <Typography variant="body1">Category: {item.category}</Typography>
                        <Typography variant="body1">Preparation Time: {item.preparationTime} min</Typography>
                        <Typography variant="body1">Calories: {item.calories} kcal</Typography>

                        <Typography variant="body2" color="textSecondary">
                          Allergens: {item.allergens.join(', ')}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Speciality Tags: {item.specialityTags.join(', ')}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Available Sizes: {item.availableSizes.join(', ')}
                        </Typography>

                        <Typography variant="body1" marginTop={2}>
                          Total Price: {item.total_price}Rs
                        </Typography>

                        {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                          <>
                            <Typography variant="h6" marginTop={2}>
                              Selected Add-Ons
                            </Typography>
                            {item.selectedAddOns.map((addOn) => (
                              <Box key={addOn._id.$oid} marginTop={1}>
                                <Typography variant="body2">
                                  {addOn.name} - ${addOn.price} x {addOn.quantity}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  Message: {addOn.message}
                                </Typography>
                              </Box>
                            ))}
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Box>

              <CardActions sx={{ display: "flex", justifyContent: "center" }}>
                <Button variant="contained" sx={{ mr: 2 }} onClick={handleChangeStatus}>
                  {loading ? (
                    <Box display='flex' alignItems='center'>
                      <Box component='span' mr={1}>
                        Loading...
                      </Box>
                      <Box component={CircularProgress} color={'white'} size={16} />
                    </Box>
                  ) : (
                    <>
                      {orderData.status === 'Pending' ? 'Start Preparing' : orderData.status === 'preparing' ? 'Ready' : 'Delivered'}
                    </>
                  )}
                </Button>
                <Button color="error" variant="tonal" onClick={() => setSuspendDialogOpen(true)}>
                  Cancel Order
                </Button>
              </CardActions>

              {/* Dialogs for Edit and Suspend */}
              {/* <EditUserDialog open={openEdit} handleClose={handleEditClose} data={data} /> */}
              <UserSuspendDialog open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
              <UserSubscriptionDialog open={subscriptionDialogOpen} setOpen={setSubscriptionDialogOpen} />
            </Card>
          </Grid>
        </Grid>
      </Grid>
    );
  } else {
    return null;
  }
};

export default UserViewLeft;