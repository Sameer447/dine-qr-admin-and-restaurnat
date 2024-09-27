// @ts-nocheck
// ** Third Party Imports
import axios from "axios";
import React from "react";

// ** Demo Components Imports
import UserProfile from "src/views/pages/user-profile/UserProfile";

const UserProfileTab = ({ tab, data }) => {
  const res = JSON.parse(window.localStorage.getItem("userData"));
  return <UserProfile tab={tab} data={res} />;
};

export const getStaticPaths = () => {
  return {
    paths: [
      { params: { tab: "profile" } },
      { params: { tab: "teams" } },
      { params: { tab: "projects" } },
      { params: { tab: "connections" } },
    ],
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const res = await axios.get("/pages/profile", {
    params: { tab: params?.tab },
  });
  const data = res.data;

  return {
    props: {
      data,
      tab: params?.tab,
    },
  };
};

export default UserProfileTab;
