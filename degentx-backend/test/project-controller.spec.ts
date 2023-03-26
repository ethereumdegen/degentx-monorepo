import axios from 'axios'
import chai, { expect } from 'chai'
import { ethers, Wallet } from 'ethers'
 
  
import { disconnectTestDatabase, initTestDatabase } from './util/test-utils'
   
import { mongoIdToString } from '../lib/mongo-helper'

import {stubProject} from "../modules/project-module"
import { Project } from '../dbextensions/project-extension'
import ProjectController from '../controllers/project-controller'

let projectController = new ProjectController()

describe('Project Controller', () => {
 
  

    before(async () => { 

        await initTestDatabase();
 

        let deleted = await Project.deleteMany({})
    })

    after(async () => {

        await disconnectTestDatabase();
     
    })



    it('should create project', async () => {

        let wallet = Wallet.createRandom()

       
       let created = await projectController.createProject(
            {fields: {

                name:'my_proj', 
               

                publicAddress: wallet.address,

                authToken: 'test_auth_token'

            }}
        )
         
        expect(created.success).to.eql(true)
        expect(created.data).to.exist
    })

    
  
    

  
})
