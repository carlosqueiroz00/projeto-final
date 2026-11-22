/* =========================================================
   Grão & Prosa - JavaScript
   O mesmo arquivo é usado nas 3 páginas. Por isso cada parte
   primeiro confere se o elemento existe na página (if) antes
   de usar, para não dar erro no console.

   1. Menu hambúrguer (abre e fecha o menu no celular)
   2. Aviso rápido (toast)
   3. Status "Aberto agora / Fechado"
   4. Pedido no cardápio (soma itens e total)
   5. Validação do formulário de contato
   ========================================================= */

/* ---------- 1. Menu hambúrguer ---------- */
const menuBotao = document.getElementById("menuBotao");
const menu = document.getElementById("menu");

if (menuBotao && menu) {
  menuBotao.addEventListener("click", function () {
    // toggle: se a classe existe, remove; se não existe, adiciona
    const estaAberto = menu.classList.toggle("aberto");

    // Atualiza a acessibilidade e o desenho do botão (vira um X no CSS)
    menuBotao.setAttribute("aria-expanded", estaAberto);
    menuBotao.setAttribute("aria-label", estaAberto ? "Fechar menu" : "Abrir menu");
  });
}

/* ---------- 2. Aviso rápido (toast) ---------- */
const aviso = document.getElementById("aviso");
let temporizadorAviso;

function mostrarAviso(texto) {
  if (!aviso) return;

  aviso.textContent = texto;
  aviso.classList.add("visivel");

  // Se clicar várias vezes seguidas, reinicia a contagem
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(function () {
    aviso.classList.remove("visivel");
  }, 2500);
}

/* ---------- 3. Status de funcionamento ---------- */
// Horário: segunda a sábado, das 7h às 19h
const status = document.getElementById("status");

if (status) {
  const agora = new Date();
  const diaDaSemana = agora.getDay(); // 0 = domingo, 6 = sábado
  const hora = agora.getHours();

  const diaUtil = diaDaSemana >= 1 && diaDaSemana <= 6;
  const noHorario = hora >= 7 && hora < 19;

  if (diaUtil && noHorario) {
    status.textContent = "Aberto agora";
    status.classList.add("aberto");
  } else {
    status.textContent = "Fechado agora";
    status.classList.add("fechado");
  }
}

/* ---------- 4. Pedido no cardápio ---------- */
const botoesPedir = document.querySelectorAll(".botao-pedir");
const pedido = document.getElementById("pedido");
const pedidoResumo = document.getElementById("pedidoResumo");
const pedidoTotal = document.getElementById("pedidoTotal");
const pedidoLimpar = document.getElementById("pedidoLimpar");

let quantidadeItens = 0;
let valorTotal = 0;

// Transforma 14 em "R$ 14,00"
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function atualizarPedido() {
  if (!pedido) return;

  // Só mostra a barra de pedido se tiver pelo menos 1 item
  pedido.hidden = quantidadeItens === 0;

  const palavra = quantidadeItens === 1 ? "item" : "itens";
  pedidoResumo.textContent = quantidadeItens + " " + palavra;
  pedidoTotal.textContent = formatarPreco(valorTotal);
}

botoesPedir.forEach(function (botao) {
  botao.addEventListener("click", function () {
    // closest: sobe no HTML até achar o card do produto clicado
    const produto = botao.closest(".produto");
    const nome = produto.dataset.nome;
    const preco = Number(produto.dataset.preco);

    quantidadeItens = quantidadeItens + 1;
    valorTotal = valorTotal + preco;

    atualizarPedido();
    mostrarAviso(nome + " adicionado ao pedido!");
  });
});

if (pedidoLimpar) {
  pedidoLimpar.addEventListener("click", function () {
    quantidadeItens = 0;
    valorTotal = 0;
    atualizarPedido();
    mostrarAviso("Pedido limpo.");
  });
}

/* ---------- 5. Validação do formulário ---------- */
const formulario = document.getElementById("formContato");

// Mostra ou apaga a mensagem de erro embaixo de um campo
function marcarErro(campo, elementoErro, mensagem) {
  elementoErro.textContent = mensagem;

  if (mensagem) {
    campo.classList.add("invalido");
  } else {
    campo.classList.remove("invalido");
  }
}

if (formulario) {
  const nome = document.getElementById("nome");
  const email = document.getElementById("email");
  const mensagem = document.getElementById("mensagem");

  const erroNome = document.getElementById("erroNome");
  const erroEmail = document.getElementById("erroEmail");
  const erroMensagem = document.getElementById("erroMensagem");

  // Regra simples de e-mail: texto @ texto . texto, sem espaços
  const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  formulario.addEventListener("submit", function (evento) {
    // Impede a página de recarregar ao enviar
    evento.preventDefault();

    let tudoCerto = true;

    // trim() tira os espaços do começo e do fim
    if (nome.value.trim().length < 3) {
      marcarErro(nome, erroNome, "Digite seu nome (mínimo 3 letras).");
      tudoCerto = false;
    } else {
      marcarErro(nome, erroNome, "");
    }

    if (!formatoEmail.test(email.value.trim())) {
      marcarErro(email, erroEmail, "Digite um e-mail válido.");
      tudoCerto = false;
    } else {
      marcarErro(email, erroEmail, "");
    }

    if (mensagem.value.trim().length < 10) {
      marcarErro(mensagem, erroMensagem, "A mensagem precisa ter pelo menos 10 caracteres.");
      tudoCerto = false;
    } else {
      marcarErro(mensagem, erroMensagem, "");
    }

    if (tudoCerto) {
      const primeiroNome = nome.value.trim().split(" ")[0];
      mostrarAviso("Obrigado, " + primeiroNome + "! Sua mensagem foi enviada.");
      formulario.reset();
    }
  });
}
