import { InputCriteria, Item } from "./types";
import { isCriteriaItem } from "./item";

export const getItemToCriteriaMap = (
  items: Item[],
  criterias: InputCriteria[]
) => {
  const criteriasCopy = [...criterias];

  return items.reduce((map, item) => {
    if (isCriteriaItem(item.itemType)) {
      map.set(item, criteriasCopy.shift() as InputCriteria);
    }
    return map;
  }, new Map<Item, InputCriteria>());
};
