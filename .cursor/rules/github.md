# GitHub Commit and PR Title Rules

## Commit Message Rules

### Format
- **Always start with a capital letter**
- Use imperative mood (e.g., "Add", "Fix", "Update", "Remove")
- Keep the first line under 50 characters
- Use present tense, not past tense

### Examples
✅ **Good:**
- `Add user authentication feature`
- `Fix navigation menu alignment`
- `Update dependency versions`
- `Remove unused imports`

❌ **Bad:**
- `add user authentication feature`
- `Fixed navigation menu alignment`
- `updating dependency versions`
- `removing unused imports`

### Commit Types (Optional Prefix)
If using conventional commits, ensure the type is capitalized:
- `Feat: Add new user dashboard`
- `Fix: Resolve authentication bug`
- `Docs: Update README instructions`
- `Style: Format code according to guidelines`

## Pull Request Title Rules

### Format
- **Always start with a capital letter**
- Be descriptive and concise (under 60 characters when possible)
- Use present tense
- Avoid ending with punctuation

### Examples
✅ **Good:**
- `Add user authentication system`
- `Fix responsive design issues`
- `Update API documentation`
- `Implement dark mode toggle`

❌ **Bad:**
- `add user authentication system`
- `Fixed responsive design issues`
- `updating API documentation`
- `implementing dark mode toggle`

### PR Title Patterns
- **Feature:** `Add [feature description]`
- **Bug Fix:** `Fix [issue description]`
- **Enhancement:** `Improve [component/feature]`
- **Refactor:** `Refactor [component/feature]`
- **Documentation:** `Update [documentation type]`

## Enforcement
- All commit messages must start with a capital letter
- All PR titles must start with a capital letter
- Use descriptive language that clearly explains the change
- Avoid generic terms like "update", "fix", or "change" without context

## Tools and Automation
Consider using:
- Husky pre-commit hooks to validate commit message format
- GitHub Actions to check PR title format
- Conventional Commits specification for structured commit messages
