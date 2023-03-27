import { useRoutes } from "react-router-dom";
import MainLayout from "../layouts/Main";

import DashboardLayout from "../layouts/Dashboard";
import DashboardView from "../views/dashboard/Index";

 
import Welcome from '../views/welcome/Main'
    
import Docs from '../views/pages/docs.md'   
import PayspecJS from '../views/pages/payspecjs.md'   
import DegenTxSol from '../views/pages/degentxsol.md'   
 
 
import ErrorPage from "../views/error-page/Main";

  
//import ProductIndex from "../views/dashboard/product/Index"
import ProductShow from "../views/dashboard/product/Show"

  
import ProjectIndex from "../views/dashboard/project/Index"
import ProjectShow from "../views/dashboard/project/Show"


import InvoiceIndex from "../views/dashboard/invoice/Index"
import InvoiceShow from "../views/dashboard/invoice/Show"
import InvoiceNew from "../views/dashboard/invoice/New"
    
function Router() {
  const routes = [
    {
      
      element: <MainLayout />,
      children:  [ 
          {
            path:"/",
            element: <Welcome />, 
          },

          { 
            path:"/docs",
            element: <Docs/>
           },

           { 
            path:"/payspecjs",
            element: <PayspecJS/>
           },

       
 

        ]
      
    },
    {
      
      element: <DashboardLayout />,
      children: [
        {
          path: "/dashboard",
          element: <DashboardView />,
        },   
        {
          path: "/dashboard/projects",
          element: <ProjectIndex />,
        },
        {
          path: "/dashboard/project/:projectId",
          element: <ProjectShow />,
        },   
        
        {
          path: "/dashboard/product/:productId",
          element: <ProductShow />,
        },


        {
          path: "/dashboard/invoices",
          element: <InvoiceIndex />,
        },

        {
          path: "/dashboard/invoice/new",
          element: <InvoiceNew />,
        },
        {
          path: "/dashboard/invoice/:invoiceId",
          element: <InvoiceShow />,
        },

       
      ]
    },
   
 
  
    {
      path: "/error-page",
      element: <ErrorPage />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ];

  return useRoutes(routes);
}

export default Router;
