import chalk from 'chalk';
import * as inquirer from 'inquirer';
import { ImportAnswers } from './types';
import { importIssues } from './importIssues';
import { githubImport } from './importers/github';
import { jiraCsvImport } from './importers/jiraCsv';
import { asanaCsvImport } from './importers/asanaCsv';
import { pivotalCsvImport } from './importers/pivotalCsv';
import { trelloJsonImport } from './importers/trelloJson';

require('dotenv').config();

inquirer.registerPrompt('filePath', require('inquirer-file-path'));

(async () => {
  try {
    const { LINEAR_API_KEY } = process.env;

    if (!LINEAR_API_KEY) {
      console.log(
        chalk.red(
          'LINEAR_API_KEY not found. Please create a .env file with LINEAR_API_KEY=<your-api-key>'
        )
      );
      return;
    }

    const importAnswers = await inquirer.prompt<ImportAnswers>([
      {
        type: 'list',
        name: 'service',
        message: 'Which service would you like to import from?',
        choices: [
          {
            name: 'GitHub',
            value: 'github',
          },
          {
            name: 'Jira (CSV export)',
            value: 'jiraCsv',
          },
          {
            name: 'Asana (CSV export)',
            value: 'asanaCsv',
          },
          {
            name: 'Pivotal (CSV export)',
            value: 'pivotalCsv',
          },
          {
            name: 'Trello (JSON export)',
            value: 'trelloJson',
          },
        ],
      },
    ]);

    // TODO: Validate Linear API
    let importer;
    switch (importAnswers.service) {
      case 'github':
        importer = await githubImport();
        break;
      case 'jiraCsv':
        importer = await jiraCsvImport();
        break;
      case 'asanaCsv':
        importer = await asanaCsvImport();
        break;
      case 'pivotalCsv':
        importer = await pivotalCsvImport();
        break;
      case 'trelloJson':
        importer = await trelloJsonImport();
        break;
      default:
        console.log(chalk.red(`Invalid importer`));
        return;
    }

    if (importer) {
      await importIssues(LINEAR_API_KEY, importer);
    }
  } catch (e) {
    // Deal with the fact the chain failed
    console.error(e);
  }
})();
