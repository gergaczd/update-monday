# update-monday

This cli tool helps you easily update your packages in your project. The main benefit of the tool is to  easily check the changelog of the package, so you will know what will be updated.

## Install package
```
$ npm i -g update-monday
```

## Usage

## Check script options
```
$ um --help
```

## Run update
You can easily run the script if you are in your project folder (where `package.json` lives):
```
$ um
```

## Override default configs
If you override the default configs, you are still able to change it when you run the script. This is for type you less
```
$ um-config config:set
```

## Useful commands
You can find some useful configuration or setup running `$ um-config` command, like:
 - See package update history
 - Clear package update history
 - Read the default config of the `um` script
 - Set the default config of the `um` script
 - Reset the config to default


## Known issues
- Does not print changelog and version history for private packages.
- Does not parse well the github link for packages using mono repo.
