// @ts-nocheck
// ** Third Party Imports
import axios from "axios";
import React from "react";

// ** Demo Components Imports
import AccountSettings from "src/views/pages/account-settings/AccountSettings";

const AccountSettingsTab = ({ tab, apiPricingPlanData }) => {
  return <AccountSettings tab={tab} apiPricingPlanData={apiPricingPlanData} />;
};

export const getStaticPaths = () => {
  return {
    paths: [
      { params: { tab: "account" } },
      { params: { tab: "security" } },
      { params: { tab: "billing" } },
      // { params: { tab: 'notifications' } },
      // { params: { tab: 'connections' } }
    ],
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const res = await axios.get("/pages/pricing");
  const data = res.data;

  return {
    props: {
      tab: 'security',
      apiPricingPlanData: data.pricingPlans,
    },
  };
};

export default AccountSettingsTab;
