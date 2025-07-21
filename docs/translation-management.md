# Translation Management

This project includes automated tools to help manage translation strings and keep them in sync.

## Available Commands

### Check Translations

```bash
npm run translations:check
```

Analyzes your translation files and source code to find:

- ✅ **Used keys**: Translation keys that are actively used in the codebase
- 🗑️ **Unused keys**: Translation keys defined but never used
- ❌ **Missing keys**: Translation keys used in code but not defined
- 🌍 **Incomplete translations**: Keys missing in German translations

### Clean Up Unused Translations

```bash
npm run translations:clean
```

Interactively removes unused translation keys from your i18n files.

- Creates automatic backups before making changes
- Shows you exactly what will be removed
- Asks for confirmation before proceeding

### Force Clean Up (Non-interactive)

```bash
npm run translations:clean-force
```

Same as clean but skips confirmation - useful for CI/CD pipelines.

## Current Status

Based on the latest scan:

- **Total defined keys**: 130
- **Total used keys**: 88
- **Unused keys**: 44 (mostly from unimplemented features like About, Resources, Problems sections)
- **Missing keys**: 2 (hardcoded strings that should be translated)

## Common Issues and Solutions

### 1. Unused Keys

Many unused keys are from planned features that aren't implemented yet:

- `about.*` - About page components
- `resources.*` - Resources section
- `problems.*` - Problems/pain points section
- `nav.about`, `nav.resources` - Navigation items

**Action**: Review if these features are still planned. If not, remove them with `npm run translations:clean`.

**Action**: Add these to both English and German translations.

### 3. Best Practices

1. **Always use translation keys** instead of hardcoded strings:

   ```tsx
   // ❌ Bad
   <h1>Contact Us</h1>

   // ✅ Good
   <h1>{t("contact.title")}</h1>
   ```

2. **Use descriptive key names** with dot notation:

   ```javascript
   "contact.form.submit": "Submit",
   "contact.form.name": "Name",
   "contact.info.email": "Email"
   ```

3. **Keep translations in sync** by running the check script regularly:

   ```bash
   npm run translations:check
   ```

4. **Clean up periodically** to avoid translation bloat:
   ```bash
   npm run translations:clean
   ```

## File Structure

- `src/contexts/i18n.tsx` - Main translation definitions
- `scripts/check-translations.cjs` - Analysis script
- `scripts/clean-translations.cjs` - Cleanup script

## Adding New Translations

1. Add the key to both `en` and `de` sections in `src/contexts/i18n.tsx`
2. Use the key in your component with `t("your.key")`
3. Run `npm run translations:check` to verify

## Workflow Integration

You can add the translation check to your CI/CD pipeline:

```bash
# This will fail (exit code 1) if there are unused or missing keys
npm run translations:check
```

This helps catch translation issues early in development.
