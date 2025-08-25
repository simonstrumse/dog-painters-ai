# Security Audit Checklist

## Overview
This document provides a systematic approach to conducting security audits for web applications. 

**Framework Scope**: This checklist is specifically designed for **Firebase + Next.js** applications deployed on **Vercel/Netlify**. 

**Other Frameworks**: If you're using different technologies, adapt accordingly:
- **Supabase**: Replace Firebase rules with Supabase RLS policies
- **AWS/GCP**: Adjust IAM and database security sections 
- **Other deployment platforms**: Modify deployment verification steps
- **Other frontend frameworks**: Adapt security header configuration

## Critical Lessons from Failed Deployments
⚠️ **NEVER assume deployment succeeded without verification**
⚠️ **Always verify the target environment/project is correct**
⚠️ **Check that configuration files include ALL required settings**

## 1. Environment Variable Security

### Check for exposed secrets
```bash
# Search for potential hardcoded secrets
grep -r "sk-" . --exclude-dir=node_modules --exclude-dir=.git
grep -r "AIza" . --exclude-dir=node_modules --exclude-dir=.git  
grep -r "pk_" . --exclude-dir=node_modules --exclude-dir=.git
grep -r "gcp-" . --exclude-dir=node_modules --exclude-dir=.git
```

### Verify proper environment variable usage
- All API keys use `process.env.VARIABLE_NAME`
- Client-side keys are properly prefixed (e.g., `NEXT_PUBLIC_`)
- No `.env` files are committed to git
- `.gitignore` properly excludes environment files

### Validate .gitignore
```bash
cat .gitignore | grep -E "\.env|\.firebase|node_modules"
```

## 2. Firebase Security Rules & Deployment Verification

### ⚠️ CRITICAL: Verify Target Project First
```bash
# 1. List all Firebase projects
firebase projects:list

# 2. Verify current project (should show "current" next to correct project)
firebase list | grep "(current)"

# 3. If wrong project, switch to correct one
firebase use PROJECT_ID

# 4. Double-check you're targeting the right project
firebase projects:list
```

### Configuration File Completeness Check
```bash
# CRITICAL: Verify firebase.json has ALL required sections
cat firebase.json

# Must include:
# - "rules": "firestore.rules" (under firestore)
# - "rules": "storage.rules" (under storage)  
# - "indexes": "firestore.indexes.json" (under firestore)
```

**Example complete firebase.json:**
```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

### Firestore Rules Audit
```bash
# Check current deployed rules (NOT local files)
firebase-mcp firestore_get_rules
# Or: firebase firestore:rules:get
```

**Critical checks:**
- No open `allow read, write: if true` rules
- No expiring test rules (e.g., `timestamp.date(2025, 9, 23)`)
- Authentication requirements in place
- User data isolation (users can only access own data)
- Public collections properly restricted

### Storage Rules Audit
```bash
# Check current deployed rules (NOT local files)
firebase-mcp storage_get_rules
# Or: firebase storage:rules:get
```

**Critical checks:**
- Public read access only where needed
- Write access restricted to server/authenticated users
- No unrestricted file upload paths

### Database Indexes Verification
```bash
# Check current deployed indexes
firebase firestore:indexes

# Compare with local indexes file
cat firestore.indexes.json

# Deploy if they don't match
firebase deploy --only firestore:indexes
```

### Rules Deployment & Verification Process
```bash
# 1. Deploy rules
firebase deploy --only firestore:rules,storage,firestore:indexes

# 2. VERIFY deployment actually worked
firebase-mcp firestore_get_rules
firebase-mcp storage_get_rules

