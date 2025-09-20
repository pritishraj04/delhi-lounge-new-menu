# Menu App CSV Import Feature

This document provides instructions on how to use the CSV import feature for the Menu App.

## Overview

The CSV import feature allows you to dynamically update the menu content by uploading CSV files. The app supports two types of menus:

1. Food Menu
2. Bar Menu

Each menu type has its own CSV format with specific fields.

## CSV Format

### Food Menu CSV Format

The Food Menu CSV should include the following columns:

- `category`: Main category of the item (e.g., Appetizers, Main Course)
- `sub category`: Optional subcategory (e.g., Vegetarian, Non-Vegetarian)
- `type`: Type of the item (e.g., Starter, Curry)
- `title`: Name of the menu item
- `description`: Description of the menu item
- `metrics`: Structured string containing weight, calories, and pricing information
- `image`: URL or path to the image
- `chefSpecial`: Boolean value (true/false) indicating if the item is a chef's special
- `mustTry` : Boolean value (true/false) indicating if the item is a must try
- `allergens`: Semicolon-separated list of allergens (e.g., "Dairy;Nuts;Gluten")

#### Metrics Format

The `metrics` field should be formatted as a semicolon-separated string with key-value pairs:
