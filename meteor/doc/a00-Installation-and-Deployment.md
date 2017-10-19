# Installation and Deployment

## Pre-requisites

-   Install `git`. [Download Link][Git Download Link]
    -   [Configure Git][Git - Installation and Getting Started]
-   Install Meteor. [Meteor Installation Guide]
-   Have a GitHub Account. [Create a Github Account]

## Installation Guide

### Download and Setup your Project Repo

1.  Go to the [GitHub repository][GitHub dO2s Repository] for the project.

2.  Fork it.

3.  Clone your repository of your computer.

    -   Open a terminal and go to the directory where you want to save the project.
        ```bash
        cd <path to directory>
        ```
    -   Clone the repository

        This creates a folder in your working directory with the project inside.
        ```bash
        git clone <url of your repo fork>
        ```

    -   Make you project the working directory
        ```bash
        cd dO2s
        ```
    -   Sync your fork master to the original repo master. [Github - Syncing a Fork]

    Now that you have the project in your computer let's start up Meteor. You might want to check the `git`  [documentation][GitPro], it's an easy read, just the first 3 chapters is enough, and it puts you up to date to how to use `git`.

    To contribute to the project, you can refer to [GitPro - Chapter 6]. If this is your first Pull Request you can learn how in this free video series: [Open Source Pull Requests - GitHub Training YouTube].

### Running the Meteor App
The meteor project is located inside the `/meteor` folder (:tada: Surprise Surprise!). So let's go into that folder:
```bash
cd meteor
```

Now you have a barebones Meteor project, you need to install all the package dependencies for the project, these dependencies are documented in `/.meteor/packages` and `/packages.json`. Remember we are working on a terminal that is in your working directory, which should be something like `/your-path-to-project/dO2s/meteor/`, this is your meteor project root. Be careful, this is different from your git repo root, which is `/your-path-to-project/dO2s/`.

Let's install the dependencies and get the meteor app running. On the command line:

```bash
meteor npm install
```
You can use this command and Meteor takes care of everything. You don't need to have `npm` installed in your computer.

When this finishes loading you can run:
```bash
meteor run
```

Now you should see the working app in the browser by typing `http://localhost:3000/` this is the default port Meteor uses, you can change it. Also have in mind that this runs a default MongoDB database on port `3001`, you can also use a custom MongoDB database if you need to share this database among apps. This is explained in the documentation.

And that's it.

## References

-   [GitPro]
-   [Version Control MIT Tutorial]
-   [Git - Installation and Getting Started]
-   [GitHub WorkFlow Guide]
-   [How to Contribute to an Open Source Project on GitHub]
-   [Open Source Pull Requests - GitHub Training YouTube]
-   [Meteor Guide]
-   [Meteor Documentation]
-   [Meteor + React Tutorial]
-   [New JavaScript ES6 features]
-   [Facebook React Tutorial]
-   [React Facebook Getting Started]
-   [A re-introduction to JavaScript]
-   [Pandoc's Markdown]

[Git Download Link]: https://git-scm.com/downloads
[GitHub dO2s Repository]: https://github.com/upm-space/dO2s
[GitPro]: https://git-scm.com/book/en/v2
[Create a Github Account]: https://git-scm.com/book/en/v2/GitHub-Account-Setup-and-Configuration
[GitPro - Chapter 6]: https://git-scm.com/book/en/v2/GitHub-Contributing-to-a-Project
[Version Control MIT Tutorial]: http://web.mit.edu/6.031/www/sp17/classes/05-version-control/
[Git - Installation and Getting Started]: http://web.mit.edu/6.031/www/sp17/getting-started/#config-git
[Github - Syncing a Fork]: https://help.github.com/articles/syncing-a-fork/
[GitHub WorkFlow Guide]: https://guides.github.com/introduction/flow/
[How to Contribute to an Open Source Project on GitHub]: https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github
[Open Source Pull Requests - GitHub Training YouTube]: (https://www.youtube.com/watch?v=81uKcXZoQ2A
[Meteor Guide]: https://guide.meteor.com
[Meteor Installation Guide]: https://www.meteor.com/install
[Meteor Documentation]: http://docs.meteor.com
[Meteor + React Tutorial]: https://www.meteor.com/tutorials/react/creating-an-app
[New JavaScript ES6 features]: http://git.io/es6features
[Facebook React Tutorial]: https://facebook.github.io/react/docs/tutorial.html
[React Facebook Getting Started]: https://facebook.github.io/react/docs/getting-started.html
[A re-introduction to JavaScript]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript
[Pandoc's Markdown]: https://pandoc.org/MANUAL.html#pandocs-markdown
