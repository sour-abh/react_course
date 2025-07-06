import {Client,Account,ID} from "appwrite";
import conf from '../conf/conf'

export class AuthServicer{
    client= new Client();
    account;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.account=new Account(this.client);

    }

    async createAccount({email,password,name}){
        try {
            const userAccount= await this.account.create(ID.unique(),email,password,name);

            if(userAccount){
                //call another method
                return this.login({email,password})
            }else{
                return userAccount;
            }
            } 
            catch (error) {
            console.error("Appwrite service :: createAccount :: error", {
                error: error.message,
                stack: error.stack,
                email: email,
                name: name,
                timestamp: new Date().toISOString()
            });
            throw new Error(`Account creation failed: ${error.message}`);
        }

    }

    async login({email,password}){
        try {
             return await this.account.createEmailPasswordSession(email,password)
        } catch (error) {
            console.error("Appwrite service :: login :: error", {
                error: error.message,
                stack: error.stack,
                email: email,
                timestamp: new Date().toISOString()
            });
            throw new Error(`Login failed: ${error.message}`);
        }
    }

    async getCurrentUser(){
        try {
            return await this.account.get(); 
        } catch (error) {

            if(
                error?.message&& 
                error.message.includes("missing scope")
            ){
                console.warn("Appwrite service :: getCurrentUser :: missing scope (user not authenticated)", {
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
                return null;
            }
            console.error("Appwrite service :: getCurrentUser :: error", {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            return null;
        }
    }

    async logout(){
        try {
            await this.account.deleteSessions();
            return true;
        } catch (error) {
            console.error("Appwrite service :: logout :: error", {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            return false;
        }
    }
}

const authService=new AuthServicer();

export default authService