import { createBrowserRouter, type RouteObject } from "react-router-dom"
import main from "../pages/main";
import WalletConnect from "../pages/WalletConnect";




const routes: RouteObject[] = [
    {
        path: "/",

        children: [
            {
                index: true,
                Component : main, 
                
        
            },
            {
                path: "WalletConnect",
                Component: WalletConnect
            }
        
         
            
        ],
        
    },
    
       
       
    
    
   
    
];

const router = createBrowserRouter(routes);

export default router;
