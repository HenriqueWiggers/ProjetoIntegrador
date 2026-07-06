# Documentação do Projeto Integrador — Sistema de Controle de Pedidos de Coifas

**Instituição:** [nome da instituição]
**Curso:** [nome do curso]
**Disciplina:** Projeto Integrador
**Autores:** [nomes dos integrantes do grupo]
**Data:** [data de entrega]

---

## 1. Introdução

Este documento descreve o desenvolvimento do sistema construído como Projeto Integrador, cujo objetivo é auxiliar no controle de pedidos de coifas sob medida, um produto normalmente fabricado por marcenarias, serralherias ou metalúrgicas de pequeno porte. A escolha do tema partiu da observação de que esse tipo de negócio costuma controlar seus pedidos de forma manual, seja em papel, seja em planilhas simples, o que dificulta o acompanhamento do andamento de cada encomenda e aumenta a chance de erro na hora de repassar as medidas para a produção.

O sistema foi dividido em duas partes principais: um back-end desenvolvido em Java com Spring Boot, responsável por armazenar e disponibilizar os dados por meio de uma API REST, e um front-end em Angular, responsável pela interface com o usuário. Além do cadastro básico de pedidos, o sistema conta com uma funcionalidade que julgamos ser o principal diferencial do trabalho: a possibilidade de cadastrar as medidas de uma coifa e visualizá-la em um modelo 3D dentro do próprio navegador, o que permite conferir visualmente se as dimensões informadas fazem sentido antes de a peça ser produzida.

Ao longo deste documento são apresentados os objetivos do sistema, os requisitos levantados, a descrição detalhada de cada funcionalidade implementada, as tecnologias utilizadas e algumas melhorias que ficaram como sugestão para trabalhos futuros, já que o tempo disponível para a disciplina não permitiu explorar todos os pontos que o grupo identificou durante o desenvolvimento.

## 2. Objetivos do sistema

O objetivo geral do sistema é permitir o cadastro, o acompanhamento e a atualização de pedidos de coifas sob medida, centralizando em um só lugar as informações que hoje, em um cenário real, tendem a ficar espalhadas entre anotações do vendedor, mensagens de WhatsApp e memória de quem está produzindo a peça.

De forma mais específica, o sistema se propõe a:

- Permitir o cadastro de um pedido com os dados do cliente (nome, telefones, preço, datas de pedido e de entrega e observações);
- Permitir o acompanhamento do status do pedido ao longo do processo produtivo (não iniciado, produzido, instalado, pago ou cancelado);
- Permitir o registro de informações de pagamento, como se o pedido já foi pago e observações sobre a forma ou condição de pagamento;
- Permitir o cadastro das medidas específicas da coifa vinculada a um pedido (altura, largura, profundidade e dimensões da abertura superior, chamada de "boca");
- Gerar uma representação tridimensional da coifa a partir das medidas informadas, para conferência visual antes da fabricação;
- Permitir a edição e a exclusão de pedidos e de coifas já cadastrados.

## 3. Justificativa

A ideia do sistema surgiu a partir de um problema bastante concreto: em negócios pequenos que fabricam peças sob medida, é comum que o controle de pedidos seja feito de forma informal, o que dificulta saber rapidamente quantos pedidos estão em produção, quais já foram entregues e quais ainda precisam ser pagos. Além disso, erros de medida são um problema recorrente nesse tipo de fabricação, já que uma coifa é feita sob encomenda e uma medida trocada pode significar retrabalho ou perda de material.

A proposta do grupo foi, então, construir um sistema simples que resolvesse dois problemas ao mesmo tempo: organizar as informações de cada pedido em um cadastro único, com status bem definidos, e reduzir o risco de erro de medida por meio de uma visualização 3D da peça, que permite ao usuário perceber rapidamente se as dimensões digitadas resultam em uma peça com as proporções esperadas.

Do ponto de vista acadêmico, o projeto também serviu como exercício de integração entre um back-end com persistência em banco de dados relacional e um front-end com uma funcionalidade gráfica mais elaborada (renderização 3D), além da configuração de todo o ambiente com contêineres Docker.

## 4. Público-alvo

