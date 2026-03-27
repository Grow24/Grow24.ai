import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import archiver from "archiver";
import { createDeployment } from "@vercel/client";
import dotenv from "dotenv";
import { randomUUID } from "crypto";

// Load environment variables
dotenv.config();

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Generate Web project endpoint (Vite/React)
app.post("/api/generate-web", async (req, res) => {
  try {
    const appDef = req.body;
    const appId = appDef.metadata?.id || `app-${Date.now()}`;
    
    console.log(`[API Web] Generating Vite/React project for appId: ${appId}`);
    
    // Write JSON to temp file
    const tempJsonPath = join(__dirname, "temp", `${appId}.json`);
    fs.mkdirSync(join(__dirname, "temp"), { recursive: true });
    fs.writeFileSync(tempJsonPath, JSON.stringify(appDef, null, 2));
    
    // Run generator
    const outDir = join(__dirname, "generated", appId);
    const { stdout, stderr } = await execAsync(
      `node ${join(__dirname, "tools/generate.js")} ${tempJsonPath} ${outDir}`
    );
    
    console.log("[Web Generator]", stdout);
    if (stderr) console.error("[Web Generator Error]", stderr);
    
    // Create zip file
    const zipPath = join(__dirname, "temp", `web-${appId}.zip`);
    await createZip(outDir, zipPath);
    
    console.log(`[API Web] Project zipped: ${zipPath}`);
    
    // Send zip file
    res.download(zipPath, `web-${appId}.zip`, (err) => {
      if (err) console.error("Download error:", err);
      
      // Cleanup temp files
      setTimeout(() => {
        try {
          fs.unlinkSync(tempJsonPath);
          fs.unlinkSync(zipPath);
        } catch (e) {
          console.error("Cleanup error:", e);
        }
      }, 5000);
    });
    
  } catch (error) {
    console.error("[API Web Error]", error);
    res.status(500).json({ error: error.message });
  }
});

// Generate Expo/React Native project endpoint
app.post("/api/generate-expo", async (req, res) => {
  try {
    const appDef = req.body;
    const appId = appDef.metadata?.id || `app-${Date.now()}`;
    
    console.log(`[API Expo] Generating React Native/Expo project for appId: ${appId}`);
    
    // Write JSON to temp file
    const tempJsonPath = join(__dirname, "temp", `${appId}.json`);
    fs.mkdirSync(join(__dirname, "temp"), { recursive: true });
    fs.writeFileSync(tempJsonPath, JSON.stringify(appDef, null, 2));
    
    // Run Expo generator
    const outDir = join(__dirname, "generated", appId);
    const { stdout, stderr } = await execAsync(
      `node ${join(__dirname, "tools/generate-expo.js")} ${tempJsonPath} ${outDir}`
    );
    
    console.log("[Expo Generator]", stdout);
    if (stderr) console.error("[Expo Generator Error]", stderr);
    
    // Create zip file
    const zipPath = join(__dirname, "temp", `expo-${appId}.zip`);
    await createZip(outDir, zipPath);
    
    console.log(`[API Expo] Project zipped: ${zipPath}`);
    
    // Send zip file
    res.download(zipPath, `expo-${appId}.zip`, (err) => {
      if (err) console.error("Download error:", err);
      
      // Cleanup temp files
      setTimeout(() => {
        try {
          fs.unlinkSync(tempJsonPath);
          fs.unlinkSync(zipPath);
        } catch (e) {
          console.error("Cleanup error:", e);
        }
      }, 5000);
    });
    
  } catch (error) {
    console.error("[API Expo Error]", error);
    res.status(500).json({ error: error.message });
  }
});

// Generate project endpoint (LEGACY - keeping for compatibility)
app.post("/api/generate", async (req, res) => {
  try {
    const appDef = req.body;
    const appId = appDef.metadata?.id || `app-${Date.now()}`;
    
    console.log(`[API] Generating project for appId: ${appId}`);
    
    // Write JSON to temp file
    const tempJsonPath = join(__dirname, "temp", `${appId}.json`);
    fs.mkdirSync(join(__dirname, "temp"), { recursive: true });
    fs.writeFileSync(tempJsonPath, JSON.stringify(appDef, null, 2));
    
    // Run generator
    const outDir = join(__dirname, "generated", appId);
    const { stdout, stderr } = await execAsync(
      `node ${join(__dirname, "tools/generate.js")} ${tempJsonPath} ${outDir}`
    );
    
    console.log("[Generator]", stdout);
    if (stderr) console.error("[Generator Error]", stderr);
    
    // Create zip file
    const zipPath = join(__dirname, "temp", `${appId}.zip`);
    await createZip(outDir, zipPath);
    
    console.log(`[API] Project zipped: ${zipPath}`);
    
    // Send zip file
    res.download(zipPath, `${appId}.zip`, (err) => {
      if (err) console.error("Download error:", err);
      
      // Cleanup temp files
      setTimeout(() => {
        try {
          fs.unlinkSync(tempJsonPath);
          fs.unlinkSync(zipPath);
        } catch (e) {
          console.error("Cleanup error:", e);
        }
      }, 5000);
    });
    
  } catch (error) {
    console.error("[API Error]", error);
    res.status(500).json({ error: error.message });
  }
});

