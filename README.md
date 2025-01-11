# 🧩 Web-Julia

Fractais são estruturas que se repetem em qualquer escala. Parece complexo? Bom, é mesmo, mas tipo, só na terminologia mesmo, a matemática por trás é estupidamente simples.

🔗 **Acesse e interaja:** [ulisses177.github.io/Web-Julia](https://ulisses177.github.io/Web-Julia/)

## ⚙️ Como o fractal de Julia é calculado?

A lógica começa com uma **fórmula básica de iteração** aplicada em números complexos:

\[ z_{n+1} = z_n^2 + c \]

### 🔬 Passo a passo:

1. **Cada pixel da tela vira um número complexo** \( z_0 = x + yi \).
    - \( x \) e \( y \) são as coordenadas do pixel no plano complexo.
2. Escolhemos uma **constante complexa** \( c \) (o tal "número mágico", mas sem magia).
3. Aplicamos a função várias vezes, verificando o que acontece:
    - Se \( z \) **explode para o infinito** → O pixel não faz parte do fractal.
    - Se \( z \) **fica contido em um limite** → O pixel pertence ao fractal.

## 🎨 Como isso vira uma imagem?

A cor de cada ponto depende de quantas iterações o número sobrevive antes de explodir:

- **Explodiu rápido?** Cor escura.
- **Demorou pra explodir?** Cores mais brilhantes.
- **Não explodiu?** Faz parte do fractal — geralmente fica preto.

Naturalmente caótico, naturalmente simples, naturalmente comum.

E aí, temos o fractal aparecendo na tela.

## 🔧 Por que mexer nos controles é divertido?

- **Zoom:** Amplie para ver os detalhes infinitos.
- **Velocidade e intensidade:** Ajuste para ver o fractal "respirar" em diferentes escalas.
- **Presets:** Cores prontas para brincar — Clássico, Psicodélico e Oceano.

## 📄 Licença

Este projeto está sob a [Licença MIT](https://opensource.org/licenses/MIT). Tradução: faça o que quiser com o código, só mantenha os créditos. Btw, vlwz Claude e QwQ por ter dado a refatorada que permite interface.


