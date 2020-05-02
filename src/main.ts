import * as core from '@actions/core';
import {Processor, ProcessorOptions} from './Processor';

async function run(): Promise<void> {
  try {
    const args = await getAndValidateArgs();
    const processor: Processor = new Processor(args);

    await processor.process();
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

async function getAndValidateArgs(): Promise<ProcessorOptions> {
  try {
  const args: ProcessorOptions = {
    githubToken: core.getInput('github_token', {required: true}),

    labels: core
      .getInput('labels')
      .split('\n')
      .filter(l => l !== ''),

    owner: core.getInput('repo').split('/')[0],
    repo: core.getInput('repo').split('/')[1],
    number: core.getInput('number') === '' ? 0 : parseInt(core.getInput('number')),
  };

  return args;
  } catch (error) {
    throw error; 
  }
}

run();
