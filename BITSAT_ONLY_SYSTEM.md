# BITSAT-Only Predictor: Complete Configuration & Logic

This specification provides a standalone, exam-specific setup designed exclusively for the BITSAT Predictor, ensuring zero overlap with other exams like JEE or NEET.

## 1. Correct Institution Types
BITS Pilani is a Deemed University with three domestic campuses. The types are restricted to:
*   `Deemed University – BITS Pilani Campus`
*   `Deemed University – BITS Goa Campus`
*   `Deemed University – BITS Hyderabad Campus`

## 2. BITSAT-Specific Filters (Frontend & API)
The following filters are strictly enforced:
| Filter Name | Type | Options |
| :--- | :--- | :--- |
| **BITSAT Score** | Primary Input | 0 to 390 (Integer) |
| **Gender** | Standard | Male, Female |
| **Campus Preference** | Multi-Select | Pilani, Goa, Hyderabad, No Preference |
| **Program Type** | Toggle | B.E. (Engineering), B.Pharm |
| **Branch Preference** | Multi-Select | CSE, ECE, EEE, Mechanical, Civil, Chemical, Manufacturing, Instrumentation, B.Pharm |

**EXCLUDED FILTERS**: Category (SC/ST/OBC), Home State, NIRF Rank, General Rank.

## 3. Dedicated Dataset Structure (JSON Payload)
```json
{
  "exam": "BITSAT",
  "category": "General",
  "data": [
    {
      "campus": "Pilani",
      "branch": "Computer Science",
      "cutoff_2023": 331,
      "program_type": "BE"
    },
    {
      "campus": "Goa",
      "branch": "Electronics & Communication",
      "cutoff_2023": 267,
      "program_type": "BE"
    }
  ]
}
```

## 4. Standalone Prediction Logic (TypeScript)
Strict matching logic for score-based admission chances.

```typescript
export const calculateBITSATChance = (score: number, cutoff: number) => {
  const diff = score - cutoff;
  
  if (diff >= 0) return { label: 'High', class: 'bg-emerald-500' };
  if (diff >= -10) return { label: 'Medium', class: 'bg-amber-500' };
  if (diff >= -20) return { label: 'Low', class: 'bg-rose-500' };
  return { label: 'Not Eligible', class: 'bg-gray-500' };
};

// Sorting Algorithm:
// 1. Sort by Probability (High > Medium > Low)
// 2. Sort by Campus Preference (User Preferred First)
// 3. Sort by Cutoff (Highest Cutoff First - Prestige indicator)
```

## 5. Frontend Output Format (Card Requirements)
Each Result Card must display:
*   **Header**: Campus Name (e.g., BITS Pilani, Goa Campus)
*   **Primary Stat**: Branch Name (e.g., B.E. Computer Science)
*   **Comparison**: "Your Score (340) vs Cutoff (331)" -> `+9 Above`
*   **Badge**: `HIGH PROBABILITY` (Dynamically colored)
*   **Meta**: Program Type (BE/BPharm)

## 6. Example API Integration (Request/Response)

**Request**:
`GET /api/predictor/bitsat?score=310&campus=Pilani&gender=Male`

**Response**:
```json
{
  "success": true,
  "results": [
    {
      "campus": "BITS Pilani, Pilani Campus",
      "branch": "Mechanical",
      "last_cutoff": 244,
      "user_score": 310,
      "difference": 66,
      "probability": "High",
      "program_type": "BE"
    }
  ]
}
```

## 7. Standalone Config Object (Frontend)
```json
{
  "examSlug": "bitsat",
  "pageTitle": "BITSAT College Predictor",
  "description": "Exclusive tool for BITS Pilani admissions (Pilani, Goa, Hyderabad).",
  "inputs": [
    { "id": "score", "label": "BITSAT Score", "min": 0, "max": 390 },
    { "id": "gender", "label": "Gender", "options": ["Male", "Female"] },
    { "id": "campus", "label": "Campus Preference", "options": ["Pilani", "Goa", "Hyderabad"] }
  ],
  "restrictedTo": "BITS"
}
```
