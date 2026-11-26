const API_URL = "http://10.106.102.100:3000";
const CHAVE_CARRINHO = 'agritech_carrinho_v5';
const CHAVE_CLIENTE = 'agritech_cliente_v1';

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

const imagensPorId = {
    1: "Semente de Milho BT ao Amanhecer.png",
    2: "Sementes de Soja RR em Destaque.jpg",
    3: "semente-algodao.jpg",
    4: "Semente de Feijão Carioca Pérola Bio.jpg",
    5: "Semente de Trigo BRS Reponte.jpg",
    6: "Semente de Sorgo Granífero AG1090.jpg",
    7: "Semente de Girassol Alto Oleico.jpg",
    8: "Semente de Tomate Híbrido Saladete.jpg",
    9: "biofertilizante.jpg",
    10: "Biofungicida-Trichoderma.jpg",
    11: "Bioinseticida Beauveria Bassiana 1kg.jpg",
    12: "inoculante.jpg",
    13: "Bioestimulante Enraizador de Algas 5L.jpg",
    14: "Bionematicida Bacillus Firmus 2L.jpg",
    15: "Bioinseticida Beauveria Bassiana 1kg.jpg",
    16: "Solubilizador de Fósforo Biophos 5L.jpg"
};

let catalogoProdutos = [];

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

function carregarCategorias() {
    if (!selectCategoria) return;

    fetch(`${API_URL}/categorias`)
        .then((response) => response.json())
        .then((categorias) => {
            console.log('Categorias recebidas da API:', categorias);
            selectCategoria.innerHTML = '<option value="Todas">Todas as Categorias</option>';
            categorias.forEach((cat) => {
                const option = document.createElement('option');
                option.value = cat.id_categoria;
                option.textContent = cat.nome || cat.nome_categoria;
                selectCategoria.appendChild(option);
            });
        })
        .catch((erro) => {
            console.error('Erro ao buscar categorias:', erro);
        });
}

function carregarProdutos() {
    if (!listaContainer) return;

    listaContainer.innerHTML = '<p>Carregando produtos...</p>';

    fetch(`${API_URL}/produtos`)
        .then((response) => response.json())
        .then((produtos) => {
            console.log('Produtos recebidos da API:', produtos);
            catalogoProdutos = produtos.map((item) => ({
                ...item,
                nome_categoria: item.nome_categoria || 'Categoria',
                imagem: item.imagem || imagensPorId[item.id_produto] || ''
            }));
            renderizarProdutos();
        })
        .catch((erro) => {
            console.error('Erro ao buscar produtos:', erro);
            listaContainer.innerHTML = '<p>Não foi possível conectar ao servidor para carregar os produtos.</p>';
        });
}

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
            (item.descricao && item.descricao.toLowerCase().includes(termo)) ||
            (item.nome_categoria && item.nome_categoria.toLowerCase().includes(termo));

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
                    ${item.imagem ? `<img src="../../img/${item.imagem.replace(/^(\.\/)?img\//, '')}" alt="${item.nome}" onerror="this.style.display='none'">` : ''}
                    <span class="tag">${item.nome_categoria}</span>
                    <h3>${item.nome}</h3>
                    <p>${item.descricao || ''}</p>
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
    carregarCategorias();
    carregarProdutos();
    renderizarCarrinho();

    if (inputBusca) inputBusca.addEventListener('input', renderizarProdutos);
    if (selectCategoria) selectCategoria.addEventListener('change', renderizarProdutos);

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

    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', () => {
            if (obterCarrinho().length === 0) return;
            window.location.href = '../pagamento/pagamento.html';
        });
    }
}

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

        fetch(`${API_URL}/clientes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosCliente)
        })
            .then((response) => response.json())
            .then((clienteCriado) => {
                console.log('Cliente cadastrado na API:', clienteCriado);
                localStorage.setItem(CHAVE_CLIENTE, JSON.stringify({ ...dadosCliente, ...clienteCriado }));

                const msg = document.getElementById('msg-cliente-sucesso');
                if (msg) {
                    msg.hidden = false;
                    setTimeout(() => (msg.hidden = true), 3000);
                }
            })
            .catch((erro) => {
                console.error('Erro ao cadastrar cliente:', erro);
                alert('Erro ao salvar cliente no servidor.');
            });
    });
}

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

        const dadosPedido = {
            id_cliente: clienteAtual.id_cliente || null,
            forma_pagamento: metodoEscolhido,
            valor_total: totalPedido,
            itens: carrinho.map((item) => ({
                id_produto: item.id_produto,
                preco: item.preco
            }))
        };

        fetch(`${API_URL}/pedidos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosPedido)
        })
            .then((response) => response.json())
            .then((pedidoCriado) => {
                console.log('Pedido registrado na API:', pedidoCriado);
                const numeroPedido = pedidoCriado.id_pedido || Math.floor(100000 + Math.random() * 900000);

                areaPagamento.hidden = true;
                const boxSucesso = document.getElementById('pedido-confirmado');
                const detalhesEl = document.getElementById('detalhes-pedido-confirmado');

                detalhesEl.innerHTML = `
                    Pedido <strong>#${numeroPedido}</strong> registrado para <strong>${clienteAtual.nome}</strong>.<br>
                    Forma de pagamento: <strong>${metodoEscolhido}</strong> • Valor: <strong>${formatarMoeda(totalPedido)}</strong>.
                `;
                boxSucesso.hidden = false;

                salvarCarrinho([]);
            })
            .catch((erro) => {
                console.error('Erro ao registrar pedido:', erro);
                alert('Erro ao confirmar pedido no servidor.');
            });
    });
}
const formAdmin = document.getElementById('form-admin-produto');

