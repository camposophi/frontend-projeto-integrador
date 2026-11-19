/* ================= 1. CARROSSEL DA PÁGINA INICIAL ================= */
const carrossel = document.getElementById('carrossel');
const slides = document.querySelectorAll('.slide');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const indicadoresContainer = document.getElementById('indicadores');

let indiceAtual = 0;
let intervaloAutoPlay;

function criarIndicadores() {
    slides.forEach((_, index) => {
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.classList.add('indicador');
        botao.setAttribute('aria-label', `Ir para o slide ${index + 1}`);
        if (index === 0) botao.classList.add('ativo');

        botao.addEventListener('click', () => {
            mostrarSlide(index);
            reiniciarAutoPlay();
        });

        indicadoresContainer.appendChild(botao);
    });
}

function mostrarSlide(novoIndice) {
    if (novoIndice >= slides.length) indiceAtual = 0;
    else if (novoIndice < 0) indiceAtual = slides.length - 1;
    else indiceAtual = novoIndice;

    slides.forEach((slide) => slide.classList.remove('ativo'));
    const indicadores = document.querySelectorAll('.indicador');
    indicadores.forEach((ind) => ind.classList.remove('ativo'));

    slides[indiceAtual].classList.add('ativo');
    indicadores[indiceAtual].classList.add('ativo');
}

function proximoSlide() { mostrarSlide(indiceAtual + 1); }
function slideAnterior() { mostrarSlide(indiceAtual - 1); }

function iniciarAutoPlay() {
    intervaloAutoPlay = setInterval(proximoSlide, 5000);
}

function pararAutoPlay() {
    clearInterval(intervaloAutoPlay);
}

function reiniciarAutoPlay() {
    pararAutoPlay();
    iniciarAutoPlay();
}

if (carrossel && slides.length > 0) {
    criarIndicadores();
    btnNext.addEventListener('click', () => { proximoSlide(); reiniciarAutoPlay(); });
    btnPrev.addEventListener('click', () => { slideAnterior(); reiniciarAutoPlay(); });
    carrossel.addEventListener('mouseenter', pararAutoPlay);
    carrossel.addEventListener('mouseleave', iniciarAutoPlay);
    iniciarAutoPlay();
}

/* ================= 2. CATÁLOGO DE PRODUTOS E STORAGE ================= */
const CHAVE_CARRINHO = 'agrobio_carrinho_v5';
const CHAVE_CLIENTE = 'agrobio_cliente_v1';