// Deploy to Vercel endpoint
app.post("/api/deploy-vercel", async (req, res) => {
  try {
    const appDef = req.body;
    const appId = appDef.metadata?.id || `app-${Date.now()}`;
    const projectName = appDef.metadata?.name?.toLowerCase().replace(/[^a-z0-9-]/g, "-") || appId;
    
    console.log(`[Vercel Deploy] Starting deployment for: ${projectName}`);
    
    // Get Vercel token from environment
    const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
    if (!VERCEL_TOKEN) {
      return res.status(400).json({ 
        error: "VERCEL_TOKEN not found. Please set it in environment variables." 
      });
    }
    
    // Write JSON to temp file
    const tempJsonPath = join(__dirname, "temp", `${appId}.json`);
    fs.mkdirSync(join(__dirname, "temp"), { recursive: true });
    fs.writeFileSync(tempJsonPath, JSON.stringify(appDef, null, 2));
    
    // Run generator
    const outDir = join(__dirname, "generated", appId);
    const { stdout } = await execAsync(
      `node ${join(__dirname, "tools/generate.js")} ${tempJsonPath} ${outDir}`
    );
    console.log("[Generator]", stdout);
    
    // Install dependencies in generated project
    console.log("[Vercel Deploy] Installing dependencies...");
    await execAsync(`cd ${outDir} && npm install`);
    
    // Build the project
    console.log("[Vercel Deploy] Building project...");
    await execAsync(`cd ${outDir} && npm run build`);
    
    // Deploy using Vercel CLI (simpler than SDK for file deployment)
    console.log("[Vercel Deploy] Deploying to Vercel...");
    const deployCmd = `cd ${outDir} && npx vercel --token ${VERCEL_TOKEN} --prod --yes --name ${projectName}`;
    const { stdout: deployOutput } = await execAsync(deployCmd);
    
    // Extract URL from output (last line typically contains the URL)
    const urlMatch = deployOutput.match(/https:\/\/[^\s]+/);
    const deploymentUrl = urlMatch ? urlMatch[0] : null;
    
    console.log(`[Vercel Deploy] ✅ Deployed to: ${deploymentUrl}`);
    
    // Cleanup temp files
    setTimeout(() => {
      try {
        fs.unlinkSync(tempJsonPath);
      } catch (e) {
        console.error("Cleanup error:", e);
      }
    }, 5000);
    
    res.json({ 
      success: true, 
      url: deploymentUrl,
      projectName,
      message: "Deployment successful!" 
    });
    
  } catch (error) {
    console.error("[Vercel Deploy Error]", error);
    res.status(500).json({ error: error.message });
  }
});

// Deploy to Android endpoint
app.post("/api/deploy/android", async (req, res) => {
  try {
    const appDef = req.body;
    const appId = appDef.metadata?.id || `app-${Date.now()}`;
    const appName = appDef.metadata?.name || "ExpoApp";
    
    console.log(`[Android Deploy] Starting for: ${appName}`);
    
    const EAS_TOKEN = process.env.EAS_ACCESS_TOKEN;
    if (!EAS_TOKEN) {
      return res.status(400).json({ error: "EAS_ACCESS_TOKEN not found in environment." });
    }
    
    const tempJsonPath = join(__dirname, "temp", `${appId}.json`);
    fs.mkdirSync(join(__dirname, "temp"), { recursive: true });
    fs.writeFileSync(tempJsonPath, JSON.stringify(appDef, null, 2));
    
    const outDir = join(__dirname, "generated", appId);
    await execAsync(`node ${join(__dirname, "tools/generate-expo.js")} ${tempJsonPath} ${outDir}`);
    
    console.log("[Android Deploy] Installing dependencies...");
    await execAsync(`cd ${outDir} && npm install`);
    
    console.log("[Android Deploy] Initializing git repository...");
    await execAsync(`cd ${outDir} && git init && git add . && git commit -m "Initial commit"`);
    
    console.log("[Android Deploy] Configuring EAS project...");
    await execAsync(`cd ${outDir} && /Users/abhinavrai/.nvm/versions/node/v20.11.1/bin/eas init --force --non-interactive`, {
      env: { ...process.env, EXPO_TOKEN: EAS_TOKEN }
    });
    
    console.log("[Android Deploy] Building with EAS...");
    const buildCmd = `cd ${outDir} && /Users/abhinavrai/.nvm/versions/node/v20.11.1/bin/eas build -p android --profile production --non-interactive`;
    const { stdout: buildOutput } = await execAsync(buildCmd, { 
      env: { ...process.env, EXPO_TOKEN: EAS_TOKEN }
    });
    
    const buildUrlMatch = buildOutput.match(/https:\/\/expo\.dev\/[^\s]+/);
    const buildUrl = buildUrlMatch ? buildUrlMatch[0] : null;
    
    console.log(`[Android Deploy] ✅ Build started: ${buildUrl}`);
    
    setTimeout(() => {
      try { fs.unlinkSync(tempJsonPath); } catch (e) {}
    }, 5000);
    
    res.json({ 
      success: true, 
      buildUrl,
      message: "Android build started! Check Expo dashboard for progress.",
      platform: "android"
    });
    
  } catch (error) {
    console.error("[Android Deploy Error]", error);
    res.status(500).json({ error: error.message });
  }
});