if (formAdmin) {
    const tituloForm = document.getElementById('titulo-form-admin');
    const inputId = document.getElementById('admin-id-produto');
    const inputNome = document.getElementById('admin-nome');
    const selectCat = document.getElementById('admin-categoria');
    const inputPreco = document.getElementById('admin-preco');
    const inputDesc = document.getElementById('admin-descricao');
    const inputImg = document.getElementById('admin-imagem');
    const btnSalvar = document.getElementById('btn-salvar-admin');
    const btnCancelar = document.getElementById('btn-cancelar-edicao');
    const msgAdmin = document.getElementById('msg-admin-sucesso');
    const tabelaAdmin = document.getElementById('tabela-produtos-admin');

    let listaProdutosAdmin = [];

    function carregarCategoriasAdmin() {
        fetch(`${API_URL}/categorias`)
            .then((response) => response.json())
            .then((categorias) => {
                selectCat.innerHTML = '';
                categorias.forEach((cat) => {
                    const option = document.createElement('option');
                    option.value = cat.id_categoria;
                    option.textContent = cat.nome || cat.nome_categoria;
                    selectCat.appendChild(option);
                });
            })
            .catch((erro) => console.error('Erro ao carregar categorias:', erro));
    }

    function carregarTabelaAdmin() {
        fetch(`${API_URL}/produtos`)
            .then((response) => response.json())
            .then((produtos) => {
                listaProdutosAdmin = produtos;
                tabelaAdmin.innerHTML = produtos
                    .map(
                        (item) => `
                        <tr>
                            <td>#${item.id_produto}</td>
                            <td><strong>${item.nome}</strong><br><small style="color:#64748b;">${item.descricao || ''}</small></td>
                            <td>${item.nome_categoria || item.id_categoria}</td>
                            <td>${formatarMoeda(item.preco)}</td>
                            <td>
                                <button type="button" class="btn-editar-admin" data-id="${item.id_produto}">Editar</button>
                            </td>
                        </tr>
                    `
                    )
                    .join('');
            })
            .catch((erro) => {
                console.error('Erro ao listar produtos:', erro);
                tabelaAdmin.innerHTML = '<tr><td colspan="5">Erro ao conectar com o servidor.</td></tr>';
            });
    }

    function resetarFormularioAdmin() {
        formAdmin.reset();
        inputId.value = '';
        tituloForm.textContent = 'Cadastrar Novo Produto';
        btnSalvar.textContent = 'Cadastrar Produto';
        btnCancelar.hidden = true;
    }

    function mostrarMensagemAdmin(texto) {
        msgAdmin.textContent = texto;
        msgAdmin.hidden = false;
        setTimeout(() => (msgAdmin.hidden = true), 3500);
    }

    // Preenche o formulário ao clicar em "Editar" na tabela
    tabelaAdmin.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-editar-admin')) {
            const id = Number(event.target.dataset.id);
            const produto = listaProdutosAdmin.find((p) => p.id_produto === id);
            if (!produto) return;

            inputId.value = produto.id_produto;
            inputNome.value = produto.nome;
            selectCat.value = produto.id_categoria;
            inputPreco.value = produto.preco;
            inputDesc.value = produto.descricao || '';
            inputImg.value = produto.imagem || imagensPorId[produto.id_produto] || '';

            tituloForm.textContent = `Editando Produto #${produto.id_produto}`;
            btnSalvar.textContent = 'Salvar Alterações';
            btnCancelar.hidden = false;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    btnCancelar.addEventListener('click', resetarFormularioAdmin);

    // Envia cadastro novo (POST) ou atualização (PUT)
    formAdmin.addEventListener('submit', (event) => {
        event.preventDefault();

        const idEdicao = inputId.value;
        const dadosProduto = {
            id_categoria: Number(selectCat.value),
            nome: inputNome.value.trim(),
            descricao: inputDesc.value.trim(),
            preco: parseFloat(inputPreco.value).toFixed(2),
            imagem: inputImg.value.trim()
        };

        const url = idEdicao ? `${API_URL}/produtos/${idEdicao}` : `${API_URL}/produtos`;
        const metodo = idEdicao ? 'PUT' : 'POST';

        fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosProduto)
        })
            .then((response) => response.json())
            .then((resposta) => {
                console.log('Resposta do servidor:', resposta);
                mostrarMensagemAdmin(idEdicao ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!');
                resetarFormularioAdmin();
                carregarTabelaAdmin();
            })
            .catch((erro) => {
                console.error('Erro ao salvar produto:', erro);
                alert('Erro ao salvar produto no servidor.');
            });
    });

    carregarCategoriasAdmin();
    carregarTabelaAdmin();
}