// @ts-nocheck
// ** React Imports
import { useState, useEffect, useCallback } from "react";

// ** Next Imports
import Link from "next/link";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { DataGrid } from "@mui/x-data-grid";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

// ** Custom Components Imports
import CustomChip from "src/@core/components/mui/chip";
import CustomAvatar from "src/@core/components/mui/avatar";
import CustomTextField from "src/@core/components/mui/text-field";
import CardStatsHorizontalWithDetails from "src/@core/components/card-statistics/card-stats-horizontal-with-details";

// ** Utils Import
import { getInitials } from "src/@core/utils/get-initials";

// ** Actions Imports
import { fetchOrdersData, deleteOrder } from "src/store/apps/orders";

// ** Third Party Components
import axios from "axios";

// ** Custom Table Components Imports
import TableHeader from "src/views/apps/orders/list/TableHeader";
import AddUserDrawer from "src/views/apps/orders/list/AddUserDrawer";
import { useRouter } from "next/router";

// ** renders client column
const userRoleObj = {
  admin: { icon: "tabler:device-laptop", color: "secondary" },
  author: { icon: "tabler:circle-check", color: "success" },
  editor: { icon: "tabler:edit", color: "info" },
  maintainer: { icon: "tabler:chart-pie-2", color: "primary" },
  subscriber: { icon: "tabler:user", color: "warning" },
};

const userStatusObj = {
  cancel: "error",
  active: "secondary",
  pending: "warning",
  complete: "success",
};

// ** Renders client column for multiple images
const renderClient = (row) => {
  if (row.images && row.images.length) {
    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        {row.images.map((image, index) => (
          <CustomAvatar
            key={index}
            src={`/api/get-food-image?imageName=${image.name}`}
            sx={{ mr: 2.5, width: 38, height: 38 }}
          />
        ))}
      </Box>
    );
  } else {
    return (
      <CustomAvatar
        skin="light"
        color={row.avatarColor}
        sx={{
          mr: 2.5,
          width: 38,
          height: 38,
          fontWeight: 500,
          fontSize: (theme) => theme.typography.body1.fontSize,
        }}
      >
        {getInitials(row.fullName ? row.fullName : "John Doe")}
      </CustomAvatar>
    );
  }
};

const RowOptions = ({ id, data }) => {
  // ** Hooks
  const dispatch = useDispatch();
  const router = useRouter();

  // ** State
  const [anchorEl, setAnchorEl] = useState(null);
  const rowOptionsOpen = Boolean(anchorEl);

  const handleRowOptionsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleView = () => {
    // navigation.push(`/apps/orders/view/account`, data);
    router.push({
      pathname: "/dashboards/orders/view/account",
      query: { data: JSON.stringify(data) },
    });
    setAnchorEl(null);
  };

  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    dispatch(deleteOrder(id));
    handleRowOptionsClose();
  };

  return (
    <>
      <IconButton size="small" onClick={handleRowOptionsClick}>
        <Icon icon="tabler:dots-vertical" />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{ style: { minWidth: "8rem" } }}
      >
        <MenuItem
          // component={Link}
          sx={{ "& svg": { mr: 2 } }}
          // href="/dashboards/orders/view/account"
          onClick={handleView}
        >
          <Icon icon="tabler:eye" fontSize={20} />
          View
        </MenuItem>
        {/* <MenuItem onClick={handleRowOptionsClose} sx={{ "& svg": { mr: 2 } }}>
          <Icon icon="tabler:edit" fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ "& svg": { mr: 2 } }}>
          <Icon icon="tabler:trash" fontSize={20} />
          Delete
        </MenuItem> */}
      </Menu>
    </>
  );
};

