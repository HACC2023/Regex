This website is currently deployed at: [https://askuh.info/](https://askuh.info/), with our pages under the Ask Us dropdown specifically (landing, chatbot, admin).

<!-- PROJECT LOGO -->
<br />
<div align="center">
  
<img src="https://regex-ics314.github.io/docs/logo.png" alt="Logo" width="200" height="200">


  <p align="center">
    Welcome to Ask UH!
    <br />
    <a href="#"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://askuh.info">View Demo</a>
    ·
    <a href="https://github.com/HACC2023/Regex/issues">Report Bug</a>
    ·
    <a href="https://github.com/HACC2023/Regex/issues">Request Feature</a>
  </p>
</div>

### Table of Contents

* [About The Project](#about-the-project)
* [Built With](#built-with)
* [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation)
* [OpenAI API Key Environment Set Up](#openai-api-key-environment-set-up)
* [License](#license)

<!-- ABOUT THE PROJECT -->
## About The Project
Leveraging the OpenAI API, our chatbot is trained to interpret and extract pertinent information from the ITS Ask Us database articles. By synthesizing content from these articles, the chatbot can address queries with information that may not be explicitly detailed within the articles themselves, showcasing a nuanced understanding and application of the knowledge base.

[![Screen Shot](https://regex-ics314.github.io/docs/landing.png)](https://askuh.info)


### Built With

* [![Meteor][Meteor.com]][Meteor-url]
* [![React][React.js]][React-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]


<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.


### Prerequisites

* Install Meteor according to https://docs.meteor.com/install.html
  
### Installation

1. Get your OPENAI API Key at [https://platform.openai.com/](https://platform.openai.com/)
2. Clone the repo
   ```sh
   git clone https://github.com/HACC2023/Regex.git
   ```
3. Cd into the app directory
   ```sh
    cd app
   ```
4. Meteor install
    ```sh
     meteor npm install
    ```

4. Enter rename `sample.env` to `.env` and enter your API in `.env`
   ```js
   OPENAI_API_KEY=<PUT_YOUR_KEY_HERE>
   ```
5. Make sure meteor starts up without errors.
    ```bash
    $ meteor npm run start
    ```
<p align="right">(<a href="#readme-top">back to top</a>)</p>



### OpenAI API Key Environment Set Up
If you are using a bash shell, you can set your API key as an environment variable by running the following command in your terminal:

```sh
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

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
[Meteor.com]: https://img.shields.io/badge/Meteor-DF4A32?style=for-the-badge&logo=meteor&logoColor=white
[Meteor-url]: https://www.meteor.com/
