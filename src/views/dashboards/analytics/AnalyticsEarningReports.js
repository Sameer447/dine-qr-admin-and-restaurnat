// @ts-nocheck
import { useEffect, useState } from "react";
// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { styled, useTheme } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";

// ** Custom Components Imports
import Icon from "src/@core/components/icon";
import CustomChip from "src/@core/components/mui/chip";
import OptionsMenu from "src/@core/components/option-menu";
import CustomAvatar from "src/@core/components/mui/avatar";
import ReactApexcharts from "src/@core/components/react-apexcharts";
import moment from "moment/moment";

// ** Util Import
import { hexToRGBA } from "src/@core/utils/hex-to-rgba";

const series = [{ data: [37, 76, 65, 41, 99, 53, 70] }];

const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up("sm")]: {
    paddingTop: "0 !important",
  },
}));

const AnalyticsEarningReports = ({ orders, foodItems }) => {
  const [selectedTab, setSelectedTab] = useState("Last Week");
  const [ordersDataBySelectedDate, setOrdersDataBySelectedDate] =
    useState(orders);
  // Get current date
  const lastday = moment().endOf("month").format("YYYY-MM-DD");
  const currentDate = moment().format("YYYY-MM-DD");
  // last 7 days orders
  useEffect(() => {
    if (selectedTab === "Last Week") {
      setOrdersDataBySelectedDate(
        orders.filter((order) => {
          return moment(order.createdAt).isBetween(
            moment().subtract(7, "days"),
            moment(),
          );
        }),
      );
    } else if (selectedTab === "Last Month") {
      setOrdersDataBySelectedDate(
        orders.filter((order) => {
          return moment(order.createdAt).isBetween(
            moment().subtract(30, "days"),
            moment(),
          );
        }),
      );
    } else {
      setOrdersDataBySelectedDate(
        orders.filter((order) => {
          return moment(order.createdAt).isBetween(
            moment().subtract(365, "days"),
            moment(),
          );
        }),
      );
    }
  }, [selectedTab]);

  // Filter orders by current date
  const currentOrders = orders.filter((order) => {
    return moment(order.createdAt).isBetween(
      moment().subtract(7, "days"),
      moment(),
    );
  });

  // Calculate total earnings, profit, and expense
  const totalEarning = currentOrders
    .map((order) => order.cart_items)
    .flat()
    .map((item) => item.total_price)
    .reduce((a, b) => a + b, 0);

  const totalProfit = (totalEarning / 100) * 20;
  const totalExpense = totalEarning - totalProfit;

  // ** Hook
  const theme = useTheme();
  const data = [
    {
      progress: 100,
      stats: totalEarning,
      title: "Earnings",
      avatarIcon: "tabler:currency-dollar",
    },
    {
      progress: 100,
      title: "Profit",
      stats: totalProfit,
      avatarColor: "info",
      progressColor: "info",
      avatarIcon: "tabler:chart-pie-2",
    },
    {
      progress: 100,
      stats: totalExpense,
      title: "Expense",
      avatarColor: "error",
      progressColor: "error",
      avatarIcon: "tabler:brand-paypal",
    },
  ];
  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        distributed: true,
        columnWidth: "42%",
        endingShape: "rounded",
        startingShape: "rounded",
      },
    },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    colors: [
      hexToRGBA(theme.palette.primary.main, 0.16),
      hexToRGBA(theme.palette.primary.main, 0.16),
      hexToRGBA(theme.palette.primary.main, 0.16),
      hexToRGBA(theme.palette.primary.main, 0.16),
      hexToRGBA(theme.palette.primary.main, 1),
      hexToRGBA(theme.palette.primary.main, 0.16),
      hexToRGBA(theme.palette.primary.main, 0.16),
    ],
    states: {
      hover: {
        filter: { type: "none" },
      },
      active: {
        filter: { type: "none" },
      },
    },
    grid: {
      show: false,
      padding: {
        top: -28,
        left: -9,
        right: -10,
        bottom: -12,
      },
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
      labels: {
        style: {
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize,
        },
      },
    },
    yaxis: { show: false },
  };

  return (
    <Card>
      <CardHeader
        sx={{ pb: 0 }}
        title="Earning Reports"
        subheader="Earnings Overview"
        action={
          <OptionsMenu
            options={["Last Week", "Last Month", "Last Year"]}
            onSelect={(option) => setSelectedTab(option.target.textContent)}
            iconButtonProps={{ size: "small", sx: { color: "text.disabled" } }}
          />
        }
      />
      <CardContent>
        <Grid container spacing={6}>
          <StyledGrid
            item
            sm={5}
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-end",
            }}
          >
            <Box
              sx={{
                mb: 3,
                rowGap: 1,
                columnGap: 2.5,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Typography variant="h1">RS{totalEarning}</Typography>
              <CustomChip
                rounded
                size="small"
                skin="light"
                color="success"
                // label={``}
              />
            </Box>
            <Typography variant="body2">
              {`You informed of this Week compared to ${selectedTab}`}
            </Typography>
          </StyledGrid>
          <StyledGrid item xs={12} sm={7}>
            <ReactApexcharts
              type="bar"
              height={163}
              series={series}
              options={options}
            />
          </StyledGrid>
        </Grid>
        <Box
          sx={{
            mt: 6,
            borderRadius: 1,
            p: theme.spacing(4, 5),
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Grid container spacing={6}>
            {data.map((item, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Box sx={{ mb: 2.5, display: "flex", alignItems: "center" }}>
                  <CustomAvatar
                    skin="light"
                    variant="rounded"
                    color={item.avatarColor}
                    sx={{ mr: 2, width: 26, height: 26 }}
                  >
                    <Icon fontSize="1.125rem" icon={item.avatarIcon} />
                  </CustomAvatar>
                  <Typography variant="h6">{item.title}</Typography>
                </Box>
                <Typography variant="h4" sx={{ mb: 2.5 }}>
                  {item.stats}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={item.progress}
                  color={item.progressColor}
                  sx={{ height: 4 }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AnalyticsEarningReports;