const columns = [
  {
    flex: 0.15,
    minWidth: 250,
    field: "fullName",
    headerName: "User",
    renderCell: ({ row }) => {
      const { user_name, user_email, cart_items } = row;
      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Assuming we want to show the first item's images */}
          {cart_items && cart_items.length > 0 && renderClient(cart_items[0])}

          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
            }}
          >
            <Typography
              noWrap
              component={Link}
              href="/dashboards/orders/view/account"
              sx={{
                fontWeight: 500,
                textDecoration: "none",
                color: "text.secondary",
                "&:hover": { color: "primary.main" },
              }}
            >
              {user_name || "Sameer Shoukat"}
            </Typography>
            <Typography noWrap variant="body2" sx={{ color: "text.disabled" }}>
              {user_email || "sameer@test.com"}
            </Typography>
          </Box>
        </Box>
      );
    },
  },
  {
    flex: 0.15,
    field: "role",
    maxWidth: 100,
    headerName: "Table",
    renderCell: ({ row }) => {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {/* <CustomAvatar
            skin="light"
            sx={{ mr: 4, width: 30, height: 30 }}
            color={userRoleObj[row.role].color || "primary"}
          >
            <Icon icon={userRoleObj[row.role].icon} />
          </CustomAvatar> */}
          <Typography
            noWrap
            sx={{
              color: "text.secondary",
              textTransform: "capitalize",
              textAlign: "center",
            }}
          >
            {row.table_number}
          </Typography>
        </Box>
      );
    },
  },
  {
    flex: 0.25,
    minWidth: 120,
    headerName: "Order",
    field: "currentPlan",
    renderCell: ({ row }) => {
      return (
        <Typography
          noWrap
          sx={{
            fontWeight: 500,
            color: "text.secondary",
            textTransform: "capitalize",
          }}
        >
          {row?.cart_items && row?.cart_items.length > 0 ? (
            <>
              <div>
                <span>{row?.cart_items.length} Items </span>
              </div>
              {/* display cart food names */}
              <div>
                {row?.cart_items.map((item, index) => (
                  <span key={item._id}>
                    {`${item.food_name} ${
                      index < row?.cart_items.length - 1 ? ", " : ""
                    }`}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <span>No Items</span>
          )}
        </Typography>
      );
    },
  },
  {
    flex: 0.15,
    minWidth: 190,
    field: "billing",
    headerName: "Billing",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap sx={{ color: "text.secondary" }}>
          {row.cart_items &&
            row.cart_items.reduce((acc, item) => acc + item.total_price, 0)}
        </Typography>
      );
    },
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: "status",
    headerName: "Status",
    renderCell: ({ row }) => {
      return (
        <CustomChip
          rounded
          skin="light"
          size="small"
          label={row.status}
          color={userStatusObj[row.status]}
          sx={{ textTransform: "capitalize" }}
        />
      );
    },
  },
  {
    flex: 0.1,
    minWidth: 100,
    sortable: false,
    field: "actions",
    headerName: "Actions",
    renderCell: ({ row }) => <RowOptions id={row._id} data={row} />,
  },
];

const UserList = ({ apiData }) => {
  // ** State
  const [role, setRole] = useState("");
  const [plan, setPlan] = useState("");
  const [value, setValue] = useState("Pending");
  const [status, setStatus] = useState("");
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // ** Hooks
  const dispatch = useDispatch();
  const store = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrdersData());
  }, []);

  const handleFilter = useCallback((val) => {
    setValue(val);
  }, []);

  const handleRoleChange = useCallback((e) => {
    setRole(e.target.value);
  }, []);

  const handlePlanChange = useCallback((e) => {
    setPlan(e.target.value);
  }, []);

  const handleStatusChange = useCallback((e) => {
    console.log("store.orders", store.orders);

    const data = store.orders.filter(
      (item) => item.status === e.target.value.toLowerCase(),
    );
    console.log("data => ", data);

    setStatus(e.target.value);
  }, []);
  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen);

  return (
    <Grid container spacing={6.5}>
      {/* <Grid item xs={12}>
        {apiData && (
          <Grid container spacing={6}>
            {apiData.statsHorizontalWithDetails.map((item, index) => {
              return (
                <Grid item xs={12} md={3} sm={6} key={index}>
                  <CardStatsHorizontalWithDetails {...item} />
                </Grid>
              );
            })}
          </Grid>
        )}
      </Grid> */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Orders" />
          <CardContent>
            <Grid container spacing={6}>
              {/*<Grid item sm={4} xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue="Select Role"
                  SelectProps={{
                    value: role,
                    displayEmpty: true,
                    onChange: (e) => handleRoleChange(e),
                  }}
                >
                  <MenuItem value="">Select Role</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="author">Author</MenuItem>
                  <MenuItem value="editor">Editor</MenuItem>
                  <MenuItem value="maintainer">Maintainer</MenuItem>
                  <MenuItem value="subscriber">Subscriber</MenuItem>
                </CustomTextField>
              </Grid>
              <Grid item sm={4} xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue="Select Plan"
                  SelectProps={{
                    value: plan,
                    displayEmpty: true,
                    onChange: (e) => handlePlanChange(e),
                  }}
                >
                  <MenuItem value="">Select Plan</MenuItem>
                  <MenuItem value="basic">Basic</MenuItem>
                  <MenuItem value="company">Company</MenuItem>
                  <MenuItem value="enterprise">Enterprise</MenuItem>
                  <MenuItem value="team">Team</MenuItem>
                </CustomTextField>
              </Grid> */}
              <Grid item sm={4} xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue="Select Status"
                  SelectProps={{
                    value: status,
                    displayEmpty: true,
                    onChange: (e) => handleStatusChange(e),
                  }}
                >
                  <MenuItem value="">Select Status</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="preparing">Preparing</MenuItem>
                  <MenuItem value="ready">Ready</MenuItem>
                  <MenuItem value="canceled">Canceled</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                </CustomTextField>
              </Grid>
            </Grid>
          </CardContent>
          <Divider sx={{ m: "0 !important" }} />
          {/* <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddUserDrawer}
          /> */}
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={store.orders.filter((item) => item.status === status)}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            getRowId={(row) => row._id}
          />
        </Card>
      </Grid>

      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  );
};

export const getStaticProps = async () => {
  const res = await axios.get("/cards/statistics");
  const apiData = res.data;

  return {
    props: {
      apiData,
    },
  };
};

export default UserList;
