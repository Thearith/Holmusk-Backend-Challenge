import {
  CALORIES,
  TOTAL_FAT,
  SATURATED,
  POLYUNSATURATED,
  MONOUNSATURATED,
  TRANS,
  CHOLESTEROL,
  SODIUM,
  POTASSIUM,
  TOTAL_CARBS,
  DIETARY_FIBRE,
  SUGARS,
  PROTEIN,
  VITAMIN_A,
  VITAMIN_C,
  CALCIUM,
  IRON
} from './JSONKeys';


export const Keys = {
  JSON_INDEX                  : 0,
  SHORT_NAME_INDEX            : 1
};

export const ImportantNutrients = [
  [TOTAL_CARBS, "Carb"],
  [PROTEIN, "Protein"],
  [TOTAL_FAT, "Fat"]
];

export const OtherNutrients = [
  [
    [SUGARS, "Sugars"],
    [DIETARY_FIBRE, "Fibre"]
  ],
  [
    [SODIUM, "Sodium"],
    [POTASSIUM, "Potassium"]
  ],
  [
    [IRON, "Iron"],
    [CALCIUM, "Calcium"]
  ],
  [
    [VITAMIN_A, "Vitamin A"],
    [VITAMIN_C, "Vitamin C"]
  ],
  [
    [SATURATED, "Saturated"],
    [TRANS, "Trans"]
  ],
  [
    [MONOUNSATURATED, "Mono Unsat"],
    [POLYUNSATURATED, "Poly Unsat"]
  ]
];