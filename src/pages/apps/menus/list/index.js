// @ts-nocheck
// ** React Imports
import { useState, useEffect, useCallback } from "react";

// ** Next Imports
import Link from "next/link";
import { useRouter } from "next/router";

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
import { fetchData, deleteUser } from "src/store/apps/user";

// ** Third Party Components
import axios from "axios";

// ** Custom Table Components Imports
import TableHeader from "src/views/apps/user/list/TableHeader";
import AddUserDrawer from "src/views/apps/user/list/AddUserDrawer";
import { deleteMenuItems, fetchMenuItems } from "../../../../store/apps/restaurants";
import { CircularProgress } from "@mui/material";

// ** renders client column
const userRoleObj = {
  admin: { icon: "tabler:device-laptop", color: "secondary" },
  author: { icon: "tabler:circle-check", color: "success" },
  editor: { icon: "tabler:edit", color: "info" },
  maintainer: { icon: "tabler:chart-pie-2", color: "primary" },
  subscriber: { icon: "tabler:user", color: "warning" },
};

const userStatusObj = {
  active: "success",
  pending: "warning",
  inactive: "secondary",
};


const renderClient = (row) => {
  if (row.images && row.images.length) {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
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
  const [deleting, setDeleting] = useState(false);


  const handleRowOptionsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  const hadleViewItem = () => {
    router.push({
      pathname: `/apps/menus/view/menu-item/${id}`,
    });
    handleRowOptionsClose();
  };

  const hadleEditMenuItem = () => {
    router.push({
      pathname: `/apps/menus/edit/menu-item/${id}`,
    });
    handleRowOptionsClose();
  };

  const handleDelete = async () => {
    setDeleting(true); // Start loading
    try {
      await dispatch(deleteMenuItems(id)).unwrap(); // Dispatch the delete action
      await fetchMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
    } finally {
      setDeleting(false);
      handleRowOptionsClose();
      window.location.reload();
    }
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
          // href="/apps/user/view/account"
          onClick={hadleViewItem}
        >
          <Icon icon="tabler:eye" fontSize={20} />
          View
        </MenuItem>
        <MenuItem onClick={hadleEditMenuItem} sx={{ "& svg": { mr: 2 } }}>
          <Icon icon="tabler:edit" fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          {deleting ? (
            <CircularProgress size={30} sx={{ mr: 2 }} />
          ) : (
            <Icon icon="tabler:trash" fontSize={20} />
          )}
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};
const columns = [
  {
    flex: 0.2,
    minWidth: 280,
    field: "food_name",
    headerName: "Menu Item Name",
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {renderClient(row)}

          <Typography noWrap sx={{ fontWeight: 500 }}>
            {row.food_name}
          </Typography>
        </Box>
      )
    },
  },
  {
    flex: 0.15,
    minWidth: 80,
    field: "category",
    headerName: "Category",
    renderCell: ({ row }) => (
      <Typography noWrap sx={{ color: "text.secondary" }}>
        {row.category}
      </Typography>
    ),
  },
  {
    flex: 0.15,
    minWidth: 120,
    field: "subCategory",
    headerName: "Sub Category",
    renderCell: ({ row }) => (
      <Typography noWrap sx={{ color: "text.secondary" }}>
        {row.subCategory}
      </Typography>
    ),
  },
  {
    flex: 0.15,
    minWidth: 120,
    field: "calories",
    headerName: "Calories",
    renderCell: ({ row }) => (
      <Typography noWrap sx={{ color: "text.secondary" }}>
        {row.calories}
      </Typography>
    ),
  },
  {
    flex: 0.15,
    minWidth: 120,
    field: "cuisine",
    headerName: "Cuisine",
    renderCell: ({ row }) => (
      <Typography noWrap sx={{ color: "text.secondary" }}>
        {row.cuisine}
      </Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 100,
    field: "price",
    headerName: "Price",
    renderCell: ({ row }) => <Typography noWrap>{row.price} RS</Typography>,
  },
  {
    flex: 0.1,
    minWidth: 100,
    field: "availability",
    headerName: "Available",
    renderCell: ({ row }) => (
      <Typography noWrap>{row.availability ? "Yes" : "No"}</Typography>
    ),
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
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("");
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [allFoodItems, setAllFoodItems] = useState([]); 
  const [paginatedItems, setPaginatedItems] = useState([]);

  // ** Hooks
  const dispatch = useDispatch();
  // const foodItems = useSelector((state) => state.restaurants.foodItems); // Access the food items data
  useEffect(() => {
    const fetchAllData = async () => {
      const response = await dispatch(fetchMenuItems()); 
      setAllFoodItems(response.payload); 
    };
    fetchAllData();
  }, [dispatch]);

  useEffect(() => {
    const start = paginationModel.page * paginationModel.pageSize;
    const end = start + paginationModel.pageSize;
    setPaginatedItems(allFoodItems.slice(start, end));
  }, [allFoodItems, paginationModel]);

  const handlePaginationChange = (model) => {
    setPaginationModel(model); 
  };

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
    setStatus(e.target.value);
  }, []);
  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen);

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Menu Items" />
          <Divider sx={{ m: "0 !important" }} />
          {/* <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddUserDrawer}
          /> */}
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={paginatedItems}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            // onPaginationModelChange={setPaginationModel}
            onPaginationModelChange={handlePaginationChange}
            paginationMode="server"
            rowCount={paginatedItems.length}
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
