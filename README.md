# Covid-19 Monitor

I know there are already many Covid-19 cases monitoring apps, dashboards, etc.
But this runs on your system, giving notifications when new Covid-19 recovered cases, new cases, and/or deaths appear.

## Install

```
npm install -g coronavirus-tracker
```

## Usage

```
coronavirus-tracker [options]

Options:
  -V, --version                     output the version number
  -i, --interval <interval>         data fetching interval (in seconds) (default: 600)
  -u, --use-custom-sound            use custom sound for notification
  -c, --custom-sound-paths <customSoundPaths>  paths for custom sound

  -d, --data-path <dataPath>        path to store JSON data (defaults to {root}/data/data.json)
  -c, --clear                       clear local database before starting (default: false)
  -h, --help                        display help for command
```

Press Enter if you want to fetch data immediately without waiting for interval.
Next interval will be reset.

## Custom notification sound

To use custom notification sound, it needs a little work. Check this blog post for the steps: [Node.js: Playing Sounds to Provide Notifications
](https://thisdavej.com/node-js-playing-sounds-to-provide-notifications/).

## Data source

- [Worldometers](https://www.worldometers.info/coronavirus/)
