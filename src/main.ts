import * as github from '@actions/github';
import * as core from '@actions/core';

async function run(): Promise<void> {
  try {
    const githubToken = core.getInput('github_token');

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

    const octokit = github.getOctokit(githubToken);
    const { data: githubLabels } = await octokit.rest.issues.addLabels({
      labels,
      owner,
      repo,
      issue_number: number
    });
    const githubLabelsByName: { [label: string]: (typeof githubLabels)[0] } = githubLabels
      .reduce((acc, label) => ({ ...acc, [label.name]: label }), {});

    const colors = core
      .getInput('colors')
      .split('\n')
      .filter(c => c !== '')
      .slice(0, labels.length);

    for (const [i, color] of colors.entries()) {
      const name = labels[i];
      const githubLabel = githubLabelsByName[name];
      if (!githubLabel || githubLabel.color == color) {
        continue;
      }
      try {
        await octokit.rest.issues.updateLabel({
          owner,
          repo,
          name,
          color
        });
        core.info(`Updated color for label "${githubLabel.name}" from #${githubLabel.color} to #${color}`);
      } catch (e) {
        if (e instanceof Error) {
          core.error(e);
        }
      }
    }
  } catch (e) {
    if (e instanceof Error) {
      core.error(e);
      core.setFailed(e.message);
    }
  }
}

run();
