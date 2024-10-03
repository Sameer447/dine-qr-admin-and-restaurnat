// @ts-nocheck
// ** Third Party Imports
import axios from "axios";
import { useRouter } from "next/router";

// ** Demo Components Imports
import UserViewPage from "src/views/apps/orders/view/UserViewPage";

const UserView = ({ tab, invoiceData }) => {
  const router = useRouter();
  return <UserViewPage tab={tab} cartData={JSON.parse(router.query.data)} />;
};

export const getStaticPaths = () => {
  return {
    paths: [
      { params: { tab: "account" } },
      // { params: { tab: "security" } },
      // { params: { tab: "billing-plan" } },
      // { params: { tab: "notification" } },
      // { params: { tab: "connection" } },
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
