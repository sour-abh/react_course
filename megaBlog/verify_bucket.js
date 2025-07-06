// Bucket permissions verification and URL testing script
import { Client, Storage } from "appwrite";

const client = new Client()
    .setEndpoint("https://fra.cloud.appwrite.io/v1")
    .setProject("686267b6002727100d2e");

const storage = new Storage(client);
const bucketId = "6863af3c00175a1bf4a7";

async function verifyBucket() {
    try {
        console.log("=== Bucket Verification ===");
        console.log("Bucket ID:", bucketId);
        console.log("Project ID:", "686267b6002727100d2e");
        console.log("Endpoint:", "https://fra.cloud.appwrite.io/v1");
        
        // Try to list files to verify bucket access
        console.log("\n=== Testing Bucket Access ===");
        const files = await storage.listFiles(bucketId);
        console.log("✅ Bucket accessible - Files found:", files.total);
        
        if (files.total > 0) {
            const firstFile = files.files[0];
            console.log("\n=== Testing File Preview ===");
            console.log("Sample file ID:", firstFile.$id);
            console.log("File name:", firstFile.name);
            console.log("File size:", firstFile.sizeOriginal, "bytes");
            
            // Test URL generation
            const previewUrl = storage.getFilePreview(bucketId, firstFile.$id);
            console.log("\n✅ Generated preview URL:", previewUrl.toString());
            
            // Test URL with dimensions
            const previewUrlWithParams = storage.getFilePreview(bucketId, firstFile.$id, 400, 300);
            console.log("✅ Preview URL with dimensions (400x300):", previewUrlWithParams.toString());
            
            // Test different parameters
            const previewUrlQuality = storage.getFilePreview(bucketId, firstFile.$id, 0, 0, 'center', 80);
            console.log("✅ Preview URL with quality (80%):", previewUrlQuality.toString());
            
            console.log("\n=== Raw URL Objects ===");
            console.log("Preview URL type:", typeof previewUrl);
            console.log("Preview URL:", previewUrl);
            
            console.log("\n=== Manual Testing Instructions ===");
            console.log("1. Copy the URL above and paste it in your browser");
            console.log("2. The image should load/download without authentication");
            console.log("3. If you get a 401 error, the bucket needs public read permissions");
        } else {
            console.log("⚠️  No files found in bucket. Upload a file first to test preview URLs.");
        }
        
    } catch (error) {
        console.error("❌ Error verifying bucket:", error.message);
        
        if (error.code === 404) {
            console.error("Bucket not found. Please check the bucket ID.");
        } else if (error.code === 401) {
            console.error("Unauthorized access. Check project ID and permissions.");
        } else {
            console.error("Full error:", error);
        }
    }
}

// Run verification
verifyBucket();
