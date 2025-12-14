# BatchBridge Multi-Dimensional Privacy Model

This document outlines the architecture for the multi-dimensional privacy system used in BatchBridge. This model provides users with granular control over their information by combining three independent filters: Relationship, Seniority, and Gender.

## 1. Data Structure

The privacy for any given field on a student's profile is stored as a `PrivacyObject`.

```typescript
interface PrivacyObject {
  level: PrivacyLevel;
  seniority: SeniorityFilter;
  gender: GenderFilter;
}
```

The `Student` interface is updated to use this object for all privacy-controlled fields, for example:
`privacy_contact_phone: PrivacyObject;`

---

## 2. Dimension 1: The Relationship `level` (The "Who")

This is the primary filter that defines the core audience group.

### Relationship `level` Options

- **Core Groups**
  - `public`: Visible to everyone, including non-logged-in visitors.
  - `onlyMe`: Visible only to the owner of the profile.
  - `allUsers`: Visible to any user who is logged in.
- **Manual Relationships**
  - `friends`: A standard, user-approved list of friends.
  - `closedFriends`: A smaller, more intimate list of close friends.
- **College & Hostel Groups (Automatic)**
  - `collegeBuddy`: Anyone from the same college.
  - `hostelBuddy`: Anyone with an overlapping stay in the same hostel building.
- **Location-Based Groups (Automatic)**
  - `fromMyState`: Any user whose permanent address is in the same state.
- **Platform-Wide Groups (Automatic)**
  - `yearMate`: Any user with the same admission year, regardless of college.
  * `alumni`: Any user on the platform who has graduated.
  * `verifiedUsers`: Any user with a verified account.
- **Administrative**
  - `admin`: Visible only to platform administrators.

---

## 3. Dimension 2: The Seniority `filter` (The "When")

This filter is applied on top of the Relationship `level` to filter the group based on their admission year relative to the profile owner.

### `Seniority` Filter Options

- `all`: (Default) No seniority filter is applied.
- `batchmatesOnly`: Filters the group to only include users with the same admission year.
- `seniorsOnly`: Filters the group to only include users with an earlier admission year.
- `juniorsOnly`: Filters the group to only include users with a later admission year.

---

## 4. Dimension 3: The Gender `filter` (The "What")

This is the third filter, applied after the first two, to filter the remaining group based on gender.

### `Gender` Filter Options

- `all`: (Default) No gender filter is applied.
- `sameGender`: Filters the group to only include users of the same gender.
- `oppositeGender`: Filters the group to only include users of the opposite gender.

**Note**: This relies on a `gender` field in the student profile. The logic for "opposite" will require careful and respectful implementation, especially in the context of non-binary gender identities.

---

## 5. Practical Examples

- **Goal**: Share phone number only with female seniors from my college.
  - **Relationship `level`**: `collegeBuddy`
  - **Seniority `filter`**: `seniorsOnly`
  - **Gender `filter`**: `sameGender` (assuming the user's profile gender is 'female')

- **Goal**: Share bio with any batchmate from any college.
  - **Relationship `level`**: `yearMate`
  - **Seniority `filter`**: `batchmatesOnly` (or `all`)
  - **Gender `filter`**: `all`
