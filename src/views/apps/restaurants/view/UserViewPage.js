// @ts-nocheck
// ** MUI Imports
import Grid from "@mui/material/Grid";

// ** Demo Components Imports
import UserViewLeft from "src/views/apps/restaurants/view/UserViewLeft";
import UserViewRight from "src/views/apps/restaurants/view/UserViewRight";

const UserView = ({ tab, invoiceData, userData }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={12} lg={12}>
        <UserViewLeft userData={userData} />
      </Grid>
      {/* <Grid item xs={12} md={7} lg={8}>
        <UserViewRight
          tab={tab}
          invoiceData={invoiceData}
          userData={userData}
        />
      </Grid> */}
    </Grid>
  );
};

export default UserView;
