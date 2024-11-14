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

// Define a map to associate each key with its properties
export const UNITS_MAP: Record<
	UnitKey,
	{ name: string; abbreviation: string }
> = {
	[UnitKey.KG]: { name: "Kilogram", abbreviation: "kg" },
	[UnitKey.LB]: { name: "Pound", abbreviation: "lb" },
	[UnitKey.G]: { name: "Gram", abbreviation: "g" },
	[UnitKey.OZ]: { name: "Ounce", abbreviation: "oz" },
	[UnitKey.T]: { name: "Metric Ton", abbreviation: "t" },
	[UnitKey.BU]: { name: "Bushel", abbreviation: "bu" },
	[UnitKey.PC]: { name: "Piece", abbreviation: "pc" },
	[UnitKey.DOZ]: { name: "Dozen", abbreviation: "doz" },
	[UnitKey.L]: { name: "Liter", abbreviation: "L" },
	[UnitKey.GAL]: { name: "Gallon", abbreviation: "gal" },
	[UnitKey.BUNCH]: { name: "Bunch", abbreviation: "bunch" },
	[UnitKey.CRATE]: { name: "Crate", abbreviation: "crate" },
	[UnitKey.BOX]: { name: "Box", abbreviation: "box" },
	[UnitKey.BAG]: { name: "Bag", abbreviation: "bag" },
	[UnitKey.AC]: { name: "Acre", abbreviation: "ac" },
	[UnitKey.HA]: { name: "Hectare", abbreviation: "ha" }
}

// Usage example
export const unitDetails = UNITS_MAP[UnitKey.KG] // { name: "Kilogram", abbreviation: "kg" }