O sistema foi pensado para pequenos negócios que fabricam coifas sob medida, como marcenarias, serralherias e metalúrgicas de pequeno porte, sendo utilizado principalmente por quem atende o cliente e faz o registro do pedido (podendo ser o próprio dono do negócio).

É importante deixar claro que, na versão atual, o sistema não possui login nem separação de usuários — trata-se de uma decisão de projeto adotada em função do escopo da disciplina, considerando que o sistema foi pensado para uso interno, por poucas pessoas de confiança, dentro de uma rede local ou de um único computador. Um cenário de uso por múltiplas empresas ou com controle de permissões distintas por funcionário não foi contemplado nesta versão.

## 5. Requisitos Funcionais

Os requisitos funcionais abaixo foram levantados a partir das telas e das operações efetivamente implementadas no sistema:

| ID | Descrição |
|---|---|
| RF01 | O sistema deve permitir o cadastro de um novo pedido, informando nome do cliente, telefone principal, telefone secundário (opcional), data do pedido, data de entrega (opcional), status, preço, observações de pagamento e observações gerais do pedido. |
| RF02 | O sistema deve listar todos os pedidos cadastrados, ordenados do mais recente para o mais antigo com base na data do pedido. |
| RF03 | O sistema deve permitir a edição dos dados de um pedido já existente. |
| RF04 | O sistema deve permitir a exclusão de um pedido. |
| RF05 | O sistema deve permitir marcar um pedido como pago e registrar uma observação referente ao pagamento. |
| RF06 | O sistema deve permitir vincular uma coifa a um pedido já cadastrado. |
| RF07 | O sistema deve permitir o cadastro das dimensões de uma coifa: altura, largura e profundidade da base, largura e profundidade da abertura superior (boca) e a posição dessa abertura em relação ao canto traseiro esquerdo da base. |
| RF08 | O sistema deve gerar uma visualização tridimensional da coifa a partir das medidas informadas, atualizada conforme os valores são digitados. |
| RF09 | O sistema deve permitir a edição das dimensões de uma coifa já cadastrada. |
| RF10 | O sistema deve exibir a lista de pedidos de forma paginada, dividindo os registros em páginas de dez itens. |
| RF11 | O sistema deve impedir o cadastro de uma coifa antes de o pedido correspondente ter sido salvo, já que a coifa depende de um pedido já existente para ser criada. |

Vale registrar que o back-end também expõe endpoints para listar pedidos filtrando por status (`/pedido/status/{status}`) e para alterar apenas o status de um pedido (`/pedido/alterar-status`), porém essas duas operações não possuem, no momento, um elemento correspondente na interface — ou seja, existem como capacidade da API, mas ainda não foram conectadas a uma tela. Isso é citado na seção de melhorias futuras.

## 6. Requisitos Não Funcionais

| ID | Descrição |
|---|---|
| RNF01 | O sistema deve ser acessado via navegador web, através de uma aplicação de página única (SPA) construída em Angular. |
| RNF02 | A comunicação entre front-end e back-end deve ocorrer por meio de uma API REST, trafegando dados em formato JSON. |
| RNF03 | Os dados devem ser persistidos em um banco de dados relacional (MySQL). |
| RNF04 | A aplicação deve poder ser executada em contêineres Docker, de forma que o banco de dados, o back-end e o front-end subam de forma integrada por meio de um único arquivo de orquestração (docker-compose). |
| RNF05 | O acesso à API a partir do navegador deve ser restrito, por política de CORS, à origem do front-end utilizada em desenvolvimento (`http://localhost:4200`). |
| RNF06 | A geração do esquema do banco de dados deve ocorrer automaticamente a partir das entidades da aplicação (Hibernate com `ddl-auto: update`), sem a necessidade de scripts SQL manuais para a criação inicial das tabelas. |

Assim como no requisito funcional, aqui também vale registrar uma decisão de projeto: por se tratar de um sistema de uso interno pensado para o escopo da disciplina, não foram definidos requisitos de autenticação, de controle de acesso por perfil de usuário nem de criptografia de dados sensíveis. Da mesma forma, requisitos de desempenho (tempo de resposta, volume de usuários simultâneos) não foram formalmente definidos, já que o sistema não foi submetido a testes de carga.

## 7. Descrição das funcionalidades

### 7.1 Cadastro e edição de pedidos

