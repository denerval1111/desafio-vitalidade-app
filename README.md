# 🌟 Desafio Vitalidade - Aplicativo Web

> Aplicativo de apoio a hábitos para a jornada de 30 dias do Desafio Vitalidade, organizado em quatro semanas práticas e quatro pilares de bem-estar.

## 📱 Sobre o Projeto

O **Desafio Vitalidade** reúne ferramentas práticas de manhã, durante o dia, no fim do dia e de reflexão. Os registros são armazenados localmente no navegador e o aplicativo permite exportar, importar ou apagar esses dados. Ele serve como apoio à construção de hábitos e não substitui avaliação, diagnóstico ou prescrição individual.

### 🎯 Público-Alvo
- Homens e mulheres acima de 40 anos
- Pessoas saudáveis e portadoras de condições crônicas
- Interessados em envelhecimento com vitalidade

## 🏗️ Funcionalidades Principais

### 📊 4 Pilares Fundamentais

1. **🧬 Medicina Regenerativa**
   - Rotina alimentar adaptada à orientação individual
   - Sono e recuperação observados com gentileza
   - Hidratação consciente

2. **🥗 Nutrologia**
   - Refeições mediterrânea/asiática/brasileira
   - Suplementos somente conforme orientação individual
   - Movimento e exercício adaptados

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
- **Metas de hábito e de resultado separadas:** uma meta de peso só é concluída pelo registro do valor-alvo, não pelo simples fim do prazo
- **Progresso em três visões:** ciclo, pilares e histórico
- **Calendário de 30 dias** que reconhece registros sem tratar dias livres como falha
- **Ritmo recente, sequência atual e melhor sequência** calculados a partir das datas reais dos check-ins
- **Revisão semanal opcional** com reflexão e foco pequeno para os próximos dias
- **Conquistas de processo** que valorizam primeiro passo, retomada e continuidade

### 🗓️ Ferramentas das 4 Semanas

A tela **Semana** apresenta uma jornada prática completa de 30 dias. As Semanas 1 a 4 oferecem sete dias cada, com prática pela manhã, micropráticas ao longo do dia, encerramento e reflexão. Os Dias 29 e 30 consolidam os aprendizados e ajudam a iniciar o próximo ciclo com uma continuidade possível.

### 📱 Interface e Navegação

- **Dashboard principal** com progresso circular, ritmo recente e próximo passo
- **Check-in diário** dos 4 pilares
- **Tela de progresso** com ciclo, pilares, calendário e histórico semanal
- **Sistema de metas** de longo prazo
- **Conquistas e reflexão semanal** motivacionais
- **Perfil do usuário** personalizável

## 🛠️ Tecnologias Utilizadas

- **React 19** - Framework principal
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **LocalStorage** - Persistência de dados
- **Vitest** - Testes das regras de negócio
- **Playwright** - Testes de ponta a ponta

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
- **LocalStorage** para armazenamento no navegador atual
- **Exportação e importação manual** de backup em JSON
- **Exclusão local** pelo perfil
- **Sem conta ou sincronização entre dispositivos** nesta versão

### Responsividade
- **Mobile-first** design
- **Touch-friendly** interface
- **Adaptável** a diferentes tamanhos de tela

### Performance
- **Imagens WebP** redimensionadas para o tamanho de exibição
- **Dependências reduzidas** para diminuir a superfície de atualização e auditoria
- **Cache imutável** dos ativos de produção

## 🏆 Sistema de Pontuação

- **10 pontos** por atividade dos pilares
- **Humor opcional e sem pontuação**, usado apenas como registro pessoal
- **Cálculo automático** do progresso
- **Estatísticas** por pilar e geral

## 🎯 Roadmap

### Versão Atual (v1.0)
- [x] 4 pilares implementados
- [x] Sistema de longo prazo
- [x] Metas personalizadas
- [x] Interface responsiva
- [x] Check-in único por data com edição segura
- [x] Exportação, importação e exclusão de dados locais
- [x] Jornada prática completa das quatro semanas e fechamento dos 30 dias

### Próximas Versões
- [ ] Notificações push
- [ ] Modo offline (PWA ainda não implementado)
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
