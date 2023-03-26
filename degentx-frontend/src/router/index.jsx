import { useRoutes } from "react-router-dom";
import MainLayout from "../layouts/Main";

import DashboardLayout from "../layouts/Dashboard";
import DashboardView from "../views/dashboard/Index";

 
import Welcome from '../views/welcome/Main'
    
import Docs from '../views/pages/docs.md'   
import Memes from '../views/pages/memes.md'   
import Metadata from '../views/pages/metadata.md'   
 
import ErrorPage from "../views/error-page/Main";

  
import ProductIndex from "../views/dashboard/product/Index"

import ProductShow from "../views/dashboard/product/Show"
    
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
            path:"/memes",
            element: <Memes/>
           },

           { 
            path:"/metadata",
            element: <Metadata/>
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
          path: "/dashboard/products",
          element: <ProductIndex />,
        },
        {
          path: "/dashboard/product/:productId",
          element: <ProductShow />,
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
