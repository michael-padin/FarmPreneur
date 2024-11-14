export const UNITS = {
	kg: { name: "Kilogram", abbreviation: "kg" },
	lb: { name: "Pound", abbreviation: "lb" },
	g: { name: "Gram", abbreviation: "g" },
	oz: { name: "Ounce", abbreviation: "oz" },
	t: { name: "Metric Ton", abbreviation: "t" },
	bu: { name: "Bushel", abbreviation: "bu" },
	pc: { name: "Piece", abbreviation: "pc" },
	doz: { name: "Dozen", abbreviation: "doz" },
	L: { name: "Liter", abbreviation: "L" },
	gal: { name: "Gallon", abbreviation: "gal" },
	bunch: { name: "Bunch", abbreviation: "bunch" },
	crate: { name: "Crate", abbreviation: "crate" },
	box: { name: "Box", abbreviation: "box" },
	bag: { name: "Bag", abbreviation: "bag" },
	ac: { name: "Acre", abbreviation: "ac" },
	ha: { name: "Hectare", abbreviation: "ha" }
} as const

export type UnitKey = keyof typeof UNITS
