# How to contribute

Thanks for taking the time to contribute!

## Branching model

 1. Use [One flow](https://www.endoflineblog.com/oneflow-a-git-branching-model-and-workflow) git branching model
 2. Prefix your branch with “feature/*”, “release/*”, “hotfix/*” tags. Note that temporary branches supposed to be deleted after the work in these branches are complete.
 3. For each release the tag must be assigned. 

## Did you find a bug?

 1. Ensure the bug was not already reported by searching on GitHub under Issues.
 2. If you're unable to find an open issue addressing the problem, open a new one. Be sure to include a title and clear description, as much relevant information as possible, and a code sample or an executable test case demonstrating the expected behavior that is not occurring.
 3. If possible, use the relevant bug report templates to create the issue.

## Did you write a patch that fixes a bug?

1. Submit new/Find reported issue with detailed bug description.
2. Check [all tests](#tests) are passing.
3. Make sure you're following [commit message convention](#commit-message)
4. Open a new GitHub pull request with the patch.
5. Ensure the PR description clearly describes the problem and solution. 
6. Include the relevant issue number to PR description.
7. Follow all instructions in the [template](PULL_REQUEST_TEMPLATE/pull_request_template.md)

## Do you intend to add a new feature or change an existing one?

1. Submit enhancement issue
2. Collect positive feedback about the change.
3. Check backward compatibility.
4. In case of major change, contact [codeowner](./CODEOWNERS) for feedback.
5. Update code, [tests](#tests) and documentation.
6. Make sure you're following [commit message convention](#commit-message)
7. Open a new GitHub pull request with the feature.
8. Ensure the PR description clearly describes the problem and solution. 
9. Include the relevant issue number to PR description.
10. Follow all instructions in the [template](PULL_REQUEST_TEMPLATE/pull_request_template.md)


## Commit message

Commit message summaries must follow this basic format:
```
  Tag: Message (fixes #1234)
```

1. The message summary should be a one-sentence description of the change.
2. Use the present tense ("Add feature" not "Added feature")
3. Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
4. The issue number should be mentioned at the end.

  
The Tag is one of the following:
* **Fix** - for a bug fix.
* **Update** - for a backwards-compatible enhancement.
* **Breaking** - for a backwards-incompatible enhancement.
* **Docs** - changes to documentation only.
* **Build** - changes to build process only.
* **New** - implemented a new feature.
* **Upgrade** - for a dependency upgrade.
* **Chore** - for tests, refactor, style, etc.

## JavaScript styleguide

All JavaScript code is linted with [ESLint](https://eslint.org/). 
Double-check you are following the current [eslint config](../.eslintrc).

After finishing work check codestyle with command:
```
    npm run test:lint
```

## Documentation

All API changes should be added to documentation.

1. Use markdown.
2. Wrap code to \`\`\`javascript \`\`\` blocks.
3. Keep table of contents up to date.
   
## Tests

run all test suites:
```
    npm run test:mocha
```
run tests in build:

```
    npm run test:package
```

check security:
```
    npm run test:security
```

check [styleguide](#javascript-styleguide):
```
    npm run test:lint
```
