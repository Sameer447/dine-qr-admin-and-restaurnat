// @ts-nocheck
// ** MUI Import
import Grid from "@mui/material/Grid";

// ** Demo Component Imports
import AnalyticsProject from "src/views/dashboards/analytics/AnalyticsProject";
import AnalyticsOrderVisits from "src/views/dashboards/analytics/AnalyticsOrderVisits";
import AnalyticsTotalEarning from "src/views/dashboards/analytics/AnalyticsTotalEarning";
import AnalyticsSourceVisits from "src/views/dashboards/analytics/AnalyticsSourceVisits";
import AnalyticsEarningReports from "src/views/dashboards/analytics/AnalyticsEarningReports";
import AnalyticsSupportTracker from "src/views/dashboards/analytics/AnalyticsSupportTracker";
import AnalyticsSalesByCountries from "src/views/dashboards/analytics/AnalyticsSalesByCountries";
import AnalyticsMonthlyCampaignState from "src/views/dashboards/analytics/AnalyticsMonthlyCampaignState";
import AnalyticsWebsiteAnalyticsSlider from "src/views/dashboards/analytics/AnalyticsWebsiteAnalyticsSlider";

// ** Custom Component Import
import KeenSliderWrapper from "src/@core/styles/libs/keen-slider";
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts";
import CardStatsWithAreaChart from "src/@core/components/card-statistics/card-stats-with-area-chart";

// store
import { fetchOrdersData, deleteOrder } from "src/store/apps/orders";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const AnalyticsDashboard = () => {
  const dispatch = useDispatch();
  const { orders, foodItems } = useSelector((state) => state?.orders);
  useEffect(() => {
    dispatch(fetchOrdersData());
  }, []);
  return (
    <ApexChartWrapper>
      <KeenSliderWrapper>
        <Grid container spacing={6}>
          {/* <Grid item xs={12} lg={6}>
            <AnalyticsWebsiteAnalyticsSlider />
          </Grid> */}

          <Grid item xs={12} md={6}>
            <AnalyticsEarningReports orders={orders} foodItems={foodItems} />
          </Grid>
          <Grid item xs={12} md={6}>
            <AnalyticsSupportTracker orders={orders} foodItems={foodItems} />
          </Grid>
          {/* <Grid item xs={12} md={6} lg={4}>
             <AnalyticsSalesByCountries />
           </Grid> */}
          {/* <Grid item xs={12} md={6} lg={4}>
            <AnalyticsTotalEarning />
          </Grid>
          <Grid item xs={12} sm={6} lg={6}>
            <AnalyticsOrderVisits />
          </Grid> */}
          {/* <Grid item xs={12} md={6} lg={4}>
            <AnalyticsMonthlyCampaignState />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsSourceVisits />
          </Grid>
          <Grid item xs={12} lg={8}>
            <AnalyticsProject />
          </Grid> */}
          {/* <Grid item xs={12} sm={6} lg={3}>
            <CardStatsWithAreaChart
              stats="97.5k"
              chartColor="success"
              avatarColor="success"
              title="Revenue Generated"
              avatarIcon="tabler:credit-card"
              chartSeries={[{ data: [6, 35, 25, 61, 32, 84, 70] }]}
            />
          </Grid> */}
        </Grid>
      </KeenSliderWrapper>
    </ApexChartWrapper>
  );
};

export default AnalyticsDashboard;
