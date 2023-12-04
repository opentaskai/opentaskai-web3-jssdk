import { ItemType } from "../constants";
import type { Item } from "./types";

export const isCurrencyItem = ({ itemType }: Item) =>
  [ItemType.NATIVE, ItemType.ERC20].includes(itemType);

export const isNativeCurrencyItem = ({ itemType }: Item) =>
  itemType === ItemType.NATIVE;

export const isErc20Item = (itemType: Item["itemType"]) =>
  itemType === ItemType.ERC20;

export const isErc721Item = (itemType: Item["itemType"]) =>
  [ItemType.ERC721, ItemType.ERC721_WITH_CRITERIA].includes(itemType);

export const isErc1155Item = (itemType: Item["itemType"]) =>
  [ItemType.ERC1155, ItemType.ERC1155_WITH_CRITERIA].includes(itemType);

export const isCriteriaItem = (itemType: Item["itemType"]) =>
  [ItemType.ERC721_WITH_CRITERIA, ItemType.ERC1155_WITH_CRITERIA].includes(
    itemType
  );

export const toItem = (item: any): Item => {
  return {
    itemType: item.itemType,
    token: item.token,
    identifierOrCriteria: item.identifierOrCriteria + "",
  };
};
