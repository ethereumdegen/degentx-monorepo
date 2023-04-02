### Todo  
  
 - deploy to goerli 

- build frontend and docs 




-copy a TON of code over from the toadz shop ...
 1. set up vibegraph as a service a moleculer  -DONE-
 2. create DB models similar to stripe so users can define a Project which has Products and then Invoices - DONE - 


 3. write unit tests to prove that project+product can be created/get  on the backend api 


PROJECT: Degen Network
PRODUCT: Advanced Guide - one time payment of $5 of 0xbtc 


4.  build an API endpoint that will let us know if ACCOUNT_X has access to PRODUCT_Y  (bc of a paid invoice that exists) 
 




 ### IMMEDIATE TODO 
  


 -build an INVOICES tab and a PRODUCTS tab (get all products of address)  (cap out accounts on a max of 5 projects) and 25 products in each . 
  
- finish 'hasProductAccess' 


then..
 - 
 -  
-  make the invoice show page look better 

- make payment effects trigger 
- show payment effects on invoice

 ## IMPROVEMENTS LATER 
 1. make it easier to make invoices for a specific product.. form is way simpler of course .. also auto only includes a single payment effect instead of array component 
 2. make an invoice show that isnt in the dashboard layout 
 3. invoice w no payment elements ? error warning



## IDEA 
Make an endpoint that links an endpoint to a product (must own product to call) and also optionally accepts a 'ClientPublicAddress' which is an account which is somehow 'rewarded' by the fact that the invoice [uuid] gets PAID 

Could also optionally accept an 'Access Key' which gets released (emailed?) (becomes accessable) to the public address if status is PAID 

### BUGS 

-connect is unreliable w metamask 
Since strict-mode is enabled, changing (observed) observable values without using an action is not allowed. Tried to modify: Web3Store@5.active

  
 