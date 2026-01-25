const fs = require('fs');
const path = require('path');

const directory = './src';
const search = 'http://localhost:5000';
const replace = 'http://localhost:5001';

function traverseDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseDirectory(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes(search)) {
                content = content.split(search).join(replace);
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

try {
    traverseDirectory(directory);
    console.log('Done!');
} catch (e) {
    console.error(e);
}