const catalogoProdutos = [
    { id_produto: 1, id_categoria: 1, nome: "Semente de Milho BT ao Amanhecer", descricao: "Resistente a pragas e seca", preco: "450.00", nome_categoria: "Sementes Modificadas", imagem: "Semente de Milho BT ao Amanhecer.png" },
    { id_produto: 2, id_categoria: 1, nome: "Semente de Soja RR em Destaque", descricao: "Tolerante a herbicidas", preco: "380.00", nome_categoria: "Sementes Modificadas", imagem: "Sementes de Soja RR em Destaque.jpg" },
    { id_produto: 3, id_categoria: 1, nome: "Semente de Algodão Bollgard III", descricao: "Tripla proteção contra pragas lepidópteras e fibra de alta resistência", preco: "620.00", nome_categoria: "Sementes Modificadas", imagem: "semente-algodao.jpg" },
    { id_produto: 4, id_categoria: 1, nome: "Semente de Feijão Carioca Pérola Bio", descricao: "Otimizado para tolerância à seca e ciclo precoce de 75 dias", preco: "295.50", nome_categoria: "Sementes Modificadas", imagem: "Semente de Feijão Carioca Pérola Bio.jpg" },
    { id_produto: 5, id_categoria: 1, nome: "Semente de Trigo BRS Reponte", descricao: "Ciclo médio com alta resistência à ferrugem da folha e giberela", preco: "260.00", nome_categoria: "Sementes Modificadas", imagem: "Semente de Trigo BRS Reponte.jpg" },
    { id_produto: 6, id_categoria: 1, nome: "Semente de Sorgo Granífero AG1090", descricao: "Adaptado para safrinha com alta tolerância ao estresse hídrico", preco: "198.00", nome_categoria: "Sementes Modificadas", imagem: "Semente de Sorgo Granífero AG1090.jpg" },
    { id_produto: 7, id_categoria: 1, nome: "Semente de Girassol Alto Oleico", descricao: "Elevado teor de óleo e resistência ao míldio", preco: "340.00", nome_categoria: "Sementes Modificadas", imagem: "Semente de Girassol Alto Oleico.jpg" },
    { id_produto: 8, id_categoria: 1, nome: "Semente de Tomate Híbrido Saladete", descricao: "Resistente a geminivírus, fusarium e nematóides", preco: "185.00", nome_categoria: "Sementes Modificadas", imagem: "Semente de Tomate Híbrido Saladete.jpg" },
    { id_produto: 9, id_categoria: 2, nome: "Biofertilizante NPK Vivo", descricao: "Acelerador de absorção de nutrientes", preco: "120.00", nome_categoria: "Insumos Biologicos", imagem: "biofertilizante.jpg" },
    { id_produto: 10, id_categoria: 2, nome: "Biofungicida Trichoderma Plus 5L", descricao: "Controle biológico preventivo contra fungos de solo", preco: "245.00", nome_categoria: "Insumos Biologicos", imagem: "Biofungicida-Trichoderma.jpg" },
    { id_produto: 11, id_categoria: 2, nome: "Bioinseticida Beauveria Bassiana 1kg", descricao: "Controle biológico de mosca-branca e cigarrinha-do-milho", preco: "178.90", nome_categoria: "Insumos Biologicos", imagem: "Bioinseticida Beauveria Bassiana 1kg.jpg" },
    { id_produto: 12, id_categoria: 2, nome: "Inoculante Bradyrhizobium Líquido 10L", descricao: "Fixador biológico de nitrogênio para sementes de soja", preco: "132.00", nome_categoria: "Insumos Biologicos", imagem: "inoculante.jpg" },
    { id_produto: 13, id_categoria: 2, nome: "Bioestimulante Enraizador de Algas 5L", descricao: "Extrato de Ascophyllum nodosum para arranque inicial", preco: "210.40", nome_categoria: "Insumos Biologicos", imagem: "Bioestimulante Enraizador de Algas 5L.jpg" },
    { id_produto: 14, id_categoria: 2, nome: "Bionematicida Bacillus Firmus 2L", descricao: "Proteção biológica de raízes contra nematóides", preco: "315.00", nome_categoria: "Insumos Biologicos", imagem: "Bionematicida Bacillus Firmus 2L.jpg" },
    { id_produto: 15, id_categoria: 2, nome: "Bioinseticida Beauveria Bassiana 1kg", descricao: "Controle biológico de cigarrinha-das-pastagens e percevejos", preco: "165.50", nome_categoria: "Insumos Biologicos", imagem: "Bioinseticida Beauveria Bassiana 1kg.jpg" },
    { id_produto: 16, id_categoria: 2, nome: "Solubilizador de Fósforo Biophos 5L", descricao: "Disponibiliza fósforo retido no solo para as raízes", preco: "280.00", nome_categoria: "Insumos Biologicos", imagem: "Solubilizador de Fósforo Biophos 5L.jpg" }
];

