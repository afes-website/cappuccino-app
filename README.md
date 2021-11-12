# CAPPUCCINO app

***C**ontrol **APP**lication for **U**nited **C**ontactless **C**heck-**IN** **O**peration*

![ver](https://img.shields.io/github/package-json/v/afes-website/cappuccino-app?style=for-the-badge)

![[deploy] app.afes.info](https://img.shields.io/github/workflow/status/afes-website/cappuccino-app/Deploy%20to%20production%20server?label=%5Bdeploy%5D%20app.afes.info&style=flat-square)
![[deploy] dev.app.afes.info](https://img.shields.io/github/workflow/status/afes-website/cappuccino-app/Deploy%20to%20develop%20server?label=%5Bdeploy%5D%20dev.app.afes.info&style=flat-square)

[![@afes-website/docs](https://img.shields.io/badge/@afes--website/docs-v3.3.4-555.svg?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxODAgMTgwIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9PC9zdHlsZT48L2RlZnM+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTM0LjYsODkuNzIsMTU2LjksNTEuMUgxMTJMOTAsMTMsNjgsNTEuMUgyMy4xTDQ1LjQsODkuNzNsLTIyLjI5LDM4LjZINjcuNjhMOTAsMTY3bDIyLjMyLTM4LjY3SDE1Ni45Wm04LjUyLDI4LjM1TDk3LjQ5LDkxLjczaDMyLjQ1Wk0xMjkuOTMsODcuNzNIOTcuNDdsNDUuNjUtMjYuMzZaTTk1LjQ3LDg0LjI3LDExMS43LDU2LjE1bDI5LjQyLDEuNzVabTEyLjYtMjkuODRMOTIsODIuMjhWMzAuMDdaTTg4LDgyLjI1LDcxLjkyLDU0LjQyLDg4LDMwLjA2Wk02OC4zLDU2LjE1LDg0LjU0LDg0LjI2LDM4Ljg4LDU3LjkxWk0zNi44OCw2MS4zNyw4Mi41Myw4Ny43Mkg1MC4wNlpNNTAuMDcsOTEuNzJIODIuNTFMMzYuODksMTE4LjA3Wm0zNC40OSwzLjQ0TDY4LjMyLDEyMy4yOWwtMjkuNDMtMS43NlptLTEyLjgsMzAuMTdMODgsOTcuMjJ2NTIuNzFaTTkyLDk3LjIybDE2LjI0LDI4LjEyTDkyLDE0OS45NFptMTkuNjgsMjYuMDdMOTUuNDIsOTUuMTZsNDUuNywyNi4zN1oiLz48L3N2Zz4K&logoColor=fff&style=flat-square&labelColor=457fb3)](https://github.com/afes-website/docs/tree/v3.3.4)
![ts](https://img.shields.io/badge/dynamic/json?color=555&label=TypeScript&labelColor=007ACC&logo=typescript&logoColor=fff&style=flat-square&query=devDependencies.typescript&url=https://raw.githubusercontent.com/afes-website/manage-app/develop/package.json)
![React](https://img.shields.io/badge/dynamic/json?color=555&label=React&labelColor=282c34&logo=react&logoColor=61dafb&style=flat-square&query=dependencies.react&url=https://raw.githubusercontent.com/afes-website/manage-app/develop/package.json)
![Material-UI](https://img.shields.io/badge/dynamic/json?color=555&label=Material-UI&labelColor=212121&logo=material-ui&logoColor=0081CB&style=flat-square&query=dependencies["@material-ui/core"]&url=https://raw.githubusercontent.com/afes-website/manage-app/develop/package.json)
![ESLint](https://img.shields.io/badge/dynamic/json?color=555&label=ESLint&labelColor=fff&logo=eslint&logoColor=4B32C3&style=flat-square&query=devDependencies.eslint&url=https://raw.githubusercontent.com/afes-website/manage-app/develop/package.json)
![Prettier](https://img.shields.io/badge/dynamic/json?color=555&label=Prettier&labelColor=1A2B34&logo=prettier&logoColor=F7B93E&style=flat-square&query=devDependencies.prettier&url=https://raw.githubusercontent.com/afes-website/manage-app/develop/package.json)
<!--![aspida](https://img.shields.io/badge/-aspida-007acc.svg?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2ODUg%0D%0ANjg1Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9LmNscy0ye2ZpbGw6IzAwN2FjYzt9%0D%0APC9zdHlsZT48L2RlZnM+PGNpcmNsZSBjbGFzcz0iY2xzLTEiIGN4PSIzNDIuNSIgY3k9IjM0Mi41%0D%0AIiByPSIzNDIuNSIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIzNjcuMyA1MTcuOTkg%0D%0AOTAuMzggNTE3Ljk5IDIwNC40MiAxNjcuMDEgNDgxLjM1IDE2Ny4wMSA0NTQuNjYgMjQ5LjE0IDI1%0D%0AOS44NiAyNDkuMTQgMTk5LjE5IDQzNS44NiAzOTMuOTkgNDM1Ljg2IDM2Ny4zIDUxNy45OSIvPjxw%0D%0Ab2x5Z29uIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSI0ODAuNTggNTE3Ljk5IDM5OC40NSA1MTcuOTkg%0D%0ANTEyLjUgMTY3LjAxIDU5NC42MyAxNjcuMDEgNDgwLjU4IDUxNy45OSIvPjwvc3ZnPg==&style=flat-square)-->

## Project setup

```
yarn install
```

## Start development server

```
yarn start
```

If you need to use **WebRTC** on your network (not `localhost`), it must be configured for **https** correctly.

**PWA does not work**. PWA only works in production mode.

### Example of `.env.development.local`

```dotenv
HTTPS=true
SSL_CRT_FILE=./hoge/cert.crt
SSL_KEY_FILE=./hoge/cert.key
```
[Using HTTPS in Development \| Create React App](https://create-react-app.dev/docs/using-https-in-development/)

## Build for production

```
yarn build
```

If you need to use **WebRTC** or **PWA** on your network (not `localhost`), it must be run in an environment that is properly configured for **https**.
