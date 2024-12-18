// Define enum for unit keys
export enum UnitKey {
	KG = "kg",
	LB = "lb",
	G = "g",
	OZ = "oz",
	T = "t",
	BU = "bu",
	PC = "pc",
	DOZ = "doz",
	L = "L",
	GAL = "gal",
	BUNCH = "bunch",
	CRATE = "crate",
	BOX = "box",
	BAG = "bag",
	AC = "ac",
	HA = "ha"
}

export const unitMap: Record<UnitKey, string> = {
	[UnitKey.KG]: "Kilogram",
	[UnitKey.LB]: "Pound",
	[UnitKey.G]: "Gram",
	[UnitKey.OZ]: "Ounce",
	[UnitKey.T]: "Metric Ton",
	[UnitKey.BU]: "Bushel",
	[UnitKey.PC]: "Piece",
	[UnitKey.DOZ]: "Dozen",
	[UnitKey.L]: "Liter",
	[UnitKey.GAL]: "Gallon",
	[UnitKey.BUNCH]: "Bunch",
	[UnitKey.CRATE]: "Crate",
	[UnitKey.BOX]: "Box",
	[UnitKey.BAG]: "Bag",
	[UnitKey.AC]: "Acre",
	[UnitKey.HA]: "Hectare"
}

export const units = Object.entries(unitMap).map(([key, value]) => ({
	label: `${value} (${key})`,
	value: key
}))