**Finalidade:** permitir o registro das informações de um pedido de coifa, desde o primeiro contato com o cliente até a atualização de dados ao longo da produção.

**Interação do usuário:** o usuário clica no botão "+ Novo Pedido", na barra lateral, o que abre um formulário com os campos de nome do cliente (limitado a 30 caracteres, com contador de caracteres exibido junto ao campo), telefone principal e telefone secundário (ambos com máscara aplicada no formato `(48) 99999-0000`), data do pedido, data de entrega, status do pedido, preço, um campo de observação de pagamento e um campo de texto livre para observações gerais do pedido. Ao preencher os dados obrigatórios e confirmar, o pedido é criado e uma mensagem de sucesso é exibida por alguns segundos. Para editar um pedido já existente, basta selecioná-lo na lista da barra lateral, o que carrega os dados no mesmo formulário, agora com o botão de confirmação alterado para "Atualizar Pedido" e com um botão adicional de "Excluir Pedido".

**Problema que resolve:** substitui anotações informais por um cadastro único e estruturado, reduzindo a chance de se perder informações do cliente ou da encomenda, além de permitir localizar rapidamente os dados de um pedido já feito.

### 7.2 Listagem de pedidos (barra lateral)

**Finalidade:** dar uma visão geral de todos os pedidos cadastrados, permitindo identificar rapidamente o cliente, o status, se o pedido já foi pago e a data de entrega.

**Interação do usuário:** a barra lateral exibe os pedidos em forma de cartões, ordenados da data mais recente para a mais antiga. Cada cartão mostra o nome do cliente, o preço formatado em reais, a data de entrega, um selo colorido indicando o status (Não Iniciado, Produzido, Instalado, Pago ou Cancelado), um selo adicional caso o pedido já esteja marcado como pago, um ícone indicando a existência de observação de pagamento e um botão para exclusão direta do pedido. Como a lista pode crescer bastante, os cartões são exibidos em páginas de dez pedidos, com botões de página anterior e próxima. Quando não há nenhum pedido cadastrado, é exibida a mensagem "Nenhum pedido encontrado.".

**Problema que resolve:** evita que o usuário precise abrir cada pedido individualmente para saber sua situação, funcionando como um painel rápido de acompanhamento do andamento de todos os pedidos.

### 7.3 Controle de status e de pagamento

**Finalidade:** acompanhar em que etapa cada pedido está (ainda não iniciado, já produzido, já instalado, já pago ou cancelado) e registrar se o valor combinado já foi recebido.

**Interação do usuário:** o status é escolhido em uma lista suspensa dentro do formulário de pedido, com as opções Não Iniciado, Produzido, Instalado e Cancelado. O campo para marcar o pedido como pago só é exibido quando o status está em Não Iniciado, Produzido ou Instalado, já que um pedido cancelado não faz sentido ser marcado como pago dentro dessa lógica. Quando marcado, o usuário pode ainda preencher uma observação sobre o pagamento (por exemplo, forma de pagamento ou uma condição combinada com o cliente).

**Observação de projeto:** o back-end define também um status chamado "Pago" (`PAGO`), porém esse valor não aparece como opção no formulário do front-end, que trata o pagamento como um campo separado (um indicador booleano mais uma observação), e não como um status do pedido. Entendemos que essa divergência entre o enum do back-end e a lista de opções do front-end é um ponto que deveria ser revisto, mas optamos por documentar o comportamento tal como ele está implementado.

**Problema que resolve:** permite que qualquer pessoa que abra o sistema saiba, sem precisar perguntar, em que fase da produção uma encomenda está e se ainda há algum valor pendente de recebimento.

### 7.4 Cadastro de dimensões da coifa

**Finalidade:** registrar as medidas necessárias para a fabricação de uma coifa sob medida, vinculada a um pedido específico.

**Interação do usuário:** a partir da tela de um pedido já salvo, o usuário clica no botão "Coifa", o que leva a uma segunda tela dividida em duas partes. Do lado esquerdo, fica o formulário com os campos numéricos (em centímetros) de altura, largura e profundidade da base da coifa, largura e profundidade da abertura superior (chamada no sistema de "boca") e a posição dessa abertura em relação ao canto traseiro esquerdo da base, informada por dois valores de deslocamento. Caso o pedido ainda não tenha sido salvo, o botão de salvar a coifa fica desabilitado e uma mensagem avisa que é necessário salvar o pedido antes. Ao salvar com sucesso, uma mensagem de confirmação é exibida por alguns segundos; em caso de falha, uma mensagem de erro é apresentada no lugar dela.

