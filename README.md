This website is currently deployed at: [https://askuh.info/](https://askuh.info/), with our pages under the Ask Us dropdown specifically (landing, chatbot, admin).

# Environment Setup

## 1. Install OpenAI
```bash
npm install openai
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
