import { message, danger, warn, fail } from 'danger';
import lint from '@commitlint/lint';
import commitLintConfig from './.commitlintrc';

const src = danger.git.fileMatch('src/*');
const tests = danger.git.fileMatch('tests/*');
const system = danger.git.fileMatch('.*', '.*/**', 'LICENSE.md', 'package-lock.json', 'package.json');
const isOwner = danger.github.pr.user.login === danger.github.thisPR.owner;
const modifiedList = danger.git.modified_files.join('- ');

export default async function () {
    message(`Changed Files in this PR: \n - ${modifiedList}`);

    if (system.modified && !isOwner) {
        const files = system.getKeyedPaths().modified;

        fail(`Only owner can change system files [${files.join(', ')}], please provide issue instead`, files[0]);
    }

    if (!src.modified && !tests.modified) {
        warn('Source files were changed without tests');
    }

    const promises = danger.github.commits.map(async commit => {
        const msg = commit.commit.message;
        const comitLintReport = await lint(msg, commitLintConfig.rules);

        if (!comitLintReport.valid) {
            const errors = comitLintReport.errors.map(e => e.message);

            fail(`Commit [${commit.sha}]:\n${msg} not mathing convention:\n${errors.join('\n')}`);
        }
    });

    await Promise.all(promises);
}