**Problema que resolve:** garante que as medidas específicas de cada coifa fiquem registradas junto do pedido correspondente, evitando depender de anotações separadas (como um papel à parte na oficina) que poderiam se perder ou ser mal interpretadas por quem vai executar o serviço.

### 7.5 Visualização tridimensional da coifa

**Finalidade:** apresentar, em tempo real, uma representação em 3D da coifa com base nas medidas digitadas pelo usuário, servindo como conferência visual antes de a peça ser produzida.

**Interação do usuário:** do lado direito da tela de cadastro da coifa, fica o painel de visualização, construído com a biblioteca Three.js. Conforme o usuário altera qualquer um dos campos de medida, o modelo tridimensional é redesenhado automaticamente. A peça é representada como um sólido com uma base retangular maior (largura e profundidade informadas) e um topo retangular menor, correspondente à abertura superior, posicionado de acordo com os deslocamentos informados a partir do canto traseiro esquerdo. O modelo exibe também linhas de cota com os valores de largura, profundidade e altura, o que ajuda a conferir a proporção da peça. O usuário pode girar o modelo arrastando o botão esquerdo do mouse, aproximar ou afastar a visualização com a rolagem e deslocar a câmera com o botão direito, recursos oferecidos pelos controles de órbita da própria biblioteca. Quando nenhuma medida válida foi informada ainda, o painel mostra uma mensagem pedindo para o usuário preencher as dimensões.

**Problema que resolve:** medidas escritas apenas em números são difíceis de visualizar mentalmente, principalmente quando envolvem uma abertura deslocada em relação à base. A visualização 3D permite que o próprio usuário perceba, antes de enviar a peça para produção, se as medidas fazem sentido entre si — por exemplo, se a abertura ficou maior que a base ou deslocada para fora dos limites da peça.

### 7.6 Exclusão de pedidos e de coifas

**Finalidade:** permitir a remoção de um pedido que tenha sido cadastrado por engano ou que não seja mais necessário.

**Interação do usuário:** a exclusão pode ser feita diretamente pelo ícone de lixeira no cartão do pedido, na barra lateral, ou pelo botão "Excluir Pedido", disponível quando um pedido está aberto para edição. O back-end também expõe uma operação equivalente para exclusão de coifas de forma isolada, embora essa ação não esteja, no momento, disponível como um botão específico na interface (a exclusão de um pedido remove também a coifa vinculada a ele, em cascata, no nível do banco de dados).

**Problema que resolve:** permite corrigir cadastros feitos por engano sem a necessidade de qualquer intervenção direta no banco de dados.

## 8. Fluxo de utilização do sistema

De forma resumida, o uso do sistema segue o seguinte caminho:

1. O usuário abre o sistema no navegador e visualiza, na barra lateral, a lista de pedidos já cadastrados.
2. Para registrar uma nova encomenda, o usuário clica em "+ Novo Pedido" e preenche os dados do cliente, a data do pedido, a data de entrega prevista, o preço combinado e, se necessário, observações do pedido.
3. Após salvar o pedido, o usuário pode clicar no botão "Coifa" para informar as medidas da peça a ser fabricada.
4. Enquanto preenche as medidas, o usuário acompanha, no painel ao lado, a representação em 3D da coifa sendo atualizada, podendo ajustar os valores até considerar a proporção da peça adequada.
5. Ao salvar a coifa, o usuário retorna para a tela de pedidos.
6. Ao longo da produção, o usuário reabre o pedido sempre que precisar atualizar o status (por exemplo, de "Não Iniciado" para "Produzido" e, depois, para "Instalado") ou registrar que o pagamento foi realizado.
7. Caso um pedido seja cancelado ou tenha sido cadastrado por engano, ele pode ser excluído tanto pela lista quanto pela própria tela de edição.

## 9. Tecnologias utilizadas

