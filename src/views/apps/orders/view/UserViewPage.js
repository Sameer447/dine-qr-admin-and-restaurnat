// @ts-nocheck
// ** MUI Imports
import Grid from "@mui/material/Grid";
import { useEffect } from "react";

// ** Demo Components Imports
import UserViewLeft from "src/views/apps/orders/view/UserViewLeft";
import UserViewRight from "src/views/apps/orders/view/UserViewRight";

const UserView = ({ tab, cartData }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={12} lg={12}>
        <UserViewLeft orderData={cartData} />
      </Grid>
      {/* <Grid item xs={12} md={7} lg={8}>
        <UserViewRight tab={tab} invoiceData={invoiceData} />
      </Grid> */}
    </Grid>
  );
};

export default UserView;
