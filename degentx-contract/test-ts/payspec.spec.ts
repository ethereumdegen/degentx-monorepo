 
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { BigNumber, Contract, Signer } from 'ethers'
import hre from 'hardhat'
//import { deploy } from 'helpers/deploy-helpers'
import { FixedSupplyToken, Payspec } from '../generated/typechain'
import { getPayspecInvoiceUUID, getTotalAmountDueFromAmountsDueArray, PayspecInvoice , ETH_ADDRESS} from 'payspec-js'
import { deploy } from '../helpers/deploy-helpers'

chai.should()
chai.use(chaiAsPromised)

const { getNamedSigner, deployments } = hre

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SetupOptions {}

interface SetupReturn {
  payspecContract: Payspec
  fixedSupplyToken: FixedSupplyToken
}

const setup = deployments.createFixture<SetupReturn, SetupOptions>(
  async (hre, _opts) => {
    await hre.deployments.fixture(['primary'], {
      keepExistingDeployments: false,
    })

    const payspecContract = await hre.contracts.get<Payspec>('Payspec')
   
        
      const fixedSupplyToken:FixedSupplyToken  = await deploy({
        contract: 'FixedSupplyToken',
        args: [ ],
        skipIfAlreadyDeployed: false,
        hre, 
      })



    return {
      payspecContract,
      fixedSupplyToken
    }
  }
)



describe('Payspec Contract', () => {

  let payspecContract: Payspec
  let fixedSupplyToken: FixedSupplyToken

  let deployer:Signer  

  let customer:Signer 

  let vendor:Signer 

  

  beforeEach(async () => {
    const result = await setup()
    payspecContract = result.payspecContract
    fixedSupplyToken = result.fixedSupplyToken


    deployer = await getNamedSigner('deployer')

    customer = await getNamedSigner('customer')

    vendor = await getNamedSigner('vendor')

  })


 

    it('should build an invoice', async () => { 

      let payToArray = [ await deployer.getAddress() ]
      let amountsDueArray = [ 100 ]
 
      let newInvoiceData:PayspecInvoice = {
        payspecContractAddress:payspecContract.address,
        description: 'testtx',
        nonce: BigNumber.from(1).toString(),
        token: fixedSupplyToken.address,
        chainId: BigNumber.from(31337).toString(), 
        payToArrayStringified: JSON.stringify(payToArray),
        amountsDueArrayStringified: JSON.stringify(amountsDueArray),
        expiresAt: 0
      }      
 
      
        let actualInvoiceUUID=  await payspecContract.getInvoiceUUID(
          newInvoiceData.description,
          newInvoiceData.nonce,
          newInvoiceData.token,
          newInvoiceData.chainId, 
          payToArray,
          amountsDueArray,
          newInvoiceData.expiresAt
        ) //.call({ from: myAccount }) ;
    


        let expecteduuid = getPayspecInvoiceUUID( newInvoiceData )



        expecteduuid!.should.eql(actualInvoiceUUID)
          
        console.log('actualInvoiceUUID',actualInvoiceUUID)
 
 
    })

    it('should create and pay an invoice with tokens', async () => { 
 
      
      let payToArray = [ await deployer.getAddress() ]
      let amountsDueArray = [ 100 ]
 
      let newInvoiceData:PayspecInvoice = {
        payspecContractAddress:payspecContract.address,
        description: 'testtx',
        nonce: BigNumber.from(1).toString(),
        token: fixedSupplyToken.address,
        chainId: BigNumber.from(31337).toString(), 
        payToArrayStringified: JSON.stringify(payToArray),
        amountsDueArrayStringified: JSON.stringify(amountsDueArray),
        expiresAt: 0
      }    

      let expecteduuid = getPayspecInvoiceUUID( newInvoiceData )

      if(!expecteduuid){
        throw new Error('Undefined expecteduuid')
      }

      //mint and preapprove tokens 
      await fixedSupplyToken.connect(customer).mint(await customer.getAddress(), 10000) 
      await fixedSupplyToken.connect(customer).approve(payspecContract.address, 10000)

      await payspecContract.connect(customer).createAndPayInvoice(
        newInvoiceData.description,
        newInvoiceData.nonce,
        newInvoiceData.token,
        newInvoiceData.chainId,
        payToArray,
        amountsDueArray, 
        newInvoiceData.expiresAt,
        expecteduuid
      )


      let invoiceData = await payspecContract.invoices(expecteduuid)

      console.log('invoiceData',invoiceData)

      expect(invoiceData.uuid).to.exist


    })

    it('should create and pay an invoice with eth', async () => { 

      let payToArray = [ await deployer.getAddress() ]
      let amountsDueArray = [ 100 ]
 
      
      let newInvoiceData:PayspecInvoice = {
        payspecContractAddress:payspecContract.address,
        description: 'testtx',
        nonce: BigNumber.from(1).toString(),
        token: ETH_ADDRESS,
        chainId: BigNumber.from(31337).toString(), 
        payToArrayStringified: JSON.stringify(payToArray),
        amountsDueArrayStringified: JSON.stringify(amountsDueArray),
        expiresAt: 0
      }    


      let expecteduuid = getPayspecInvoiceUUID( newInvoiceData )


      if(!expecteduuid){
        throw new Error('Undefined expecteduuid')
      }

      let totalAmountDue = getTotalAmountDueFromAmountsDueArray(amountsDueArray); //calc me 
      
      await payspecContract.connect(customer).createAndPayInvoice(
            newInvoiceData.description,
            newInvoiceData.nonce,
            newInvoiceData.token,
            newInvoiceData.chainId,
            payToArray,
            amountsDueArray, 
            newInvoiceData.expiresAt,
            expecteduuid , {value: totalAmountDue }
          ) 


      let invoiceData = await payspecContract.invoices(expecteduuid)
 

      expect(invoiceData.uuid).to.exist


    })

    
  
})
