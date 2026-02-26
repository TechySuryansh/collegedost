# BITSAT College Predictor - Technical Blueprint

This document outlines the complete logic, dataset, and implementation details for the BITSAT College Predictor tool.

## 1. Input Parameters (Frontend & Backend)
The following inputs are captured from the user and passed to the prediction engine:
*   **BITSAT Score**: Numeric (0–390). Primary identifier.
*   **Gender**: Male / Female. (BITS has minor differences in some quotas/dorm availability, though cutoffs are usually common).
*   **Campus Preference**: (Pilani, Goa, Hyderabad, No Preference).
*   **Program Type**: B.E. (Engineering) or B.Pharm.

## 2. Dataset Structure (JSON)
The dataset contains last 3 years' cutoff scores for all three campuses.
```json
[
  {
    "campus": "BITS Pilani",
    "branch": "Computer Science",
    "cutoffs": [
      { "year": 2023, "score": 331 },
      { "year": 2022, "score": 320 },
      { "year": 2021, "score": 364 }
    ],
    "program": "B.E.",
    "fees": "₹ 5.4L / Year"
  },
  {
    "campus": "BITS Goa",
    "branch": "Electronics & Communication",
    "cutoffs": [
      { "year": 2023, "score": 267 },
      { "year": 2022, "score": 256 },
      { "year": 2021, "score": 308 }
    ],
    "program": "B.E.",
    "fees": "₹ 5.4L / Year"
  }
]
```

## 3. Prediction Logic (TypeScript)
The logic determines admission probability based on the user's score relative to historical cutoffs.

```typescript
function calculateProbability(userScore: number, lastYearCutoff: number): { probability: string, color: string } {
  const diff = userScore - lastYearCutoff;
  
  if (diff >= 0) {
    return { probability: 'High', color: 'emerald' }; // Score >= Cutoff
  } else if (Math.abs(diff) <= 10) {
    return { probability: 'Medium', color: 'amber' }; // 0-10 marks below
  } else if (Math.abs(diff) <= 20) {
    return { probability: 'Low', color: 'rose' }; // 11-20 marks below
  } else {
    return { probability: 'Very Low / Not Eligible', color: 'gray' }; // 21+ marks below
  }
}
```

## 4. API Filter Logic (Backend MongoDB Pipeline)
Filters strictly for BITS campuses and General category.
```javascript
const pipeline = [
  {
    $match: {
      "location.city": { $in: ["Pilani", "Zuarinagar", "Hyderabad"] },
      "cutoffs": {
        $elemMatch: {
          "exam": "BITSAT",
          "category": "General",
          "closingRank": { $lte: userScore + 50 } // Search range
        }
      }
    }
  }
];
```

## 5. UI Requirements (Design Specs)
*   **Input Section**: Clean, numeric input with range validation (0-390).
*   **Probability Badges**: Distinct color-coded pills (Emerald for High, Amber for Medium, Rose for Low).
*   **Result Sorting**: Results sorted by `Probability (High -> Low)` and then by `Average Package`.
*   **Comparison Row**: Display `User Score vs Last Year Cutoff` (e.g., "+15 Above Cutoff").

## 6. Example API Response
```json
{
  "success": true,
  "data": [
    {
      "collegeName": "BITS Pilani, Pilani Campus",
      "course": "B.E. Computer Science",
      "chance": "high",
      "closingRank": 331,
      "difference": 19,
      "location": "Pilani, Rajasthan"
    }
  ]
}
```
