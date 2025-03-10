import {execSync} from 'child_process';

console.log('process.argv:', process.argv);

let userArg: string | null = null;
let projectType: string | null = null;

for (const element of process.argv) {
    const arg = element;
    if (arg.startsWith('--tags=') || arg.startsWith('tags=')) {
        const parts = arg.split('=');
        if (parts.length > 1 && parts[1]) {
            userArg = parts[1];
        }
    }
    if (arg.startsWith('--project=') || arg.startsWith("project=")) {
        const parts = arg.split('=');
        if (parts.length > 1 && parts[1]) {
            projectType = parts[1];
        }
    }
}

// If nothing was provided exit
if (!userArg) {
    console.log('No tag expression provided.');
    process.exit(0);
}

// Pass the original expression to bddgen
const bddgenTagExpr: string = userArg;

// Translate for Playwright’s --grep
let playwrightRegex: string;

if (bddgenTagExpr.includes(' and ')) {
    // e.g., '@fast and @slow' => '(?=.*@fast)(?=.*@slow)'
    const tags = bddgenTagExpr.split(/\sand\s/);
    playwrightRegex = tags.map(tag => `(?=.*${tag})`).join('');
} else if (bddgenTagExpr.includes(' or ')) {
    // e.g., '@fast or @slow' => '@fast|@slow'
    playwrightRegex = bddgenTagExpr.replace(/\sor\s/g, '|');
} else {
    // Just one tag, no "and"/"or"
    playwrightRegex = bddgenTagExpr;
}

if(projectType === null) {
    if (bddgenTagExpr.includes('@UI')) {
        projectType = 'ui';
    } else if (bddgenTagExpr.includes('@API')) {
        projectType = 'api';
    }
}


console.log('Cucumber Expression =>', bddgenTagExpr);
console.log('Playwright Regex =>', playwrightRegex);


// 4) Run bddgen, then Playwright with --grep and project
execSync(
    `npx bddgen --tags "${bddgenTagExpr}" && npx playwright test --grep "${playwrightRegex}" --project=${projectType}`,
    {stdio: 'inherit'}
);