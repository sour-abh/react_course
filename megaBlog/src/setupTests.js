import '@testing-library/jest-dom';

// Polyfills for Node.js environment
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}
if (typeof TextDecoder === 'undefined') {
  global.TextDecoder = require('util').TextDecoder;
}

// Mock appwrite service for testing
jest.mock('./appwrite/config', () => ({
  __esModule: true,
  default: {
    createPost: jest.fn(),
    updatePost: jest.fn(),
    deletePost: jest.fn(),
    getPost: jest.fn(),
    getPosts: jest.fn(),
    uploadFile: jest.fn(),
    deleteFile: jest.fn(),
    getFilePreview: jest.fn(),
  },
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({ slug: 'test-post' }),
}));

// Mock Redux store
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: () => jest.fn(),
}));

// Global test setup
beforeEach(() => {
  jest.clearAllMocks();
});

// Mock file upload for testing
global.File = class MockFile {
  constructor(parts, filename, properties) {
    this.parts = parts;
    this.name = filename;
    this.size = parts[0].length;
    this.type = properties?.type || 'image/jpeg';
    this.lastModified = Date.now();
  }
};
