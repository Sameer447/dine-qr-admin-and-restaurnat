// @ts-nocheck
// ** Third Party Imports
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// ** Demo Components Imports
import UserViewPage from "src/views/apps/restaurants/view/UserViewPage";

const UserView = ({ tab, invoiceData }) => {
  const router = useRouter();
  const { id } = router.query;
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    axios.get("/api/UserById/route?id=" + id).then((res) => {
      setUserData(res.data);
    });
  }, [router.query.id]);
  return (
    <UserViewPage tab={tab} invoiceData={invoiceData} userData={userData} />
  );
};

export const getStaticPaths = () => {
  return {
    paths: [
      { params: { tab: "account" } },
      { params: { tab: "security" } },
      { params: { tab: "billing-plan" } },
      // { params: { tab: 'notification' } },
      // { params: { tab: 'connection' } }
    ],
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const res = await axios.get("/apps/invoice/invoices");
  const invoiceData = res.data.allData;

  return {
    props: {
      invoiceData,
      tab: params?.tab,
    },
  };
};

export default UserView;
