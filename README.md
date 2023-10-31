[![ci-meteor-application-template-react](https://github.com/ics-software-engineering/meteor-application-template-react/actions/workflows/ci.yml/badge.svg)](https://github.com/ics-software-engineering/meteor-application-template-react/actions/workflows/ci.yml)

# Environment Setup

## 1. Install Meteor
```bash
npm install openai
place holder for now
```

## 2. Meteor Application Template React
For details, please see http://ics-software-engineering.github.io/meteor-application-template-react/

```bash
$ cd app/
$ meteor npm install
```
Make sure meteor starts up without errors.
```bash
$ meteor npm run start
```

## OpenAI API Key Environment Set Up
```bash
powershell
$env:OPENAI_API_KEY="<your key here>"
Write-Output $env:OPENAI_API_KEY

linux
echo "export OPENAI_API_KEY='<your key here>'" >> ~/.zshrc
source ~/.zshrc
echo $OPENAI_API_KEY

window
set OPENAI_API_KEY "<your key here>"
echo %OPENAI_API_KEY%
```
https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety