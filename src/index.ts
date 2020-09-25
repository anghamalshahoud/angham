// import yargs to re-use code from someone else that has already 
// solved the complexities of parsing command line arguments
import yargs = require('yargs');
import { calcWoodNeeded } from './commands/calc-wood-needed';
import { getCustomersHouses } from './commands/get_customers';



calcWoodNeeded( yargs );

getCustomersHouses(yargs);


// tell yargs to include the --help flag
yargs.help();

// tell yargs to parse the parameters
yargs.parse();