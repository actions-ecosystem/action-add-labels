import * as github from '@actions/github';
import * as core from '@actions/core';

async function run(): Promise<void> {
  try {
    const githubToken = core.getInput('github_token', { required: true });

    const labels = core
      .getInput('labels')
      .split('\n')
      .filter(l => l !== '');
    const [owner, repo] = core.getInput('repo').split('/');
    const number =
      core.getInput('number') === ''
        ? github.context.issue.number
        : parseInt(core.getInput('number'));

    if (labels.length === 0) {
      return;
    }

    const client = new github.GitHub(githubToken);
    await client.issues.addLabels({
      labels,
      owner,
      repo,
      issue_number: number
    });
  } catch (e) {
    core.error(e);
    core.setFailed(e.message);
  }
}

run();
