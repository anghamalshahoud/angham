import fs = require("fs");
import { Arguments, Argv, string } from "yargs";
import { calculateWidthRequirements } from "../wallCalculator";
import { Houses } from "../house/houses";
import {getCustomersHouses} from "./get_customers"
 
 
 
 
export function calcWoodNeeded(yargs: Argv): void {
    // create a new yargs "command"
    yargs.command(
        // name the command with no spaces
        "calc-wood-needed",
 
        // describe the command so that the --help flag is helpful
        "Calculate the number of studs required to stick frame a house for Gerald",
 
        // define the parameters we need for our command
        {
            Name: {
                type: "string",
                alias: "n",
                description: "The name of the custmer"
            },
 
            width: {
                type: "number",
                alias: "w",
                description: "The width of the house",
            },
 
            inches:{
                type: "number",
                alias: "i",
                description: "extra inches to the width",
            },
        
            
        },
 
        // define the function we want to run once the arguments are parsed
        function (
            args: Arguments<{
                width: number;
                inches: number;
                Name: string;
                w: number;
                i: number;
                n: string;
            }>
        ) {
            const calculator = calculateWidthRequirements(args.width);   
            
            
 
 
            Houses.setWallSuppliesCalculator(( inches: number) => {
 
              inches = (args.width * 12) + args.inches;
                return {
                    name: args.Name,
                    posts: calculator.posts ,
                    studs: calculator.studs,
                    plates: calculator.plates
                } 
            
            }); void {}; 
 
             
 
    
            
            const savedHouses = Houses.getAll();
            const House = [ ...savedHouses.values()];
            const house = Houses.create(args.Name);
            house.width = args.width;
            house.name = args.Name;
            house.plates,
            house.posts,
            house.studs,
            Houses.save( house );
        
            
        
        
            console.log(house);
        }
            
        
    );
}


