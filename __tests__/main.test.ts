import * as Processor from '../src/Processor';

test('issues payload is assumed to be issues payload', async () => {
  const payload: any = {
    pull_request: {
      number: 1
    }
  };
  expect(Processor.isWebhookPayloadPullRequest(payload)).toEqual(true);
});

test('pull request payload is assumed to be pull request payload', async () => {
  const payload: any = {
    issue: {
      number: 1
    }
  };
  expect(Processor.isWebhookPayloadIssues(payload)).toEqual(true);
});
