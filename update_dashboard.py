import shutil
import os

# Copy Dashboard-New.tsx to Dashboard.tsx
src = r'frontend\src\pages\Dashboard-New.tsx'
dst = r'frontend\src\pages\Dashboard.tsx'

if os.path.exists(src):
    shutil.copy2(src, dst)
    print("✅ Dashboard.tsx updated successfully!")
    print("\n📊 New features are now active:")
    print("   • Graph selector dropdown")
    print("   • Custom graph input button")
    print("   • 4 realistic graph datasets")
    print("   • Enhanced UI with gradients")
    print("\n🔄 Next step: RESTART the frontend (Ctrl+C then npm start)")
else:
    print(f"❌ Error: {src} not found")
