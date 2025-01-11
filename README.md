🧩 Web-Julia

Fractais são estruturas que se repetem em qualquer escala. Parece complexo? Bom, é mesmo, mas tipo, só na terminologia mesmo, a matemática por traz é estupidamente simples.
🔗 Acesse e interaja: ulisses177.github.io/Web-Julia
⚙️ Como o fractal de Julia é calculado?

A lógica começa com uma fórmula básica de iteração aplicada em números complexos:
zn+1=zn2+c
zn+1​=zn2​+c
🔬 Passo a passo:

    Cada pixel da tela vira um número complexo z0=x+yiz0​=x+yi.
        xx e yy são as coordenadas do pixel no plano complexo.
    Escolhemos uma constante complexa cc (o tal "número mágico", mas sem magia).
    Aplicamos a função várias vezes, verificando o que acontece:
        Se zz explode para o infinito → O pixel não faz parte do fractal.
        Se zz fica contido em um limite → O pixel pertence ao fractal.

🎨 Como isso vira uma imagem?

A cor de cada ponto depende de quantas iterações o número sobrevive antes de explodir:

    Explodiu rápido? Cor escura.
    Demorou pra explodir? Cores mais brilhantes.
    Não explodiu? Faz parte do fractal — geralmente fica preto.
    Naturalemte caótico, naturalmente simples, naturalmente comum.

E aí, temos o fractal aparecendo na tela.
🔧 Por que mexer nos controles é divertido?

    Zoom: Amplie para ver os detalhes infinitos.
    Velocidade e intensidade: Ajuste para ver o fractal "respirar" em diferentes escalas.
    Presets: Cores prontas para brincar — Clássico, Psicodélico e Oceano.


📄 Licença

Este projeto está sob a Licença MIT. Tradução: faça o que quiser com o código, só mantenha os créditos, btw, vlwz claude e qwq por ter dado a refatorada que permite interface.
