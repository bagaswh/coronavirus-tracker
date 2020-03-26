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
  -c, --custom-sound <customSound>  use custom sound for notification (leave to use provided sounds, false                                   to use default system notification)

  -d, --data-path <dataPath>        path to store JSON data (defaults to {root}/data/data.json)
  -c, --clear                       clear local database before starting (default: false)
  -h, --help                        display help for command
```

Press Enter if you want to fetch data immediately without waiting for interval.
Next interval will be reset.

## Data source

- [Worldometers](https://www.worldometers.info/coronavirus/)