// Build APK endpoint (direct installable Android app)
app.post("/api/build/apk", async (req, res) => {
  try {
    const appDef = req.body;
    const appId = appDef.metadata?.id || `app-${Date.now()}`;
    const appName = appDef.metadata?.name || "ExpoApp";
    
    console.log(`[APK Build] Starting for: ${appName}`);
    
    const EAS_TOKEN = process.env.EAS_ACCESS_TOKEN;
    if (!EAS_TOKEN) {
      return res.status(400).json({ error: "EAS_ACCESS_TOKEN not found in environment." });
    }
    
    const tempJsonPath = join(__dirname, "temp", `${appId}.json`);
    fs.mkdirSync(join(__dirname, "temp"), { recursive: true });
    fs.writeFileSync(tempJsonPath, JSON.stringify(appDef, null, 2));
    
    const outDir = join(__dirname, "generated", appId);
    await execAsync(`node ${join(__dirname, "tools/generate-expo.js")} ${tempJsonPath} ${outDir}`);
    
    console.log("[APK Build] Installing dependencies...");
    await execAsync(`cd ${outDir} && npm install`);
    
    console.log("[APK Build] Initializing git repository...");
    await execAsync(`cd ${outDir} && git init && git add . && git commit -m "Initial commit"`);
    
    console.log("[APK Build] Configuring EAS project...");
    await execAsync(`cd ${outDir} && /Users/abhinavrai/.nvm/versions/node/v20.11.1/bin/eas init --force --non-interactive`, {
      env: { ...process.env, EXPO_TOKEN: EAS_TOKEN }
    });
    
    console.log("[APK Build] Building APK with EAS...");
    const buildCmd = `cd ${outDir} && /Users/abhinavrai/.nvm/versions/node/v20.11.1/bin/eas build -p android --profile apk --non-interactive`;
    
    try {
      const { stdout: buildOutput } = await execAsync(buildCmd, { 
        env: { ...process.env, EXPO_TOKEN: EAS_TOKEN },
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer for build output
      });
      
      const buildUrlMatch = buildOutput.match(/https:\/\/expo\.dev\/[^\s]+/);
      const buildUrl = buildUrlMatch ? buildUrlMatch[0] : null;
      
      console.log(`[APK Build] ✅ APK build started: ${buildUrl}`);
      
      setTimeout(() => {
        try { fs.unlinkSync(tempJsonPath); } catch (e) {}
      }, 5000);
      
      res.json({ 
        success: true, 
        buildUrl,
        message: "APK build started! Check Expo dashboard for download link.",
        platform: "android-apk"
      });
    } catch (buildError) {
      console.error("[APK Build] Build error:", buildError);
      
      // Check if it's a keystore issue
      if (buildError.message && buildError.message.includes("Keystore")) {
        return res.status(500).json({ 
          error: "Keystore setup required. Run: cd " + outDir + " && eas credentials",
          projectPath: outDir
        });
      }
      throw buildError;
    }
    
  } catch (error) {
    console.error("[APK Build Error]", error);
    res.status(500).json({ error: error.message });
  }
});

// Build APK Locally endpoint (zero wait time - builds on your Mac)
app.post("/api/build/apk-local", async (req, res) => {
  try {
    const appDef = req.body;
    const appId = appDef.metadata?.id || `app-${Date.now()}`;
    const appName = appDef.metadata?.name || "ExpoApp";
    
    console.log(`[Local APK Build] Starting for: ${appName}`);
    
    const tempJsonPath = join(__dirname, "temp", `${appId}.json`);
    fs.mkdirSync(join(__dirname, "temp"), { recursive: true });
    fs.writeFileSync(tempJsonPath, JSON.stringify(appDef, null, 2));
    
    const outDir = join(__dirname, "generated", appId);
    console.log(`[Local APK Build] Generating Expo project at: ${outDir}`);
    
    await execAsync(`node ${join(__dirname, "tools/generate-expo.js")} ${tempJsonPath} ${outDir}`);
    
    console.log("[Local APK Build] Installing dependencies...");
    await execAsync(`cd ${outDir} && npm install`, {
      maxBuffer: 1024 * 1024 * 10
    });
    
    console.log("[Local APK Build] Pre-building Android native files...");
    try {
      await execAsync(`cd ${outDir} && npx expo prebuild --platform android --clean`, {
        maxBuffer: 1024 * 1024 * 20,
        timeout: 300000 // 5 minutes
      });
    } catch (prebuildError) {
      console.error("[Local APK Build] Prebuild error:", prebuildError);
      
      // Check for common errors
      if (prebuildError.message && prebuildError.message.includes("ANDROID_HOME")) {
        return res.status(500).json({ 
          error: "Android SDK not found",
          hint: "Set ANDROID_HOME environment variable. On Mac, add to ~/.zshrc:\nexport ANDROID_HOME=$HOME/Library/Android/sdk\nexport PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools"
        });
      }
      
      throw prebuildError;
    }
    
    console.log("[Local APK Build] Building APK locally (this may take 5-10 minutes)...");
    console.log("[Local APK Build] Running: cd android && ./gradlew assembleRelease");
    
    // Build using Gradle directly (more reliable than expo run:android)
    const androidDir = join(outDir, "android");
    
    try {
      // Make gradlew executable
      await execAsync(`chmod +x ${join(androidDir, "gradlew")}`);
      
      // Run Gradle build
      const { stdout: buildOutput, stderr: buildError } = await execAsync(
        `cd ${androidDir} && ./gradlew assembleRelease`,
        {
          maxBuffer: 1024 * 1024 * 50, // 50MB buffer
          timeout: 600000, // 10 minute timeout
          env: {
            ...process.env,
            ANDROID_HOME: process.env.ANDROID_HOME || `${process.env.HOME}/Library/Android/sdk`
          }
        }
      );
      
      console.log("[Local APK Build] Gradle output:", buildOutput.substring(0, 500) + "...");
      if (buildError) console.log("[Local APK Build] Gradle stderr:", buildError.substring(0, 500));
      
      // APK should be at: android/app/build/outputs/apk/release/app-release.apk
      const apkPath = join(androidDir, "app/build/outputs/apk/release/app-release.apk");
      
      // Check if APK exists
      if (!fs.existsSync(apkPath)) {
        // Try debug path as fallback
        const debugApkPath = join(androidDir, "app/build/outputs/apk/debug/app-debug.apk");
        if (fs.existsSync(debugApkPath)) {
          console.log(`[Local APK Build] ✅ Debug APK built: ${debugApkPath}`);
          
          setTimeout(() => {
            try { fs.unlinkSync(tempJsonPath); } catch (e) {}
          }, 5000);
          
          return res.json({ 
            success: true, 
            apkPath: debugApkPath,
            message: "Local APK build complete! Download your APK below.",
            platform: "android-local-apk",
            downloadUrl: `/download-apk/${appId}/debug`
          });
        }
        
        throw new Error("APK file not found after build. Build may have failed.");
      }
      
      console.log(`[Local APK Build] ✅ Release APK built: ${apkPath}`);
      
      setTimeout(() => {
        try { fs.unlinkSync(tempJsonPath); } catch (e) {}
      }, 5000);
      
      res.json({ 
        success: true, 
        apkPath: apkPath,
        message: "Local APK build complete! Download your APK below.",
        platform: "android-local-apk",
        downloadUrl: `/download-apk/${appId}/release`
      });
      
    } catch (buildError) {
      console.error("[Local APK Build] Gradle build error:", buildError);
      
      // Helpful error messages
      if (buildError.message && (buildError.message.includes("ANDROID_HOME") || buildError.message.includes("SDK location not found"))) {
        return res.status(500).json({ 
          error: "Android SDK not configured properly",
          hint: "Set ANDROID_HOME in your shell:\nexport ANDROID_HOME=$HOME/Library/Android/sdk\nThen restart your terminal and server."
        });
      }
      
      if (buildError.message && buildError.message.includes("Java")) {
        return res.status(500).json({ 
          error: "Java/JDK issue detected",
          hint: "Make sure you have JDK 17 installed. Check with: java -version"
        });
      }
      
      throw buildError;
    }
    
  } catch (error) {
    console.error("[Local APK Build Error]", error);
    res.status(500).json({ 
      error: error.message || "Local APK build failed",
      hint: "Check server logs for details. Ensure Android Studio, Android SDK, and JDK 17 are installed."
    });
  }
});

