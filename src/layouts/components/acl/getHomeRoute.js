/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = (role) => {
  if (role) return "/dashboards/analytics";
  else return "/dashboards/orders/list";
};

export default getHomeRoute;
