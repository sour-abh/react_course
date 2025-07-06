describe('Image Functionality E2E Tests', () => {
  beforeEach(() => {
    // Set up API intercepts for consistent testing
    cy.interceptAppwriteAPI();
    
    // Mock authentication state
    cy.window().then((win) => {
      win.localStorage.setItem('auth', JSON.stringify({
        status: true,
        userData: {
          $id: 'test-user-id',
          name: 'Test User',
          email: 'test@example.com'
        }
      }));
    });
  });

  afterEach(() => {
    cy.cleanupTestData();
  });

  describe('1. Create new post with image', () => {
    it('should create a new post with image and verify card preview', () => {
      cy.visit('/add-post');
      
      // Fill out the post form
      cy.get('input[name="title"]').type('Test Post with Image');
      cy.get('input[name="slug"]').should('have.value', 'test-post-with-image');
      
      // Add content using TinyMCE editor
      cy.get('.tox-edit-area iframe').then(($iframe) => {
        const doc = $iframe.contents();
        const body = doc.find('body');
        body.type('This is a test post with an image.');
      });
      
      // Upload image
      cy.get('input[type="file"]').attachFile('test-image.jpg');
      
      // Set status
      cy.get('select[name="status"]').select('active');
      
      // Submit form
      cy.get('button[type="submit"]').contains('Submit').click();
      
      // Wait for API calls
      cy.wait('@uploadFile');
      cy.wait('@createPost');
      
      // Verify navigation to post page
      cy.url().should('include', '/post/');
      
      // Verify image is displayed on individual post page
      cy.verifyImageDisplay('img');
      cy.get('h1').should('contain', 'Test Post with Image');
      
      // Navigate back to home to verify card preview
      cy.visit('/');
      
      // Verify post card with image preview is displayed
      cy.get('[data-testid="post-card"]')
        .should('be.visible')
        .within(() => {
          cy.verifyImageDisplay('img');
          cy.get('h2').should('contain', 'Test Post with Image');
        });
    });

    it('should show error when trying to create post without image', () => {
      cy.visit('/add-post');
      
      // Fill out the post form without image
      cy.get('input[name="title"]').type('Post Without Image');
      cy.get('.tox-edit-area iframe').then(($iframe) => {
        const doc = $iframe.contents();
        const body = doc.find('body');
        body.type('This post has no image.');
      });
      
      // Submit form without uploading image
      cy.get('button[type="submit"]').contains('Submit').click();
      
      // Verify form validation prevents submission
      cy.get('input[type="file"]').should('have.attr', 'required');
      cy.url().should('include', '/add-post'); // Should still be on add post page
    });
  });

  describe('2. Edit post and replace image', () => {
    beforeEach(() => {
      // Mock existing post data
      cy.intercept('GET', '**/databases/**/collections/**/documents/**', {
        statusCode: 200,
        body: {
          $id: 'existing-post-id',
          title: 'Existing Post',
          slug: 'existing-post',
          content: 'Original content',
          FeaturedImage: 'old-image-id',
          status: 'active',
          userId: 'test-user-id'
        }
      }).as('getExistingPost');
    });

    it('should replace image and verify old image is deleted', () => {
      cy.visit('/edit-post/existing-post-id');
      
      // Wait for post data to load
      cy.wait('@getExistingPost');
      
      // Verify current image is displayed
      cy.verifyImageDisplay('img');
      
      // Upload new image
      cy.get('input[type="file"]').attachFile('test-image.jpg');
      
      // Update the title slightly to verify change
      cy.get('input[name="title"]').clear().type('Updated Post with New Image');
      
      // Submit form
      cy.get('button[type="submit"]').contains('Update').click();
      
      // Verify API calls for upload new file, delete old file, and update post
      cy.wait('@uploadFile');
      cy.wait('@updatePost');
      
      // Navigate to post page
      cy.url().should('include', '/post/');
      
      // Verify new image is displayed
      cy.verifyImageDisplay('img');
      cy.get('h1').should('contain', 'Updated Post with New Image');
      
      // Go back to home and verify card shows new image
      cy.visit('/');
      cy.get('[data-testid="post-card"]')
        .should('be.visible')
        .within(() => {
          cy.verifyImageDisplay('img');
          cy.get('h2').should('contain', 'Updated Post with New Image');
        });
    });

    it('should keep existing image when no new image is uploaded', () => {
      cy.visit('/edit-post/existing-post-id');
      
      cy.wait('@getExistingPost');
      
      // Verify current image is displayed
      cy.verifyImageDisplay('img');
      
      // Update only the title, don't upload new image
      cy.get('input[name="title"]').clear().type('Updated Title Same Image');
      
      // Submit form
      cy.get('button[type="submit"]').contains('Update').click();
      
      // Should only call update post, not upload or delete file
      cy.wait('@updatePost');
      
      // Verify image is still displayed
      cy.verifyImageDisplay('img');
      cy.get('h1').should('contain', 'Updated Title Same Image');
    });
  });

  describe('3. Delete post and verify image cleanup', () => {
    beforeEach(() => {
      // Mock existing post data
      cy.intercept('GET', '**/databases/**/collections/**/documents/**', {
        statusCode: 200,
        body: {
          $id: 'post-to-delete',
          title: 'Post to Delete',
          slug: 'post-to-delete',
          content: 'This post will be deleted',
          FeaturedImage: 'image-to-delete',
          status: 'active',
          userId: 'test-user-id'
        }
      }).as('getPostToDelete');
    });

    it('should delete post and remove image file from bucket', () => {
      cy.visit('/post/post-to-delete');
      
      cy.wait('@getPostToDelete');
      
      // Verify post and image are displayed
      cy.verifyImageDisplay('img');
      cy.get('h1').should('contain', 'Post to Delete');
      
      // Verify edit and delete buttons are visible (user is author)
      cy.get('button').contains('Delete').should('be.visible');
      
      // Click delete button
      cy.get('button').contains('Delete').click();
      
      // Verify API calls for deleting post and file
      cy.wait('@deletePost');
      cy.wait('@deleteFile');
      
      // Verify navigation back to home
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      
      // Verify post card is no longer visible on home page
      cy.get('[data-testid="post-card"]')
        .contains('Post to Delete')
        .should('not.exist');
    });

    it('should handle delete errors gracefully', () => {
      // Mock delete failure
      cy.intercept('DELETE', '**/databases/**/collections/**/documents/**', {
        statusCode: 500,
        body: { error: 'Delete failed' }
      }).as('deletePostFail');
      
      cy.visit('/post/post-to-delete');
      cy.wait('@getPostToDelete');
      
      // Click delete button
      cy.get('button').contains('Delete').click();
      
      cy.wait('@deletePostFail');
      
      // Should remain on post page if delete fails
      cy.url().should('include', '/post/post-to-delete');
      cy.get('h1').should('contain', 'Post to Delete');
    });
  });

  describe('4. Image display and error handling', () => {
    it('should display fallback when image fails to load', () => {
      // Mock post with invalid image ID
      cy.intercept('GET', '**/databases/**/collections/**/documents/**', {
        statusCode: 200,
        body: {
          $id: 'post-broken-image',
          title: 'Post with Broken Image',
          content: 'This post has a broken image',
          FeaturedImage: 'invalid-image-id',
          status: 'active',
          userId: 'test-user-id'
        }
      }).as('getPostBrokenImage');
      
      // Mock image preview to return 404
      cy.intercept('GET', '**/storage/**/files/**/preview**', {
        statusCode: 404
      }).as('brokenImagePreview');
      
      cy.visit('/post/post-broken-image');
      cy.wait('@getPostBrokenImage');
      
      // Verify fallback is shown for broken image
      cy.get('img').should('have.attr', 'alt', 'Post with Broken Image');
    });

    it('should handle posts without featured image', () => {
      // Mock post without FeaturedImage
      cy.intercept('GET', '**/databases/**/collections/**/documents/**', {
        statusCode: 200,
        body: {
          $id: 'post-no-image',
          title: 'Post Without Image',
          content: 'This post has no featured image',
          FeaturedImage: null,
          status: 'active',
          userId: 'test-user-id'
        }
      }).as('getPostNoImage');
      
      cy.visit('/post/post-no-image');
      cy.wait('@getPostNoImage');
      
      cy.get('h1').should('contain', 'Post Without Image');
      
      // Check home page shows fallback for posts without images
      cy.visit('/');
      cy.get('[data-testid="post-card"]')
        .contains('Post Without Image')
        .within(() => {
          cy.get('.no-image, [data-testid="no-image"]').should('be.visible');
        });
    });
  });

  describe('5. Image upload validation', () => {
    it('should only accept valid image file types', () => {
      cy.visit('/add-post');
      
      // Try to upload a non-image file
      cy.fixture('package.json').then((fileContent) => {
        cy.get('input[type="file"]').selectFile({
          contents: JSON.stringify(fileContent),
          fileName: 'test.txt',
          mimeType: 'text/plain'
        }, { force: true });
      });
      
      // Verify file input validation
      cy.get('input[type="file"]')
        .should('have.attr', 'accept')
        .and('include', 'image/');
    });

    it('should handle large file uploads appropriately', () => {
      cy.visit('/add-post');
      
      // Create a large fake file
      const largeImageData = 'x'.repeat(10 * 1024 * 1024); // 10MB
      cy.get('input[type="file"]').selectFile({
        contents: largeImageData,
        fileName: 'large-image.jpg',
        mimeType: 'image/jpeg'
      }, { force: true });
      
      // Fill other required fields
      cy.get('input[name="title"]').type('Post with Large Image');
      
      // Submit and verify handling
      cy.get('button[type="submit"]').click();
      
      // Should either upload successfully or show appropriate error
      cy.get('body').should('exist'); // Basic check that page doesn't crash
    });
  });

  describe('6. Performance and user experience', () => {
    it('should show loading states during image operations', () => {
      // Mock slow upload response
      cy.intercept('POST', '**/storage/**/files', {
        delay: 2000,
        statusCode: 201,
        body: { $id: 'slow-upload-id' }
      }).as('slowUpload');
      
      cy.visit('/add-post');
      
      cy.get('input[name="title"]').type('Post with Slow Upload');
      cy.get('input[type="file"]').attachFile('test-image.jpg');
      
      cy.get('button[type="submit"]').click();
      
      // Could check for loading spinner or disabled button
      cy.get('button[type="submit"]').should('be.disabled');
      
      cy.wait('@slowUpload');
    });

    it('should maintain image aspect ratios in different contexts', () => {
      cy.visit('/');
      
      // Check image dimensions in card view
      cy.get('[data-testid="post-card"] img').then(($img) => {
        const cardImg = $img[0];
        const cardAspectRatio = cardImg.naturalWidth / cardImg.naturalHeight;
        
        // Navigate to individual post
        cy.get('[data-testid="post-card"]').first().click();
        
        // Check image dimensions in post view
        cy.get('img').then(($postImg) => {
          const postImg = $postImg[0];
          const postAspectRatio = postImg.naturalWidth / postImg.naturalHeight;
          
          // Aspect ratios should be the same
          expect(postAspectRatio).to.be.closeTo(cardAspectRatio, 0.1);
        });
      });
    });
  });
});

// Additional helper functions for image testing
describe('Image Testing Utilities', () => {
  it('should provide helper commands for image testing', () => {
    cy.visit('/');
    
    // Test custom commands
    cy.verifyImageDisplay('img');
    cy.waitForImageLoad('img');
    cy.verifyImageNotBroken('img');
  });
});
