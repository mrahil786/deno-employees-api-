import {
    HandlerFunc,
    Context,
  } from "https://deno.land/x/abc@v1.0.0-rc2/mod.ts";
  import db from "../config/db.ts";
  import { ErrorHandler } from "../utils/middlewares.ts";
  
  const database = db.getDatabase;
  const rent = database.collection("rent");

  interface EmployeeRent {
    _id: {
      $oid: string;
    };
    name: string;
    total: number;
    electricity: number;
    house:number;
    gas_cylinder:number;
    month:number;
    year:number
  }
export const createRent: HandlerFunc = async(c: Context)=>{
    try{
        if(c.request.headers.get("content-type")!="application/json"){
            throw new ErrorHandler("Invalid header",422);
        }
        const body= await(c.body());
        if(!Object.keys(body).length){
            throw new ErrorHandler("Request body can not Empty",400);
        }

        const {name,electricity,house,gas_cylinder,month,year}=body;
    
        const insertedRent= await rent.insertOne({
            name,
            "total":electricity,
            electricity,
            house,
            gas_cylinder,
            month,
            year
        });
        console.log(insertedRent);
        return c.json(insertedRent,201);
    }catch(error){
        throw new ErrorHandler(error.message,error.status||500);
    }   
}

export const fetchAllRents: HandlerFunc = async(c: Context)=>{

    try{
        const fetchAllRents:EmployeeRent[]= await rent.find();
        if(fetchAllRents){
            const list=(fetchAllRents.length)?fetchAllRents.map((employeeRent)=> {
                const {_id: { $oid },name,total,electricity,house,gas_cylinder,month,year}=employeeRent;
                return {_id:$oid,name,total,electricity,house,gas_cylinder,month,year};
            }):[];
            return c.json(list,200);
        }
    }catch(error){
        throw new ErrorHandler(error.message,error.status||500);
    }
}
export const findOneRent: HandlerFunc = async (c: Context)=>{
    try{
        const {month}= c.params as {month: string};
        const fetchOneRent:EmployeeRent[]=await rent.find({"month":Number(month)});
        console.log(fetchOneRent.length);

        if(fetchOneRent){
            const list=(findOneRent.length)?fetchOneRent.map((employeRent)=>{
                const {_id:{$oid},name,total,electricity,house,gas_cylinder,month,year}=employeRent;
                return {id:$oid,name,total,electricity,house,gas_cylinder,month,year};
            }):[];
            return c.json(list,200);

        };
        throw new ErrorHandler("This month Rent Not found "+{"month":month},404);
    }catch(error){
        throw new ErrorHandler(error.message,error.status||500)
    }
}