#!/usr/bin/env node
import fs from "fs";
import path from "path";

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function write(p, content) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, content, "utf8");
  console.log("created", p);
}

function renderNodeToRN(node, idx = 0) {
  const props = node.props || {};
  const style = props.style || {};
  
  // Build React Native StyleSheet style object
  const rnStyle = {};
  if (style.backgroundColor) rnStyle.backgroundColor = style.backgroundColor;
  if (style.textColor) rnStyle.color = style.textColor;
  if (style.borderColor) rnStyle.borderColor = style.borderColor;
  if (style.borderWidth != null) rnStyle.borderWidth = style.borderWidth;
  if (style.radius != null) rnStyle.borderRadius = style.radius;
  if (style.px != null) { rnStyle.paddingHorizontal = style.px; }
  if (style.py != null) { rnStyle.paddingVertical = style.py; }
  if (style.fontSize != null) rnStyle.fontSize = style.fontSize;
  if (style.bold) rnStyle.fontWeight = '700';
  if (style.italic) rnStyle.fontStyle = 'italic';
  if (style.shadow) {
    rnStyle.shadowColor = '#000';
    rnStyle.shadowOffset = { width: 0, height: 2 };
    rnStyle.shadowOpacity = 0.25;
    rnStyle.shadowRadius = 3.84;
    rnStyle.elevation = 5;
  }
  
  const styleStr = Object.keys(rnStyle).length ? `style={${JSON.stringify(rnStyle)}}` : "";

  if (node.type === "Text") {
    const align = props.align || style.align || 'left';
    const textStyle = { ...rnStyle, textAlign: align };
    return `<Text style={${JSON.stringify(textStyle)}}>${props.text || ""}</Text>`;
  }
  
  if (node.type === "Button") {
    const btnStyle = { ...rnStyle, padding: 12, borderRadius: 8, alignItems: 'center' };
    const textStyle = { color: rnStyle.color || '#fff', fontWeight: '600' };
    return `<TouchableOpacity ${styleStr ? `style={${JSON.stringify(btnStyle)}}` : ''}>
  <Text style={${JSON.stringify(textStyle)}}>${props.text || "Button"}</Text>
</TouchableOpacity>`;
  }
  
  if (node.type === "Input") {
    const label = props.label || '';
    const placeholder = props.placeholder || '';
    const helpText = props.helpText || '';
    return `<View style={{ marginBottom: 16 }}>
  ${label ? `<Text style={{ marginBottom: 4, fontSize: 14, fontWeight: '600' }}>${label}</Text>` : ''}
  <TextInput
    placeholder="${placeholder}"
    ${styleStr}
    style={{...${JSON.stringify(rnStyle)}, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 12}}
  />
  ${helpText ? `<Text style={{ marginTop: 4, fontSize: 12, color: '#64748b' }}>${helpText}</Text>` : ''}
</View>`;
  }
  
  if (node.type === "Card") {
    const children = (node.children || []).map((c, i) => renderNodeToRN(c, i)).join("\n");
    const cardStyle = { ...rnStyle, padding: 16, borderRadius: 12, backgroundColor: rnStyle.backgroundColor || '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 };
    return `<View style={${JSON.stringify(cardStyle)}}>
  ${children || '<Text style={{ color: "#aaa" }}>Empty card</Text>'}
</View>`;
  }
  
  if (node.type === "Grid") {
    const gap = props.gap || 12;
    const children = (node.children || []).map((c, i) => renderNodeToRN(c, i)).join("\n");
    return `<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ${gap} }}>
  ${children || '<Text style={{ color: "#aaa" }}>Empty grid</Text>'}
</View>`;
  }
  
  if (node.type === "AuthScreen") {
    const title = props.title || 'Sign In';
    const description = props.description || '';
    const children = (node.children || []).map((c, i) => renderNodeToRN(c, i)).join("\n");
    return `<View style={{ padding: 24, backgroundColor: '#fff', borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 }}>
  <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 8 }}>${title}</Text>
  ${description ? `<Text style={{ color: '#64748b', marginBottom: 16 }}>${description}</Text>` : ''}
  ${children}
</View>`;
  }
  
  // root or unknown
  if (node.children && node.children.length) return node.children.map((c, i) => renderNodeToRN(c, i)).join("\n");
  return `{/* unknown node ${node.type} */}`;
}

function createPlaceholderAssets(outDir) {
  const assetsDir = path.join(outDir, "assets");
  ensureDir(assetsDir);
  
  // Create a simple 1024x1024 placeholder PNG (base64 encoded minimal PNG)
  // This is a tiny 1x1 white pixel PNG that will be accepted by Expo
  const minimalPNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
    'base64'
  );
  
  // Write placeholder images
  fs.writeFileSync(path.join(assetsDir, "icon.png"), minimalPNG);
  fs.writeFileSync(path.join(assetsDir, "splash.png"), minimalPNG);
  fs.writeFileSync(path.join(assetsDir, "adaptive-icon.png"), minimalPNG);
  fs.writeFileSync(path.join(assetsDir, "favicon.png"), minimalPNG);
  
  console.log("✓ Created placeholder assets (replace with your own images)");
}

