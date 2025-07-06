// Custom command to login for testing
Cypress.Commands.add('login', (email = 'test@example.com', password = 'testpassword') => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/login');
});

// Custom command to create a test post with image
Cypress.Commands.add('createTestPost', (postData = {}) => {
  const defaultData = {
    title: 'Test Post',
    content: 'This is a test post content',
    status: 'active',
    imageFile: 'test-image.jpg'
  };
  
  const data = { ...defaultData, ...postData };
  
  cy.visit('/add-post');
  
  // Fill form fields
  cy.get('input[name="title"]').type(data.title);
  cy.get('textarea[name="content"], .tox-edit-area').type(data.content);
  
  // Upload image if provided
  if (data.imageFile) {
    cy.get('input[type="file"]').attachFile(data.imageFile);
  }
  
  // Set status
  cy.get('select[name="status"]').select(data.status);
  
  // Submit form
  cy.get('button[type="submit"]').click();
  
  // Wait for navigation to post page
  cy.url().should('include', '/post/');
  
  return cy.url().then(url => {
    const postId = url.split('/post/')[1];
    return { postId, ...data };
  });
});

// Custom command to verify image display
Cypress.Commands.add('verifyImageDisplay', (selector = 'img') => {
  cy.get(selector)
    .should('be.visible')
    .and(($img) => {
      expect($img[0].naturalWidth).to.be.greaterThan(0);
      expect($img[0].naturalHeight).to.be.greaterThan(0);
    });
});

// Custom command to wait for image load
Cypress.Commands.add('waitForImageLoad', (selector = 'img') => {
  cy.get(selector).should('be.visible').and('have.prop', 'complete', true);
});

// Custom command to check if image is broken
Cypress.Commands.add('verifyImageNotBroken', (selector = 'img') => {
  cy.get(selector).should(($img) => {
    expect($img[0].naturalWidth).to.be.greaterThan(0);
  });
});

// Custom command to intercept API calls
Cypress.Commands.add('interceptAppwriteAPI', () => {
  // Intercept post creation
  cy.intercept('POST', '**/databases/**/collections/**/documents', {
    statusCode: 201,
    body: {
      $id: 'test-post-id',
      title: 'Test Post',
      FeaturedImage: 'test-image-id',
      status: 'active'
    }
  }).as('createPost');
  
  // Intercept file upload
  cy.intercept('POST', '**/storage/**/files', {
    statusCode: 201,
    body: {
      $id: 'test-image-id',
      name: 'test-image.jpg'
    }
  }).as('uploadFile');
  
  // Intercept post update
  cy.intercept('PATCH', '**/databases/**/collections/**/documents/**', {
    statusCode: 200,
    body: {
      $id: 'test-post-id',
      title: 'Updated Post',
      FeaturedImage: 'new-image-id',
      status: 'active'
    }
  }).as('updatePost');
  
  // Intercept post deletion
  cy.intercept('DELETE', '**/databases/**/collections/**/documents/**', {
    statusCode: 204
  }).as('deletePost');
  
  // Intercept file deletion
  cy.intercept('DELETE', '**/storage/**/files/**', {
    statusCode: 204
  }).as('deleteFile');
  
  // Intercept get post
  cy.intercept('GET', '**/databases/**/collections/**/documents/**', {
    statusCode: 200,
    body: {
      $id: 'test-post-id',
      title: 'Test Post',
      content: 'Test content',
      FeaturedImage: 'test-image-id',
      status: 'active',
      userId: 'test-user-id'
    }
  }).as('getPost');
});

// Command to clean up test data
Cypress.Commands.add('cleanupTestData', () => {
  // This would typically clean up any test posts/images created during testing
  // For now, we'll just ensure we're logged out
  cy.window().then((win) => {
    win.localStorage.clear();
    win.sessionStorage.clear();
  });
});