// Build iOS APP Locally endpoint (zero wait time - builds on your Mac)
app.post("/api/build/ios-local", async (req, res) => {
  try {
    const appDef = req.body;
    const appId = appDef.metadata?.id || `app-${Date.now()}`;
    const appName = appDef.metadata?.name || "ExpoApp";
    
    console.log(`[Local iOS Build] Starting for: ${appName}`);
    console.log(`[Local iOS Build] TestFlight flag: ${req.body.testflight}`);
    
    const tempJsonPath = join(__dirname, "temp", `${appId}.json`);
    fs.mkdirSync(join(__dirname, "temp"), { recursive: true });
    fs.writeFileSync(tempJsonPath, JSON.stringify(appDef, null, 2));
    
    const outDir = join(__dirname, "generated", appId);
    console.log(`[Local iOS Build] Generating Expo project at: ${outDir}`);
    
    await execAsync(`node ${join(__dirname, "tools/generate-expo.js")} ${tempJsonPath} ${outDir}`);
    
    console.log("[Local iOS Build] Installing dependencies...");
    await execAsync(`cd ${outDir} && npm install`, {
      maxBuffer: 1024 * 1024 * 10
    });
    
    console.log("[Local iOS Build] Pre-building iOS native files...");
    try {
      await execAsync(`cd ${outDir} && npx expo prebuild --platform ios --clean`, {
        maxBuffer: 1024 * 1024 * 20,
        timeout: 300000 // 5 minutes
      });
    } catch (prebuildError) {
      console.error("[Local iOS Build] Prebuild error:", prebuildError);
      
      // Check for common errors
      if (prebuildError.message && prebuildError.message.includes("Xcode")) {
        return res.status(500).json({ 
          error: "Xcode not found or not properly configured",
          hint: "Install Xcode from the App Store and run: sudo xcode-select --switch /Applications/Xcode.app"
        });
      }
      
      throw prebuildError;
    }
    
    console.log("[Local iOS Build] Building iOS app locally (this may take 5-10 minutes)...");
    console.log("[Local iOS Build] Running: xcodebuild for device build");
    
    const iosDir = join(outDir, "ios");
    
    try {
      // Find the workspace file
      const workspaceFiles = fs.readdirSync(iosDir).filter(f => f.endsWith('.xcworkspace'));
      if (workspaceFiles.length === 0) {
        throw new Error("No .xcworkspace file found in ios directory");
      }
      const workspaceName = workspaceFiles[0];
      const projectName = workspaceName.replace('.xcworkspace', '');
      
      console.log(`[Local iOS Build] Found workspace: ${workspaceName}`);
      
      // Check available SDKs - iOS 26.1 is now installed!
      console.log("[Local iOS Build] Checking available iOS SDKs...");
      const { stdout: sdkOutput } = await execAsync('xcodebuild -showsdks');
      
      // Extract iOS device SDK version
      const deviceMatch = sdkOutput.match(/iphoneos(\d+\.\d+)/);
      if (!deviceMatch) {
        throw new Error('iOS device SDK not found. Please verify iOS platform is installed in Xcode.');
      }
      
      const sdk = `iphoneos${deviceMatch[1]}`;
      const destination = 'generic/platform=iOS';
      
      console.log(`[Local iOS Build] ✅ iOS ${deviceMatch[1]} SDK detected`);
      console.log(`[Local iOS Build] Building for physical iPhone device...`);
      
      // Check if we should build with signing (for TestFlight) or without (for local testing)
      const buildForTestFlight = req.body.testflight === true;
      
      let buildCmd;
      if (buildForTestFlight) {
        console.log("[Local iOS Build] 🚀 Building SIGNED IPA for TestFlight...");
        // Build with proper code signing for TestFlight using automatic signing
        buildCmd = `cd ${iosDir} && xcodebuild \
          -workspace ${workspaceName} \
          -scheme ${projectName} \
          -configuration Release \
          -sdk ${sdk} \
          -destination '${destination}' \
          -derivedDataPath ${iosDir}/build \
          -archivePath ${iosDir}/build/${projectName}.xcarchive \
          CODE_SIGN_STYLE=Automatic \
          DEVELOPMENT_TEAM=U9BZA8J2B8 \
          archive`;
      } else {
        console.log("[Local iOS Build] Building unsigned .app for local testing...");
        // Build without code signing for local testing
        buildCmd = `cd ${iosDir} && xcodebuild \
          -workspace ${workspaceName} \
          -scheme ${projectName} \
          -configuration Release \
          -sdk ${sdk} \
          -destination '${destination}' \
          -derivedDataPath ${iosDir}/build \
          CODE_SIGN_IDENTITY="-" \
          CODE_SIGNING_REQUIRED=NO \
          CODE_SIGNING_ALLOWED=NO \
          ONLY_ACTIVE_ARCH=NO \
          build`;
      }
      
      console.log("[Local iOS Build] Building .app (this may take 5-10 minutes)...");
      const { stdout: buildOutput, stderr: buildError } = await execAsync(buildCmd, {
        maxBuffer: 1024 * 1024 * 50, // 50MB buffer
        timeout: 600000, // 10 minute timeout
      });
      
      console.log("[Local iOS Build] Build output:", buildOutput.substring(buildOutput.length - 500));
      if (buildError && !buildError.includes("note:")) {
        console.log("[Local iOS Build] Build stderr:", buildError.substring(0, 500));
      }
      
      let ipaPath;
      let instructions;
      
      if (buildForTestFlight) {
        // Export archive to IPA with App Store signing
        console.log("[Local iOS Build] Exporting signed IPA for TestFlight...");
        
        const archivePath = join(iosDir, `build/${projectName}.xcarchive`);
        if (!fs.existsSync(archivePath)) {
          throw new Error(`Archive not found at: ${archivePath}`);
        }
        
        // Create export options plist for App Store distribution
        const exportOptionsPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>teamID</key>
    <string>YOUR_TEAM_ID</string>
    <key>uploadBitcode</key>
    <false/>
    <key>uploadSymbols</key>
    <true/>
    <key>compileBitcode</key>
    <false/>
</dict>
</plist>`;
        
        const exportOptionsPath = join(iosDir, "build/ExportOptions.plist");
        fs.writeFileSync(exportOptionsPath, exportOptionsPlist);
        
        const exportPath = join(iosDir, "build/export");
        const exportCmd = `xcodebuild -exportArchive \
          -archivePath "${archivePath}" \
          -exportPath "${exportPath}" \
          -exportOptionsPlist "${exportOptionsPath}"`;
        
        await execAsync(exportCmd, {
          maxBuffer: 1024 * 1024 * 50,
          timeout: 600000
        });
        
        // Find the IPA in export folder
        const ipaFiles = fs.readdirSync(exportPath).filter(f => f.endsWith('.ipa'));
        if (ipaFiles.length === 0) {
          throw new Error("No IPA file found after export");
        }
        
        const exportedIpaPath = join(exportPath, ipaFiles[0]);
        ipaPath = join(__dirname, "temp", `${appId}-testflight.ipa`);
        
        // Copy to temp directory
        await execAsync(`cp "${exportedIpaPath}" "${ipaPath}"`);
        
        console.log(`[Local iOS Build] ✅ Signed IPA created: ${ipaPath}`);
        
        instructions = `📱 Upload to TestFlight:

✅ METHOD 1 - Transporter App (Easiest):
1. Download "Transporter" from Mac App Store
2. Open Transporter and sign in with Apple ID
3. Drag the IPA file to Transporter
4. Click "Deliver" - done!

✅ METHOD 2 - Xcode:
1. Open Xcode → Window → Organizer
2. Click "Distribute App"
3. Choose "App Store Connect" → Upload
4. Select the IPA file

✅ METHOD 3 - Command Line:
xcrun altool --upload-app -f "${ipaPath}" -t ios -u YOUR_APPLE_ID -p YOUR_APP_SPECIFIC_PASSWORD

⏱️ After upload: Check App Store Connect → TestFlight (30min-2hrs processing)`;
        
      } else {
        // Build unsigned IPA for local testing (original behavior)
        // Determine the .app path based on SDK used
        let appPath;
        if (sdk.includes('simulator')) {
          appPath = join(iosDir, `build/Build/Products/Release-iphonesimulator/${projectName}.app`);
        } else {
          appPath = join(iosDir, `build/Build/Products/Release-iphoneos/${projectName}.app`);
        }
        
        // Check if .app exists
        if (!fs.existsSync(appPath)) {
          throw new Error(`iOS .app bundle not found at: ${appPath}. Build may have failed.`);
        }
        
        // .app bundle is ready!
        console.log(`[Local iOS Build] ✅ App built successfully: ${appPath}`);
        
        // Create IPA file (like APK for iOS) - shareable via WhatsApp!
        console.log("[Local iOS Build] Creating unsigned IPA for local testing...");
        
        ipaPath = join(__dirname, "temp", `${appId}-release.ipa`);
        const payloadDir = join(__dirname, "temp", `${appId}-payload`, "Payload");
        
        // Create Payload directory structure
        fs.mkdirSync(payloadDir, { recursive: true });
        
        // Copy .app into Payload directory
        const destAppPath = join(payloadDir, `${projectName}.app`);
        await execAsync(`cp -R "${appPath}" "${destAppPath}"`);
        
        // Create IPA (zip the Payload folder)
        const payloadParent = join(__dirname, "temp", `${appId}-payload`);
        await execAsync(`cd "${payloadParent}" && zip -r "${ipaPath}" Payload`);
        
        // Cleanup payload directory
        await execAsync(`rm -rf "${payloadParent}"`);
        
        console.log(`[Local iOS Build] ✅ IPA created: ${ipaPath}`);
        
        instructions = `📱 To install IPA on iPhone:

✅ EASIEST METHOD (AltStore/Sideloadly):
1. Install AltStore or Sideloadly on your Mac
2. Open the app and connect your iPhone
3. Drag the .ipa file to install

✅ VIA XCODE:
1. Connect iPhone via USB
2. Open Xcode → Window → Devices & Simulators
3. Drag the .ipa file onto your device

✅ SHARE IT:
You can share this .ipa file via WhatsApp, AirDrop, or any file sharing method!`;
      }
      
      setTimeout(() => {
        try { fs.unlinkSync(tempJsonPath); } catch (e) {}
      }, 5000);
      
      res.json({ 
        success: true, 
        ipaPath: ipaPath,
        message: buildForTestFlight 
          ? "🚀 Signed IPA ready for TestFlight upload!" 
          : "iOS IPA ready! Share via WhatsApp and install on iPhone.",
        platform: buildForTestFlight ? "ios-testflight-local" : "ios-local-ipa",
        downloadUrl: buildForTestFlight ? `/download-ipa/${appId}/testflight` : `/download-ipa/${appId}/release`,
        instructions: instructions
      });
      
    } catch (buildError) {
      console.error("[Local iOS Build] Build error:", buildError);
      
      // Helpful error messages
      if (buildError.message && buildError.message.includes("Xcode")) {
        return res.status(500).json({ 
          error: "Xcode build failed",
          hint: "Make sure Xcode is installed and up to date. Open Xcode and accept the license agreement if needed."
        });
      }
      
      if (buildError.message && buildError.message.includes("provisioning")) {
        return res.status(500).json({ 
          error: "Code signing / provisioning issue",
          hint: "For device testing, you need an Apple Developer account and proper provisioning profiles."
        });
      }
      
      throw buildError;
    }
    
  } catch (error) {
    console.error("[Local iOS Build Error]", error);
    res.status(500).json({ 
      error: error.message || "Local iOS build failed",
      hint: "Check server logs for details. Ensure Xcode is installed and properly configured."
    });
  }
});

// Download APK endpoint
app.get("/download-apk/:appId/:variant", (req, res) => {
  const { appId, variant } = req.params;
  const outDir = join(__dirname, "generated", appId);
  
  let apkPath;
  if (variant === "release") {
    apkPath = join(outDir, "android/app/build/outputs/apk/release/app-release.apk");
  } else {
    apkPath = join(outDir, "android/app/build/outputs/apk/debug/app-debug.apk");
  }
  
  if (!fs.existsSync(apkPath)) {
    return res.status(404).json({ error: "APK file not found" });
  }
  
  res.download(apkPath, `${appId}-${variant}.apk`, (err) => {
    if (err) {
      console.error("APK download error:", err);
    }
  });
});

// Download iOS APP endpoint
app.get("/download-ios/:appId/:variant", (req, res) => {
  const { appId, variant } = req.params;
  const zipPath = join(__dirname, "temp", `${appId}-${variant}.zip`);
  
  if (!fs.existsSync(zipPath)) {
    return res.status(404).json({ error: "iOS app bundle not found" });
  }
  
  res.download(zipPath, `${appId}-${variant}.zip`, (err) => {
    if (err) {
      console.error("iOS app download error:", err);
    }
    // Clean up zip file after download
    setTimeout(() => {
      try { fs.unlinkSync(zipPath); } catch (e) {}
    }, 5000);
  });
});

// Download iOS IPA endpoint
app.get("/download-ipa/:appId/:variant", (req, res) => {
  const { appId, variant } = req.params;
  const ipaPath = join(__dirname, "temp", `${appId}-${variant}.ipa`);
  
  if (!fs.existsSync(ipaPath)) {
    return res.status(404).json({ error: "iOS IPA file not found" });
  }
  
  const filename = variant === "testflight" ? `${appId}-testflight.ipa` : `${appId}-${variant}.ipa`;
  
  res.download(ipaPath, filename, (err) => {
    if (err) {
      console.error("IPA download error:", err);
    }
    // Clean up IPA file after download
    setTimeout(() => {
      try { fs.unlinkSync(ipaPath); } catch (e) {}
    }, 5000);
  });
});

// Build iOS for Simulator (test on Mac without iPhone)
app.post("/api/build/ios-simulator", async (req, res) => {
  try {
    const appDef = req.body;
    const appId = appDef.metadata?.id || `app-${Date.now()}`;
    const appName = appDef.metadata?.name || "ExpoApp";
    
    console.log(`[iOS Simulator Build] Starting for: ${appName}`);
    
    const tempJsonPath = join(__dirname, "temp", `${appId}.json`);
    fs.mkdirSync(join(__dirname, "temp"), { recursive: true });
    fs.writeFileSync(tempJsonPath, JSON.stringify(appDef, null, 2));
    
    const outDir = join(__dirname, "generated", appId);
    console.log(`[iOS Simulator Build] Generating Expo project at: ${outDir}`);
    
    await execAsync(`node ${join(__dirname, "tools/generate-expo.js")} ${tempJsonPath} ${outDir}`);
    
    console.log("[iOS Simulator Build] Installing dependencies...");
    await execAsync(`cd ${outDir} && npm install`, {
      maxBuffer: 1024 * 1024 * 10
    });
    
    console.log("[iOS Simulator Build] Pre-building iOS native files...");
    await execAsync(`cd ${outDir} && npx expo prebuild --platform ios --clean`, {
      maxBuffer: 1024 * 1024 * 20,
      timeout: 300000
    });
    
    const iosDir = join(outDir, "ios");
    const workspaceFiles = fs.readdirSync(iosDir).filter(f => f.endsWith('.xcworkspace'));
    
    if (workspaceFiles.length === 0) {
      throw new Error("No .xcworkspace file found in ios directory");
    }
    
    const workspaceName = workspaceFiles[0];
    const projectName = workspaceName.replace('.xcworkspace', '');
    
    console.log(`[iOS Simulator Build] Found workspace: ${workspaceName}`);
    console.log(`[iOS Simulator Build] Building for iOS Simulator (testable on Mac)...`);
    
    // List available simulators
    const { stdout: simListOutput } = await execAsync('xcrun simctl list devices available iPhone');
    console.log("[iOS Simulator Build] Available simulators:", simListOutput.substring(0, 300));
    
    // Find first available iPhone simulator
    const iPhoneMatch = simListOutput.match(/iPhone [^(]+\(([A-F0-9-]+)\)/);
    
    if (!iPhoneMatch) {
      throw new Error("No iPhone simulator found. Please open Xcode and create a simulator.");
    }
    
    const simulatorId = iPhoneMatch[1];
    const simulatorName = iPhoneMatch[0].split('(')[0].trim();
    console.log(`[iOS Simulator Build] Using simulator: ${simulatorName} (${simulatorId})`);
    
    // Build for simulator
    const buildCmd = `cd ${iosDir} && xcodebuild \
      -workspace ${workspaceName} \
      -scheme ${projectName} \
      -configuration Release \
      -sdk iphonesimulator \
      -destination 'id=${simulatorId}' \
      -derivedDataPath ${iosDir}/build \
      CODE_SIGN_IDENTITY="-" \
      CODE_SIGNING_REQUIRED=NO \
      CODE_SIGNING_ALLOWED=NO \
      build`;
    
    console.log("[iOS Simulator Build] Building .app (this may take 5-10 minutes)...");
    const { stdout: buildOutput } = await execAsync(buildCmd, {
      maxBuffer: 1024 * 1024 * 50,
      timeout: 600000
    });
    
    console.log("[iOS Simulator Build] Build completed successfully!");
    
    const appPath = join(iosDir, `build/Build/Products/Release-iphonesimulator/${projectName}.app`);
    
    if (!fs.existsSync(appPath)) {
      throw new Error(`iOS .app bundle not found at: ${appPath}`);
    }
    
    console.log(`[iOS Simulator Build] ✅ App built: ${appPath}`);
    
    // Boot simulator first (must be booted before installing)
    console.log("[iOS Simulator Build] Starting simulator...");
    try {
      await execAsync(`xcrun simctl boot ${simulatorId}`);
      console.log("[iOS Simulator Build] Simulator booted");
    } catch (e) {
      // Simulator might already be booted
      console.log("[iOS Simulator Build] Simulator already running");
    }
    
    // Open simulator app
    console.log("[iOS Simulator Build] Opening Simulator.app...");
    await execAsync(`open -a Simulator`);
    
    // Wait a moment for simulator to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Install to simulator
    console.log(`[iOS Simulator Build] Installing app to ${simulatorName}...`);
    await execAsync(`xcrun simctl install ${simulatorId} "${appPath}"`);
    
    // Get bundle identifier to launch the app
    const infoPlistPath = join(appPath, "Info.plist");
    const { stdout: bundleId } = await execAsync(
      `/usr/libexec/PlistBuddy -c "Print :CFBundleIdentifier" "${infoPlistPath}"`
    );
    const bundleIdentifier = bundleId.trim();
    
    // Launch the app
    console.log(`[iOS Simulator Build] Launching app with bundle ID: ${bundleIdentifier}...`);
    await execAsync(`xcrun simctl launch ${simulatorId} ${bundleIdentifier}`);
    
    console.log(`[iOS Simulator Build] ✅ App installed and launched on simulator!`);
    
    setTimeout(() => {
      try { fs.unlinkSync(tempJsonPath); } catch (e) {}
    }, 5000);
    
    res.json({ 
      success: true,
      message: `App built and launched on ${simulatorName}! Check your Mac's iOS Simulator.`,
      platform: "ios-simulator",
      simulatorName: simulatorName,
      appPath: appPath,
      instructions: "The iOS Simulator should open automatically with your app running. You can now test it on your Mac without an iPhone!"
    });
    
  } catch (error) {
    console.error("[iOS Simulator Build Error]", error);
    res.status(500).json({ 
      error: error.message || "iOS Simulator build failed",
      hint: "Make sure Xcode is installed with iOS Simulator"
    });
  }
});