function formatarMoeda(valor) {
    return parseFloat(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function obterCarrinho() {
    return JSON.parse(localStorage.getItem(CHAVE_CARRINHO)) || [];
}

function salvarCarrinho(lista) {
    localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(lista));
}

const listaContainer = document.getElementById('lista-produtos');
const inputBusca = document.getElementById('busca-produto');
const selectCategoria = document.getElementById('filtro-categoria');

const carrinhoLista = document.getElementById('carrinho-lista');
const carrinhoQtd = document.getElementById('carrinho-qtd');
const carrinhoTotal = document.getElementById('carrinho-total');
const btnFinalizar = document.getElementById('btn-finalizar');

function renderizarCarrinho() {
    if (!carrinhoLista) return;

    const carrinho = obterCarrinho();
    carrinhoQtd.textContent = carrinho.length;

    const somaTotal = carrinho.reduce((acc, item) => acc + parseFloat(item.preco), 0);
    carrinhoTotal.textContent = `Total: ${formatarMoeda(somaTotal)}`;

    if (carrinho.length === 0) {
        carrinhoLista.innerHTML = '<li>Nenhum produto selecionado ainda.</li>';
        btnFinalizar.hidden = true;
        return;
    }

    btnFinalizar.hidden = false;
    carrinhoLista.innerHTML = carrinho
        .map(
            (item, index) => `
            <li>
                <span><strong>${item.nome}</strong> (${item.nome_categoria})</span>
                <span>
                    ${formatarMoeda(item.preco)}
                    <button type="button" class="btn-remover-item" data-index="${index}">Remover</button>
                </span>
            </li>
        `
        )
        .join('');
}

function renderizarProdutos() {
    if (!listaContainer) return;

    const termo = inputBusca ? inputBusca.value.toLowerCase() : '';
    const categoriaSelecionada = selectCategoria ? selectCategoria.value : 'Todas';

    const filtrados = catalogoProdutos.filter((item) => {
        const bateCategoria = categoriaSelecionada === 'Todas' || String(item.id_categoria) === categoriaSelecionada;
        const bateTexto =
            item.nome.toLowerCase().includes(termo) ||
            item.descricao.toLowerCase().includes(termo) ||
            item.nome_categoria.toLowerCase().includes(termo);

        return bateCategoria && bateTexto;
    });

    if (filtrados.length === 0) {
        listaContainer.innerHTML = '<p>Nenhum produto encontrado para os filtros aplicados.</p>';
        return;
    }

    listaContainer.innerHTML = filtrados
        .map(
            (item) => `
            <article class="card-produto">
                <div>
                    ${item.imagem ? `${item.imagem ? `<img src="../../img/${item.imagem.replace(/^(\.\/)?img\//, '')}" alt="${item.nome}" onerror="this.style.display='none'">` : ''}` : ''}
                    <span class="tag">${item.nome_categoria}</span>
                    <h3>${item.nome}</h3>
                    <p>${item.descricao}</p>
                </div>
                <div>
                    <div class="preco-card">${formatarMoeda(item.preco)}</div>
                    <button type="button" class="btn-comprar" data-id="${item.id_produto}">Selecionar Produto</button>
                </div>
            </article>
        `
        )
        .join('');
}

if (listaContainer) {
    renderizarProdutos();
    renderizarCarrinho();

    if (inputBusca) inputBusca.addEventListener('input', renderizarProdutos);
    if (selectCategoria) selectCategoria.addEventListener('change', renderizarProdutos);

    // Adiciona o item selecionado ao carrinho
    listaContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-comprar')) {
            const id = Number(event.target.dataset.id);
            const produto = catalogoProdutos.find((item) => item.id_produto === id);
            if (produto) {
                const carrinho = obterCarrinho();
                carrinho.push(produto);
                salvarCarrinho(carrinho);
                renderizarCarrinho();
            }
        }
    });

    // Remove item da lista do carrinho
    if (carrinhoLista) {
        carrinhoLista.addEventListener('click', (event) => {
            if (event.target.classList.contains('btn-remover-item')) {
                const index = Number(event.target.dataset.index);
                const carrinho = obterCarrinho();
                carrinho.splice(index, 1);
                salvarCarrinho(carrinho);
                renderizarCarrinho();
            }
        });
    }

    // Encaminha para a página de Forma de Pagamento
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', () => {
            if (obterCarrinho().length === 0) return;
            window.location.href = '../pagamento/pagamento.html';
        });
    }
}

/* ================= 4. CADASTRO DO CLIENTE (cliente.html) ================= */
const formCliente = document.getElementById('form-cliente');

if (formCliente) {
    const clienteSalvo = JSON.parse(localStorage.getItem(CHAVE_CLIENTE));
    if (clienteSalvo) {
        document.getElementById('cliente-nome').value = clienteSalvo.nome || '';
        document.getElementById('cliente-documento').value = clienteSalvo.documento || '';
        document.getElementById('cliente-telefone').value = clienteSalvo.telefone || '';
        document.getElementById('cliente-email').value = clienteSalvo.email || '';
        document.getElementById('cliente-endereco').value = clienteSalvo.endereco || '';
        document.getElementById('cliente-cidade').value = clienteSalvo.cidade || '';
        document.getElementById('cliente-cep').value = clienteSalvo.cep || '';
    }

    formCliente.addEventListener('submit', (event) => {
        event.preventDefault();

        const dadosCliente = {
            nome: document.getElementById('cliente-nome').value.trim(),
            documento: document.getElementById('cliente-documento').value.trim(),
            telefone: document.getElementById('cliente-telefone').value.trim(),
            email: document.getElementById('cliente-email').value.trim(),
            endereco: document.getElementById('cliente-endereco').value.trim(),
            cidade: document.getElementById('cliente-cidade').value.trim(),
            cep: document.getElementById('cliente-cep').value.trim()
        };

        localStorage.setItem(CHAVE_CLIENTE, JSON.stringify(dadosCliente));

        const msg = document.getElementById('msg-cliente-sucesso');
        if (msg) {
            msg.hidden = false;
            setTimeout(() => (msg.hidden = true), 3000);
        }
    });
}

