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
 
 - allow for creating invoice in front end form 
 - now that invoice is in DB, build SHOW page for it -> then pay button  +(+show any effects)
 - allow for paying an invoice in front end goerli 

then..
 - build api endpoint that shows if an invoice is PAID     (vibegraph req)
 - show invoices and their statuses on the frontend (vibegraph req)

## IDEA 
Make an endpoint that links an endpoint to a product (must own product to call) and also optionally accepts a 'ClientPublicAddress' which is an account which is somehow 'rewarded' by the fact that the invoice [uuid] gets PAID 

Could also optionally accept an 'Access Key' which gets released (emailed?) (becomes accessable) to the public address if status is PAID 

### BUGS 

-connect is unreliable w metamask 
Since strict-mode is enabled, changing (observed) observable values without using an action is not allowed. Tried to modify: Web3Store@5.active

  
 