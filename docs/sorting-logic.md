# Student Grid Sorting Logic Documentation

This document outlines the logic used to sort students within the BatchBridge application's student grid. The sorting mechanism is driven by user preferences stored in `public/database/currentUserPreferenceData.json`, ensuring a personalized and relevant display of student profiles.

## 1. Preference Modes

The sorting behavior adapts based on the `collegeWisePreferences` flag in the user's preference data.

### 1.1. College-wise Sorting (`collegeWisePreferences: true`)

When college-wise preferences are enabled, students are prioritized as follows:

1.  **Interested Colleges**: Students belonging to colleges explicitly marked as "interested" by the user are sorted based on their college's assigned preference value.
2.  **Interested Students**: Within the same college, or for students from colleges not explicitly listed in `interestedColleges`, sorting is determined by individual student preference values.

### 1.2. Student-wise Sorting (`collegeWisePreferences: false`)

When student-wise preferences are enabled, the prioritization shifts:

1.  **Interested Students**: Students explicitly marked as "interested" by the user are sorted based on their individual preference value.
2.  **Interested Colleges**: Students not present in the `interestedStudents` list are then sorted by their college's preference value.

## 2. Weighted Scoring System

Each student is assigned a `totalScore`, which is a composite value derived from various weighted factors. This score dictates their position in the sorted grid.

The `totalScore` is calculated using the following formula:

```
totalScore = (collegeWeight * collegePrefScore) +
             (studentWeight * studentPrefScore) +
             (mutualBoost * mutualInterestFlag) +
             (stateBonus * sameStateFlag) +
             (popularityWeight * popularity) +
             (activityWeight * activityScore)
```

| Factor               | Description                                                                                   | Default Weight |
| :------------------- | :-------------------------------------------------------------------------------------------- | :------------: |
| `collegePrefScore`   | Preference value from `interestedColleges[collegeId]`                                         |      0.6       |
| `studentPrefScore`   | Preference value from `interestedStudents[studentId]`                                         |      0.4       |
| `mutualInterestFlag` | Binary flag (1 if both users express mutual interest, 0 otherwise)                            |      0.3       |
| `sameStateFlag`      | Binary flag (1 if the user's `defaultState` matches the student's college state, 0 otherwise) |      0.2       |
| `popularity`         | A normalized value (0–1) reflecting student profile visits/interactions                       |      0.1       |
| `activityScore`      | A normalized value (0–1) indicating recent engagement or activity                             |      0.1       |

**Note**: If `collegeWisePreferences` is `false`, the `collegeWeight` and `studentWeight` values are swapped to reflect the change in prioritization.

## 3. Fallback Rules

To ensure consistent and predictable sorting, the following fallback rules are applied:

- **Missing Values**: Any preference or score values that are missing or undefined are treated as `0`.
- **Equal Scores**: In cases where multiple students have identical `totalScore` values, a stable sort is applied, typically by student ID or their original index, to maintain consistency.
- **No Preferences**: If no explicit preferences are set for a student or college, students are primarily sorted by the `sameStateFlag`. Further tie-breaking is handled by a stable-random order.
- **Random Fallback Consistency**: The stable-random order utilizes a consistent hash of the student ID to ensure that the "random" order remains the same across sessions for identical inputs.

## 4. Optional Enhancements

The following enhancements are considered for future iterations to further refine the sorting algorithm:

- **Preference Decay**: Implement a mechanism where older preferences gradually lose their influence over time.
- **Mutual Interest Detection**: Automate the detection and setting of the `mutualInterestFlag` based on reciprocal interactions.
- **Contextual Sorting**: Introduce additional sorting dimensions, such as batch year, academic specialty, or geographical location.
- **Precomputed Scores**: Store pre-calculated scores in a JSON structure to expedite data retrieval and reduce real-time computation load.

## 5. Example Calculation

Consider a user with `collegeWisePreferences: true` viewing the profile of **Sneha Mukherjee**. The `totalScore` would be calculated as follows:

| Factor             | Value (from Data)                          | Weight (from Prefs) | Contribution |
| :----------------- | :----------------------------------------- | ------------------: | -----------: |
| College Preference | `interestedColleges["b16b7458..."]` = 90   |                 0.6 |         54.0 |
| Student Preference | `interestedStudents["e81c22f6..."]` = 95   |                 0.4 |         38.0 |
| State Bonus        | `sameStateFlag` = 1 (Both in West Bengal)  |                 0.2 |          0.2 |
| Popularity         | `popularity` = 35 (normalized to 0.35)     |                 0.1 |        0.035 |
| Mutual Interest    | `mutualInterestFlag` = 0 (Not implemented) |                 0.3 |          0.0 |
| Activity           | `activityScore` = 0 (Not implemented)      |                 0.1 |          0.0 |
| **Total Score**    |                                            |                     |   **92.235** |

Students are ultimately displayed in descending order based on their calculated `totalScore`.

## 6. JSON Structure Reference

The user preferences that drive this sorting logic are stored in `currentUserPreferenceData.json` with the following structure, using real IDs from the database:

```json
{
  "id": "b5b8ff60-924e-45eb-8592-09d378cd4b4e",
  "registeredEmail": "mltnbla@gmail.com",
  "collegeId": "b16b7458-1d89-4143-9b3c-7d6d7a6d1859",
  "batch": "2025",
  "theme": "system",
  "interestedStudents": {
    "e81c22f6-7c44-4d4a-8df0-3c2bf91bcf55": 95,
    "a10f52c1-8e3f-4f33-b143-2ae1c9791f01": 80
  },
  "interestedColleges": {
    "b16b7458-1d89-4143-9b3c-7d6d7a6d1859": 90,
    "a2b1c3d4-e5f6-7890-1234-567890abcdef": 75
  },
  "collegeWisePreferences": true,
  "defaultState": "West Bengal",
  "preferenceWeights": {
    "collegeWeight": 0.6,
    "studentWeight": 0.4,
    "mutualBoost": 0.3,
    "stateBonus": 0.2,
    "popularityWeight": 0.1,
    "activityWeight": 0.1
  }
}
```

This concludes the documentation for the student grid sorting logic.
