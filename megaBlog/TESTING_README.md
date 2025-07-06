# Image Functionality Testing Suite

This document describes the comprehensive testing setup for the MegaBlog image functionality, covering all aspects of post creation, editing, and deletion with image management.

## 🎯 Test Scenarios Covered

### 1. ✨ Create New Post with Image
- **Unit Tests**: Verify form validation, image upload, and post creation
- **E2E Tests**: Test complete user flow from form to card preview
- **Verification**: 
  - Image uploads to bucket
  - Post saves with correct image reference
  - Card preview displays image correctly
  - Individual post page shows image

### 2. 🔄 Edit Post and Replace Image
- **Unit Tests**: Test image replacement logic and cleanup
- **E2E Tests**: Verify UI updates and file management
- **Verification**:
  - Old image gets deleted from bucket
  - New image uploads successfully
  - Post updates with new image reference
  - All views show the new image

### 3. 🗑️ Delete Post and Image Cleanup
- **Unit Tests**: Test deletion cascading and error handling
- **E2E Tests**: Verify complete removal from UI
- **Verification**:
  - Post deleted from database
  - Image file removed from bucket
  - Post card disappears from listings
  - No orphaned files remain

## 🛠️ Testing Technologies

### Jest + React Testing Library (Unit Tests)
- **Location**: `src/components/__tests__/ImageFunctionality.test.js`
- **Setup**: `src/setupTests.js`
- **Config**: `jest.config.js`
- **Coverage**: Includes line, branch, and function coverage

### Cypress (E2E Tests)
- **Location**: `cypress/e2e/image-functionality.cy.js`
- **Config**: `cypress.config.js`
- **Support**: `cypress/support/` (custom commands and utilities)
- **Fixtures**: `cypress/fixtures/` (test data and images)

## 🚀 Quick Start

### Prerequisites
```bash
npm install  # Install all dependencies including testing libraries
```

### Running Tests

#### Unit Tests Only
```bash
npm run test                    # Run Jest tests once
npm run test:watch             # Run Jest in watch mode
npm run test:coverage          # Run with coverage report
```

#### E2E Tests (requires dev server)
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run Cypress tests
npm run cypress:open           # Interactive mode
npm run cypress:run            # Headless mode
npm run test:e2e              # Alias for headless mode
```

#### All Tests
```bash
# Run comprehensive test suite
npm run test:all

# Or use the custom test runner
node test-runner.js --all
```

### Using the Test Runner Script
```bash
# Check help
node test-runner.js --help

# Run unit tests only
node test-runner.js

# Run unit + E2E tests
node test-runner.js --e2e

