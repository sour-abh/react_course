// Test script to check getFilePreview URL generation
import { Client, Storage } from "appwrite";

const client = new Client()
    .setEndpoint("https://fra.cloud.appwrite.io/v1")
    .setProject("686267b6002727100d2e");

const storage = new Storage(client);
const bucketId = "6863af3c00175a1bf4a7";

// Test with a sample file ID (you'll need to replace this with an actual file ID)
const testFileId = "test-file-id"; // Replace with actual file ID

try {
    const previewUrl = storage.getFilePreview(bucketId, testFileId);
    console.log("Generated Preview URL:", previewUrl);
    console.log("Bucket ID:", bucketId);
    console.log("File ID:", testFileId);
} catch (error) {
    console.error("Error generating preview URL:", error);
}
