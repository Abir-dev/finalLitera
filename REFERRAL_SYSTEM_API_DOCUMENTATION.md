# Referral System API Documentation

## Overview
The referral system allows users to refer others and provides a 10% discount on the first purchase for referred users. The system includes validation, application, and tracking of referral discounts.

## API Endpoints

### 1. Validate Referral Code
**Endpoint:** `POST /api/auth/validate-referral`

**Description:** Validates a referral code and checks if the user is eligible for a referral discount.

**Request Body:**
```json
{
  "referralCode": "LIT123456",
  "userId": "user_id_here" // optional
}
```

**Response (Success):**
```json
{
  "valid": true,
  "referrer": {
    "name": "John Doe",
    "referralCode": "LIT123456",
    "id": "referrer_user_id"
  },
  "discount": {
    "percentOff": 10,
    "type": "referral",
    "description": "10% discount on your first purchase"
  }
}
```

**Response (Error):**
```json
{
  "valid": false,
  "message": "Invalid referral code"
}
```

**Error Cases:**
- `400`: Referral code is required
- `400`: Cannot use your own referral code
- `400`: You have already used a referral discount
- `404`: Invalid referral code
- `500`: Server error

### 2. Apply Referral Discount
**Endpoint:** `POST /api/auth/apply-referral-discount`

**Description:** Applies a referral discount to a user's account and links them to the referrer.

**Request Body:**
```json
{
  "referralCode": "LIT123456",
  "userId": "user_id_here"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Referral discount applied successfully",
  "discount": {
    "percentOff": 10,
    "type": "referral",
    "description": "10% discount on your first purchase"
  },
  "referrer": {
    "name": "John Doe",
    "referralCode": "LIT123456"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "You have already used a referral discount"
}
```

**Error Cases:**
- `400`: Referral code and user ID are required
- `400`: Cannot use your own referral code
- `400`: You have already used a referral discount
- `404`: Invalid referral code
- `404`: User not found
- `500`: Server error

### 3. Check Referral Discount Eligibility
**Endpoint:** `GET /api/auth/referral-discount-eligibility/:userId`

**Description:** Checks if a user is eligible for a referral discount.

**Response (Success):**
```json
{
  "eligible": true,
  "hasUsedReferralDiscount": false,
  "referredBy": null,
  "message": "User is eligible for referral discount"
}
```

**Response (Not Eligible):**
```json
{
  "eligible": false,
  "hasUsedReferralDiscount": true,
  "referredBy": "referrer_user_id",
  "message": "User has already used a referral discount"
}
```

**Error Cases:**
- `400`: User ID is required
- `404`: User not found
- `500`: Server error

### 4. Get User's Referral Discount Status
**Endpoint:** `GET /api/users/referral/discount-status`

**Description:** Gets the current user's referral discount status (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (Success):**
```json
{
  "status": "success",
  "data": {
    "eligible": true,
    "hasUsedReferralDiscount": false,
    "referredBy": null,
    "referralCode": "LIT789012",
    "message": "You are eligible for a referral discount"
  }
}
```

**Error Cases:**
- `401`: Unauthorized (missing or invalid token)
- `404`: User not found
- `500`: Server error

### 5. Get User's Referral Details
**Endpoint:** `GET /api/users/referral/me`

**Description:** Gets the current user's referral code, stats, and invite link (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (Success):**
```json
{
  "status": "success",
  "data": {
    "referralCode": "LIT789012",
    "referredBy": null,
    "stats": {
      "totalInvites": 0,
      "successfulPurchases": 0,
      "totalCoinsEarned": 0
    },
    "inviteLink": "https://finallitera.onrender.com/invite?ref=LIT789012"
  }
}
```

## User Model Fields

The referral system uses the following fields in the User model:

```javascript
{
  // Referral system fields
  referralCode: { type: String, unique: true, sparse: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  referral: {
    totalInvites: { type: Number, default: 0 },
    successfulPurchases: { type: Number, default: 0 },
    totalCoinsEarned: { type: Number, default: 0 },
  },
  referralDiscountUsed: { type: Boolean, default: false }, // whether 10% referral discount was used by referred user
  referralRewardGiven: { type: Boolean, default: false }, // first-purchase reward credited to referrer
}
```

## Business Logic

### Referral Code Generation
- Referral codes are automatically generated when a user signs up
- Format: `LIT` + 6 characters (e.g., `LIT123456`)
- Codes are unique and case-insensitive
- Generated using the last 6 characters of the user's ObjectId

### Discount Application Rules
1. **One-time use**: Each user can only use a referral discount once
2. **Self-referral prevention**: Users cannot use their own referral code
3. **First purchase only**: The 10% discount applies only to the first purchase
4. **Automatic tracking**: The system automatically tracks discount usage

### Referrer Benefits
- When someone uses their referral code, their `totalInvites` count increases
- Future implementation can include rewards for successful referrals

## Testing

The referral system can be tested using the API endpoints directly:

1. **Validate Referral Code**: Use `POST /api/auth/validate-referral`
2. **Apply Referral Discount**: Use `POST /api/auth/apply-referral-discount`
3. **Check Eligibility**: Use `GET /api/auth/referral-discount-eligibility/:userId`
4. **Get User Status**: Use `GET /api/users/referral/discount-status`

## Integration with Frontend

### Signup Flow
1. User enters referral code during signup
2. System validates the code
3. If valid, user is linked to referrer
4. User becomes eligible for 10% discount on first purchase

### Purchase Flow
1. Check if user has unused referral discount
2. Apply 10% discount if eligible
3. Mark discount as used after successful purchase
4. Update referrer's stats

## Error Handling

All endpoints include comprehensive error handling:
- Input validation
- Database error handling
- User-friendly error messages
- Proper HTTP status codes

## Security Considerations

- Referral codes are case-insensitive but stored in uppercase
- Users cannot use their own referral codes
- Discount usage is tracked to prevent abuse
- All endpoints validate user permissions where required

## Future Enhancements

1. **Referrer Rewards**: Implement rewards for successful referrals
2. **Analytics**: Add detailed referral analytics
3. **Expiration**: Add referral code expiration dates
4. **Tiered Discounts**: Different discount percentages based on referrer status
5. **Bulk Operations**: Admin tools for managing referral system
