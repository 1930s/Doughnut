<h1 align="center">
  <img src="https://github.com/CD1212/Doughnut/raw/master/Assets/icon.png" alt="Doughnut" width="200">
  <br>
  Doughnut
  <br>
</h1>

<h4 align="center">Podcast app. For Mac.</h4>

<p align="center">
  <a href="https://travis-ci.org/CD1212/Doughnut"><img src="https://img.shields.io/travis/CD1212/Doughnut/master.svg" alt="Travis CI Status" /></a>
  <a href="https://github.com/CD1212/Doughnut/releases"><img src="https://img.shields.io/github/release/cd1212/doughnut.svg" alt="github release"></a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/CD1212/Doughnut/master/screenshot.png?v=2" align="center" alt="screenshot" style="max-width:100%;" />
</p>

Doughnut is a podcast client built using Swift. The design and user experience are inspired by Instacast for Mac which was discontinued in 2015. After experimenting with alternate user interface layouts, I kept coming back to the three column layout as most useable and practical.

Beyond the standard expected podcast app features, my goals for the project are:
- [x] Support an iTunes style library that can be hosted on an internal or network shared drive 
- [x] Ability to favourite episodes
- [x] Ability to create podcasts without a feed, for miscellaneous releases of discontinued podcasts

Previously Doughnut was built on top of Electron which worked ok, but using 200+ MB for a podcast app, even when it's minimized felt very poor. This version is archived in the `electron` branch. Doughnut is now written as a 100% native MacOS app in Swift.

## How to Contribute

### Get the code
```
$ git clone git@github.com:CD1212/Doughnut.git
$ cd Doughnut
$ open Doughnut.xcworkspace
```
