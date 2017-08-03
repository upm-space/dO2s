#Contributing Guidelines

### Table of Contents
[Styleguides](#styleguides)

*   [Git Commit Messages](#git-commit-messages)
*   [JavaScript Styleguide](#javascript-styleguide)

## Syncing you fork

[Github Help - How to sync a Fork](https://help.github.com/articles/syncing-a-fork/)

## Small Corrections

Errata and basic clarifications will be accepted if we agree that they improve the content. You can also open an issue so we can figure out how or if it needs to be addressed.

If you've never done this before, the [flow guide](https://guides.github.com/introduction/flow/) might be useful.


## How to make a pull request

Please follow the formal procedure to make a Pull Request that is explained in this [Github video](https://www.youtube.com/watch?v=81uKcXZoQ2A).

[How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

Take note of what you have to do before doing the Pull Request if the main repository has been updated while you did work on your branch.

## What to do after my pull request is merged

[StackOverflow Question - My Pull Request has been merged, what to do next?](https://stackoverflow.com/questions/12770550/my-pull-request-has-been-merged-what-to-do-next)

As recommended in the link after you pull request is merged on the main repository.
Go to your fork:

1.  Check out you master branch and [sync it with the main repository](https://help.github.com/articles/syncing-a-fork/).
2.  Delete the branch you were working with locally and in your remote fork. You shouldn't get any warnings when deleting them since you work is already merged on the master branch in your fork.

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

All JavaScript must adhere to [JavaScript Airbnb Style](https://github.com/airbnb/javascript#blocks).

*   Prefer the object spread operator (`{...anotherObj}`) to `Object.assign()`
*   Inline `export`s with expressions whenever possible

```javascript
// Use this:
export default class ClassName {

}

// Instead of:
class ClassName {

}
export default ClassName
```

## References

-   [Git and GitHub with Briana Swift](https://www.youtube.com/playlist?list=PLg7s6cbtAD17Gw5u8644bgKhgRLiJXdX4)
-   [GitHub Training & Guides](https://www.youtube.com/user/GitHubGuides)