# Run everything with full reporting
node test-runner.js --all
```

## 📋 Test Structure

### Unit Tests (`ImageFunctionality.test.js`)

#### Post Card Tests
- ✅ Display image preview in post card
- ✅ Show fallback when no image provided
- ✅ Handle broken image URLs gracefully

#### Post Form Tests
- ✅ Create new post with image upload
- ✅ Replace image in existing post
- ✅ Require image for new posts
- ✅ Keep existing image when no new upload
- ✅ Clean up files on operation failure

#### Post Page Tests
- ✅ Display image on individual post page
- ✅ Handle post deletion with image cleanup
- ✅ Show appropriate buttons for post authors

#### Error Handling Tests
- ✅ Handle image upload failures
- ✅ Clean up on post creation failure
- ✅ Handle API errors gracefully

### E2E Tests (`image-functionality.cy.js`)

#### Create Post Flow
- ✅ Complete form submission with image
- ✅ Verify navigation and display
- ✅ Check card preview on home page
- ✅ Validate form requirements

#### Edit Post Flow
- ✅ Load existing post data
- ✅ Replace image and verify cleanup
- ✅ Update without changing image
- ✅ Verify changes across all views

#### Delete Post Flow
- ✅ Delete post and verify removal
- ✅ Confirm image file cleanup
- ✅ Check home page update
- ✅ Handle deletion errors

#### Image Validation
- ✅ Accept only valid image types
- ✅ Handle large file uploads
- ✅ Display loading states
- ✅ Maintain aspect ratios

#### Performance & UX
- ✅ Loading indicators during operations
- ✅ Image optimization and display
- ✅ Error message handling
- ✅ Responsive image behavior

## 🔧 Test Configuration

### Jest Configuration (`jest.config.js`)
```javascript
{
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: { '^@/(.*)$': '<rootDir>/src/$1' },
  collectCoverageFrom: ['src/**/*.{js,jsx}']
}
```

### Cypress Configuration (`cypress.config.js`)
```javascript
{
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js'
  }
}
```

## 🎨 Custom Test Utilities

### Cypress Custom Commands
- `cy.login()` - Authenticate test user
- `cy.createTestPost()` - Create post with image
- `cy.verifyImageDisplay()` - Check image rendering
- `cy.waitForImageLoad()` - Wait for image completion
- `cy.interceptAppwriteAPI()` - Mock API responses
- `cy.cleanupTestData()` - Clean test data

### Jest Mocks
- Appwrite service methods
- React Router navigation
- Redux store state
- File upload functionality

## 📊 Coverage Goals

### Minimum Coverage Targets
- **Lines**: 85%
- **Branches**: 80%
- **Functions**: 90%
- **Statements**: 85%

### Key Areas of Focus
- Image upload and processing
- Error handling and recovery
- State management during operations
- User interface interactions

## 🐛 Debugging Tests

### Common Issues
1. **Cypress tests fail**: Ensure dev server is running on port 5173
2. **File upload tests fail**: Check file fixtures and permissions
3. **API mocks not working**: Verify intercept patterns match actual API calls
4. **Timing issues**: Use proper wait conditions and timeouts

### Debug Commands
```bash
# Jest with verbose output
npm run test -- --verbose --no-coverage

# Cypress with debug info
DEBUG=cypress:* npm run cypress:run

# Run specific test file
npm run test -- ImageFunctionality.test.js
```

## 📈 CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Tests
  run: |
    npm ci
    npm run test:coverage
    npm run build
    npm start &
    sleep 10
    npm run test:e2e
```

### Test Reports
- **Jest**: HTML coverage report in `coverage/lcov-report/`
- **Cypress**: Screenshots and videos in `cypress/screenshots/` and `cypress/videos/`
- **Custom**: JSON report generated by test runner

## 🔍 Test Data Management

### Test Images
- `cypress/fixtures/test-image.jpg` - Sample JPEG for upload tests
- Base64 encoded minimal image data
- Various sizes for testing limits

### Mock Data
- Consistent post objects across tests
- Predictable user authentication state
- Controlled API response scenarios

## 📚 Best Practices

### Writing Tests
1. **Arrange-Act-Assert** pattern
2. **Independent tests** - no shared state
3. **Descriptive test names** explaining the scenario
4. **Mock external dependencies** consistently
5. **Test error conditions** not just happy paths

### Maintenance
1. **Update tests** when components change
2. **Review coverage reports** regularly
3. **Clean up test data** after each run
4. **Document test scenarios** for team members

## 🎯 Verification Checklist

When adding new image functionality, ensure tests cover:

- [ ] **Happy path**: Normal operation works
- [ ] **Error handling**: Failures are handled gracefully
- [ ] **Edge cases**: Boundary conditions and unusual inputs
- [ ] **Performance**: Operations complete in reasonable time
- [ ] **Accessibility**: Images have proper alt text and markup
- [ ] **Responsive**: Images display correctly on different screen sizes
- [ ] **Cleanup**: No resource leaks or orphaned files
- [ ] **Security**: File validation and safe handling

## 🤝 Contributing

### Adding New Tests
1. Follow existing naming conventions
2. Add both unit and E2E coverage
3. Update this documentation
4. Ensure all tests pass before submitting

### Reporting Issues
Include:
- Test command that failed
- Expected vs actual behavior
- Environment details
- Error messages and logs

---

## 📞 Support

For questions about the testing setup:
1. Check existing test files for examples
2. Review error messages and logs
3. Ensure all dependencies are installed
4. Verify dev server is running for E2E tests

This testing suite ensures that the image functionality works reliably across all scenarios and provides confidence in the application's behavior.
