import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';

import Postcard from '../Postcard';
import Postform from '../post-form/Postform';
import Post from '../../pages/Post';
import appwriteService from '../../appwrite/config';
import authSlice from '../../store/authSlice';

// Mock store setup
const mockStore = configureStore({
  reducer: {
    auth: authSlice,
  },
  preloadedState: {
    auth: {
      status: true,
      userData: {
        $id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
      },
    },
  },
});

// Helper function to render components with providers
const renderWithProviders = (component) => {
  return render(
    <Provider store={mockStore}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('Image Functionality Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Post Card Image Display', () => {
    it('should display image preview in post card', () => {
      const mockPost = {
        $id: 'test-post-id',
        title: 'Test Post',
        FeaturedImage: 'test-image-id',
      };

      appwriteService.getFilePreview.mockReturnValue('https://example.com/image.jpg');

      renderWithProviders(
        <Postcard 
          $id={mockPost.$id}
          title={mockPost.title}
          FeaturedImage={mockPost.FeaturedImage}
        />
      );

      expect(screen.getByAltText('Test Post')).toBeInTheDocument();
      expect(appwriteService.getFilePreview).toHaveBeenCalledWith('test-image-id');
    });

    it('should show fallback when no image is provided', () => {
      const mockPost = {
        $id: 'test-post-id',
        title: 'Test Post',
        FeaturedImage: null,
      };

      renderWithProviders(
        <Postcard 
          $id={mockPost.$id}
          title={mockPost.title}
          FeaturedImage={mockPost.FeaturedImage}
        />
      );

      expect(screen.getByText('No image')).toBeInTheDocument();
    });
  });

  describe('Post Form Image Upload', () => {
    it('should handle new post creation with image upload', async () => {
      const user = userEvent.setup();
      
      // Mock successful file upload
      appwriteService.uploadFile.mockResolvedValue({
        $id: 'uploaded-file-id',
      });

      // Mock successful post creation
      appwriteService.createPost.mockResolvedValue({
        $id: 'new-post-id',
        title: 'New Post',
        FeaturedImage: 'uploaded-file-id',
      });

      renderWithProviders(<Postform />);

      // Fill form fields
      await user.type(screen.getByLabelText(/title/i), 'New Post');
      await user.type(screen.getByLabelText(/content/i), 'Post content');

      // Upload image
      const file = new File(['image content'], 'test-image.jpg', { type: 'image/jpeg' });
      const imageInput = screen.getByLabelText(/featured image/i);
      await user.upload(imageInput, file);

      // Submit form
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(appwriteService.uploadFile).toHaveBeenCalledWith(file);
        expect(appwriteService.createPost).toHaveBeenCalledWith({
          title: 'New Post',
          slug: 'new-post',
          content: 'Post content',
          FeaturedImage: 'uploaded-file-id',
          status: 'active',
          userId: 'test-user-id',
        });
      });
    });

    it('should handle post update with image replacement', async () => {
      const user = userEvent.setup();
      
      const existingPost = {
        $id: 'existing-post-id',
        title: 'Existing Post',
        slug: 'existing-post',
        content: 'Existing content',
        FeaturedImage: 'old-image-id',
        status: 'active',
      };

      // Mock successful new file upload
      appwriteService.uploadFile.mockResolvedValue({
        $id: 'new-file-id',
      });

      // Mock successful old file deletion
      appwriteService.deleteFile.mockResolvedValue(true);

      // Mock successful post update
      appwriteService.updatePost.mockResolvedValue({
        ...existingPost,
        FeaturedImage: 'new-file-id',
      });

      // Mock file preview for existing image
      appwriteService.getFilePreview.mockReturnValue('https://example.com/old-image.jpg');

      renderWithProviders(<Postform post={existingPost} />);

      // Upload new image
      const newFile = new File(['new image content'], 'new-image.jpg', { type: 'image/jpeg' });
      const imageInput = screen.getByLabelText(/featured image/i);
      await user.upload(imageInput, newFile);

      // Submit form
      await user.click(screen.getByRole('button', { name: /update/i }));

      await waitFor(() => {
        expect(appwriteService.uploadFile).toHaveBeenCalledWith(newFile);
        expect(appwriteService.deleteFile).toHaveBeenCalledWith('old-image-id');
        expect(appwriteService.updatePost).toHaveBeenCalledWith('existing-post-id', {
          title: 'Existing Post',
          slug: 'existing-post',
          content: 'Existing content',
          FeaturedImage: 'new-file-id',
          status: 'active',
          userId: 'test-user-id',
        });
      });
    });

    it('should require image for new posts', async () => {
      const user = userEvent.setup();

      renderWithProviders(<Postform />);

      // Fill form fields but don't upload image
      await user.type(screen.getByLabelText(/title/i), 'New Post');
      await user.type(screen.getByLabelText(/content/i), 'Post content');

      // Submit form without image
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Should not call createPost since image is required
      expect(appwriteService.createPost).not.toHaveBeenCalled();
    });
  });

  describe('Post Page Image Display', () => {
    it('should display image on individual post page', async () => {
      const mockPost = {
        $id: 'test-post-id',
        title: 'Test Post',
        content: '<p>Test content</p>',
        FeaturedImage: 'test-image-id',
        userId: 'test-user-id',
      };

      appwriteService.getPost.mockResolvedValue(mockPost);
      appwriteService.getFilePreview.mockReturnValue('https://example.com/image.jpg');

      renderWithProviders(<Post />);

      await waitFor(() => {
        expect(screen.getByAltText('Test Post')).toBeInTheDocument();
        expect(appwriteService.getFilePreview).toHaveBeenCalledWith('test-image-id');
      });
    });

    it('should handle post deletion with image cleanup', async () => {
      const user = userEvent.setup();
      
      const mockPost = {
        $id: 'test-post-id',
        title: 'Test Post',
        content: '<p>Test content</p>',
        FeaturedImage: 'test-image-id',
        userId: 'test-user-id',
      };

      appwriteService.getPost.mockResolvedValue(mockPost);
      appwriteService.getFilePreview.mockReturnValue('https://example.com/image.jpg');
      appwriteService.deletePost.mockResolvedValue(true);
      appwriteService.deleteFile.mockResolvedValue(true);

      renderWithProviders(<Post />);

      await waitFor(() => {
        expect(screen.getByAltText('Test Post')).toBeInTheDocument();
      });

      // Click delete button
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteButton);

      await waitFor(() => {
        expect(appwriteService.deletePost).toHaveBeenCalledWith('test-post-id');
        expect(appwriteService.deleteFile).toHaveBeenCalledWith('test-image-id');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle image upload failure', async () => {
      const user = userEvent.setup();
      
      // Mock failed file upload
      appwriteService.uploadFile.mockRejectedValue(new Error('Upload failed'));

      renderWithProviders(<Postform />);

      // Fill form fields
      await user.type(screen.getByLabelText(/title/i), 'New Post');
      await user.type(screen.getByLabelText(/content/i), 'Post content');

      // Upload image
      const file = new File(['image content'], 'test-image.jpg', { type: 'image/jpeg' });
      const imageInput = screen.getByLabelText(/featured image/i);
      await user.upload(imageInput, file);

      // Submit form
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(appwriteService.uploadFile).toHaveBeenCalledWith(file);
        expect(appwriteService.createPost).not.toHaveBeenCalled();
      });
    });

    it('should cleanup uploaded file when post creation fails', async () => {
      const user = userEvent.setup();
      
      // Mock successful file upload but failed post creation
      appwriteService.uploadFile.mockResolvedValue({
        $id: 'uploaded-file-id',
      });
      appwriteService.createPost.mockRejectedValue(new Error('Post creation failed'));
      appwriteService.deleteFile.mockResolvedValue(true);

      renderWithProviders(<Postform />);

      // Fill form fields
      await user.type(screen.getByLabelText(/title/i), 'New Post');
      await user.type(screen.getByLabelText(/content/i), 'Post content');

      // Upload image
      const file = new File(['image content'], 'test-image.jpg', { type: 'image/jpeg' });
      const imageInput = screen.getByLabelText(/featured image/i);
      await user.upload(imageInput, file);

      // Submit form
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(appwriteService.uploadFile).toHaveBeenCalledWith(file);
        expect(appwriteService.createPost).toHaveBeenCalled();
        expect(appwriteService.deleteFile).toHaveBeenCalledWith('uploaded-file-id');
      });
    });
  });
});
