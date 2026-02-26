# VITEEE-Only Predictor: Complete Configuration & Logic

This specification provides a standalone, exam-specific setup designed exclusively for the VITEEE Predictor, ensuring zero overlap with other exams.

## 1. VIT Institution Types
Admissions are restricted to the four VIT campuses:
*   `Deemed University – VIT Vellore`
*   `Deemed University – VIT Chennai`
*   `Deemed University – VIT AP (Amaravati)`
*   `Deemed University – VIT Bhopal`

## 2. VITEEE-Specific Filters
The tool enforces filters valid strictly for the VIT admission model:
| Filter Name | Type | Options |
| :--- | :--- | :--- |
| **VITEEE Rank** | Primary Input | 1 to 2,00,000 (Integer) |
| **VIT Category** | Select | Category 1, Category 2, Category 3, Category 4, Category 5 |
| **Campus Preference** | Multi-Select | Vellore, Chennai, AP, Bhopal, No Preference |
| **Program Type** | Multi-Select | B.Tech |
| **Branch Interest** | Multi-Select | CSE, CSE Spec, AI & ML, Data Science, IT, ECE, EEE, Mechanical, Civil, etc. |

**EXCLUDED FILTERS**: Home State, Gender, Category (Reservation), Score-based markers.

## 3. VIT Category System Logic
Each B.Tech branch at VIT has five categories with increasing fees and decreasing rank cutoffs.
*   **Category 1**: Merit-based (Lowest Fees, stiffest competition).
*   **Category 5**: Higher Fees (More lenient rank requirements).

## 4. Standalone Prediction Logic (TypeScript)
The logic assesses chances based on the rank relative to category-specific closing ranks.

```typescript
export const calculateVITEEEChance = (rank: number, closingRank: number) => {
  const diff = rank - closingRank;
  
  if (rank <= closingRank) return { label: 'High', chance: 'high' };
  if (diff <= 2000) return { label: 'Medium', chance: 'medium' };
  if (diff <= 5000) return { label: 'Low', chance: 'low' };
  return { label: 'Not Eligible', chance: 'not-eligible' };
};

// Sorting priority:
// 1. Campus Preference
// 2. Branch Interest
// 3. Category (Lowest Category First)
// 4. Highest Probability
```

## 5. Frontend Output Format
Each Result Card displays:
*   **Campus**: (e.g., VIT Vellore)
*   **Branch**: (e.g., CSE - Artificial Intelligence)
*   **Category**: Displayed as "Category 1" or "Category 2" in the Quota field.
*   **Comparison**: "User Rank (15k) vs Closing (12k)" -> `+3k Diff`
*   **Status**: `HIGH / MEDIUM / LOW / NOT ELIGIBLE`

## 6. Example API Response Structure
```json
{
  "success": true,
  "data": [
    {
      "collegeName": "VIT Vellore",
      "course": "CSE - Data Science",
      "quota": "Category 2",
      "closingRank": 12000,
      "chance": "low",
      "location": "Vellore, Tamil Nadu"
    }
  ]
}
```

## 7. VITEEE-Only Configuration (Frontend)
The system is configured via `viteeeConfig.ts`, which auto-hides irrelevant fields like "Home State" and renames the Category label to "**VIT Category**".
