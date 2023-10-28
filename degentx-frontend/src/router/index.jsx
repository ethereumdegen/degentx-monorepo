import { useRoutes } from "react-router-dom";
import MainLayout from "../layouts/Main";

import ContextLayout from "../layouts/Context";

import DocumentationLayout from "../layouts/Documentation";

import DashboardLayout from "../layouts/Dashboard";
import DashboardView from "../views/dashboard/Index";

import Welcome from "../views/welcome/Main";

import Docs from "../views/docs/docs.md";
import PayspecJS from "../views/docs/payspecjs.md";
import DegenTxSol from "../views/docs/degentxsol.md";

import ErrorPage from "../views/error-page/Main";

import Checkout from "../views/invoice/Checkout";

import InvoiceIndex from "../views/dashboard/invoice/Index";
import InvoiceShow from "../views/dashboard/invoice/Show";
import InvoiceNew from "../views/dashboard/invoice/New";

function Router() {
  const routes = [
    {
      element: <ContextLayout />,
      children: [
        {
          element: <MainLayout />,
          children: [
            {
              path: "/",
              element: <Welcome />,
            },

            //make this a special custom new invoice form that uses GET params
            {
              path: "/checkout",
              element: <Checkout />,
            },

            //make this a special custom new invoice form that uses GET params
            {
              path: "/checkout",
              element: <Checkout />,
            },
          ],
        },
        {
          element: <DocumentationLayout />,
          children: [
            {
              path: "/docs",
              element: <Docs />,
            },

            {
              path: "/docs/payspecjs",
              element: <PayspecJS />,
            },

            {
              path: "/docs/degentxsol",
              element: <DegenTxSol />,
            },
          ],
        },

        /*{
      
      element: <DashboardLayout />,
      children: [
        {
          path: "/dashboard",
          element: <DashboardView />,
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
            path: "/dashboard/invoice/:invoiceUUID",
            element: <InvoiceShow />,
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
          path: "/dashboard/invoice/:invoiceUUID",
          element: <InvoiceShow />,
        },

       
      ]
    },*/

        {
          path: "/error-page",
          element: <ErrorPage />,
        },
        {
          path: "*",
          element: <ErrorPage />,
        },
      ],
    },
  ];

  return useRoutes(routes);
}

export default Router;
