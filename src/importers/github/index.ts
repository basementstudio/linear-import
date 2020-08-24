import chalk from 'chalk';
import { GithubImporter } from './GithubImporter';
import * as inquirer from 'inquirer';
import { Importer } from '../../types';

export const githubImport = async (): Promise<Importer> => {
  const answers = await inquirer.prompt<GithubImportAnswers>(questions);

  const { GITHUB_API_KEY } = process.env;

  if (!GITHUB_API_KEY) {
    console.log(
      chalk.red(
        'GITHUB_API_KEY not found. Please create a .env file with GITHUB_API_KEY=<your-api-key>'
      )
    );
    console.log(
      chalk.green(
        'Get yours at (https://github.com/settings/tokens, select `repo` scope)'
      )
    );
    throw new Error('');
  }

  const [owner, repo] = answers.repo.split('/');
  const githubImporter = new GithubImporter(GITHUB_API_KEY, owner, repo);
  return githubImporter;
};

interface GithubImportAnswers {
  githubApiKey: string;
  linearApiKey: string;
  repo: string;
}

const questions = [
  {
    type: 'input',
    name: 'repo',
    message:
      'From which repo do you want to import issues from (e.g. "facebook/react")',
  },
];
