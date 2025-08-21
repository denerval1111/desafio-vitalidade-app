# 🌟 Desafio Vitalidade - Aplicativo Web

> Aplicativo para acompanhamento dos 30 dias do Desafio Vitalidade, focado em longevidade saudável através dos 4 pilares fundamentais.

## 📱 Sobre o Projeto

O **Desafio Vitalidade** é um aplicativo web desenvolvido para acompanhar a jornada de transformação de 30 dias, baseado nos 4 pilares da longevidade saudável. O aplicativo oferece funcionalidades avançadas de acompanhamento de longo prazo, sistema de metas personalizadas e gamificação motivacional.

### 🎯 Público-Alvo
- Homens e mulheres acima de 40 anos
- Pessoas saudáveis e portadoras de condições crônicas
- Interessados em envelhecimento com vitalidade

## 🏗️ Funcionalidades Principais

### 📊 4 Pilares Fundamentais

1. **🧬 Medicina Regenerativa**
   - Jejum intermitente (16h)
   - Sono adequado (7-9h)
   - Hidratação (2L+)

2. **🥗 Nutrologia**
   - Refeições mediterrânea/asiática/brasileira
   - Suplementos recomendados
   - Exercício físico

3. **🧠 Psiquiatria**
   - Meditação/mindfulness
   - Prática de gratidão
   - Avaliação de humor (1-5)

4. **⚖️ Gerenciamento do Peso**
   - Pesagem registrada
   - Controle alimentar

### 🎯 Sistema de Longo Prazo

- **Ciclos de 30 dias** com acompanhamento automático
- **Metas pré-definidas:** 30, 90, 180, 360 dias
- **Metas personalizadas** criadas pelo usuário
- **Progresso visual** por pilar e geral
- **Sistema de conquistas** motivacional

### 📱 Interface e Navegação

- **Dashboard principal** com progresso circular
- **Check-in diário** dos 4 pilares
- **Tela de progresso** com estatísticas
- **Sistema de metas** de longo prazo
- **Conquistas e badges** motivacionais
- **Perfil do usuário** personalizável

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework principal
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **LocalStorage** - Persistência de dados
- **PWA Ready** - Instalável como app

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- pnpm (recomendado) ou npm

### Instalação
```bash
# Clone o repositório
git clone https://github.com/[seu-usuario]/desafio-vitalidade-app.git

# Entre no diretório
cd desafio-vitalidade-app

# Instale as dependências
pnpm install

# Execute em modo desenvolvimento
pnpm run dev

# Acesse http://localhost:5173
```

### Build para Produção
```bash
# Gerar build otimizado
pnpm run build

# Preview do build
pnpm run preview
```

## 📊 Estrutura do Projeto

```
desafio-vitalidade-app/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   ├── hooks/              # Custom hooks
│   ├── assets/             # Imagens e ícones
│   ├── App.jsx             # Componente principal
│   └── main.jsx            # Entry point
├── public/                 # Arquivos estáticos
├── dist/                   # Build de produção
└── docs/                   # Documentação
```

## 🎨 Design System

### Cores Principais
- **Verde:** #10B981 (Medicina Regenerativa)
- **Azul:** #3B82F6 (Nutrologia)
- **Roxo:** #8B5CF6 (Psiquiatria)
- **Laranja:** #F59E0B (Gerenciamento do Peso)

### Tipografia
- **Fonte:** Inter (sistema)
- **Tamanhos:** 72px, 36px, 24px (front page)
- **Tamanhos:** 36px, 24px, 20px (content pages)

## 📱 Funcionalidades Técnicas

### Persistência de Dados
- **LocalStorage** para armazenamento local
- **Backup automático** do progresso
- **Privacidade total** - dados não saem do dispositivo

### Responsividade
- **Mobile-first** design
- **Touch-friendly** interface
- **Adaptável** a diferentes tamanhos de tela

### Performance
- **Lazy loading** de componentes
- **Otimização** de imagens
- **Bundle splitting** automático

## 🏆 Sistema de Pontuação

- **10 pontos** por atividade dos pilares
- **2-10 pontos** baseado no humor (Psiquiatria)
- **Cálculo automático** do progresso
- **Estatísticas** por pilar e geral

## 🎯 Roadmap

### Versão Atual (v1.0)
- [x] 4 pilares implementados
- [x] Sistema de longo prazo
- [x] Metas personalizadas
- [x] Interface responsiva

### Próximas Versões
- [ ] Exportação de relatórios
- [ ] Notificações push
- [ ] Modo offline
- [ ] Integração com wearables

## 🤝 Contribuição

Este projeto foi desenvolvido especificamente para o **Desafio Vitalidade**. Para sugestões ou melhorias, entre em contato através do site oficial.

## 📄 Licença

Este projeto é propriedade do **Desafio Vitalidade** e destinado exclusivamente para uso no programa de longevidade saudável.

## 📞 Suporte

- **Site:** [desafiovitalidade.com.br](https://desafiovitalidade.com.br)
- **Aplicativo:** [app.desafiovitalidade.com.br](https://app.desafiovitalidade.com.br)

---

**Desenvolvido com ❤️ para transformar vidas através da longevidade saudável**

