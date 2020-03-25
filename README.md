# Covid-19 Monitor

I know there have been lots of Covid-19 cases monitoring app, dashboards, etc.
But this runs on your system, giving notifications when new Covid-19 cases and/or deaths appear.

## Install

```
npm install -g coronavirus-tracker
```

## Usage

```
  coronavirus-tracker [options]

  Options:
    -i, --interval          Data fetching interval (in s)
    -c, --clear             Clear local database before starting
```

Press Enter if you want to fetch data immediately without waiting for interval.
Next interval will be reset.

## Data source

- [Worldometers](https://www.worldometers.info/coronavirus/)