// Deploy to iOS endpoint
app.post("/api/deploy/ios", async (req, res) => {
  try {
    const appDef = req.body;
    const appId = appDef.metadata?.id || `app-${Date.now()}`;
    const appName = appDef.metadata?.name || "ExpoApp";
    
    console.log(`[iOS Deploy] Starting for: ${appName}`);
    
    const EAS_TOKEN = process.env.EAS_ACCESS_TOKEN;
    if (!EAS_TOKEN) {
      return res.status(400).json({ error: "EAS_ACCESS_TOKEN not found in environment." });
    }
    
    const tempJsonPath = join(__dirname, "temp", `${appId}.json`);
    fs.mkdirSync(join(__dirname, "temp"), { recursive: true });
    fs.writeFileSync(tempJsonPath, JSON.stringify(appDef, null, 2));
    
    const outDir = join(__dirname, "generated", appId);
    await execAsync(`node ${join(__dirname, "tools/generate-expo.js")} ${tempJsonPath} ${outDir}`);
    
    console.log("[iOS Deploy] Installing dependencies...");
    await execAsync(`cd ${outDir} && npm install`);
    
    console.log("[iOS Deploy] Initializing git repository...");
    await execAsync(`cd ${outDir} && git init && git add . && git commit -m "Initial commit"`);
    
    console.log("[iOS Deploy] Configuring EAS project...");
    await execAsync(`cd ${outDir} && /Users/abhinavrai/.nvm/versions/node/v20.11.1/bin/eas init --force --non-interactive`, {
      env: { ...process.env, EXPO_TOKEN: EAS_TOKEN }
    });
    
    console.log("[iOS Deploy] Building with EAS...");
    const buildCmd = `cd ${outDir} && /Users/abhinavrai/.nvm/versions/node/v20.11.1/bin/eas build -p ios --profile production --non-interactive`;
    const { stdout: buildOutput } = await execAsync(buildCmd, {
      env: { ...process.env, EXPO_TOKEN: EAS_TOKEN }
    });
    
    const buildUrlMatch = buildOutput.match(/https:\/\/expo\.dev\/[^\s]+/);
    const buildUrl = buildUrlMatch ? buildUrlMatch[0] : null;
    
    console.log(`[iOS Deploy] ✅ Build started: ${buildUrl}`);
    
    setTimeout(() => {
      try { fs.unlinkSync(tempJsonPath); } catch (e) {}
    }, 5000);
    
    res.json({ 
      success: true, 
      buildUrl,
      message: "iOS build started! Check Expo dashboard for progress.",
      platform: "ios"
    });
    
  } catch (error) {
    console.error("[iOS Deploy Error]", error);
    res.status(500).json({ error: error.message });
  }
});

