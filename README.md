# HackX - The (worst) package manager for Bitburner

*HackX*, the worlds worst pacakge manager.

# NOTE:
> [!WARNING]
> This project is very, very early development, an is not finished yet.

Lots of features are still missing, such as checking version, updates, etc. The code is also not very clean, and is not well documented. Please be careful when using this, and report any bugs you find.

(Note: This is not a hackathon project, this is just a personal project I'm working on.)

Lots of the spec in `package_repo.json` is not implemented yet, ands will be added in the future. The only currently implemented feature are `post_install`, `download_from` and `github`. The rest will be added in the future sometime.

## Installation

For right now, you can just download all the files from the repo, and run them from the terminal. (I'm working on an installer, but it's not ready yet)

## Usage

Hackx has a couple of commands you can use to manage your scripts, that are designed to be similar to the ones you're used to from other package managers.

### Installing a script

To install a script, you can use the `install` command followed by the name of the script you want to install.

```bash
hax install scriptname
```

OR, if you've navigated to where the base hackx.js file is you can do:

```bash
run hackx.js install scriptname
```

### Removing a script

To remove a script you can use the `remove` command followed by the name of the script you want to remove.

```bash
hax remove scriptname
```

OR, if you've navigated to where the base hackx.js file is you can do:

```bash
run hackx.js remove scriptname
```

### Configuring Hackx

You can configure hackx by going to `/.config/hackx/config.json` and editing the file. An example of the config file is shown below:

```jsonc
{
  "scriptInstalllocation": "/.hackx/", // The location where hackx will install scripts (defaults to /.hackx/ScriptName/)
  "repos": [], // The repos that hackx will use to find and install scripts
  "disallowPostInstall": true // Whether or not hackx will run the post-install script after installing a script (defaults to true)
}
```

## Getting your script added to hackx

To get your script added to hackx, you can create a pull request to the main repository, and modify the `package_repo.json` file to include your script. Example of how you should set your script up:

```jsonc
{
  "hackx": {
    // This is the name that people will use in `hax install`
    "name": "HackX", // The name of your package
    "description": "I haven't thought that far yet", // The description of your package
    "author": "Ghoul", // The author of your package
    "version": "1.0.0", // The version of your package
    "depends": {}, // The dependencies of your package (Note: This is not yet implemented)
    "post_install": "./post.js", // The post-install script
    "post_install_required": true, // Whether or not the post-install script is required
    "github": "https://www.github.com/NotGhoull/HackX", // Where to find the source code for your package
    "download_from": "/out/hackx" // Where to download the package from

    // Note: github and download_from are required. Given the way we download packages we need them, an example link is this
    // https://www.github.com/NotGhoull/out/hackx
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ----------
    //              ^                      ^
    //           github              download_from
    //
    // Everything then in those folders will be downloaded, because of the download_from attribute.
  }
}
```

## Contributing

To contribute to hackx, you can fork the repository and make changes to the code. Once you're done, you can create a pull request to merge your changes into the main repository.

## License

Hackx is licensed under the MIT License.

# Thank you! :D