import { Arguments, Argv } from "yargs";
import { calculateHouseRequirements } from "../wallCalculator";

export function calcWoodNeeded(yargs: Argv): void {
    // create a new yargs "command"
    yargs.command(
        // name the command with no spaces
        "calc-wood-needed",

        // describe the command so that the --help flag is helpful
        "Calculate the number of studs required to stick frame a house for Gerald",

        // define the parameters we need for our command
        {
            width: {
                type: "number",
                alias: "w",
                description: "The width of the house",
            },

            Inchs: {
                type: "number",
                alias: "I",
                description: "extra inchs for the wall width",
            },
        },

        // define the function we want to run once the arguments are parsed
        function (
            args: Arguments<{
                width: number;
                
                Inchs: number;
                w: number;
               
                I: number;
            }>
        ) {
            const requirements = calculateHouseRequirements(
                args.width,
                args.Inchs
            );

            console.log(requirements);
        }
    );
}
