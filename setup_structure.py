import os

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

print("✅ Directory structure created successfully!")
print("\nCreated directories:")
for root, dirs, files in os.walk('.'):
    level = root.replace('.', '', 1).count(os.sep)
    indent = ' ' * 2 * level
    print(f'{indent}{os.path.basename(root)}/')
    subindent = ' ' * 2 * (level + 1)
    for file in files:
        if file != 'setup_structure.py':
            print(f'{subindent}{file}')
