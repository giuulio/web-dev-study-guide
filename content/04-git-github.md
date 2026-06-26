# Git & GitHub

Git is a **version control system**: it records snapshots of your project over time so you can review history, undo mistakes, and work on features in isolation. It runs locally from the command line. **GitHub** is a hosting platform built around Git: it stores your repositories remotely and adds collaboration tools (pull requests, issues) on top. This guide moves from your machine outward: the command line, then Git locally, then GitHub remotely, then deployment.

## Notes

### The command line

- the **command line** (terminal) lets you navigate the filesystem and run programs by typing; it is the interface Git and most dev tooling run on
- on Unix (macOS, Linux) the shell is commonly **Bash** or **Zsh**; the prompt is `$`
- the **filesystem** is a tree: directories (folders) contain files and other directories, descending from a single **root**
- **navigation**:
  - `pwd`: print working directory (where you currently are)
  - `ls`: list contents of a directory (defaults to the current one)
  - `cd path`: change directory; `cd ..` moves up to the parent; `cd` alone goes home
- **creating**:
  - `mkdir name`: make a new directory
  - `touch name`: create a new empty file
- **helper keys**: `clear` empties the terminal; `Tab` autocompletes; `↑` / `↓` cycle previous commands

> **Beyond the cheatsheets**
> - more everyday commands: `cat file` (print contents), `mv` (move/rename), `cp` (copy), `rm` (remove; `rm -r` for directories, careful, no undo) ([MDN CLI crash course](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Command_line))
> - on macOS the default shell is **Zsh** (since Catalina), largely Bash-compatible ([Apple](https://support.apple.com/en-us/102360))
> - `~` is shorthand for your home directory; `.` is the current directory, `..` the parent

### Git fundamentals & the basic workflow

- **version control** tracks changes so you can revisit, compare, and restore earlier versions
- a Git project has **three areas**:
  - **working directory**: where you edit files
  - **staging area**: changes you have marked for the next commit
  - **repository**: where Git permanently stores committed snapshots
- the workflow is: edit in the working directory → `add` to staging → `commit` to the repository
- **commands**:
  - `git init`: initialize a repository (creates a hidden `.git` folder); run once per project
  - `git status`: show what is staged, modified, or untracked
  - `git add filename`: stage a file (`git add file1 file2` for several; `git add .` for everything)
  - `git diff filename`: show changes between the working directory and the staging area
  - `git commit -m "message"`: permanently save staged changes with a descriptive message
  - `git log`: view commit history (author, date, message, and SHA)
- every commit has a unique 40-character **SHA** hash identifying it; the commit you are currently on is **`HEAD`**

> **Beyond the cheatsheets**
> - one-time setup so commits are attributed to you: `git config --global user.name "..."` and `git config --global user.email "..."` ([Git docs](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup))
> - a **`.gitignore`** file lists paths Git should not track (e.g. `node_modules/`, `.env`, build output); essential in every real project ([GitHub templates](https://github.com/github/gitignore))
> - write commit messages in the imperative ("Add login form", not "Added"); short summary line, optional blank line, then detail ([conventional style](https://www.conventionalcommits.org/))

### Backtracking & undoing changes

- `git show HEAD`: display the most recent commit plus its file changes
- `git checkout HEAD filename`: discard working-directory changes to a file, restoring it to the last commit
- `git reset HEAD filename`: unstage a file (keeps the working-directory edits, just removes from staging)
- `git reset commit_SHA`: move `HEAD` back to an earlier commit (first 7 chars of the SHA)
- `git stash`: shelve uncommitted work to get a clean working tree (e.g. to switch tasks); `git stash pop` restores it
- `git commit --amend`: update the most recent commit instead of making a new one (re-stage first, then amend)
- **log options**: `git log --oneline` (compact), `--graph` (visual branch structure), `-S "keyword"` (search messages)

> **Beyond the cheatsheets**
> - newer, clearer commands split `checkout`'s overloaded jobs: **`git restore file`** discards changes, **`git restore --staged file`** unstages. `git checkout` still works but does too many things ([Git docs](https://git-scm.com/docs/git-restore))
> - `git revert SHA` undoes a commit by creating a new inverse commit, the safe choice on shared branches (unlike `reset`, which rewrites history) ([Git docs](https://git-scm.com/docs/git-revert))
> - avoid `reset`/`amend`/rebase on commits you have already pushed to a shared branch; rewriting public history causes conflicts for collaborators

### Branching & merging

- a **branch** is an independent line of development; build a feature without touching the stable code
- the default branch is **`main`** (older repos and some tools use `master`); the first commit creates it
- **commands**:
  - `git branch`: list branches (`*` marks the current one)
  - `git branch branch-name`: create a branch (no whitespace in names; use `-` or `_`)
  - `git checkout branch-name`: switch to a branch
  - `git merge branch-name`: pull another branch's changes into the current one
  - `git branch -d branch-name`: delete a branch (good practice once merged)
- a **merge conflict** happens when the same lines changed on both branches; Git marks the file:
  - `<<<<<<< HEAD` ... `=======` is the current branch's version
  - `=======` ... `>>>>>>> branch-name` is the incoming version
  - resolve by editing the file to the desired result, then `add` and `commit`

> **Beyond the cheatsheets**
> - **`git switch branch-name`** (and `git switch -c new-branch` to create) is the modern replacement for `git checkout` when changing branches; less ambiguous ([Git docs](https://git-scm.com/docs/git-switch))
> - **feature-branch workflow**: branch off `main`, build, open a pull request, merge back. The backbone of team development ([GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow))
> - `git rebase` is an alternative to `merge` that replays commits for a linear history; powerful but rewrites history, so use with care ([Atlassian guide](https://www.atlassian.com/git/tutorials/merging-vs-rebasing))

### Remotes & GitHub collaboration

- a **remote** is a shared repository (often on GitHub) that lets collaborators sync work from different machines
- Git names the default remote **`origin`**
- **a common collaboration loop**:
  1. fetch and merge the latest from the remote
  2. branch for your feature
  3. commit your work
  4. fetch and merge again (catch new commits, avoid conflicts)
  5. push your branch for review
- **commands**:
  - `git clone remote_location clone_name`: copy a remote repository locally
  - `git remote -v`: list the remotes this project is tied to (shows fetch + push URLs)
  - `git fetch`: download remote changes into `origin/branch-name` (does not merge them yet)
  - `git merge origin/branch-name`: merge fetched changes into your current branch
  - `git push origin branch-name`: upload your committed branch to the remote
- **GitHub the platform** adds, on top of Git:
  - **repositories** hosted remotely, public or private
  - **pull requests**: propose merging a branch, with review and discussion
  - **issues**: track bugs, tasks, and feature requests
  - **README.md** and Markdown render on the repo page

> **Beyond the cheatsheets**
> - **`git pull`** = `git fetch` + `git merge` in one step; convenient, though fetching first lets you inspect before merging ([Git docs](https://git-scm.com/docs/git-pull))
> - authentication uses a **personal access token** or **SSH key**, not your password, over HTTPS/SSH ([GitHub auth](https://docs.github.com/en/authentication))
> - **fork** (your own copy of someone else's repo) + pull request is the standard open-source contribution path ([GitHub docs](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project))
> - the GitHub CLI (`gh`) drives issues, PRs, and repos from the terminal ([cli.github.com](https://cli.github.com))

#### Git through an editor UI

- you do not have to drive Git from the terminal; editors wrap the same commands in a graphical interface (the underlying Git operations are identical)
- **VS Code**: the Source Control panel (the branch icon in the sidebar) stages, commits, and pushes; it shows diffs inline, marks changed files in the explorer, and surfaces merge-conflict resolution with "Accept Current / Incoming / Both" buttons. Extensions like GitLens add blame annotations and richer history ([VS Code docs](https://code.visualstudio.com/docs/sourcecontrol/overview))
- **Xcode**: the Source Control navigator and menu handle commit, push, pull, branch, and merge for Swift/iOS projects; conflict resolution has a side-by-side comparison view ([Apple docs](https://developer.apple.com/documentation/xcode/source-control-management))
- a common, reliable habit: use the UI for quick stage-and-commit and visual diffs, but keep the terminal as the source of truth for anything tricky (interactive rebase, complex conflicts, inspecting state), since the CLI exposes exactly what Git is doing

### Deployment

- **deployment** is publishing your built site so it is live on the web at a URL
- a **static site** is plain HTML/CSS/JS with no server-side runtime; the simplest thing to host
- **Netlify** hosts static sites and web apps (free tier plus paid plans):
  - **link a GitHub repo** so Netlify builds and hosts from your code
  - **continuous deployment**: every push to the linked repo automatically rebuilds and redeploys the site
  - **site logs** show build status and help diagnose failures

> **Beyond the cheatsheets**
> - common alternatives, all with the same git-push-to-deploy model: **Vercel** (especially for Next.js/React), **GitHub Pages** (free static hosting straight from a repo), and **Cloudflare Pages** ([Vercel](https://vercel.com/docs), [GitHub Pages](https://docs.github.com/en/pages), [Cloudflare Pages](https://developers.cloudflare.com/pages/))
> - static hosting suits front-end apps and SPAs; apps that need a backend (databases, auth, server APIs) require a different model, covered in the Node.js notes
> - the build step (e.g. `npm run build` with Vite) produces the static output that gets deployed; configure the build command and publish directory in the host's settings

## Cheatsheet links

31. [Learn Git & GitHub](https://www.codecademy.com/learn/learn-git/modules/learn-git-git-workflow-u/cheatsheet)
32. [Build a Website with HTML, CSS, and GitHub Pages - How to Build Websites on Your Own Computer](https://www.codecademy.com/learn/build-websites-on-your-own-computer/modules/command-line-for-building-websites/cheatsheet)
33. [Deploying with Netlify](https://www.codecademy.com/learn/deploying-with-netlify/modules/deploying-static-sites-with-netlify/cheatsheet)
