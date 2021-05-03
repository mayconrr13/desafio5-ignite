<img alt="Banner" title="space-travelling" src="./public/Banner.png" />

<h4 align="center">
	Projeto concluído!
</h4>
<p align="left"><strong>space travelling</strnon> é um projeto que faz parte dos desafios do terceiro capítulo do trilha ReactJS do Ignite, bootcamp da Rocketseat.</p>
<p>Neste projeto foi necessário criar o projeto do completo zero, levando em consideração apenas o design recebido pelo Figma, simulando uma situação real de desenvolvimento no mercado de trabalho.</p>
<p>Para o desenvolvimento da aplicação foi utilizado o NextJS, aplicando seus recursos de renderização no lado do servidor. Em específico, foram utilizados o getStaticProps para a Home e o getStaticProps em conjunto com o getStaticPaths na geração das páginas estáticas com caminhos dinâmicos. Além disso, fez o uso do fallback true, deixando uma determinada quantidade de páginas já renderizadas no processo de build e as demais sendo geradas após o primeiro acesso do visitante na postagem.</p>
<p>O Prismic foi o headless CMS adotado no desenvolvimento deste projeto, permitindo que o usuário crie novas postagens. Outro recurso do Prismic que foi utilizado é o modo de preview, que permite que o usuário vizualize sua postagem antes da publicação.</p>
<p>Para os comentários foi utilizado o Utteranc que permite armazená-los em um repositório independente no Github, deixando-os disponíveis na página da postagem.</p>

### Tecnologias utilizadas
---

* NextJS
* TypeScript
* Sass
* Prismic CMS
* Date FNS
* Utteranc
* Figma

### Features
---

- [x] Paginação de postagens com opção "carregar mais"
- [x] Navegação entre post adjacentes
- [x] Comentários com Utteranc
- [x] Prismic como headless CMS, premitindo ao usuário criar postagens, além da funcionalidade preview antes da publicação definitiva
- [x] Renderização no lado do servidor com getStaticProps e getStaticPaths

### Screenshots
---
* Mobile
![](/public/spacemobile.gif)


* Web
![](/public/spaceweb.gif)

### Como instalar
---

```bash
# Clone este repositório
$ git clone https://github.com/mayconrr13/desafio5-ignite

# Instale as dependências
$ yarn

# Execute a aplicação
$ yarn dev

# Acesse a aplicação
$ http://localhost:3000
```

### Autor
---

<p>Projeto criado por Maycon dos Reis Rosário</p>
<p>Portifólio Digital: <a href="http://mayconrr.vercel.app">Acessar</a></p>

### Entre em contato!

[<img src="https://img.shields.io/badge/linkedin-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white" />](https://www.linkedin.com/in/mayconreisrosario/) [<img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" />](mailto:mayconrr13@gmail.com)
