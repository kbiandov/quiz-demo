# Theory Section Setup Guide

## CORS Issue Resolution

The CORS error you're experiencing is because the theory CSV URL in `src/constants.js` is not pointing to a valid, publicly accessible Google Sheets CSV export.

## How to Fix

### Option 1: Use Existing Sheet Tab (Recommended)
1. **Open your Google Sheet** that contains the classes, subjects, lessons, and questions
2. **Create a new tab** called "theory" (or any name you prefer)
3. **Add the required columns**:
   ```
   id | class_id | lesson_id | title | content | image
   ```
4. **Get the tab ID**:
   - Click on the theory tab
   - Copy the URL from your browser
   - Look for the `gid=` parameter in the URL
   - Example: `.../pub?gid=1234567890&single=true&output=csv`
5. **Update constants.js**:
   ```js
   theory: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd0EZNnDJV2Bf9OpeffMMDLzqyzEB_OZnXW-ePb4G60IhkmGUcHUadKPAny5IVzkfdIbF0GH9YiwHn/pub?gid=YOUR_ACTUAL_GID&single=true&output=csv"
   ```

### Option 2: Use Temporary Demo Data
The app now includes a development fallback that shows sample theory data when the CSV fails to load. This allows you to test the functionality while setting up the real data source.

## CSV Column Requirements

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | String | Yes | Unique identifier for each theory item |
| `class_id` | Number | Yes* | Class ID (numeric, e.g., 2, 3, 5) |
| `lesson_id` | String | No | Lesson ID (can be empty) |
| `title` | String | Yes | Theory title/heading |
| `content` | String | Yes | Theory content (supports line breaks) |
| `image` | String | No | Optional image URL |

*Note: Either `class_id` or `lesson_id` must be provided for each item.

## Example CSV Data

```csv
id,class_id,lesson_id,title,content,image
t001,5,lesson-1,Математически основи,"Това е теория за математическите основи.

Включва:
• Събиране и изваждане
• Умножение и деление
• Дроби и проценти",https://example.com/image1.jpg
t002,5,lesson-2,Алгебра,"Алгебрата работи с променливи.

Основни концепции:
• Променливи (x, y, z)
• Уравнения
• Функции",https://example.com/image2.jpg
```

## Testing

1. **Update the CSV URL** in `src/constants.js`
2. **Refresh your app**
3. **Navigate to the Theory section**
4. **Verify data loads** without CORS errors

## Troubleshooting

### Still getting CORS errors?
- Ensure the Google Sheet is **publicly accessible**
- Check that the `gid` parameter is correct
- Verify the sheet tab exists and has data
- Try accessing the CSV URL directly in your browser

### Data not showing?
- Check browser console for errors
- Verify CSV column names match exactly
- Ensure at least one required column (`class_id` or `lesson_id`) is populated
- Check that `id`, `title`, and `content` columns are not empty

### Need help?
The app now includes better error handling and will show helpful messages when issues occur.
