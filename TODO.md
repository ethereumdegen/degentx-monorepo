### Todo  
  
 - deploy to goerli 

- build frontend and docs 




-copy a TON of code over from the toadz shop ...
 1. set up vibegraph as a service a moleculer  -DONE-
 2. create DB models similar to stripe so users can define a Project which has Products and then Invoices - DONE - 

 3. write unit tests to prove that project+product can be created/get  on the backend api 


PROJECT: Degen Network
PRODUCT: Advanced Guide - one time payment of $5 of 0xbtc 
 



 ### IMMEDIATE TODO 
  

  
 
- make payment effects trigger (alrdy do?)

- make a page for users that shows all of the Effects they have been granted  
 

 ## IMPROVEMENTS LATER 
 1. add pagination and sorting to tables 

 1. make it easier to make invoices for a specific product.. form is way simpler of course .. also auto only includes a single payment effect instead of array component 
 2. make an invoice show that isnt in the dashboard layout 
 3. invoice w no payment elements ? error warning
4. allow a product image to be chosen from a few templates 
 
 5. deploy contract to optimism and test that out 


## IDEA 
Make an endpoint that links an endpoint to a product (must own product to call) and also optionally accepts a 'ClientPublicAddress' which is an account which is somehow 'rewarded' by the fact that the invoice [uuid] gets PAID 

Could also optionally accept an 'Access Key' which gets released (emailed?) (becomes accessable) to the public address if status is PAID 

### BUGS 

-connect is unreliable w metamask 
Since strict-mode is enabled, changing (observed) observable values without using an action is not allowed. Tried to modify: Web3Store@5.active

  
 