# 3. Test rules are working (should see secure rules, not open ones)
# If you still see open/test rules, the deployment failed!
```

## 3. Authentication Security

### Verify authentication implementation
- Server-side token verification using Admin SDK
- Proper `idToken` validation in API routes
- No client-side admin operations
- Authentication state properly managed

### Check for authentication bypass
```bash
# Search for API routes that might skip auth
grep -r "req.json" src/app/api --include="*.ts" -A 5 -B 5
```

## 4. Database Access Patterns

### Review API routes security
- All database writes use Admin SDK
- User data properly isolated by UID
- Input validation on all endpoints
- Proper error handling (no sensitive data in errors)

### Check for data leakage
- Gallery data doesn't expose private user information
- File paths don't reveal sensitive structure
- Error messages don't leak system details

## 5. Production Environment

### Security Headers
Verify `next.config.js` includes:
```javascript
headers: [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
]
```

### Deployment Configuration
- Environment variables encrypted in production
- No development/debug modes in production
- Proper domain configuration
- HTTPS enforced

## 6. File Upload Security

### Validate upload restrictions
- File type validation on server-side
- File size limits enforced
- Upload paths restricted
- No executable file uploads

### Storage access patterns
- Public URLs only for intended public content
- No direct database access from client
- Proper file cleanup procedures

## Complete Security Audit Script

```bash
#!/bin/bash
echo "=== Firebase Security Audit ==="

# 1. Project verification
echo "1. Verifying Firebase project..."
echo "Current project:"
firebase projects:list | grep "(current)" || echo "❌ No current project set!"

# 2. Secret scanning
echo "2. Checking for exposed secrets..."
grep -r "sk-\|AIza\|pk_\|gcp-" . --exclude-dir=node_modules --exclude-dir=.git || echo "✓ No exposed secrets found"

# 3. Environment protection
echo "3. Checking .gitignore..."
grep -E "\.env|\.firebase|node_modules" .gitignore && echo "✓ Environment files properly ignored"

# 4. Configuration completeness
echo "4. Checking firebase.json completeness..."
if grep -q '"rules".*firestore.rules' firebase.json && grep -q '"rules".*storage.rules' firebase.json; then
    echo "✓ Firebase rules configuration complete"
else
    echo "❌ Missing rules configuration in firebase.json"
fi

# 5. Security headers
echo "5. Checking security headers..."
grep -A 20 "headers" next.config.js | grep -E "X-Content-Type|X-Frame|X-XSS" && echo "✓ Security headers configured"

# 6. Critical manual verification required
echo "6. ⚠️  CRITICAL MANUAL VERIFICATION REQUIRED:"
echo "   Run these commands and verify secure rules (no open access):"
echo "   firebase firestore:rules:get"
echo "   firebase storage:rules:get"
echo "   firebase firestore:indexes"
echo ""
echo "   - Should NOT see: 'allow read, write: if true'"
echo "   - Should NOT see: 'timestamp.date(2025, X, Y)'"
echo "   - Should see proper authentication checks"

echo "=== Audit Complete ==="

# Framework adaptation notes
echo ""
echo "📋 FRAMEWORK ADAPTATIONS:"
echo "Supabase users: Replace Firebase rules checks with RLS policy verification"
echo "AWS users: Add IAM permission auditing"
echo "Other platforms: Adapt deployment verification steps"
```

## Security Rule Templates

### Secure Firestore Rules Template
```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Public read collections
    match /public_collection/{documentId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null 
        && request.auth.uid == resource.data.uid;
    }
    
    // User-private collections
    match /user_data/{documentId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.uid;
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Secure Storage Rules Template
```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Public files - read only
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if false; // Server-only writes
    }
    
    // User files - authenticated access
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
    
    // Deny all other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## Incident Response

### If security issue found:
1. **Immediate**: Restrict access (deploy secure rules)
2. **Assess**: Determine scope of potential data exposure
3. **Fix**: Implement proper security measures
4. **Verify**: Re-audit all related components
5. **Monitor**: Set up alerts for similar issues

### Regular maintenance:
- Monthly security rule review
- Quarterly dependency audits
- Annual full security assessment
- Monitor Firebase security notifications