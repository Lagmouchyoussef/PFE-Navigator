# Contributing Guide

Thank you for your interest in contributing to the Scientific Research Portal! This guide will help you understand how to contribute effectively.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git
- A code editor (VS Code recommended)

### Development Setup

1. **Fork the repository**
   ```bash
   # Go to GitHub and fork the project
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/pfe-navigator.git
   cd pfe-navigator
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/pfe-navigator.git
   ```

4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Making Changes

### Code Style

**Python (Backend)**
- Follow PEP 8
- Use Black for formatting
- Use isort for import ordering
- Maximum line length: 100 characters

**TypeScript (Frontend)**
- Follow ESLint configuration
- Use Prettier for formatting
- Use meaningful variable names
- Add JSDoc comments for functions

### Naming Conventions

**Backend**
- Models: CamelCase (e.g., `ProjectEvaluation`)
- Functions: snake_case (e.g., `get_project_status`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)
- API endpoints: kebab-case (e.g., `/api/projects/submit/`)

**Frontend**
- Components: PascalCase (e.g., `ProjectForm`)
- Hooks: camelCase starting with 'use' (e.g., `useProjectData`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_TIMEOUT`)
- Files: match component name (e.g., `ProjectForm.tsx`)

### Commit Messages

Follow the Conventional Commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style changes
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Test additions
- `chore` - Build/setup changes

**Examples:**
```
feat(projects): add project filtering by status
fix(auth): correct token refresh logic
docs(readme): update installation instructions
```

### Testing

**Backend Testing**
```bash
cd Backend
# Run all tests
pytest

# Run specific test file
pytest apps/students/tests.py

# Run with coverage
pytest --cov=apps
```

**Frontend Testing**
```bash
cd Frontend
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

### Code Quality

**Format your code before committing:**

Backend:
```bash
cd Backend
black .
isort .
flake8 .
```

Frontend:
```bash
cd Frontend
npm run lint
npm run format
```

## Pull Request Process

### Before Submitting

1. **Update your branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Ensure tests pass**
   - Run backend tests
   - Run frontend tests
   - Check coverage

3. **Format code**
   - Backend: Black, isort, flake8
   - Frontend: ESLint, Prettier

4. **Write/update documentation**
   - Update README if needed
   - Add docstrings
   - Comment complex logic

### Submitting a Pull Request

1. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create PR on GitHub**
   - Use a clear title
   - Reference related issues
   - Add description of changes
   - Include any breaking changes

3. **PR Title Format**
   ```
   [Type] Brief description

   [Backend] Add project status filtering
   [Frontend] Improve performance chart
   [Docs] Update API documentation
   ```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #(issue number)

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Tested locally
- [ ] Added/updated tests
- [ ] All tests passing

## Screenshots (if applicable)
[Add screenshots or GIFs]

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No new warnings generated
```

## Review Process

1. **Code Review**
   - Maintainers will review your code
   - Address feedback and update PR
   - Discussions for clarification

2. **CI/CD Checks**
   - Tests must pass
   - Coverage must not decrease
   - Linting must pass

3. **Approval**
   - At least one approval required
   - All conversations resolved
   - Merge into main branch

## Feature Development

### Adding a New Backend Feature

1. **Create the model**
   ```bash
   python manage.py startapp feature_name
   # Edit models.py
   ```

2. **Create serializer**
   - Add to `serializers.py`
   - Handle validation

3. **Create views**
   - Add ViewSet or APIView
   - Implement CRUD operations

4. **Add endpoints**
   - Update `urls.py`
   - Follow REST conventions

5. **Add tests**
   - Model tests
   - View tests
   - Permission tests

6. **Create migration**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

### Adding a New Frontend Feature

1. **Create module structure**
   ```
   src/modules/feature_name/
   ├── components/
   ├── hooks/
   ├── types/
   └── services/
   ```

2. **Build components**
   - Use TypeScript
   - Add prop types
   - Use custom hooks

3. **Implement services**
   - Add API calls
   - Handle errors
   - Add caching

4. **Add tests**
   - Component tests
   - Hook tests
   - Integration tests

5. **Update routing**
   - Add route in App.tsx
   - Update navigation

## Documentation

### Writing Good Documentation

- Use clear, simple language
- Include code examples
- Explain the "why"
- Update related docs
- Check for typos

### Documentation Structure

**Code Comments**
```python
# Use comments for complex logic
# Explain why, not what the code does
def calculate_final_grade(scores):
    # Weight grades to reflect importance:
    # Thesis (30%), Presentation (20%), Technical (20%)
    total = (scores['thesis'] * 0.3 + 
             scores['presentation'] * 0.2 +
             scores['technical'] * 0.2)
    return total
```

**Docstrings**
```python
def get_student_projects(student_id: int) -> List[Project]:
    """
    Retrieve all projects for a specific student.
    
    Args:
        student_id: The ID of the student
        
    Returns:
        A list of Project objects
        
    Raises:
        Student.DoesNotExist: If student not found
    """
    pass
```

## Common Tasks

### Adding a Database Field

1. Edit `models.py`
2. Create migration: `python manage.py makemigrations`
3. Apply migration: `python manage.py migrate`
4. Update serializers
5. Update forms/components
6. Add tests

### Adding an API Endpoint

1. Update views/viewsets
2. Add to `urls.py`
3. Create serializer
4. Add tests
5. Update documentation

### Fixing a Bug

1. Create issue with reproducible steps
2. Create test that reproduces bug
3. Fix the bug
4. Verify test passes
5. Submit PR with test

## Getting Help

- **Questions**: Open a Discussion
- **Bugs**: Open an Issue with details
- **Features**: Open an Issue to discuss
- **Chat**: Join our Slack/Discord community

## Reporting Issues

**Include in bug reports:**
- Description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment info (OS, browser, versions)
- Screenshots/error logs

## Coding Standards

### Python Standards (Backend)
- PEP 8 compliant
- Type hints for functions
- Docstrings for modules, classes, functions
- DRY principle
- SOLID principles

### TypeScript Standards (Frontend)
- Strict mode enabled
- No `any` types (use proper typing)
- Interface for component props
- Proper error handling
- Accessibility compliance

## Performance Guidelines

- Avoid N+1 queries (use select_related, prefetch_related)
- Lazy load components
- Optimize images
- Cache API responses
- Minimize bundle size

## Reviewing Others' Code

- Be constructive and friendly
- Ask questions, don't demand
- Acknowledge good solutions
- Suggest improvements
- Approve when ready

## Release Process

1. Update version number
2. Update CHANGELOG
3. Create release notes
4. Tag release in Git
5. Deploy to production

## Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [REST API Best Practices](https://restfulapi.net/)
- [Python PEP 8](https://www.python.org/dev/peps/pep-0008/)

---

**Thank you for contributing!** 🙏

Your contributions make this project better for everyone.

**Last Updated**: December 2024
