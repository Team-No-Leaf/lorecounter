import assert from 'node:assert/strict';

function requireCheckedWorkflow(settings) {
  assert.equal(settings.build_type, 'workflow',
    'Pages must publish through GitHub Actions, not directly from a branch. Branch publishing bypasses proxy safety checks.');
}

// Prove the unsafe configuration is rejected before consulting repository settings.
requireCheckedWorkflow({ build_type: 'workflow' });
assert.throws(() => requireCheckedWorkflow({ build_type: 'legacy' }));

const repository = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;
assert.ok(repository && token, 'Repository and GitHub authentication are required to verify Pages settings.');
const response = await fetch(`https://api.github.com/repos/${repository}/pages`, {
  headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' }
});
assert.ok(response.ok, `Could not verify Pages publishing settings: HTTP ${response.status}`);
requireCheckedWorkflow(await response.json());
console.log('Passed: Pages uses the checked workflow; direct branch publishing is disabled.');