// Build iOS for TestFlight endpoint
app.post("/api/build/ios-testflight", async (req, res) => {
  try {
    const appDef = req.body;
    const appId = appDef.metadata?.id || `app-${Date.now()}`;
    const appName = appDef.metadata?.name || "ExpoApp";
    
    console.log(`[TestFlight Build] Starting for: ${appName}`);
    
    const EAS_TOKEN = process.env.EAS_ACCESS_TOKEN;
    if (!EAS_TOKEN) {
      return res.status(400).json({ 
        error: "EAS_ACCESS_TOKEN not found",
        hint: "Get your token from: https://expo.dev/accounts/[account]/settings/access-tokens"
      });
    }
    
    const tempJsonPath = join(__dirname, "temp", `${appId}.json`);
    fs.mkdirSync(join(__dirname, "temp"), { recursive: true });
    fs.writeFileSync(tempJsonPath, JSON.stringify(appDef, null, 2));
    
    const outDir = join(__dirname, "generated", appId);
    await execAsync(`node ${join(__dirname, "tools/generate-expo.js")} ${tempJsonPath} ${outDir}`);
    
    console.log("[TestFlight Build] Installing dependencies...");
    await execAsync(`cd ${outDir} && npm install`);
    
    console.log("[TestFlight Build] Initializing git...");
    await execAsync(`cd ${outDir} && git init && git add . && git commit -m "Initial commit"`);
    
    console.log("[TestFlight Build] Configuring EAS...");
    await execAsync(`cd ${outDir} && /Users/abhinavrai/.nvm/versions/node/v20.11.1/bin/eas init --force --non-interactive`, {
      env: { ...process.env, EXPO_TOKEN: EAS_TOKEN }
    });
    
    // Build for TestFlight/App Store
    console.log("[TestFlight Build] Building for TestFlight...");
    const buildCmd = `cd ${outDir} && /Users/abhinavrai/.nvm/versions/node/v20.11.1/bin/eas build -p ios --profile production --auto-submit --non-interactive`;
    
    const { stdout: buildOutput } = await execAsync(buildCmd, {
      env: { ...process.env, EXPO_TOKEN: EAS_TOKEN },
      maxBuffer: 1024 * 1024 * 10
    });
    
    const buildUrlMatch = buildOutput.match(/https:\/\/expo\.dev\/[^\s]+/);
    const buildUrl = buildUrlMatch ? buildUrlMatch[0] : null;
    
    console.log(`[TestFlight Build] ✅ Build started: ${buildUrl}`);
    
    setTimeout(() => {
      try { fs.unlinkSync(tempJsonPath); } catch (e) {}
    }, 5000);
    
    res.json({ 
      success: true, 
      buildUrl,
      message: "iOS build for TestFlight started! EAS will automatically submit to TestFlight when complete.",
      platform: "ios-testflight",
      instructions: "1. Monitor build at Expo dashboard\n2. Once complete, EAS will submit to App Store Connect\n3. Check TestFlight in App Store Connect (30min - 2hrs for processing)\n4. Add testers in App Store Connect → TestFlight"
    });
    
  } catch (error) {
    console.error("[TestFlight Build Error]", error);
    res.status(500).json({ error: error.message });
  }
});