**Front-end**
- Angular 21, utilizando *standalone components* e *signals* para controle de estado, sem uso do roteador do Angular para navegação entre telas (a alternância entre a tela de pedidos e a tela de coifa é feita internamente por uma variável de estado do componente principal, e não por rotas de URL);
- TypeScript e RxJS;
- Three.js, para a renderização 3D da coifa, incluindo os módulos de controles de órbita (`OrbitControls`) e de rótulos em HTML sobrepostos ao modelo (`CSS2DRenderer`);
- Vitest, como executor dos testes automatizados do front-end;
- CSS escrito manualmente para o layout, sem uso de bibliotecas de componentes prontos como Angular Material ou Bootstrap.

**Back-end**
- Java 21;
- Spring Boot 3.4.0, com os módulos Spring Web e Spring Data JPA;
- Hibernate como implementação de JPA, responsável também por gerar automaticamente o esquema do banco de dados a partir das entidades;
- MySQL Connector/J, como driver de acesso ao banco de dados.

**Banco de dados**
- MySQL 8.

**Infraestrutura e execução**
- Docker e Docker Compose, orquestrando três serviços: o banco de dados MySQL, a aplicação back-end e a aplicação front-end;
- Maven, para build e gerenciamento de dependências do back-end;
- Nginx, servindo os arquivos estáticos gerados pelo build do Angular na imagem final do front-end.

## 10. Estrutura do sistema

O sistema segue uma arquitetura cliente-servidor simples, dividida em três camadas:

```
[ Navegador (Angular SPA) ]  --HTTP/JSON-->  [ API REST (Spring Boot) ]  --JPA/Hibernate-->  [ MySQL ]
```

No back-end, o código está organizado nos pacotes tradicionais de uma aplicação Spring Boot em camadas:

- **Controllers** (`PedidoController`, `CoifaController`): recebem as requisições HTTP e delegam o processamento para a camada de serviço;
- **Services** (`PedidoService`, `CoifaService`): concentram as regras de negócio, como validar se um pedido existe antes de vincular uma coifa a ele;
- **Repositories** (`PedidoRepository`, `CoifaRepository`): interfaces do Spring Data JPA responsáveis pelo acesso ao banco de dados;
- **Models** (`Pedido`, `Coifa`, além do enum `StatusPedido` e do DTO `AlteraStatusDTO`): representam as entidades persistidas e os objetos de transferência de dados entre camadas.

No modelo de dados, um pedido (`Pedido`) pode ter, no máximo, uma coifa associada (`Coifa`), em um relacionamento um-para-um. A tabela `coifa` compartilha a mesma chave primária da tabela `pedido` a que pertence (mapeamento `@MapsId`), ou seja, uma coifa sempre existe em função de um pedido já cadastrado, o que reflete a regra de negócio de que não é possível cadastrar uma coifa sem antes ter um pedido salvo.

No front-end, a organização segue o padrão de componentes do Angular:

- `components/kanban-sidebar`: barra lateral com a listagem paginada de pedidos;
- `components/order-form`: formulário de cadastro e edição de pedidos;
- `components/coifa-form`: formulário de cadastro e edição das dimensões da coifa;
- `components/coifa-viewer`: componente responsável pela renderização 3D;
- `services/order.service.ts` e `services/coifa.service.ts`: responsáveis pela comunicação HTTP com o back-end;
- `models/order.model.ts` e `models/coifa.model.ts`: definição das interfaces de dados utilizadas no front-end.

A comunicação entre front-end e back-end ocorre integralmente por requisições HTTP para os endpoints `/pedido` e `/coifa`, sem uso de WebSocket ou de qualquer outro protocolo em tempo real — a atualização da lista de pedidos, por exemplo, ocorre por uma nova busca ao servidor após cada operação de criação, edição ou exclusão.

## 11. Considerações sobre a interface (UX/UI)

A interface foi pensada para ser direta, com apenas duas telas principais (pedidos e coifa) e sem menus ou caminhos de navegação adicionais, já que o escopo do sistema é pequeno e não exigiria uma estrutura de navegação mais complexa.

Alguns cuidados de usabilidade foram aplicados durante o desenvolvimento:

