import { Arguments, Argv, string } from "yargs";
import { getThecustomerHouse } from "./housefunction";

export function getCustomersHouses(yargs: Argv): void {
    // creating new yargs command.
    yargs.command(
        // command name
        "customer-house",

        //Description of the command 
        "Gets a house by the customer name, or return that there is no house by that name.",

        
        {
            customerName: {
                type: "string",
                alias: "n",
                description: "The customer name",
            },
        },

        function (args: Arguments<{ customerName: string }>) {
            const requirements = getThecustomerHouse(args.customerName);
            console.log(requirements);
        }
    );
}