// Helper to create zip
function createZip(sourceDir, outPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outPath);
    const archive = archiver("zip", { zlib: { level: 9 } });
    
    output.on("close", () => resolve());
    archive.on("error", (err) => reject(err));
    
    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

const PORT = Number(process.env.APP_MANAGER_API_PORT || process.env.PORT || 5185);
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
  console.log(`\n📥 Download Endpoints:`);
  console.log(`   🌐 Web Project: POST http://localhost:${PORT}/api/generate-web`);
  console.log(`   📱 Mobile Project: POST http://localhost:${PORT}/api/generate-expo`);
  console.log(`\n🚢 Deploy Endpoints:`);
  console.log(`   🌐 Deploy Web: POST http://localhost:${PORT}/api/deploy-vercel`);
  console.log(`   🤖 Deploy Android (AAB): POST http://localhost:${PORT}/api/deploy/android`);
  console.log(`   📦 Build APK (Cloud): POST http://localhost:${PORT}/api/build/apk`);
  console.log(`   🍎 Deploy iOS: POST http://localhost:${PORT}/api/deploy/ios`);
  console.log(`\n⚡ Local Build Endpoints:`);
  console.log(`   🤖 Build APK (Local): POST http://localhost:${PORT}/api/build/apk-local`);
  console.log(`   🍎 Build iOS IPA (Local): POST http://localhost:${PORT}/api/build/ios-local`);
  console.log(`   📱 Build iOS Simulator (Test on Mac): POST http://localhost:${PORT}/api/build/ios-simulator`);
});