- Aplicação de máscara nos campos de telefone, reduzindo a chance de o usuário digitar um número em formato inconsistente;
- Contador de caracteres no campo de nome do cliente, deixando visível o limite de 30 caracteres;
- Uso de cores diferentes nos selos de status, facilitando a identificação visual do andamento de cada pedido na lista;
- Exibição condicional de campos, como o campo de pagamento, que só aparece quando o status do pedido permite essa marcação, e o botão de salvar a coifa, que fica desabilitado com uma explicação até que o pedido tenha sido salvo;
- Mensagens de sucesso e de erro exibidas de forma temporária após ações como salvar um pedido ou uma coifa;
- Mensagens de estado vazio, tanto na lista de pedidos ("Nenhum pedido encontrado.") quanto no painel 3D ("Preencha as dimensões para visualizar a coifa"), evitando que o usuário veja uma tela em branco sem entendimento do motivo;
- Atualização do modelo 3D em tempo real, permitindo que o usuário associe imediatamente o valor digitado ao efeito visual na peça.

Por outro lado, o grupo reconhece algumas limitações na interface atual: não foi implementado nenhum tratamento específico de responsividade para telas menores (celular ou tablet), não foram adotadas práticas formais de acessibilidade (como atributos ARIA ou navegação completa por teclado) e não existe nenhuma tela de confirmação antes da exclusão de um pedido, o que pode ser um risco caso o botão seja acionado sem intenção.

## 12. Possíveis melhorias futuras

Durante o desenvolvimento, o grupo identificou uma série de pontos que poderiam ser trabalhados em uma versão futura do sistema, mas que ficaram fora do escopo da disciplina em função do tempo disponível:

- Implementar autenticação e controle de acesso, já que atualmente qualquer pessoa com acesso à URL da API consegue realizar qualquer operação, sem exigência de login;
- Adicionar uma confirmação antes da exclusão de pedidos e coifas, para reduzir o risco de exclusões acidentais;
- Conectar à interface os endpoints de filtro de pedidos por status e de alteração isolada de status, que já existem no back-end mas não são utilizados pelo front-end atual;
- Corrigir a divergência entre o status "Pago" existente no back-end e a ausência dessa opção na lista de status do formulário de pedidos;
- Utilizar `@Enumerated(EnumType.STRING)` no campo de status do pedido, evitando que o significado dos valores gravados no banco dependa da ordem de declaração do enum;
- Adicionar validações de dados também no back-end (por exemplo, com Bean Validation), já que hoje a validação principal ocorre apenas no formulário do front-end;
- Adotar uma ferramenta de controle de versão de banco de dados, como Flyway ou Liquibase, em vez de depender da geração automática do esquema pelo Hibernate;
- Mover a URL do back-end e as credenciais do banco de dados para variáveis de ambiente, em vez de deixá-las fixas no código-fonte;
- Padronizar o tratamento de erros da API com um manipulador central de exceções, retornando mensagens de erro mais claras para o front-end;
- Avaliar a adoção de rotas do Angular Router para a navegação entre as telas de pedido e de coifa, permitindo, por exemplo, o uso do botão de voltar do navegador;
- Ampliar a cobertura de testes automatizados, tanto no front-end quanto no back-end, já que a estrutura de testes existente foi pouco explorada durante o projeto;
- Estudar a geração de um documento (PDF) do pedido para entrega ao cliente, funcionalidade para a qual já há arquivos de fonte incluídos no projeto, mas que não chegou a ser implementada.

## 13. Conclusão

O sistema desenvolvido cumpre o objetivo proposto de organizar o cadastro de pedidos de coifas sob medida, permitindo acompanhar o status de cada encomenda e registrar as informações de pagamento em um único lugar. A funcionalidade de visualização 3D das dimensões da coifa, integrada ao formulário de cadastro, foi o ponto em que o grupo concentrou maior esforço, por representar o principal diferencial do sistema em relação a um cadastro convencional.

Ao longo do desenvolvimento, o grupo pôde aplicar, na prática, conceitos trabalhados ao longo do curso, como a construção de uma API REST em camadas, o mapeamento objeto-relacional de entidades com relacionamento um-para-um, o consumo dessa API por uma aplicação front-end reativa e a configuração de um ambiente com múltiplos contêineres Docker. Ao mesmo tempo, o processo deixou claros os limites da versão atual do sistema, listados na seção anterior, que ficam registrados como possibilidades de continuidade caso o projeto venha a ser retomado em outra disciplina ou de forma independente pelo grupo.