/* ================= 5. FORMA DE PAGAMENTO (pagamento.html) ================= */
const areaPagamento = document.getElementById('area-pagamento');

if (areaPagamento) {
    const infoClienteEl = document.getElementById('info-cliente-pagamento');
    const resumoItensEl = document.getElementById('resumo-itens-pagamento');
    const totalFinalEl = document.getElementById('total-final-pagamento');
    const formPagamento = document.getElementById('form-pagamento');
    const camposCartao = document.getElementById('campos-cartao');

    const cliente = JSON.parse(localStorage.getItem(CHAVE_CLIENTE));
    const carrinho = obterCarrinho();

    if (cliente) {
        infoClienteEl.innerHTML = `
            <strong>${cliente.nome}</strong> (${cliente.documento})<br>
            Entrega: ${cliente.endereco} - ${cliente.cidade}<br>
            <a href="../cliente/cliente.html" style="color: #2d6a4f; font-size: 0.85rem;">Editar dados do cliente</a>
        `;
    } else {
        infoClienteEl.innerHTML = `
            <span style="color: #b91c1c;">Nenhum cliente cadastrado ainda.</span><br>
            <a href="../cliente/cliente.html" style="color: #1b4332; font-weight: 600;">Clique aqui para cadastrar seus dados antes de pagar</a>
        `;
    }

    if (carrinho.length === 0) {
        resumoItensEl.innerHTML = '<li>Seu carrinho está vazio. <a href="../consulta/consulta.html" style="color: #2d6a4f;">Selecionar produtos</a></li>';
    } else {
        resumoItensEl.innerHTML = carrinho
            .map((item) => `<li><span>${item.nome}</span><strong>${formatarMoeda(item.preco)}</strong></li>`)
            .join('');
    }

    const totalPedido = carrinho.reduce((acc, item) => acc + parseFloat(item.preco), 0);
    totalFinalEl.textContent = formatarMoeda(totalPedido);

    document.querySelectorAll('input[name="metodo_pagamento"]').forEach((radio) => {
        radio.addEventListener('change', () => {
            camposCartao.hidden = radio.value !== 'Cartão de Crédito';
        });
    });

    formPagamento.addEventListener('submit', (event) => {
        event.preventDefault();

        if (carrinho.length === 0) {
            alert('Selecione pelo menos um produto no Carrinho antes de pagar.');
            window.location.href = '../consulta/consulta.html';
            return;
        }

        const clienteAtual = JSON.parse(localStorage.getItem(CHAVE_CLIENTE));
        if (!clienteAtual) {
            alert('Por favor, preencha o Cadastro do Cliente antes de confirmar o pagamento.');
            window.location.href = '../cliente/cliente.html';
            return;
        }

        const metodoEscolhido = document.querySelector('input[name="metodo_pagamento"]:checked').value;
        const numeroPedido = Math.floor(100000 + Math.random() * 900000);

        areaPagamento.hidden = true;
        const boxSucesso = document.getElementById('pedido-confirmado');
        const detalhesEl = document.getElementById('detalhes-pedido-confirmado');

        detalhesEl.innerHTML = `
            Pedido <strong>#${numeroPedido}</strong> registrado para <strong>${clienteAtual.nome}</strong>.<br>
            Forma de pagamento: <strong>${metodoEscolhido}</strong> • Valor: <strong>${formatarMoeda(totalPedido)}</strong>.
        `;
        boxSucesso.hidden = false;

        salvarCarrinho([]);
    });
}