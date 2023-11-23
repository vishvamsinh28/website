const { promises: { readFile, writeFile, mkdir } } = require('fs');
const { convertToJson } = require('../utils');
const { resolve, dirname } = require('path');

module.exports = async function buildFinanceInfoList() {
    try {
        const currentDir = resolve(__dirname, '../../');

        const expensesPath = resolve(currentDir, 'config', 'finance', '2023', 'Expenses.yml');
        const expensesLinkPath = resolve(currentDir, 'config', 'finance', '2023', 'ExpensesLink.yml');

        console.log('Reading Expenses file from:', expensesPath);
        const ExpensesContent = await readFile(expensesPath, 'utf-8');
        console.log('Reading ExpensesLink file from:', expensesLinkPath);
        const ExpensesLinkContent = await readFile(expensesLinkPath, 'utf-8');

        const Expenses = convertToJson(ExpensesContent);
        const ExpensesLink = convertToJson(ExpensesLinkContent);

        // Ensure the directory exists before writing the files
        const jsonDirectory = resolve(currentDir, 'config', 'finance', 'json-data', '2023');
        console.log('Ensuring directory exists:', jsonDirectory);
        await mkdir(jsonDirectory, { recursive: true });

        // Write Expenses to a JSON file
        const expensesJsonPath = resolve(jsonDirectory, 'Expenses.json');
        console.log('Writing Expenses to:', expensesJsonPath);
        await writeFile(expensesJsonPath, JSON.stringify(Expenses, null, 2));

        // Write ExpensesLink to a JSON file
        const expensesLinkJsonPath = resolve(jsonDirectory, 'ExpensesLink.json');
        console.log('Writing ExpensesLink to:', expensesLinkJsonPath);
        await writeFile(expensesLinkJsonPath, JSON.stringify(ExpensesLink, null, 2));

    } catch (err) {
        console.error(err);
        throw err;
    }
};