function generateExpoApp(def, outDir) {
  ensureDir(outDir);
  
  // Create placeholder assets first
  createPlaceholderAssets(outDir);

  // package.json
  const pkg = {
    name: def.metadata?.name || "expo-app",
    version: def.metadata?.version || "1.0.0",
    main: "node_modules/expo/AppEntry.js",
    scripts: {
      start: "expo start",
      android: "expo start --android",
      ios: "expo start --ios",
      web: "expo start --web"
    },
    dependencies: {
      "expo": "~54.0.0",
      "expo-status-bar": "~3.0.8",
      "react": "19.1.0",
      "react-native": "0.81.5"
    },
    devDependencies: {
      "@babel/core": "^7.25.0",
      "babel-preset-expo": "^12.0.3"
    }
  };
  write(path.join(outDir, "package.json"), JSON.stringify(pkg, null, 2));

  // app.json
  const appName = def.metadata?.name || "ExpoApp";
  const slug = appName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const packageName = `com.hbmp.${slug.replace(/-/g, '')}`;
  
  const appJson = {
    expo: {
      name: appName,
      slug: slug,
      version: def.metadata?.version || "1.0.0",
      orientation: "portrait",
      icon: "./assets/icon.png",
      userInterfaceStyle: "light",
      splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      },
      ios: {
        supportsTablet: true,
        bundleIdentifier: packageName
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-icon.png",
          backgroundColor: "#ffffff"
        },
        package: packageName,
        versionCode: 1
      },
      web: {
        favicon: "./assets/favicon.png"
      },
      updates: {
        fallbackToCacheTimeout: 0
      },
      assetBundlePatterns: ["**/*"],
      extra: {
        generatedBy: "HBMP App Manager",
        generatedAt: new Date().toISOString()
      }
    }
  };
  write(path.join(outDir, "app.json"), JSON.stringify(appJson, null, 2));

  // eas.json
  const easJson = {
    cli: {
      version: ">= 16.0.0"
    },
    build: {
      development: {
        developmentClient: true,
        distribution: "internal",
        android: {
          buildType: "apk"
        }
      },
      preview: {
        distribution: "internal",
        android: {
          buildType: "apk"
        }
      },
      production: {
        android: {
          buildType: "app-bundle"
        },
        ios: {
          buildType: "app-store",
          autoSubmit: true
        }
      },
      apk: {
        android: {
          buildType: "apk"
        }
      }
    },
    submit: {
      production: {
        ios: {
          appleId: "${APPLE_ID}",
          ascAppId: "${ASC_APP_ID}",
          appleTeamId: "${APPLE_TEAM_ID}"
        }
      }
    }
  };
  write(path.join(outDir, "eas.json"), JSON.stringify(easJson, null, 2));

  // App.js
  const jsx = renderNodeToRN(def.tree || { children: [] });
  const appJs = `import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';

export default function App() {
  return (
    <ScrollView style={styles.container}>
      <StatusBar style="auto" />
      ${jsx}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
  },
});
`;
  write(path.join(outDir, "App.js"), appJs);

  // .gitignore
  write(path.join(outDir, ".gitignore"), `node_modules/
.expo/
dist/
npm-debug.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/

# macOS
.DS_Store

# Android Studio
.idea/
*.iml
.gradle/
local.properties

# Android
android/
ios/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Library files (exclude Android Studio workspace)
Library/
`);

  // babel.config.js
  write(path.join(outDir, "babel.config.js"), `module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
`);

  console.log(`\nExpo app generated → ${outDir}`);
  console.log("\nNext steps:");
  console.log(`  cd ${outDir}`);
  console.log(`  npm install`);
  console.log(`  npx expo start`);
}

// CLI
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Usage: node generate-expo.js <app-definition.json> <output-dir>");
  process.exit(1);
}

const jsonPath = args[0];
const outDir = args[1];

if (!fs.existsSync(jsonPath)) {
  console.error(`File not found: ${jsonPath}`);
  process.exit(1);
}

const def = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
generateExpoApp(def, outDir);
