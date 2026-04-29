#!/usr/bin/env python3
import os
import sys

# Change to the script's directory
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

# Create backend structure
os.makedirs('backend/pagerank', exist_ok=True)
os.makedirs('backend/data', exist_ok=True)

# Create frontend structure
os.makedirs('frontend/src/components', exist_ok=True)
os.makedirs('frontend/src/pages', exist_ok=True)
os.makedirs('frontend/src/api', exist_ok=True)

# Create __init__.py for Python package
with open('backend/pagerank/__init__.py', 'w') as f:
    f.write('# PageRank package\n')

print("✓ Directory structure created successfully!\n")
print("Created directories and files:")
print("=" * 50)

for root, dirs, files in os.walk('.'):
    level = root.replace('.', '', 1).count(os.sep)
    indent = '  ' * level
    folder_name = os.path.basename(root) or 'MM EL'
    print(f'{indent}{folder_name}/')
    subindent = '  ' * (level + 1)
    for file in sorted(files):
        if file not in ['setup_structure.py', 'create_dirs.py']:
            print(f'{subindent}{file}')
    for dir_name in sorted(dirs):
        pass  # dirs are printed in next iteration

print("=" * 50)
print("\nDirectory listing complete!")
