<h1 align="center">
  <img src="https://github.com/CD1212/Doughnut/raw/master/src/assets/icon.png" alt="Doughnut" width="200">
  <br>
  Doughnut
  <br>
</h1>

<h4 align="center">Podcast app. For Mac.</h4>

<p align="center">
  <a href="https://travis-ci.org/CD1212/Doughnut"><img src="https://img.shields.io/travis/CD1212/Doughnut/master.svg" alt="Travis CI Status" /></a>
  <a href="https://github.com/CD1212/Doughnut/releases"><img src="https://img.shields.io/github/release/cd1212/doughnut.svg" alt="github release"></a>
  <a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="Standard - JavaScript Style Guide"></a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/CD1212/Doughnut/master/screenshot.jpg?v=4" align="center" alt="screenshot" style="max-width:100%;" />
</p>

Doughnut is a podcast client built using Electron. The design and user experience are inspired by Instacast for Mac which was discontinued in 2015. After experimenting with alternate user interface layouts, I kept coming back to the three column layout as most useable and practical.

Beyond the standard expected podcast app features, my goals for the project are:
- [x] Support an iTunes style library that can be hosted on an internal or network shared drive 
- [x] Ability to favourite episodes
- [ ] Ability to create podcasts without a feed, for miscellaneous releases of discontinued podcasts
- [ ] Support Windows & Linux as well as macOS

I hope to provide the first release (0.1.0) in the next few weeks, although a release build can be compiled using the commands below.

## How to Contribute

### Get the code
```
$ git clone git@github.com:CD1212/Doughnut.git
$ cd Doughnut
$ npm install
```

### Run the app
```
$ npm run rebuild
$ npm start
```

### Compile a release build
```
$ npm run package
```