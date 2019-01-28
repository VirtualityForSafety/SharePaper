# SharePaper
SharePaper is an open-source project of a web-based reference manager for a collaborative submission.
SharePaper aims to integrate and share multiple authors' thoughts and quotes from various papers.
Two major features are given from the use of SharePaper:
- A shared paper repository (as a nature of GitHub repository)
- Easy accessibility of tracking thoughts of citation by tag
The project was initiated by [Jinki Jung](https://github.com/jinkijung), and then has been implemented by [Soyeon Kim](https://github.com/soykim314), [Sua Lee](https://github.com/otterlee), [Sangho Lee](https://github.com/kimmydkemf), and [Jinki Jung](https://github.com/jinkijung).

## Current setup
- Remotely (read-only): SharePaper provides a web interface to explore whole contents.
- Locally: we recommend to setup local servers and maintaining it locally, for frequent updates.

## Required
- Node.js (required to execute a web server and update CSV files locally)

## Execute a local server
- Install [Node.js](https://nodejs.org/en/)
- Move to the repository root folder
- Install csv package via 'npm install -g csv'
- Execute 'npm install'
- Execute the server by 'node js/server.js'
- Browse 'http://localhost:4000'
- Enjoy!

## How to use
 - A demo video will be posted.

## Metadata License
SharePaper asserts no claims of ownership to individual items of paper metadata and associated files. 

## Contributor
 - [Soyeon Kim](https://github.com/soykim314): data filtering and integrity
 - [Sua Lee](https://github.com/otterlee): interactive table and timezone converting
 - [Sangho Lee](https://github.com/kimmydkemf): data sorting and file I/O
 - [Jinki Jung](https://github.com/jinkijung): frameworking and refactoring

## Special thanks to
 - We thank to [Kangsoo Kim](http://www.kangsookim.com/) and Hyunwoo Cho who give us a practical advise for efficient paper sharing.
