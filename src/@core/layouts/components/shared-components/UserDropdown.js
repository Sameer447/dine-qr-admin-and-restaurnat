// @ts-nocheck
// ** React Imports
import { useState, Fragment, useEffect } from "react";

// ** Next Import
import { useRouter } from "next/router";

// ** MUI Imports
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Context
import { useAuth } from "src/hooks/useAuth";
import React from "react";

// ** Styled Components
const BadgeContentSpan = styled("span")(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
}));

const MenuItemStyled = styled(MenuItem)(({ theme }) => ({
  "&:hover .MuiBox-root, &:hover .MuiBox-root svg": {
    color: theme.palette.primary.main,
  },
}));

const UserDropdown = (props) => {
  // ** Props
  const { settings } = props;

  // ** States
  const [anchorEl, setAnchorEl] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);

  // ** Hooks
  const router = useRouter();
  const { logout } = useAuth();

  // ** Vars
  const { direction } = settings;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    if (user) {
      if (user?.role === "superAdmin") {
        setUserRole(true);
      } else if (user?.role === "Resturant") {
        setUserRole(false);
      }
      setUserData(user);
    }
  }, []);

  const handleDropdownOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = (url) => {
    if (url) {
      router.push(url);
    }
    setAnchorEl(null);
  };

  const styles = {
    px: 4,
    py: 1.75,
    width: "100%",
    display: "flex",
    alignItems: "center",
    color: "text.primary",
    textDecoration: "none",
    "& svg": {
      mr: 2.5,
      fontSize: "1.5rem",
      color: "text.secondary",
    },
  };

  const handleLogout = () => {
    logout();
    handleDropdownClose();
  };

  return (
    <Fragment>
      <Badge
        overlap="circular"
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: "pointer" }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Avatar
          alt="John Doe"
          src={`/api/get-user-image?imageName=${userData && userData?.restaurantDetails ? userData?.restaurantDetails?.logo : '/images/avatars/1.png'}`}
          onClick={handleDropdownOpen}
          sx={{ width: 38, height: 38 }}
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ "& .MuiMenu-paper": { width: 230, mt: 4.75 } }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: direction === "ltr" ? "right" : "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: direction === "ltr" ? "right" : "left",
        }}
      >
        <Box sx={{ py: 1.75, px: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Badge
              overlap="circular"
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              <Avatar
                alt="John Doe"
                src={`/api/get-user-image?imageName=${userData && userData?.restaurantDetails ? userData?.restaurantDetails?.logo : '/images/avatars/1.png'}`}
                sx={{ width: "2.5rem", height: "2.5rem" }}
              />
            </Badge>
            <Box
              sx={{
                display: "flex",
                ml: 2.5,
                alignItems: "flex-start",
                flexDirection: "column",
              }}
            >
              <Typography sx={{ fontWeight: 500 }}>
                {userData?.restaurantDetails?.restaurantName}
              </Typography>
              <Typography variant="body2">{userData?.role}</Typography>
            </Box>
          </Box>
        </Box>
        {userRole && (
          <Divider sx={{ my: (theme) => `${theme.spacing(2)} !important` }} />
        )}
        {!userRole ? (
          <MenuItemStyled
            sx={{ p: 0 }}
            onClick={() => handleDropdownClose("/pages/user-profile/profile")}
          >
            <Box sx={styles}>
              <Icon icon="tabler:user-check" />
              My Profile
            </Box>
          </MenuItemStyled>
        ) : null}
        {!userRole ? (
          <MenuItemStyled
            sx={{ p: 0 }}
            onClick={() =>
              handleDropdownClose("/pages/account-settings/account")
            }
          >
            <Box sx={styles}>
              <Icon icon="tabler:settings" />
              Settings
            </Box>
          </MenuItemStyled>
        ) : null}
        {!userRole && (
          <Divider sx={{ my: (theme) => `${theme.spacing(2)} !important` }} />
        )}

        <MenuItemStyled sx={{ p: 0 }} onClick={handleLogout}>
          <Box sx={styles}>
            <Icon icon="tabler:logout" />
            Sign Out
          </Box>
        </MenuItemStyled>
      </Menu>
    </Fragment>
  );
};

export default UserDropdown;
