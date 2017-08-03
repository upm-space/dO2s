#Contributing Guidelines

### Table of Contents


*   [How to Contribute](#how-to-contribute)
    *  [How to Contribute to an Open Source Project on Github](#how-to-contribute-to-an-open-source-project-on-github)
    *  [Small Corrections](#small-corrections)
    *  [Syncing your Fork](#syncing-your-fork)
    *  [How to make a Pull Request](#how-to-make-a-pull-request)
    *  [What to do after your Pull Request is merged](#what-to-do-after-my-pull-request-is-merged)
*   [Styleguides](#styleguides)
    *   [Git Commit Messages](#git-commit-messages)
    *   [JavaScript Styleguide](#javascript-styleguide)
*   [References](#references)

## How to Contribute
### How to Contribute to an Open Source Project on Github
If you've never done this before, the [Github Workflow Guide](https://guides.github.com/introduction/flow/) might be useful.

> “Feel free to submit a PR!” - words often found in GitHub issues, but met with confusion and fear by many. Getting started with contributing open source is not always straightforward and can be tricky. With this series, you’ll be equipped with the the tools, knowledge, and understanding you need to be productive and contribute to the wonderful world of open source projects. Much of this series speaks about GitHub, but most of the concepts are generally applicable to contributing to any open source project, regardless of where it’s hosted.
So enjoy the course and start contributing to the projects you use and love today!

[Follow link to course](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

[StackOverflow Question - How do I create a Git branch both locally and remotely?](https://stackoverflow.com/questions/2003505/how-do-i-delete-a-git-branch-both-locally-and-remotely)

**TL;DR**: You create a branch yo do your work, work on small fixes/features at a time, branches should be named based on the content or work you will be doing. To create a new branch.
```bash
git checkout -b <branch-name>
git push <remote-name> <branch-name>
```

### Small Corrections

Errata and basic clarifications will be accepted if we agree that they improve the content. You can also open an issue so we can figure out how or if it needs to be addressed.

### Syncing your Fork

Follow the Github Documentation to sync your fork of the repository to keep it up to date with the upstream repository. [Github Help - How to sync a Fork](https://help.github.com/articles/syncing-a-fork/)

**TL;DR**
````bash
git remote add upstream https://github.com/upm-space/dO2s
git fetch upstream
git checkout master
git merge upstream/master
````


### How to make a pull request

Please follow the formal procedure to make a Pull Request that is explained in this [Github Video Tutorial](https://www.youtube.com/watch?v=81uKcXZoQ2A).

Take note of what you have to do before doing the Pull Request if the main repository has been updated while you did work on your branch.

**TL;DR**

1. The Git workflow establishes that to work you create branches and never implement work on the master branch unless it's final.

1. What's more, when you fork a repository you never touch the master branch, it's only there to bring work in from the original repository.

1. So after you finish working on your branch and pushed your work to your fork branch, on GitHub's website you request a Pull Request.

1. A discussion will open with the repository maintainers to review the pull request. They may ask you to change anything or they can approve as is.

1. After everything is correct they will merge your code in.

### What to do after my pull request is merged

[StackOverflow Question - My Pull Request has been merged, what to do next?](https://stackoverflow.com/questions/12770550/my-pull-request-has-been-merged-what-to-do-next)
[StackOverflow Question - How do I delete a Git branch both locally and remotely?](https://stackoverflow.com/questions/2003505/how-do-i-delete-a-git-branch-both-locally-and-remotely)

**TL;DR**: _**Do Not Merge Your Branch**_

As recommended in the link after your pull request is merged on the main repository you have to do the following:

1.  Go to your fork repository on you computer.

1.  Check out the master branch and [sync it with the main repository](#sync-your-fork).
1.  Delete the branch you were working with locally and in your remote fork. You shouldn't get any warnings when deleting the branch since the work on it is already merged on the master branch in your fork when you synced it with the main repository.
```bash
git push origin --delete <branch_name>
git branch -d <branch_name>
```


## Styleguides

### Git Commit Messages

*   Use the present tense ("Add feature" not "Added feature")
*   Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
*   Limit the first line to 72 characters or less
*   Reference issues and pull requests liberally after the first line
*   When only changing documentation, include `[ci skip]` in the commit description
*   Consider starting the commit message with an applicable emoji:

    *   :star: `:star:` when adding features
    *   :art: `:art:` when improving the format/structure of the code
    *   :racehorse: `:racehorse:` when improving performance
    *   :non-potable_water: `:non-potable_water:` when plugging memory leaks
    *   :memo: `:memo:` when writing docs
    *   :penguin: `:penguin:` when fixing something on Linux
    *   :apple: `:apple:` when fixing something on macOS
    *   :checkered_flag: `:checkered_flag:` when fixing something on Windows
    *   :bug: `:bug:` when fixing a bug
    *   :fire: `:fire:` when removing code or files
    *   :green_heart: `:green_heart:` when fixing the CI build
    *   :white_check_mark: `:white_check_mark:` when adding tests
    *   :lock: `:lock:` when dealing with security
    *   :arrow_up: `:arrow_up:` when upgrading dependencies
    *   :arrow_down: `:arrow_down:` when downgrading dependencies
    *   :shirt: `:shirt:` when removing linter warnings

### JavaScript Styleguide

All JavaScript must adhere to [JavaScript Airbnb Style](https://github.com/airbnb/javascript#types).

*   Prefer the object spread operator (`{...anotherObj}`) to `Object.assign()`

## References

-   [Git and GitHub with Briana Swift](https://www.youtube.com/playlist?list=PLg7s6cbtAD17Gw5u8644bgKhgRLiJXdX4)
-   [GitHub Training & Guides](https://www.youtube.com/user/GitHubGuides)
