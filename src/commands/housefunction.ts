import { House } from "../house";
import { Houses } from "../house/houses"
import { calculateWidthRequirements} from "../wallCalculator";

export function getThecustomerHouse(Name:string) {
    
    Houses.setWallSuppliesCalculator((inches) => calculateWidthRequirements(inches))
    
    const savedHouses = Houses.getAll();

    // if the user searched a customer name that have not signed a house before this message will appear.
    
    if(!savedHouses.get(Name))
    {
        return "This customer is not an existing customer!";
    } else
    {       
        let houses = [...savedHouses.values()];
        let House = houses.find((element: any) => element.name === Name);
        return House;
    }
} 
